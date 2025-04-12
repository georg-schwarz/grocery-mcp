import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { GroceryService } from "./grocery-service.ts";

export class GroceryMCPServer {
  server: McpServer;

  constructor(private groceryService: GroceryService) {
    this.server = new McpServer({
      name: "groceries",
      version: "0.0.1",
      capabilities: {
        resourcies: {},
        tools: {},
      },
    });

    this.server.tool(
      "get-nutriments",
      "Get nutriment information for a grocery per 100g",
      { groceryName: z.string() },
      (props) => {
        return {
          content: [
            {
              type: "text",
              text: this.getNutriments(props.groceryName),
            },
          ],
        };
      },
    );
  }

  async connect() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Grocery MCP server started");
  }

  private getNutriments(groceryName: string) {
    const nutriments = this.groceryService.getNutriments(groceryName);
    if (nutriments == null) {
      return `Sorry, I couldn't find any information for ${groceryName}.`;
    }
    return `The nutriments for ${groceryName} are as follows:
- Calories: ${nutriments.kcal}
- Protein: ${nutriments.protein}
- Fat: ${nutriments.fat}
- Carbohydrates: ${nutriments.carbohydrates}`;
  }
}
