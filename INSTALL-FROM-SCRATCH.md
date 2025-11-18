# Open Notebook Installation Guide - From Scratch

Complete setup for Open Notebook with SurrealDB and Ollama on a fresh system.

## System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 8GB minimum (16GB recommended for Ollama)
- **Storage**: 20GB free space
- **CPU**: 4+ cores recommended

## Step 1: Install Docker

### macOS
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker
```

Launch Docker Desktop from Applications.

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

Log out and back in for group changes to take effect.

### Windows
Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).

## Step 2: Install Ollama

### macOS/Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Download and install from [ollama.ai](https://ollama.ai/download).

### Pull Required Models
```bash
# Language model
ollama pull qwen3

# Embedding model (for search)
ollama pull mxbai-embed-large
```

### Configure Ollama for Docker Access
```bash
# Ollama must accept connections from Docker containers
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

Leave this terminal running. Open a new terminal for the next steps.

## Step 3: Install Open Notebook

### Create Project Directory
```bash
mkdir open-notebook && cd open-notebook
```

### Create docker-compose.yml
```bash
cat > docker-compose.yml << 'EOF'
services:
  open_notebook:
    image: lfnovo/open_notebook:v1-latest-single
    ports:
      - "8502:8502"  # Web UI
      - "5055:5055"  # API
    environment:
      # Add your OpenAI key if you have one (optional with Ollama)
      - OPENAI_API_KEY=
      # Ollama connection (from Docker to host)
      - OLLAMA_API_BASE=http://host.docker.internal:11434
      # Database settings
      - SURREAL_URL=ws://localhost:8000/rpc
      - SURREAL_USER=root
      - SURREAL_PASSWORD=root
      - SURREAL_NAMESPACE=open_notebook
      - SURREAL_DATABASE=production
    volumes:
      - ./notebook_data:/app/data
      - ./surreal_data:/mydata
    restart: always
EOF
```

### Start Open Notebook
```bash
docker compose up -d
```

### Verify Installation
```bash
# Check services
docker compose ps

# Check logs
docker compose logs -f
```

## Step 4: Access Open Notebook

Open your browser to: **http://localhost:8502**

## Step 5: Configure AI Models

1. Click the **Settings** icon in Open Notebook
2. Navigate to **Models**
3. Configure your models:
   - **Language Model**: Select `qwen3` (Ollama)
   - **Embedding Model**: Select `mxbai-embed-large` (Ollama)

## Troubleshooting

### Ollama Not Connecting
```bash
# Verify Ollama is accessible
curl http://localhost:11434/api/tags

# Check Ollama is bound to all interfaces
ps aux | grep ollama
# Should show OLLAMA_HOST=0.0.0.0:11434
```

### Open Notebook Not Starting
```bash
# Check logs
docker compose logs

# Restart services
docker compose restart
```

### Port Already in Use
```bash
# Find what's using the port
lsof -i :8502
# or
netstat -tulpn | grep 8502

# Kill the process or use different ports in docker-compose.yml
```

## Service Management

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Update to latest version
docker compose pull
docker compose up -d
```

## Next Steps

- Create your first notebook
- Add sources (PDFs, text, web pages)
- Chat with your content
- Generate podcasts from your research

For detailed feature documentation, visit the [docs](docs/index.md).
