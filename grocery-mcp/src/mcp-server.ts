import { McpServer } from "@modelcontextprotocol/sdk";

const server = new McpServer({
    name: "groceries",
    version: "0.0.1",
    capabilities: {
        resourcies: {},
        tools: {},
    },
});