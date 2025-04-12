import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "groceries",
  version: "0.0.1",
  capabilities: {
    resourcies: {},
    tools: {},
  },
});

server.tool(
  "get-nutriments",
  "Get nutriment information for a grocery per 100g",
  { groceryName: z.string() },
  ({ groceryName }) => {
    // Simulate a call to a grocery API
    const nutriments = {
      calories: 100,
      protein: 5,
      fat: 2,
      carbohydrates: 15,
    };
    return {
      content: [
        {
          type: "text",
          text:
            `The nutriments for ${groceryName} are as follows:
- Calories: ${nutriments.calories}
- Protein: ${nutriments.protein}
- Fat: ${nutriments.fat}
- Carbohydrates: ${nutriments.carbohydrates}`,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Grocery MCP server started");
}

if (import.meta.main) {
  main()
    .catch((err) => {
      console.error("Error starting server:", err);
      Deno.exit(1);
    });
}
