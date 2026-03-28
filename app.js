const express = require('express');
const os = require('os');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Docker + ngrok — Ostad Batch 11</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f0f1a;
      color: #e0e0e0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .topbar {
      width: 100%;
      max-width: 560px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .ostad-brand {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #fff;
    }
    .ostad-brand span { color: #f97316; }
    .batch-pill {
      font-size: 0.7rem;
      font-weight: 600;
      background: #f9731622;
      color: #f97316;
      border: 1px solid #f9731655;
      border-radius: 999px;
      padding: 3px 12px;
      letter-spacing: 1px;
    }
    .card {
      background: #1a1a2e;
      border: 1px solid #2a2a4a;
      border-radius: 16px;
      padding: 2.5rem 3rem;
      max-width: 560px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      background: #1bd96a22;
      color: #1bd96a;
      border: 1px solid #1bd96a55;
      border-radius: 999px;
      font-size: 0.75rem;
      padding: 4px 14px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 1.2rem;
    }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #ffffff; }
    .subtitle { color: #888; margin-bottom: 2rem; font-size: 0.95rem; }
    .instructor-note {
      background: #f9731611;
      border: 1px dashed #f9731644;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      font-size: 0.82rem;
      color: #f97316cc;
      margin-bottom: 1.5rem;
      text-align: left;
      line-height: 1.6;
    }
    .instructor-note strong { color: #f97316; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .info-box {
      background: #12122a;
      border-radius: 10px;
      padding: 1rem;
      border: 1px solid #2a2a4a;
    }
    .info-box .label { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .info-box .value { font-size: 0.9rem; color: #1bd96a; font-weight: 600; word-break: break-all; }
    .endpoints { text-align: left; }
    .endpoints h3 { font-size: 0.8rem; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem; }
    .endpoint {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      background: #12122a;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      border: 1px solid #2a2a4a;
      font-size: 0.88rem;
    }
    .method {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      min-width: 40px;
      text-align: center;
    }
    .get  { background: #1a4a1a; color: #4caf50; }
    .post { background: #4a3a00; color: #ffc107; }
    .path { color: #aaa; font-family: monospace; }
    .desc { color: #555; font-size: 0.78rem; margin-left: auto; }
    footer { margin-top: 1.5rem; font-size: 0.75rem; color: #444; text-align: center; }
    footer span { color: #1bd96a; }
    footer .instructor { color: #f97316; }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="ostad-brand"><span>Ostad</span> · Module 01</div>
    <div class="batch-pill">Batch 11</div>
  </div>

  <div class="card">
    <div class="badge">&#x2022; Live via ngrok</div>
    <h1>Docker + ngrok</h1>
    <p class="subtitle">Your local app is publicly accessible right now!</p>

    <div class="instructor-note">
      &#128075; <strong>Ngrok Demo</strong> — This Express app is running inside a
      Docker container on the local laptop. ngrok created a secure tunnel
      so you can open this URL from <em>any device, anywhere</em> — no port
      forwarding, no firewall rules needed.
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="label">Status</div>
        <div class="value">Running</div>
      </div>
      <div class="info-box">
        <div class="label">Container Port</div>
        <div class="value">:3000</div>
      </div>
      <div class="info-box">
        <div class="label">Timestamp</div>
        <div class="value">${new Date().toISOString()}</div>
      </div>
      <div class="info-box">
        <div class="label">Machine</div>
        <div class="value">${process.env.HOST_HOSTNAME || os.hostname()}</div>
      </div>
    </div>

    <div class="endpoints">
      <h3>Available Endpoints</h3>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/</span>
        <span class="desc">This page</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="path">/health</span>
        <span class="desc">Health check (JSON)</span>
      </div>
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="path">/echo</span>
        <span class="desc">Echo body back (JSON)</span>
      </div>
    </div>
  </div>
  <footer>
    Tunneled by <span>ngrok</span> &middot; Containerized with <span>Docker</span>
    &middot; <span class="instructor">Ostad Batch 11</span>
  </footer>
</body>
</html>`;
  res.send(html);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/echo', (req, res) => {
  res.json({
    received: req.body,
    echo: true,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Demo app running on http://0.0.0.0:${port}`);
});