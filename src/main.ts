import { GroceryService } from "./grocery-service.ts";
import { GroceryMCPServer } from "./mcp-server.ts";

async function main() {
  const groceryService = new GroceryService();
  await groceryService.init(
    "https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2024-10-31.zip",
  );

  const mcpServer = new GroceryMCPServer(groceryService);
  await mcpServer.connect();
}

if (import.meta.main) {
  main()
    .catch((err) => {
      console.error("Error starting server:", err);
      Deno.exit(1);
    });
}
