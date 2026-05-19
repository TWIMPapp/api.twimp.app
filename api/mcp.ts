// HTTP MCP server endpoint — mcp.twimp.app
//
// Implements the MCP Streamable HTTP transport, gated by a bearer-token check.
// One token (`MCP_TOKEN` env var) for now — single-user setup.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { registerTools } from '../src/mcp/tools';

function unauthorized(res: VercelResponse, msg = 'Unauthorized') {
  res.status(401).json({
    jsonrpc: '2.0',
    error: { code: -32001, message: msg },
    id: null,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id');
    res.status(204).end();
    return;
  }

  // Auth check — bearer token compared against env var
  const expected = process.env.MCP_TOKEN;
  if (!expected) {
    res.status(500).json({ error: 'MCP_TOKEN not configured on server' });
    return;
  }
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  const authStr = Array.isArray(auth) ? auth[0] : auth;
  if (!authStr || authStr !== `Bearer ${expected}`) {
    return unauthorized(res, 'Missing or invalid bearer token');
  }

  // Build a fresh server per request (stateless mode — no session IDs).
  // This keeps each Vercel function invocation independent, which is what
  // serverless wants. Cost: tool list/init runs on every request.
  const server = new McpServer({ name: 'twimp', version: '1.0.0' });
  registerTools(server);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,        // stateless
    enableJsonResponse: true,             // JSON not SSE for simple req/res
  });

  res.on('close', () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  await server.connect(transport);
  // The transport reads req.body if already parsed (Vercel does this) or
  // streams the body itself otherwise.
  await transport.handleRequest(req as any, res as any, req.body);
}

// Tell Vercel to parse JSON bodies for us
export const config = {
  api: {
    bodyParser: { sizeLimit: '4mb' },
  },
};
