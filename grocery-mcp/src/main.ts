import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "groceries",
  version: "0.0.1",
  capabilities: {
    resourcies: {},
    tools: {},
  },
});

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