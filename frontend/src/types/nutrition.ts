export type NutritionResult = {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealLogEntry = NutritionResult & {
  id: string;
  loggedAt: string;
};
