# Open Notebook Quick Installation Guide

Fast setup for users with Docker and prerequisites already installed.

**Prerequisites**: Docker, Docker Compose, and Ollama installed.

## Step 1: Pull Ollama Models

```bash
# Language model (choose one)
ollama pull qwen3              # Recommended: 7B, excellent performance
ollama pull gemma3             # Alternative: Google's model
ollama pull deepseek-r1        # Advanced: Reasoning model

# Embedding model (required for search)
ollama pull mxbai-embed-large
```

## Step 2: Configure Ollama for Docker

**Important**: Ollama must accept connections from Docker containers.

```bash
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

Keep this terminal running. Open a new terminal for the next steps.

**Linux users**: Make this permanent by adding to `~/.bashrc`:
```bash
echo 'export OLLAMA_HOST=0.0.0.0:11434' >> ~/.bashrc
```

## Step 3: Deploy Open Notebook

### Option A: Single Command (Recommended)

```bash
mkdir open-notebook && cd open-notebook

docker run -d \
  --name open-notebook \
  -p 8502:8502 -p 5055:5055 \
  -v ./notebook_data:/app/data \
  -v ./surreal_data:/mydata \
  -e OLLAMA_API_BASE=http://host.docker.internal:11434 \
  -e SURREAL_URL="ws://localhost:8000/rpc" \
  -e SURREAL_USER="root" \
  -e SURREAL_PASSWORD="root" \
  -e SURREAL_NAMESPACE="open_notebook" \
  -e SURREAL_DATABASE="production" \
  lfnovo/open_notebook:v1-latest-single
```

### Option B: Docker Compose

```bash
mkdir open-notebook && cd open-notebook
```

Create `docker-compose.yml`:
```yaml
services:
  open_notebook:
    image: lfnovo/open_notebook:v1-latest-single
    ports:
      - "8502:8502"
      - "5055:5055"
    environment:
      - OLLAMA_API_BASE=http://host.docker.internal:11434
      - SURREAL_URL=ws://localhost:8000/rpc
      - SURREAL_USER=root
      - SURREAL_PASSWORD=root
      - SURREAL_NAMESPACE=open_notebook
      - SURREAL_DATABASE=production
    volumes:
      - ./notebook_data:/app/data
      - ./surreal_data:/mydata
    restart: always
```

Start:
```bash
docker compose up -d
```

## Step 4: Access

Open browser: **http://localhost:8502**

## Step 5: Configure Models

1. Click **Settings** → **Models**
2. Set default models:
   - **Language**: `qwen3`
   - **Embedding**: `mxbai-embed-large`

## Remote Server Setup

If installing on a remote server (NAS, Raspberry Pi, etc.):

```bash
# Add API_URL with your server's IP or hostname
docker run -d \
  --name open-notebook \
  -p 8502:8502 -p 5055:5055 \
  -v ./notebook_data:/app/data \
  -v ./surreal_data:/mydata \
  -e API_URL=http://YOUR_SERVER_IP:5055 \
  -e OLLAMA_API_BASE=http://host.docker.internal:11434 \
  -e SURREAL_URL="ws://localhost:8000/rpc" \
  -e SURREAL_USER="root" \
  -e SURREAL_PASSWORD="root" \
  -e SURREAL_NAMESPACE="open_notebook" \
  -e SURREAL_DATABASE="production" \
  lfnovo/open_notebook:v1-latest-single
```

Replace `YOUR_SERVER_IP` with your server's actual IP (e.g., 192.168.1.100).

## Adding Cloud AI Providers

To use OpenAI, Anthropic, or other providers:

```bash
# Stop container
docker compose down

# Add to docker-compose.yml environment section:
      - OPENAI_API_KEY=sk-your-key-here
      - ANTHROPIC_API_KEY=sk-ant-your-key-here

# Restart
docker compose up -d
```

## Common Commands

```bash
# Status
docker compose ps

# Logs
docker compose logs -f

# Restart
docker compose restart

# Update
docker compose pull && docker compose up -d

# Stop
docker compose down
```

## Troubleshooting

### "Ollama unavailable"
```bash
# Test Ollama from Docker container
docker exec -it open-notebook curl http://host.docker.internal:11434/api/tags

# Verify OLLAMA_HOST is set
echo $OLLAMA_HOST  # Should show: 0.0.0.0:11434
```

### "Unable to connect to server"
Set `API_URL` environment variable for remote access (see Remote Server Setup above).

### Both Ports Required
- **8502**: Web interface
- **5055**: API backend

Both must be exposed for the application to work.

## What's Included

- **Open Notebook**: Web UI + API (ports 8502, 5055)
- **SurrealDB**: Database (internal, auto-configured)
- **Ollama**: Local AI models (external, port 11434)

## Performance Tips

- **CPU only**: Expect 2-5 seconds per response with qwen3
- **With GPU**: Sub-second responses
- **Storage**: Use SSD for better performance
- **Memory**: 16GB RAM recommended for comfortable use

## Next Steps

- Create a notebook
- Add sources (PDFs, videos, web pages)
- Chat with AI about your content
- Generate podcasts from your research

See [full documentation](docs/index.md) for advanced features.
