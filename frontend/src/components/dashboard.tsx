"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Check,
  CircleHelp,
  ImagePlus,
  Leaf,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { analyzeMeal } from "@/lib/api";
import type { NutritionResult } from "@/types/nutrition";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function Dashboard() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function chooseFile(file?: File) {
    if (!file) return;
    setError(null);
    setResult(null);

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to scan.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("That image is larger than 10 MB. Choose a smaller file.");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  async function handleAnalyze() {
    if (!imageFile || isAnalyzing) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      setResult(await analyzeMeal(imageFile));
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "Something went wrong while analyzing your meal.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function clearImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
    setResult(null);
    setError(null);
  }

  function finishScan() {
    clearImage();
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#e9eee9] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="CalloAI home">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-ink text-white shadow-sm">
              <Leaf size={21} strokeWidth={2.2} />
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.04em] text-ink">
              callo<span className="text-brand-600">ai</span>
            </span>
            <span className="ml-1 hidden rounded-full border border-[#e7ece8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:inline-flex">
              Nutrition studio
            </span>
          </a>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#68746d] transition hover:bg-canvas hover:text-ink sm:flex"
              aria-label="Help and support"
            >
              <CircleHelp size={17} />
              <span>Help</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[960px] px-5 pb-16 pt-9 sm:px-8 sm:pt-12">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 py-3 text-center sm:mb-10 sm:py-5"
        >
          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.055em] text-ink sm:text-[38px]">
            Know what&apos;s on <span className="text-brand-600">your plate.</span>
          </h1>
        </motion.section>

        <div>
          <section className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="overflow-hidden rounded-[26px] border border-[#e7ede8] bg-white shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 px-5 pb-4 pt-6 sm:px-7 sm:pt-7">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <ScanLine size={17} />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                      Smart meal scan
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold tracking-[-0.04em] text-ink sm:text-[22px]">
                    What are we eating?
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    A quick photo is all it takes to get started.
                  </p>
                </div>
                <span className="rounded-full bg-[#f5f7f5] px-3 py-1.5 text-[11px] font-medium text-[#748078]">
                  JPG, PNG or WEBP · 10 MB max
                </span>
              </div>

              <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-label="Choose a food photo"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-label="Take a food photo"
                />
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`group relative min-h-[260px] overflow-hidden rounded-[20px] border border-dashed transition-all sm:min-h-[300px] ${
                    isDragging
                      ? "border-brand-500 bg-brand-50/80"
                      : previewUrl
                        ? "border-[#dfe8e1] bg-[#f7f9f7]"
                        : "border-[#dce5de] bg-[#fafcfb] hover:border-brand-500 hover:bg-brand-50/30"
                  }`}
                >
                  {previewUrl ? (
                    <>
                      {/* Preview is intentionally served from a local object URL before upload. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Selected meal preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101b15]/75 via-transparent to-[#101b15]/10" />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition hover:bg-white"
                        aria-label="Remove selected image"
                      >
                        <X size={17} />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
                        <div className="min-w-0 text-white">
                          <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-medium backdrop-blur">
                            <Check size={12} /> Ready to scan
                          </span>
                          <p className="truncate text-sm font-medium">
                            {imageFile?.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isAnalyzing ? (
                            <LoaderCircle className="animate-spin" size={17} />
                          ) : (
                            <Sparkles size={16} />
                          )}
                          {isAnalyzing ? "Analysing meal…" : "Analyse my meal"}
                          {!isAnalyzing && <ArrowUpRight size={16} />}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="relative flex min-h-[260px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[300px]">
                      <div className="soft-grid absolute inset-0 opacity-35" />
                      <div className="relative mb-4 flex h-[58px] w-[58px] items-center justify-center rounded-[19px] border border-white bg-white text-brand-600 shadow-[0_8px_24px_-12px_rgba(27,55,39,0.3)] transition duration-300 group-hover:-translate-y-1">
                        <ImagePlus size={25} strokeWidth={1.7} />
                      </div>
                      <h3 className="relative text-[15px] font-semibold tracking-[-0.02em] text-ink">
                        Drop your meal photo here
                      </h3>
                      <p className="relative mt-1.5 text-xs text-muted">
                        or choose how you&apos;d like to add one
                      </p>
                      <div className="relative mt-5 flex flex-wrap justify-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#263b30] active:scale-[0.98]"
                        >
                          <Camera size={15} />
                          Take a photo
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#e1e9e3] bg-white px-4 py-2.5 text-xs font-semibold text-[#46534b] transition hover:border-brand-500 hover:text-brand-700 active:scale-[0.98]"
                        >
                          <Upload size={14} />
                          Upload a photo
                        </button>
                      </div>
                      <p className="relative mt-5 text-[10px] text-[#98a29c]">
                        For the best estimate, show the full plate in natural light.
                      </p>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      role="alert"
                      className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isAnalyzing && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-5 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4"
                      role="status"
                      aria-live="polite"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
                        <LoaderCircle size={18} className="animate-spin" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          Reading your plate
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          Identifying ingredients and estimating nutrition…
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {result && !isAnalyzing && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-5 rounded-2xl border border-[#e5ece6] bg-white p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                            <Sparkles size={13} /> AI estimate
                          </span>
                          <p className="mb-1 text-[11px] text-muted">
                            Nutrition estimates are approximate.
                          </p>
                          <h3 className="text-lg font-semibold tracking-[-0.035em] text-ink">
                            {result.food_name}
                          </h3>
                        </div>
                        <span className="rounded-full bg-[#f4f7f4] px-3 py-1.5 text-[11px] font-medium text-[#77837b]">
                          Per serving
                        </span>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <ResultMetric
                          label="Calories"
                          value={result.calories}
                          unit="kcal"
                          color="text-ink"
                          background="bg-[#f5f7f5]"
                        />
                        <ResultMetric
                          label="Protein"
                          value={result.protein}
                          unit="g"
                          color="text-brand-700"
                          background="bg-brand-50"
                        />
                        <ResultMetric
                          label="Carbs"
                          value={result.carbs}
                          unit="g"
                          color="text-sky-700"
                          background="bg-sky-50"
                        />
                        <ResultMetric
                          label="Fats"
                          value={result.fat}
                          unit="g"
                          color="text-amber-700"
                          background="bg-amber-50"
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1ed] pt-4">
                        <p className="max-w-sm text-[11px] leading-5 text-muted">
                          AI estimates can vary with portion size and ingredients.
                        </p>
                        <button
                          type="button"
                          onClick={finishScan}
                          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                        >
                          <Camera size={15} /> Scan another meal
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </section>

        </div>
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#e8eee9] pt-5 text-[10px] text-[#98a29c] sm:flex-row">
          <span>© {new Date().getFullYear()} CalloAI · Made for mindful eating.</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} /> Estimates are informational, not medical advice.
          </span>
        </footer>
      </div>
    </main>
  );
}

function ResultMetric({
  label,
  value,
  unit,
  color,
  background,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  background: string;
}) {
  return (
    <div className={`rounded-2xl p-3.5 ${background}`}>
      <p className="text-[10px] font-medium text-[#78837d]">{label}</p>
      <p className={`mt-1 text-xl font-semibold tracking-[-0.05em] ${color}`}>
        {value}
        <span className="ml-1 text-[10px] font-medium tracking-normal">{unit}</span>
      </p>
    </div>
  );
}
