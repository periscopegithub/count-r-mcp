import express, { Request, Response } from 'express';
import cors from 'cors';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

// Handle graceful shutdown
const shutdown = () => {
    console.log("Shutting down server gracefully...");
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Create Express app
const app = express();
app.use(cors());

// Create MCP server
const server = new McpServer({
    name: "count-r",
    version: "1.0.0"
});

// Store SSE transports for session management
const transports: { [sessionId: string]: SSEServerTransport } = {};

// Define count-r tool
server.tool(
    "count-r",
    { word: z.string() },
    async ({ word }) => {
        try {
            if (typeof word !== 'string') {
                return {
                    content: [{ type: "text", text: "0" }]
                };
            }
            const count = word.toLowerCase().split('r').length - 1;
            return {
                content: [{ type: "text", text: String(count) }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: "0" }],
                isError: true
            };
        }
    }
);

// Set up SSE endpoint
app.get('/sse', async (_: Request, res: Response) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
    
    res.on('close', () => {
        delete transports[transport.sessionId];
    });
    
    await server.connect(transport);
});

// Handle POST messages
app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

// Start server
const PORT = 5000;
const HOST = '127.0.0.1';

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
    console.log(`SSE endpoint available at http://${HOST}:${PORT}/sse`);
});
