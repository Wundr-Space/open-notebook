# Open Notebook Quick Installation Guide (Build from Source)

Fast setup to build and run Open Notebook from source code in Docker containers.

**Prerequisites**: Docker and Docker Compose installed, source code cloned.

## Quick Build and Run

### 1. Navigate to Source Directory

```bash
cd /path/to/open-notebook
```

### 2. Build Docker Image from Source

```bash
# Build the single-container image (5-15 minutes)
docker build -f Dockerfile.single -t open-notebook:local-build .
```

### 3. Create and Start Services

```bash
cat > docker-compose.yml << 'EOF'
services:
  open_notebook:
    image: open-notebook:local-build  # Your locally built image
    ports:
      - "8502:8502"
      - "5055:5055"
    environment:
      - OLLAMA_API_BASE=http://ollama:11434
      - SURREAL_URL=ws://localhost:8000/rpc
      - SURREAL_USER=root
      - SURREAL_PASSWORD=root
      - SURREAL_NAMESPACE=open_notebook
      - SURREAL_DATABASE=production
    volumes:
      - ./notebook_data:/app/data
      - ./surreal_single_data:/mydata
    depends_on:
      - ollama
    restart: always

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: always

volumes:
  ollama_data:
EOF

docker compose up -d
```

### 4. Download AI Models

```bash
# Language model (choose one)
docker exec -it ollama ollama pull qwen3              # Recommended
docker exec -it ollama ollama pull gemma3             # Alternative
docker exec -it ollama ollama pull deepseek-r1        # Reasoning

# Embedding model (required for search)
docker exec -it ollama ollama pull mxbai-embed-large
```

### 5. Access and Configure

1. Open browser: **http://localhost:8502**
2. Click **Settings** → **Models**
3. Set:
   - Language Model: `qwen3`
   - Embedding Model: `mxbai-embed-large`
4. Click **Save**

**Done!** Your locally built Open Notebook is running.

## Development Workflow

Making code changes? Here's the quick rebuild process:

```bash
# 1. Make your code changes

# 2. Rebuild and restart
docker compose down
docker build -f Dockerfile.single -t open-notebook:local-build .
docker compose up -d

# 3. Check logs
docker compose logs -f open_notebook
```

## With GPU Support (NVIDIA)

For faster AI inference with NVIDIA GPU:

### 1. Install NVIDIA Container Toolkit

**Ubuntu/Debian:**
```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

### 2. Add GPU Configuration

Add this to the `ollama` service in your docker-compose.yml:

```yaml
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: always
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

Restart:
```bash
docker compose down && docker compose up -d
```

## Remote Server Setup

Installing on remote server (NAS, Raspberry Pi, cloud)?

Add `API_URL` to open_notebook environment in docker-compose.yml:

```yaml
services:
  open_notebook:
    # ... other settings
    environment:
      - API_URL=http://YOUR_SERVER_IP:5055
      - OLLAMA_API_BASE=http://ollama:11434
      # ... rest of environment
```

Replace `YOUR_SERVER_IP` with your server's IP (e.g., 192.168.1.100).

Access at: `http://YOUR_SERVER_IP:8502`

## Adding Cloud AI Providers

Want OpenAI, Anthropic, or other cloud providers too?

Add to `environment` section:

```yaml
    environment:
      # Existing environment variables...
      - OPENAI_API_KEY=sk-your-key-here
      - ANTHROPIC_API_KEY=sk-ant-your-key-here
      - GOOGLE_API_KEY=your-google-key-here
```

Restart:
```bash
docker compose restart
```

## Common Commands

```bash
# Check build status
docker compose ps

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f ollama
docker compose logs -f open_notebook

# Rebuild after code changes
docker compose down
docker build -f Dockerfile.single -t open-notebook:local-build .
docker compose up -d

# Restart all
docker compose restart

# Restart specific service
docker compose restart ollama

# Stop all
docker compose down

# List models in Ollama
docker exec -it ollama ollama list

# Check resource usage
docker stats
```

## Troubleshooting

### Build Fails

```bash
# Clean Docker cache and rebuild
docker system prune -a
docker build -f Dockerfile.single -t open-notebook:local-build .
```

### "Ollama unavailable" Error

```bash
# Test Ollama from Open Notebook container
docker exec -it open_notebook curl http://ollama:11434/api/tags

# If that fails, check both containers are running
docker compose ps

# Check Ollama logs
docker compose logs ollama

# Restart both services
docker compose restart
```

### Models Not Showing Up

```bash
# Verify models are installed
docker exec -it ollama ollama list

# If empty, pull models
docker exec -it ollama ollama pull qwen3
docker exec -it ollama ollama pull mxbai-embed-large
```

### "Unable to connect to server"

For **remote access**, ensure `API_URL` is set (see Remote Server Setup above).

For **local access**, both ports 8502 and 5055 must be accessible:
```bash
docker compose ps
# Should show both ports: 8502->8502 and 5055->5055
```

### Port Already in Use

```bash
# Find what's using the port
lsof -i :8502

# Either kill that process or change ports in docker-compose.yml
```

### Containers Not Starting

```bash
# Check logs for errors
docker compose logs

# Try cleaning up and restarting
docker compose down -v
docker compose up -d
```

## Build Options

### Build Multi-Container Version

For separate backend/frontend containers:

```bash
# Build regular (multi-container) image
docker build -f Dockerfile -t open-notebook:multi-build .
```

### Build with Custom Tag

```bash
# Build with version tag
docker build -f Dockerfile.single -t open-notebook:v1.0.0 .
```

### Build for Specific Platform

```bash
# Build for ARM64 (e.g., Raspberry Pi, Apple Silicon)
docker build -f Dockerfile.single --platform linux/arm64 -t open-notebook:local-build .

# Build for AMD64 (standard x86_64)
docker build -f Dockerfile.single --platform linux/amd64 -t open-notebook:local-build .
```

## Model Recommendations

### Fast & Free (CPU-friendly)
- **Language**: `qwen3` (7B) - Excellent quality, fast
- **Embedding**: `mxbai-embed-large` - Best for search

### Advanced Reasoning
- **Language**: `deepseek-r1` (7B) - Exceptional reasoning
- **Embedding**: `mxbai-embed-large`

### Cloud-Backed (requires API keys)
- **Language**: `gpt-5-mini` (OpenAI) - Great value
- **Embedding**: `text-embedding-3-small` (OpenAI)

## What's Running?

Your setup includes:

1. **open_notebook** container (built from source)
   - Web UI (port 8502)
   - API backend (port 5055)
   - SurrealDB database (embedded)

2. **ollama** container
   - AI model server (port 11434)
   - Local AI models storage

All communicate over Docker's internal network.

## Performance Tips

- **8GB RAM**: Use qwen3 only
- **16GB RAM**: Can use multiple models
- **32GB+ RAM**: Can run larger models (13B+)
- **GPU**: 10-50x faster responses
- **SSD**: Recommended for better database performance

## Data Backup

Your data locations:

```bash
./notebook_data/       # Notebooks and content
./surreal_single_data/ # Database
ollama_data            # Models (Docker volume)
```

Backup:
```bash
tar -czf backup-$(date +%Y%m%d).tar.gz notebook_data surreal_single_data
```

Restore:
```bash
tar -xzf backup-YYYYMMDD.tar.gz
```

## Security

For public deployments, add password protection:

```yaml
    environment:
      - OPEN_NOTEBOOK_PASSWORD=your_secure_password
```

## Getting Started

1. Create a notebook
2. Add sources (PDFs, links, text)
3. Chat with your content
4. Generate notes and summaries
5. Create podcasts from your research

## Learn More

- [Complete Installation Guide](INSTALL-FROM-SCRATCH.md) - Detailed setup
- [Documentation](docs/index.md) - Full feature guide
- [Docker Guide](docs/deployment/docker.md) - Advanced Docker configs
- [Ollama Guide](docs/features/ollama.md) - Model optimization

## Support

- 💬 [Discord](https://discord.gg/37XJPXfz2w) - Community help
- 🐛 [GitHub Issues](https://github.com/lfnovo/open-notebook/issues) - Bug reports
- 📧 [Email](mailto:luis@lfnovo.com) - Direct support

---

**You're all set!** Your Open Notebook is running from source code. Make changes, rebuild, and test locally!
