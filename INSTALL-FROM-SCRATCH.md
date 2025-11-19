# Open Notebook Installation Guide - From Scratch (Build from Source)

Complete containerized setup for Open Notebook built from source code. This guide shows how to build Docker images from the source code in this repository and run them locally for testing.

## System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 8GB minimum (16GB recommended for Ollama)
- **Storage**: 20GB free space
- **CPU**: 4+ cores recommended
- **Optional**: NVIDIA GPU with 8GB+ VRAM for faster AI inference

## Step 1: Install Docker

### macOS
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker
```

Launch Docker Desktop from Applications and wait for it to start.

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**Important**: Log out and back in for group changes to take effect.

### Windows
Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/).

### Verify Docker Installation
```bash
docker --version
docker compose version
```

## Step 2: Clone or Navigate to Source Code

If you haven't already cloned the repository:

```bash
git clone https://github.com/Wundr-Space/open-notebook.git
cd open-notebook
```

If you're already in the repository:
```bash
cd /path/to/open-notebook
```

## Step 3: Build Open Notebook Docker Image from Source

Build the Docker image from the source code:

```bash
# Build the single-container image (includes Open Notebook + SurrealDB)
docker build -f Dockerfile.single -t open-notebook:local-build .
```

This will:
- Build the Python backend
- Build the Next.js frontend
- Install SurrealDB
- Create a single container image with everything
- Take 5-15 minutes depending on your machine

**Note**: The image will be tagged as `open-notebook:local-build` on your local machine.

## Step 4: Create Docker Compose Configuration

Create a `docker-compose.yml` file in your project directory:

```bash
cat > docker-compose.yml << 'EOF'
services:
  open_notebook:
    image: open-notebook:local-build  # Uses your locally built image
    ports:
      - "8502:8502"  # Web UI
      - "5055:5055"  # API
    environment:
      # Ollama connection (container to container)
      - OLLAMA_API_BASE=http://ollama:11434
      # Database settings (auto-configured in single container)
      - SURREAL_URL=ws://localhost:8000/rpc
      - SURREAL_USER=root
      - SURREAL_PASSWORD=root
      - SURREAL_NAMESPACE=open_notebook
      - SURREAL_DATABASE=production
      # Optional: Add cloud AI providers
      # - OPENAI_API_KEY=sk-your-key-here
      # - ANTHROPIC_API_KEY=sk-ant-your-key-here
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
    # Uncomment for NVIDIA GPU support:
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

volumes:
  ollama_data:
EOF
```

## Step 5: Start All Services

```bash
docker compose up -d
```

This will:
- Start your locally built Open Notebook container
- Start the Ollama container
- Create persistent storage volumes

### Verify Services Are Running
```bash
# Check container status
docker compose ps

# Should show:
# open_notebook   running
# ollama          running
```

## Step 6: Download AI Models into Ollama Container

Now we'll install AI models directly into the Ollama container:

```bash
# Language model (choose one or more)
docker exec -it ollama ollama pull qwen3              # Recommended: 7B, excellent quality
docker exec -it ollama ollama pull gemma3             # Alternative: Google's model
docker exec -it ollama ollama pull deepseek-r1        # Advanced: Reasoning model

# Embedding model (REQUIRED for search functionality)
docker exec -it ollama ollama pull mxbai-embed-large
```

**Note**: Each model download will take a few minutes depending on your internet speed.

### Verify Models Are Installed
```bash
docker exec -it ollama ollama list
```

You should see the models you downloaded.

## Step 7: Access Open Notebook

Open your browser to: **http://localhost:8502**

You should see the Open Notebook interface!

## Step 8: Configure AI Models

1. Click the **Settings** icon (⚙️) in the sidebar
2. Navigate to **Models** tab
3. Configure your default models:
   - **Language Model**: Select `qwen3`
   - **Embedding Model**: Select `mxbai-embed-large`
4. Click **Save**

## Step 9: Create Your First Notebook

1. Click **"Create New Notebook"**
2. Give it a name (e.g., "My First Notebook")
3. Add a description
4. Click **"Create"**
5. Add your first source (PDF, web link, or text)
6. Start chatting with your content!

## Rebuilding After Code Changes

If you make changes to the source code and want to rebuild:

```bash
# Stop containers
docker compose down

# Rebuild the image
docker build -f Dockerfile.single -t open-notebook:local-build .

# Start containers again
docker compose up -d
```

## GPU Support (Optional)

If you have an NVIDIA GPU for faster AI inference:

### Install NVIDIA Container Toolkit (Ubuntu/Debian)
```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

### Enable GPU in docker-compose.yml
Uncomment the `deploy` section under the `ollama` service in your docker-compose.yml, then restart:
```bash
docker compose down
docker compose up -d
```

## Troubleshooting

### Build Failures

**If Docker build fails:**
```bash
# Clean up and try again
docker system prune -a
docker build -f Dockerfile.single -t open-notebook:local-build .
```

### Ollama Container Not Communicating with Open Notebook
```bash
# Test Ollama from Open Notebook container
docker exec -it open_notebook curl http://ollama:11434/api/tags

# Should return list of models
```

### Open Notebook Not Starting
```bash
# Check logs for errors
docker compose logs open_notebook

# Check if all containers are running
docker compose ps

# Restart services
docker compose restart
```

### Models Not Appearing in Open Notebook
```bash
# Verify models are in Ollama container
docker exec -it ollama ollama list

# If empty, pull models again
docker exec -it ollama ollama pull qwen3
docker exec -it ollama ollama pull mxbai-embed-large
```

### Port Already in Use
```bash
# Find what's using the port
lsof -i :8502
# or
netstat -tulpn | grep 8502

# Either kill the process or change ports in docker-compose.yml
```

### Container Running Out of Disk Space
```bash
# Check Docker disk usage
docker system df

# Clean up unused images and containers
docker system prune -a

# Check model sizes in Ollama container
docker exec -it ollama ollama list
```

## Service Management

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs (all containers)
docker compose logs -f

# View logs (specific container)
docker compose logs -f ollama
docker compose logs -f open_notebook

# Restart all services
docker compose restart

# Restart specific service
docker compose restart ollama

# Rebuild and restart after code changes
docker compose down
docker build -f Dockerfile.single -t open-notebook:local-build .
docker compose up -d

# Check container resource usage
docker stats
```

## Remote Server Setup

Installing on a remote server (NAS, Raspberry Pi, cloud server)?

Update your `docker-compose.yml` environment section for open_notebook:
```yaml
    environment:
      - API_URL=http://YOUR_SERVER_IP:5055
      - OLLAMA_API_BASE=http://ollama:11434
      # ... rest of environment variables
```

Replace `YOUR_SERVER_IP` with your server's IP address (e.g., 192.168.1.100).

Then access Open Notebook at: `http://YOUR_SERVER_IP:8502`

## Adding Cloud AI Providers

Want to use OpenAI, Anthropic, or other cloud providers alongside Ollama?

Add API keys to the `environment` section in docker-compose.yml:
```yaml
    environment:
      # ... existing environment variables
      - OPENAI_API_KEY=sk-your-openai-key-here
      - ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
      - GOOGLE_API_KEY=your-google-key-here
      - GROQ_API_KEY=gsk_your-groq-key-here
```

Then restart:
```bash
docker compose down
docker compose up -d
```

## Data Persistence

Your data is stored in Docker volumes and local directories:

```bash
# Local directories (backed up in your project folder)
./notebook_data/      # Your notebooks and content
./surreal_single_data/ # Database files

# Docker volumes
ollama_data           # AI models (managed by Docker)
```

### Backup Your Data
```bash
# Create backup
tar -czf backup-$(date +%Y%m%d).tar.gz notebook_data surreal_single_data

# Restore from backup
tar -xzf backup-20240101.tar.gz
```

## What's Running?

Your Open Notebook installation consists of containerized services built from source:

1. **open_notebook** (port 8502, 5055) - Built from this repository
   - Next.js web interface
   - FastAPI backend
   - SurrealDB database (embedded)

2. **ollama** (port 11434)
   - AI model server
   - Stores and runs local AI models

All services communicate over Docker's internal network.

## Development Workflow

For active development:

```bash
# 1. Make code changes in your editor

# 2. Rebuild the image
docker build -f Dockerfile.single -t open-notebook:local-build .

# 3. Restart containers
docker compose down
docker compose up -d

# 4. Check logs for errors
docker compose logs -f open_notebook

# 5. Test your changes at http://localhost:8502
```

## Performance Expectations

- **CPU-only (qwen3)**: 2-5 seconds per AI response
- **With NVIDIA GPU**: Sub-second responses
- **Storage**: SSD recommended for better performance
- **Memory**: 16GB RAM recommended for comfortable use
- **Concurrent users**: 1-5 (single-container setup)

## Security Considerations

For public deployments, add password protection by adding to environment:
```yaml
    environment:
      - OPEN_NOTEBOOK_PASSWORD=your_secure_password_here
```

## Next Steps

- ✅ Create your first notebook
- ✅ Add sources (PDFs, web pages, videos, audio files)
- ✅ Chat with your content using AI
- ✅ Generate AI notes and summaries
- ✅ Create multi-speaker podcasts from your research
- ✅ Use transformations to extract insights
- ✅ Make code changes and rebuild to test

## Learn More

- **[Complete Documentation](docs/index.md)** - Full feature guide
- **[Quick Start Guide](docs/getting-started/quick-start.md)** - 5-minute tutorial
- **[Docker Deployment Guide](docs/deployment/docker.md)** - Advanced Docker configurations
- **[Ollama Setup Guide](docs/features/ollama.md)** - Detailed Ollama configuration
- **[AI Models Guide](docs/features/ai-models.md)** - All supported AI providers

## Getting Help

- 💬 **[Discord Community](https://discord.gg/37XJPXfz2w)** - Get help and share ideas
- 🐛 **[GitHub Issues](https://github.com/lfnovo/open-notebook/issues)** - Report bugs and request features
- 📧 **[Email Support](mailto:luis@lfnovo.com)** - Direct support

---

**Congratulations!** You now have Open Notebook running from source code in Docker containers. Make changes to the code, rebuild, and test your modifications locally!
