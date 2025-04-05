#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';

// Create MCP server instance
const server = new Server(
  {
    name: 'count-r',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Set up the tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'count_r',
      description: 'Count the number of "r" letters in a given word',
      inputSchema: {
        type: 'object',
        properties: {
          word: {
            type: 'string',
            description: 'The word to count "r" letters in',
          },
        },
        required: ['word'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'count_r') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const { word } = request.params.arguments;
  
  try {
    // Count occurrences of 'r' (case insensitive)
    const count = (word || '').toLowerCase().split('r').length - 1;
    
    return {
      content: [
        {
          type: 'text',
          text: String(count),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: '0',
        },
      ],
    };
  }
});

// Error handling
server.onerror = (error) => console.error('[MCP Error]', error);

// Set up Express server for SSE
const app = express();
app.use(cors());

// SSE endpoint
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Create custom transport for SSE
  const transport = {
    send: (message) => {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    },
    onMessage: () => {},
    close: () => {},
    start: async () => {},
    connected: true,
    setMessageHandler: (handler) => {
      transport.onMessage = handler;
    }
  };

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(':keepalive\n\n');
  }, 15000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(keepAlive);
    server.close().catch(console.error);
  });

  // Handle incoming messages from the client
  req.on('data', (data) => {
    try {
      const message = JSON.parse(data.toString());
      transport.onMessage?.(message);
    } catch (error) {
      console.error('Error parsing client message:', error);
    }
  });

  // Connect MCP server using custom SSE transport
  server.connect(transport).catch(console.error);
});

// Start the server
const PORT = 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`MCP SSE server running at http://127.0.0.1:${PORT}/sse`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server gracefully...');
  await server.close();
  process.exit(0);
});
