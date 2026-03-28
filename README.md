# Docker + ngrok Demo
> Ostad · Batch 11 · Module 01

A live demo showing how to expose a local Docker app to the internet using ngrok.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- An ngrok account → [dashboard.ngrok.com](https://dashboard.ngrok.com)

---

## First-time Setup

1. Get your auth token from [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Create a `.env` file in this folder:
   ```
   NGROK_AUTHTOKEN=your_token_here
   ```

---

## Start

```bash
docker compose up --build -d && bash get-url.sh
```

This starts everything and **automatically prints your public URL**:
```
============================================
  Live URL: https://xxxx.ngrok-free.app
============================================
```

If you made code changes and want to force a full rebuild:
```bash
docker compose up --build -d --force-recreate && bash get-url.sh
```

Open that URL in any browser — from any device, anywhere.

---

## Run Locally (without Docker)

Two options to run the app on your machine and tunnel it via ngrok:

### Option 1 — ngrok CLI installed locally

```bash
# Terminal 1: start the app
npm install
npm start

# Terminal 2: start the tunnel
ngrok http 3000
```

ngrok prints the public URL directly in Terminal 2.  
Install ngrok CLI: [ngrok.com/download](https://ngrok.com/download)

---

### Option 2 — ngrok via Docker (no local ngrok install needed)

```bash
# Terminal 1: start the app
npm install
npm start

# Terminal 2: run just the ngrok container
docker run --rm -p 4040:4040 \
  -e NGROK_AUTHTOKEN=your_token_here \
  ngrok/ngrok:latest http host.docker.internal:3000
```

`host.docker.internal` lets the ngrok container reach your app running on the host machine.  
Get the URL once running:
```bash
curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*"'
```

---

## Stop

```bash
docker compose down
```

---

## Bonus: Traffic Inspector

While the app is running, open **http://localhost:4040** in your browser to see every incoming request in real time — headers, body, response, and more.

---

## Endpoints

| Method | Path      | Description          |
|--------|-----------|----------------------|
| GET    | `/`       | Landing page         |
| GET    | `/health` | Health check (JSON)  |
| POST   | `/echo`   | Echo request body    |

---

## 🧑‍💻 Author

*Md. Sarowar Alam*  
Lead DevOps Engineer, Hogarth Worldwide  
📧 Email: sarowar@hotmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/sarowar/
