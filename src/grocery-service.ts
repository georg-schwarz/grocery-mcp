import { Buffer } from "node:buffer";
import * as unzipper from "unzipper";
import type { RootObject } from "./us-food-data.types.ts";

export interface Grocery {
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export class GroceryService {
  private groceries: Grocery[] = [];

  async init(url: string) {
    const dataRoot = await this.downloadJson(url);
    const groceries = this.extractNutriments(dataRoot);
    this.groceries.push(...groceries);
    console.error(`Initialized GroceryService with ${groceries.length} groceries`);
  }

  async downloadJson(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const directory = await unzipper.Open.buffer(buffer);
      const file = directory.files.find((f) =>
        f.path === "foundationDownload.json"
      );
      if (!file) {
        throw new Error("foundationDownload.json not found in archive");
      }

      const content = await file.buffer();
      const json = JSON.parse(content.toString());
      return json;
    } catch (error) {
      console.error("Error downloading or processing JSON:", error);
    }
  }

  extractNutriments(json: RootObject): Grocery[] {
    const groceries: Grocery[] = [];
    json.FoundationFoods.forEach((food) => {
      const name = food.description;
      const kcal = food.foodNutrients.find(
        (n) => n.nutrient.name === "Energy",
      )?.nutrient.number;
      const protein = food.foodNutrients.find(
        (n) => n.nutrient.name === "Protein",
      )?.nutrient.number;
      const fat = food.foodNutrients.find(
        (n) => n.nutrient.name === "Total lipid (fat)",
      )?.nutrient.number;
      const carbohydrates = food.foodNutrients.find(
        (n) => n.nutrient.name === "Carbohydrate, by difference",
      )?.nutrient.number;

      groceries.push({
        name: name,
        kcal: kcal === undefined ? 0 : Number.parseInt(kcal),
        protein: protein === undefined ? 0 : Number.parseInt(protein),
        fat: fat === undefined ? 0 : Number.parseInt(fat),
        carbohydrates: carbohydrates === undefined
          ? 0
          : Number.parseInt(carbohydrates),
      });
    });
    return groceries;
  }

  getNutriments(groceryName: string): Grocery | undefined {
    const grocery = this.groceries.find((g) => g.name === groceryName);
    if (!grocery) {
      return undefined;
    }
    return grocery;
  }
}
