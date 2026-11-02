import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, Flame, Activity, Zap, ArrowRight, 
  CheckCircle2, RefreshCcw, ShieldCheck, ChevronRight, Apple, 
  Info, Award, Plus, Trash2, Heart, PieChart
} from 'lucide-react';

export default function CalloAIApp() {
  const [view, setView] = useState('landing'); // 'landing', 'app'
  const [scanningState, setScanningState] = useState('idle'); // 'idle', 'uploading', 'scanning', 'success'
  const [selectedImage, setSelectedImage] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [dailyLog, setDailyLog] = useState([
    { id: 1, name: 'Greek Yogurt & Berries Bowl', calories: 340, protein: 24, carbs: 42, fat: 8, time: '8:30 AM' },
    { id: 2, name: 'Grilled Chicken Salad with Avocado', calories: 520, protein: 48, carbs: 14, fat: 28, time: '1:15 PM' }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Sample preset meals for quick testing in the demo
  const presetMeals = [
    {
      name: "Truffle Salmon Poke Bowl",
      calories: 620,
      protein: 38,
      carbs: 58,
      fat: 24,
      confidence: 99.4,
      breakdown: {
        salmon: "180g Atlantic Salmon (320 kcal)",
        rice: "150g Jasmine Rice (190 kcal)",
        avocado: "50g Fresh Avocado (80 kcal)",
        sauce: "Truffle Soy Glaze (30 kcal)"
      }
    },
    {
      name: "Smashed Avocado & Poached Eggs Sourdough",
      calories: 480,
      protein: 22,
      carbs: 45,
      fat: 26,
      confidence: 98.9,
      breakdown: {
        bread: "2 slices Artisan Sourdough (220 kcal)",
        eggs: "2 Organic Poached Eggs (140 kcal)",
        avocado: "80g Smashed Avocado (120 kcal)"
      }
    }
  ];

  const handleFileSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      runScanningSimulation();
    };
    reader.readAsDataURL(file);
  };

  const runScanningSimulation = () => {
    setView('app');
    setScanningState('uploading');
    
    setTimeout(() => {
      setScanningState('scanning');
    }, 1200);

    setTimeout(() => {
      setScanningState('success');
      // Pick a random preset meal for dynamic simulation
      const randomMeal = presetMeals[Math.floor(Math.random() * presetMeals.length)];
      setNutritionData(randomMeal);
    }, 3200);
  };

  const handleAddToLog = () => {
    if (!nutritionData) return;
    const newItem = {
      id: Date.now(),
      name: nutritionData.name,
      calories: nutritionData.calories,
      protein: nutritionData.protein,
      carbs: nutritionData.carbs,
      fat: nutritionData.fat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDailyLog([newItem, ...dailyLog]);
    setScanningState('idle');
    setSelectedImage(null);
    setNutritionData(null);
  };

  const totalCalories = dailyLog.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = dailyLog.reduce((acc, item) => acc + item.protein, 0);
  const totalCarbs = dailyLog.reduce((acc, item) => acc + item.carbs, 0);
  const totalFat = dailyLog.reduce((acc, item) => acc + item.fat, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold text-xl">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">CalloAI</span>
              <span className="text-[10px] font-semibold text-emerald-600 tracking-widest uppercase mt-0.5">Vision Nutrition</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => setView('landing')} className="hover:text-emerald-600 transition">Overview</button>
            <a href="#features" className="hover:text-emerald-600 transition">Technology</a>
            <a href="#accuracy" className="hover:text-emerald-600 transition">Precision AI</a>
            <a href="#pricing" className="hover:text-emerald-600 transition">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {view === 'landing' ? (
              <button 
                onClick={() => setView('app')}
                className="bg-slate-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-slate-900/10 flex items-center gap-2 group"
              >
                <span>Launch Scanner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={() => setView('landing')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium text-sm transition"
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main View Router */}
      {view === 'landing' ? (
        <main className="overflow-hidden">
          
          {/* Hero Section */}
          <section className="relative pt-20 pb-32 px-6 overflow-hidden">
            {/* Subtle background glow mesh */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/40 via-teal-100/30 to-indigo-100/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold mb-8 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Computer Vision Macro Engine</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
                Snap your meal. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  Instantly decode macros.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-normal leading-relaxed">
                Experience the world&apos;s most precise AI nutrition tracker. No barcode scanning, no manual weighing—just point your lens and get instant lab-grade calorie and macro breakdowns.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button 
                  onClick={() => setView('app')}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-3 group"
                >
                  <Camera className="w-5 h-5" />
                  <span>Try Scanner Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => {
                    setSelectedImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80");
                    runScanningSimulation();
                  }}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-semibold text-base transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>See Live Demo</span>
                </button>
              </div>

              {/* Interactive Hero Showcase Card */}
              <div className="relative max-w-4xl mx-auto rounded-3xl p-3 bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-900/10">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center group cursor-pointer" onClick={() => setView('app')}>
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80" 
                    alt="Meal preview" 
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-8 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-medium border border-emerald-500/30">
                        AI Confidence 99.4%
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Poke Bowl with Sesame Glaze</h3>
                    <p className="text-slate-300 text-sm mt-1">620 kcal • 38g Protein • 58g Carbs • 24g Fat</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-slate-950/40 backdrop-blur-xs">
                    <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      <span>Launch Interactive Scanner</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">99.2%</div>
                  <div className="text-sm text-slate-500 mt-1">Macro Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">&lt; 0.8s</div>
                  <div className="text-sm text-slate-500 mt-1">Analysis Speed</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">1.2M+</div>
                  <div className="text-sm text-slate-500 mt-1">Meals Scanned</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900">£10k</div>
                  <div className="text-sm text-slate-500 mt-1">Design Standard</div>
                </div>
              </div>

            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24 bg-white px-6 border-t border-slate-100">
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Engineered for absolute precision</h2>
                <p className="text-slate-600 mt-3">Every pixel and algorithm is calibrated to save you time and keep you in peak nutritional shape.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-[#FAFAFC] border border-slate-100 hover:border-emerald-200 transition group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Multimodal Vision</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Advanced neural networks identify complex ingredients, cooking oils, and hidden dressings instantly.</p>
                </div>

                <div className="p-8 rounded-3xl bg-[#FAFAFC] border border-slate-100 hover:border-emerald-200 transition group">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Granular Macro Rings</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Real-time breakdown of calories, proteins, complex carbohydrates, and essential healthy fats.</p>
                </div>

                <div className="p-8 rounded-3xl bg-[#FAFAFC] border border-slate-100 hover:border-emerald-200 transition group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Accuracy</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Cross-referenced against international nutritional databases with zero manual estimation required.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-slate-900 text-slate-400 px-6 text-center text-sm">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">C</div>
                <span className="text-white font-bold tracking-wide">CalloAI</span>
              </div>
              <p>&copy; {new Date().getFullYear()} CalloAI Inc. All rights reserved. Crafted to perfection.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">Privacy</a>
                <a href="#" className="hover:text-white transition">Terms</a>
                <a href="#" className="hover:text-white transition">API</a>
              </div>
            </div>
          </footer>

        </main>
      ) : (
        /* Application / Live Scanner View */
        <main className="max-w-6xl mx-auto px-6 py-10">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Scanner & State Machine */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">AI Macro Scanner</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Upload a photo or choose a preset meal to test</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                    Active Session
                  </span>
                </div>

                {/* Upload Zone / Scanning Zone */}
                {scanningState === 'idle' && (
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} 
                    />
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-emerald-600 mb-4">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">Click to snap or upload meal photo</h3>
                    <p className="text-xs text-slate-500 max-w-xs mb-6">Supports high-res JPG, PNG, WEBP or HEIC images up to 25MB.</p>
                    
                    <button className="bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow hover:bg-emerald-600 transition">
                      Browse Files
                    </button>
                  </div>
                )}

                {(scanningState === 'uploading' || scanningState === 'scanning') && (
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] flex flex-col items-center justify-center text-center p-6">
                    {selectedImage && (
                      <img src={selectedImage} alt="Uploaded meal" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {scanningState === 'uploading' ? 'Uploading & Preprocessing...' : 'Analyzing Ingredients & Portions...'}
                      </h3>
                      <p className="text-xs text-slate-300 max-w-xs">
                        CalloAI is mapping food geometry and estimating macronutrients in real-time.
                      </p>
                    </div>
                  </div>
                )}

                {scanningState === 'success' && nutritionData && (
                  <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/9] flex items-center justify-center">
                      <img src={selectedImage} alt="Scanned meal" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">
                              {nutritionData.confidence}% AI Match
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white">{nutritionData.name}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Macro Breakdown Cards */}
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Calories</span>
                        <div className="text-lg font-extrabold text-slate-900 mt-0.5">{nutritionData.calories}</div>
                        <span className="text-[10px] text-slate-500">kcal</span>
                      </div>
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <span className="text-[10px] uppercase font-bold text-emerald-600">Protein</span>
                        <div className="text-lg font-extrabold text-emerald-700 mt-0.5">{nutritionData.protein}g</div>
                        <span className="text-[10px] text-emerald-600">40%</span>
                      </div>
                      <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                        <span className="text-[10px] uppercase font-bold text-teal-600">Carbs</span>
                        <div className="text-lg font-extrabold text-teal-700 mt-0.5">{nutritionData.carbs}g</div>
                        <span className="text-[10px] text-teal-600">45%</span>
                      </div>
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                        <span className="text-[10px] uppercase font-bold text-amber-600">Fat</span>
                        <div className="text-lg font-extrabold text-amber-700 mt-0.5">{nutritionData.fat}g</div>
                        <span className="text-[10px] text-amber-600">15%</span>
                      </div>
                    </div>

                    {/* Ingredient Breakdown List */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detected Ingredients</h4>
                      <div className="space-y-1.5">
                        {Object.entries(nutritionData.breakdown).map(([key, val], idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-100">
                            <span className="font-medium text-slate-800 capitalize">{key}</span>
                            <span className="text-slate-500 font-mono">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => { setScanningState('idle'); setSelectedImage(null); setNutritionData(null); }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm transition"
                      >
                        Scan Another
                      </button>
                      <button 
                        onClick={handleAddToLog}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Daily Log</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Quick Preset Test Meals */}
              {scanningState === 'idle' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Or Test With Sample Meals</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {presetMeals.map((meal, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setSelectedImage(idx === 0 ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" : "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80");
                          runScanningSimulation();
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 transition text-left group"
                      >
                        <img 
                          src={idx === 0 ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80" : "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=200&q=80"} 
                          alt="Meal" 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">{meal.name}</h5>
                          <p className="text-[11px] text-slate-500">{meal.calories} kcal • {meal.protein}g protein</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Daily Macro Summary & Log */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Today&apos;s Nutrition</h3>
                    <p className="text-xs text-slate-500">Daily Goal: 2,200 kcal</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>

                {/* Main Progress Bar */}
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">Calories Consumed</span>
                    <span className="font-bold text-slate-900">{totalCalories} / 2200 kcal</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalCalories / 2200) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Macro Progress Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Protein</span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">{totalProtein}g</div>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalProtein / 140) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Carbs</span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">{totalCarbs}g</div>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalCarbs / 220) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Fats</span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">{totalFat}g</div>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalFat / 70) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Logged Meals List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Meal Log ({dailyLog.length})</h4>
                    <span className="text-xs text-emerald-600 font-semibold">Live Sync</span>
                  </div>

                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {dailyLog.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAFC] border border-slate-100 hover:border-slate-200 transition">
                        <div className="min-w-0 pr-2">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.time} • P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-extrabold text-slate-900">{item.calories}</span>
                          <span className="text-[10px] text-slate-500 block">kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>
      )}

    </div>
  );
}