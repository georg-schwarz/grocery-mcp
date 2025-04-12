export interface RootObject {
  FoundationFoods: FoundationFood[];
}

export interface FoundationFood {
  foodClass: string;
  description: string;
  foodNutrients: FoodNutrient[];
  foodCategory: FoodCategory;
  fdcId: number;
  publicationDate: string;
}

export interface FoodCategory {
  description: string;
}

export interface FoodNutrient {
  type: string;
  id: number;
  nutrient: Nutrient;
}

export interface Nutrient {
  id: number;
  number: string;
  name: string;
  rank: number;
  unitName: string;
}
