// Local test harness (not deployed): serves the Vercel handlers on :3001
// with a local trail JSON override (BATCH_TRAIL_FILE) and file sessions.
import http from 'http';
import fs from 'fs';
import { TrailService } from '../src/services/TrailService';
import next from '../api/next';
import play from '../api/play';
import awty from '../api/awty';

const file = process.env.BATCH_TRAIL_FILE!;
const trail = JSON.parse(fs.readFileSync(file, 'utf8'));
(TrailService as any).getTrailByRefAsync = async (ref: string) => (ref === trail.ref ? trail : undefined);

const routes: Record<string, any> = { '/next': next, '/play': play, '/awty': awty };
http.createServer((req, res) => {
  let raw = '';
  req.on('data', c => (raw += c));
  req.on('end', async () => {
    const url = new URL(req.url!, 'http://x');
    const h = routes[url.pathname];
    const r: any = res;
    r.status = (c: number) => { res.statusCode = c; return r; };
    r.json = (o: any) => { if (!res.headersSent) res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return r; };
    r.send = (o: any) => { res.end(typeof o === 'string' ? o : JSON.stringify(o)); return r; };
    const q: any = req;
    q.query = Object.fromEntries(url.searchParams);
    try { q.body = raw ? JSON.parse(raw) : {}; } catch { q.body = {}; }
    if (!h) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      if (req.method === 'OPTIONS') return res.end();
      if (url.pathname === '/list') return r.json({ featured: [], playAgain: [], nearYou: [], all: [{ ref: trail.ref, name: trail.name, description: trail.description, image_url: trail.image_url, tags: trail.tags, hasSession: true }] });
      res.statusCode = 404; return res.end('{}');
    }
    try { await h(q, r); } catch (e: any) { console.error(e); res.statusCode = 500; res.end(JSON.stringify({ err: e.message })); }
  });
}).listen(3001, () => console.log('local api :3001'));
