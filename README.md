# Docker + ngrok Demo

> **Ostad · Batch 11 · Module 01**  
> A classroom demonstration showing how a locally containerised Node.js app can be exposed to the public internet in seconds using ngrok — no firewall rules, no port forwarding, no cloud deployment required.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Repository Structure](#repository-structure)
3. [Dependencies & Prerequisites](#dependencies--prerequisites)
4. [Environment Configuration](#environment-configuration)
5. [Running the System — Docker Compose (recommended)](#running-the-system--docker-compose-recommended)
6. [Running the System — Locally without Docker](#running-the-system--locally-without-docker)
7. [Stopping the System](#stopping-the-system)
8. [API Reference](#api-reference)
9. [Operational Tasks](#operational-tasks)
10. [Making Changes Safely](#making-changes-safely)
11. [Troubleshooting](#troubleshooting)
12. [Author](#-author)

---

## Architecture Overview

```
                    ┌─────────────────────────────────┐
                    │         Docker Network           │
                    │                                  │
  Browser/Phone ──► │  ngrok container  ──►  app       │
  (public HTTPS)    │  (ngrok/ngrok)       container   │
                    │  port 4040 (UI)      port 3000   │
                    └─────────────────────────────────┘
                              │
                    localhost:3000 also accessible
                    locally for direct testing
```

**Two containers, one network:**

| Container | Image | Role |
|---|---|---|
| `demo-app` | Built from local `Dockerfile` | Express.js API serving HTML + JSON |
| `demo-ngrok` | `ngrok/ngrok:latest` | Creates a public HTTPS tunnel to `demo-app:3000` |

**Design decisions:**

- `demo-ngrok` uses `depends_on: app` so it starts after the app is ready
- The real Windows machine hostname is injected via `COMPUTERNAME` env var so the app can display it on the landing page (Docker containers report their container ID as hostname, not the host machine name)
- ngrok auth token is kept in `.env` (gitignored) — never hardcoded
- `restart: unless-stopped` keeps both containers alive across Docker Desktop restarts

---

## Repository Structure

```
docker-ngrok-demo/
├── app.js               # Express app — HTML landing page + API routes
├── Dockerfile           # Builds the app container image (node:18-alpine)
├── docker-compose.yml   # Wires app + ngrok containers together
├── package.json         # Node.js dependencies (express ^4.18.2)
├── get-url.sh           # Helper script — polls ngrok API and prints public URL
├── .env                 # Secret — NGROK_AUTHTOKEN (gitignored, create manually)
├── .gitignore           # Excludes .env and node_modules
└── .dockerignore        # Excludes node_modules, .env from Docker build context
```

---

## Dependencies & Prerequisites

### Required software

| Tool | Minimum Version | Purpose | Install |
|---|---|---|---|
| Docker Desktop | 4.x | Container runtime | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Git Bash / WSL | any | Run `.sh` scripts on Windows | Included with Git for Windows |
| ngrok account | free tier | Auth token for tunnelling | [dashboard.ngrok.com](https://dashboard.ngrok.com) |

> **Node.js is NOT required on the host** when using Docker Compose. It is only needed for the local (non-Docker) run options.

### Node.js (local runs only)

| Tool | Version | Install |
|---|---|---|
| Node.js | 18.x LTS | [nodejs.org](https://nodejs.org) |

### Runtime dependencies (`package.json`)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | HTTP server framework |

---

## Environment Configuration

Create a `.env` file in the project root before first run:

```bash
# .env
NGROK_AUTHTOKEN=your_token_here
```

Get your token from: [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)

**Rules:**
- `.env` is gitignored — never commit it
- The token is injected into the `ngrok` container at runtime via `docker-compose.yml`
- `COMPUTERNAME` (Windows built-in env var) is automatically passed through to display the host machine name on the landing page — no manual action needed

---

## Running the System — Docker Compose (recommended)

This is the primary demo mode. One command starts both the app and ngrok.

### Start and get the public URL

```bash
docker compose up --build -d && bash get-url.sh
```

Expected output:

```
============================================
  Live URL: https://xxxx.ngrok-free.app
============================================
```

Open that URL in any browser — from any device, anywhere in the world.

### Force a full rebuild (after code changes)

```bash
docker compose up --build -d --force-recreate && bash get-url.sh
```

> Use `--force-recreate` when you've changed `app.js` or any source file to ensure Docker picks up the new code rather than using a cached layer.

### What `get-url.sh` does

The script polls `http://localhost:4040/api/tunnels` (ngrok's local API) every second for up to 15 seconds until the tunnel is established, then prints the URL. This avoids manually reading container logs.

---

## Running the System — Locally without Docker

Use these options when Docker is unavailable or you want to iterate faster during development.

### Option 1 — ngrok CLI installed locally

```bash
# Terminal 1 — start the app
npm install
npm start

# Terminal 2 — start the tunnel
ngrok http 3000
```

ngrok prints the public URL directly in Terminal 2.

Install ngrok CLI: [ngrok.com/download](https://ngrok.com/download)  
Authenticate once: `ngrok config add-authtoken your_token_here`

---

### Option 2 — ngrok via Docker, app running locally

No local ngrok install needed. The ngrok container connects back to port 3000 on your host machine via `host.docker.internal`.

```bash
# Terminal 1 — start the app
npm install
npm start

# Terminal 2 — run just the ngrok container
docker run --rm -p 4040:4040 \
  -e NGROK_AUTHTOKEN=your_token_here \
  ngrok/ngrok:latest http host.docker.internal:3000
```

Get the public URL:

```bash
curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*"'
```

---

## Stopping the System

### Docker Compose

```bash
docker compose down
```

Stops and removes both containers. Images remain cached for fast restart.

### Local runs (Option 1 or Option 2)

Press `Ctrl+C` in each terminal to stop the app and the ngrok process/container.

---

## API Reference

Base URL (local): `http://localhost:3000`  
Base URL (public): `https://<your-ngrok-subdomain>.ngrok-free.app`

| Method | Path | Description | Response |
|---|---|---|---|
| `GET` | `/` | Styled HTML landing page | `text/html` |
| `GET` | `/favicon.ico` | Suppresses browser favicon 404 | `204 No Content` |
| `GET` | `/health` | Health check | `{ status: "OK", timestamp: "..." }` |
| `POST` | `/echo` | Echoes request body back | `{ received: <body>, echo: true, timestamp: "..." }` |

**Example — health check:**

```bash
curl https://xxxx.ngrok-free.app/health
```

**Example — echo:**

```bash
curl -X POST https://xxxx.ngrok-free.app/echo \
  -H "Content-Type: application/json" \
  -d '{"student": "Alice", "batch": 11}'
```

---

## Operational Tasks

### View live container logs

```bash
docker logs demo-app       # Express app logs
docker logs demo-ngrok     # ngrok tunnel logs (shows public URL)
```

### Follow logs in real time

```bash
docker logs -f demo-app
docker logs -f demo-ngrok
```

### Check container status

```bash
docker compose ps -a
```

### Restart a single container

```bash
docker compose restart app
docker compose restart ngrok
```

### Inspect ngrok traffic (real-time request viewer)

Open **http://localhost:4040** in your browser while the stack is running.  
Every request — including headers, body, and response — appears here in real time. Requests can be replayed with one click.

### Rotate the ngrok auth token

1. Go to [dashboard.ngrok.com/tunnels/authtokens](https://dashboard.ngrok.com/tunnels/authtokens)
2. Create a new token and revoke the old one
3. Update `.env` with the new value
4. Restart: `docker compose down && docker compose up -d`

---

## Making Changes Safely

### Changing the app (`app.js`)

1. Edit `app.js`
2. Rebuild and restart:
   ```bash
   docker compose up --build -d --force-recreate && bash get-url.sh
   ```
3. Verify locally first: `curl http://localhost:3000/health`
4. Then verify via the public URL

### Changing dependencies (`package.json`)

1. Add/update the dependency in `package.json`
2. The `RUN npm install` layer in the Dockerfile will re-run on next `--build`
3. Rebuild: `docker compose up --build -d --force-recreate`

### Changing infrastructure (`docker-compose.yml` or `Dockerfile`)

- Always run `docker compose down` before applying structural changes to avoid orphaned containers
- Test changes with `docker compose config` to validate YAML syntax before bringing the stack up

### What NOT to do

| Action | Risk |
|---|---|
| Committing `.env` | Exposes your ngrok auth token publicly |
| Using `docker compose up` without `--build` after code changes | Runs stale code from the previous image |
| Running two tunnels simultaneously with the same free-tier token | `ERR_NGROK_334` — free accounts allow one tunnel at a time |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `docker logs demo-ngrok` is empty | ngrok started too recently or crashed immediately | Wait 2–3 seconds and retry; check `docker ps -a` for exit code |
| `ERR_NGROK_334` | Another tunnel is already active on the same account | Stop existing tunnel from [dashboard.ngrok.com/tunnels](https://dashboard.ngrok.com/tunnels) then restart |
| `ERR_NGROK_105` / authentication failed | Auth token revoked or invalid | Generate a new token at [dashboard.ngrok.com](https://dashboard.ngrok.com), update `.env` |
| Machine name shows container ID (e.g. `876076d9e893`) | `COMPUTERNAME` not set or not passed through | Ensure you are running on Windows where `COMPUTERNAME` is set automatically; on Linux/Mac set it manually in `.env` |
| `bash get-url.sh` times out | ngrok container not yet healthy or failed | Run `docker logs demo-ngrok` to see the error |
| `curl localhost:3000` refused | App container not running | Run `docker compose ps` and check `demo-app` status |

---

## 🧑‍💻 Author

*Md. Sarowar Alam*  
Lead DevOps Engineer, Hogarth Worldwide  
📧 Email: sarowar@hotmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/sarowar/
