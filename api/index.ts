import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twimp API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { text-align: center; padding: 2rem; }
        h1 { font-size: 3rem; margin-bottom: 0.5rem; }
        p { opacity: 0.9; font-size: 1.2rem; }
        .status {
            background: rgba(255,255,255,0.2);
            padding: 1rem 2rem;
            border-radius: 8px;
            margin-top: 2rem;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>api.twimp.app</h1>
        <p>Easter Event API Server</p>
        <div class="status">Status: Online</div>
    </div>
</body>
</html>`);
}
