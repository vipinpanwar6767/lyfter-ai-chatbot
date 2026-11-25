# lyfter-ai-chatbot

Full-stack LLM chatbot with API key failover, response caching and persistent conversation history.

## Run Locally with Docker

### Prerequisites

- Docker Desktop
- Docker Compose
- GNU Make
- At least two valid LLM API keys

### 1. Clone the repository

```bash
git clone https://github.com/vipinpanwar6767/lyfter-ai-chatbot.git
cd lyfter-ai-chatbot
```

### 2. Configure environment variables

Copy `.env.example` to `backend/.env`.

For Windows PowerShell:

```powershell
Copy-Item .env.example backend/.env
```

For Linux or macOS:

```bash
cp .env.example backend/.env
```

Replace the placeholder API keys with valid API keys.

Never commit your actual `.env` file.

### 3. Start the application

```bash
make up
```

### 4. Access the application

| Service          | URL                          |
| ---------------- | ---------------------------- |
| Frontend         | http://localhost:3000        |
| Backend          | http://localhost:8000        |
| Swagger API Docs | http://localhost:8000/docs   |
| Health Check     | http://localhost:8000/health |

### 5. Available Make Commands

| Command      | Description                  |
| ------------ | ---------------------------- |
| make up      | Build and start all services |
| make down    | Stop and remove containers   |
| make ps      | View running services        |
| make logs    | View application logs        |
| make restart | Restart services             |

If GNU Make is unavailable, use:

```bash
docker compose up --build -d
```

### Docker Architecture

The application uses multi-stage Docker builds:

- Frontend: Node.js 24 for building React and Nginx
  for serving production files.
- Backend: Python 3.12 with FastAPI and Uvicorn.
- Docker Compose: Manages frontend and backend services.
- SQLite: Stores conversation history in a persistent
  named Docker volume mounted at `/data`.

### Database Persistence

The SQLite database is stored at `/data/app.db`
inside a named Docker volume.

Conversation history survives container removal
and recreation.

This was verified by comparing stored message counts
before and after running Docker Compose down and up.

Avoid running `docker compose down -v` unless you
intentionally want to delete the stored database.

### Live Deployment

Docker is used for reproducible local execution.
The public frontend is deployed on Vercel, and
the public backend is deployed on Render.
