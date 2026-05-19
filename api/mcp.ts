// HTTP MCP server endpoint — api.twimp.app/mcp
//
// The @modelcontextprotocol/sdk is ESM-only, but the backend is compiled
// as CommonJS (no "type": "module" in package.json). Static `import`s of
// the SDK from CJS would fail at module-load time. Workaround: dynamic
// `await import()` inside the handler — Node supports CJS→ESM via dynamic
// import.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registerTools } from '../src/mcp/tools';

function unauthorized(res: VercelResponse, msg = 'Unauthorized') {
  res.status(401).json({
    jsonrpc: '2.0',
    error: { code: -32001, message: msg },
    id: null,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id, Accept');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Auth check before doing anything expensive
  const expected = process.env.MCP_TOKEN;
  if (!expected) {
    res.status(500).json({ error: 'MCP_TOKEN not configured on server' });
    return;
  }
  const auth = req.headers['authorization'];
  const authStr = Array.isArray(auth) ? auth[0] : auth;
  if (!authStr || authStr !== `Bearer ${expected}`) {
    return unauthorized(res, 'Missing or invalid bearer token');
  }

  // Dynamic-import the ESM SDK from our CJS module. Cast to `any`:
  // Node16 module resolution otherwise gives the dynamic-import value an
  // ESM type identity that doesn't match the CJS type tools.ts (and our
  // locals) see — same runtime class, separate nominal types in TS.
  // We're past type-safety territory here; just want the runtime to work.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { McpServer } = (await import('@modelcontextprotocol/sdk/server/mcp.js')) as any;
  const { StreamableHTTPServerTransport } = (await import(
    '@modelcontextprotocol/sdk/server/streamableHttp.js'
  )) as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const server = new McpServer({ name: 'twimp', version: '1.0.0' });
  registerTools(server);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });

  res.on('close', () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  await server.connect(transport);
  await transport.handleRequest(req as any, res as any, req.body);
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '4mb' },
  },
};
