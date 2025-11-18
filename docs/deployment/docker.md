# Docker Deployment Guide

**The complete Docker setup guide for Open Notebook - from beginner to advanced configurations.**

This guide covers everything you need to deploy Open Notebook using Docker, from a simple single-provider setup to advanced multi-provider configurations with local models.

## 📋 What You'll Get

Open Notebook is a powerful AI-powered research and note-taking tool that:
- Modern Next.js/React interface for a smooth user experience
- Helps you organize research across multiple notebooks
- Lets you chat with your documents using AI
- Supports 16+ AI providers (OpenAI, Anthropic, Google, Ollama, and more)
- Creates AI-generated podcasts from your content
- Works with PDFs, web links, videos, audio files, and more

## 📦 Docker Image Registries

Open Notebook images are available from two registries:

- **GitHub Container Registry (GHCR)**: `ghcr.io/lfnovo/open-notebook` - Hosted on GitHub, no Docker Hub account needed
- **Docker Hub**: `lfnovo/open_notebook` - Traditional Docker registry

Both registries contain identical images. Choose based on your preference:
- Use **GHCR** if you prefer GitHub-native workflows or Docker Hub is blocked
- Use **Docker Hub** if you're already using it or prefer the traditional registry

All examples in this guide use Docker Hub (`lfnovo/open_notebook`), but you can replace it with `ghcr.io/lfnovo/open-notebook` anywhere.

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Docker

#### Windows
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted
4. Launch Docker Desktop

#### macOS
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Choose Intel or Apple Silicon based on your Mac
3. Drag Docker to Applications folder
4. Open Docker from Applications

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```
Log out and log back in after installation.

### Step 2: Get Your OpenAI API Key

OpenAI provides everything you need to get started:
- **Text generation** for chat and notes
- **Embeddings** for search functionality  
- **Text-to-speech** for podcast generation
- **Speech-to-text** for audio transcription

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to **API Keys** in the sidebar
4. Click **"Create new secret key"**
5. Name your key (e.g., "Open Notebook")
6. Copy the key (starts with "sk-")
7. **Save it safely** - you won't see it again!

**Important**: Add at least $5 in credits to your OpenAI account before using the API.

### Step 3: Deploy Open Notebook

1. **Create a project directory**:
   ```bash
   mkdir open-notebook
   cd open-notebook
   ```

2. **Create `docker-compose.yml`**:
   ```yaml
   services:
     open_notebook:
       image: lfnovo/open_notebook:v1-latest-single
       ports:
         - "8502:8502"  # Frontend
         - "5055:5055"  # API
       environment:
         - OPENAI_API_KEY=your_openai_key_here
       volumes:
         - ./notebook_data:/app/data
         - ./surreal_data:/mydata
       restart: always
   ```

3. **Create `docker.env` file** (optional but recommended):
   ```env
   # Required: Your OpenAI API key
   OPENAI_API_KEY=sk-your-actual-key-here
   
   # Optional: Security for public deployments
   OPEN_NOTEBOOK_PASSWORD=your_secure_password
   
   # Database settings (auto-configured)
   SURREAL_URL=ws://localhost:8000/rpc
   SURREAL_USER=root
   SURREAL_PASSWORD=root
   SURREAL_NAMESPACE=open_notebook
   SURREAL_DATABASE=production
   ```

4. **Start Open Notebook**:
   ```bash
   docker compose up -d
   ```

5. **Access the application**:
   - **Next.js UI**: http://localhost:8502 - Modern, responsive interface
   - **API Documentation**: http://localhost:5055/docs - Full REST API access
   - You should see the Open Notebook interface!

**Alternative: Using GHCR**
To use GitHub Container Registry instead, simply replace the image name:
```yaml
services:
  open_notebook:
    image: ghcr.io/lfnovo/open-notebook:v1-latest-single
    # ... rest of configuration stays the same
```

### Step 4: Configure Your Models

Before creating your first notebook, configure your AI models:

1. Click **"⚙️ Settings"** in the sidebar
2. Click **"🤖 Models"** tab
3. Configure these recommended models:
   - **Language Model**: `gpt-5-mini` (cost-effective)
   - **Embedding Model**: `text-embedding-3-small` (required for search)
   - **Text-to-Speech**: `gpt-4o-mini-tts` (for podcast generation)
   - **Speech-to-Text**: `whisper-1` (for audio transcription)
4. Click **"Save"** after configuring all models

### Step 5: Create Your First Notebook

1. Click **"Create New Notebook"**
2. Give it a name (e.g., "My Research")
3. Add a description
4. Click **"Create"**
5. Add your first source (web link, PDF, or text)
6. Start chatting with your content!

## 🔧 Advanced Configuration

### Multi-Container Setup

For production deployments or development, use the multi-container setup:

```yaml
services:
  surrealdb:
    image: surrealdb/surrealdb:v1-latest
    ports:
      - "8000:8000"
    command: start --log trace --user root --pass root memory
    restart: always

  open_notebook:
    image: lfnovo/open_notebook:v1-latest
    # Or use: ghcr.io/lfnovo/open-notebook:v1-latest
    ports:
      - "8502:8502"  # Next.js Frontend
      - "5055:5055"  # REST API
    env_file:
      - ./docker.env
    volumes:
      - ./notebook_data:/app/data
    depends_on:
      - surrealdb
    restart: always
```

### Environment Configuration

Create a comprehensive `docker.env` file:

```env
# Required: Database connection
SURREAL_URL=ws://surrealdb:8000/rpc
SURREAL_USER=root
SURREAL_PASSWORD=root
SURREAL_NAMESPACE=open_notebook
SURREAL_DATABASE=production

# Required: At least one AI provider
OPENAI_API_KEY=sk-your-openai-key

# Optional: Additional AI providers
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_API_KEY=your-google-key
GROQ_API_KEY=gsk_your-groq-key

# Optional: Security
OPEN_NOTEBOOK_PASSWORD=your_secure_password

# Optional: Advanced features
ELEVENLABS_API_KEY=your-elevenlabs-key
```

## 🌟 Advanced Provider Setup

### OpenRouter (100+ Models)

OpenRouter gives you access to virtually every AI model through a single API:

1. **Get your API key** at [openrouter.ai](https://openrouter.ai/keys)
2. **Add to your `docker.env`**:
   ```env
   OPENROUTER_API_KEY=sk-or-your-openrouter-key
   ```
3. **Restart the container**:
   ```bash
   docker compose restart
   ```
4. **Configure models** in Models

**Recommended OpenRouter models**:
- `anthropic/claude-3-haiku` - Fast and cost-effective
- `google/gemini-pro` - Good reasoning capabilities
- `meta-llama/llama-3-8b-instruct` - Open source option

### Ollama (Local Models in Docker)

Run AI models locally in a Docker container for complete privacy and easy deployment:

1. **Add Ollama service to your `docker-compose.yml`**:
   ```yaml
   services:
     open_notebook:
       image: lfnovo/open_notebook:v1-latest-single
       # Or use: ghcr.io/lfnovo/open-notebook:v1-latest-single
       ports:
         - "8502:8502"
         - "5055:5055"
       environment:
         - OLLAMA_API_BASE=http://ollama:11434
       env_file:
         - ./docker.env
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
       # Optional: GPU support for NVIDIA cards
       # deploy:
       #   resources:
       #     reservations:
       #       devices:
       #         - driver: nvidia
       #           count: 1
       #           capabilities: [gpu]

   volumes:
     ollama_data:
   ```

2. **Add to your `docker.env`**:
   ```env
   OLLAMA_API_BASE=http://ollama:11434
   ```

3. **Start both containers**:
   ```bash
   docker compose up -d
   ```

4. **Download models into the Ollama container**:
   ```bash
   # Access the Ollama container
   docker exec -it ollama ollama pull qwen3              # Excellent general purpose
   docker exec -it ollama ollama pull mxbai-embed-large  # Required for search
   docker exec -it ollama ollama pull deepseek-r1        # Advanced reasoning
   ```

5. **Configure models** in Open Notebook Settings → Models
   - Language Model: `qwen3`
   - Embedding Model: `mxbai-embed-large`

**GPU Support (NVIDIA):**
If you have an NVIDIA GPU, uncomment the `deploy` section in the docker-compose.yml above and install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html):

```bash
# Ubuntu/Debian
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker
```

### Other Providers

**Anthropic (Direct)**:
```env
ANTHROPIC_API_KEY=sk-ant-your-key
```

**Google Gemini**:
```env
GOOGLE_API_KEY=AIzaSy-your-key
```

**Groq (Fast Inference)**:
```env
GROQ_API_KEY=gsk_your-key
```

## 🔒 Security & Production

### Password Protection

For public deployments, always set a password:

```env
OPEN_NOTEBOOK_PASSWORD=your_secure_password
```

This protects both the web interface and API endpoints.

### Production Best Practices

1. **Use HTTPS**: Deploy behind a reverse proxy with SSL
2. **Regular Updates**: Keep containers updated
3. **Monitor Resources**: Set up resource limits
4. **Backup Data**: Regular backups of volumes
5. **Network Security**: Configure firewall rules

### Example Production Setup

```yaml
services:
  surrealdb:
    image: surrealdb/surrealdb:v1-latest
    ports:
      - "127.0.0.1:8000:8000"  # Bind to localhost only
    command: start --log warn --user root --pass root file:///mydata/database.db
    volumes:
      - ./surreal_data:/mydata
    restart: always
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: "0.5"

  open_notebook:
    image: lfnovo/open_notebook:v1-latest
    ports:
      - "127.0.0.1:8502:8502"
      - "127.0.0.1:5055:5055"
    env_file:
      - ./docker.env
    volumes:
      - ./notebook_data:/app/data
    depends_on:
      - surrealdb
    restart: always
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "1.0"
```

## 🛠️ Management & Maintenance

### Container Management

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Restart specific service
docker compose restart open_notebook

# Update to latest version
docker compose pull
docker compose up -d
```

### Data Management

```bash
# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz notebook_data surreal_data

# Restore data
tar -xzf backup-20240101.tar.gz

# Clean up old containers
docker system prune -a
```

### Monitoring

```bash
# Check resource usage
docker stats

# Check service health
docker compose ps

# View detailed logs
docker compose logs --tail=100 -f open_notebook
```

## 📊 Performance Optimization

### Resource Allocation

**Minimum requirements**:
- 2GB RAM
- 2 CPU cores
- 10GB storage

**Recommended for production**:
- 4GB+ RAM
- 4+ CPU cores
- 50GB+ storage

### Model Selection Tips

**For cost optimization**:
- Use OpenRouter for expensive models
- Use Ollama for simple tasks
- Monitor usage at provider dashboards

**For performance**:
- Use Groq for fast inference
- Use local models for privacy
- Use OpenAI for reliability

## 🔍 Troubleshooting

### Common Issues

**Port conflicts**:
```bash
# Check what's using port 8502
lsof -i :8502

# Use different port
docker compose -p 8503:8502 up -d
```

**API key errors**:
1. Verify keys are set correctly in `docker.env`
2. Check you have credits with your AI provider
3. Ensure no extra spaces in the key

**Database connection issues**:
1. Check SurrealDB container is running
2. Verify database files are writable
3. Try restarting containers

**Out of memory errors**:
1. Increase Docker memory allocation
2. Use smaller models
3. Monitor resource usage

### Getting Help

1. **Check logs**: `docker compose logs -f`
2. **Verify environment**: `docker compose config`
3. **Test connectivity**: `docker compose exec open_notebook ping surrealdb`
4. **Join Discord**: [discord.gg/37XJPXfz2w](https://discord.gg/37XJPXfz2w)
5. **GitHub Issues**: [github.com/lfnovo/open-notebook/issues](https://github.com/lfnovo/open-notebook/issues)

## 🎯 Next Steps

After successful deployment:

1. **Create your first notebook** - Start with a simple research project
2. **Explore features** - Try podcasts, transformations, and search
3. **Optimize models** - Experiment with different providers
4. **Join the community** - Share your experience and get help

## 📚 Complete Configuration Reference

### All Environment Variables

```env
# Database Configuration
SURREAL_URL=ws://surrealdb:8000/rpc
SURREAL_USER=root
SURREAL_PASSWORD=root
SURREAL_NAMESPACE=open_notebook
SURREAL_DATABASE=production

# Required: At least one AI provider
OPENAI_API_KEY=sk-your-openai-key

# Optional: Additional AI providers
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_API_KEY=your-google-key
GROQ_API_KEY=gsk_your-groq-key
OPENROUTER_API_KEY=sk-or-your-openrouter-key
OLLAMA_API_BASE=http://192.168.1.100:11434

# Optional: Advanced TTS
ELEVENLABS_API_KEY=your-elevenlabs-key

# Optional: Security
OPEN_NOTEBOOK_PASSWORD=your_secure_password

# Optional: Advanced settings
LOG_LEVEL=INFO
MAX_UPLOAD_SIZE=100MB
ENABLE_ANALYTICS=false
```

### Complete Docker Compose

```yaml
version: '3.8'
services:
  surrealdb:
    image: surrealdb/surrealdb:v1-latest
    ports:
      - "8000:8000"
    command: start --log warn --user root --pass root file:///mydata/database.db
    volumes:
      - ./surreal_data:/mydata
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  open_notebook:
    image: lfnovo/open_notebook:v1-latest
    ports:
      - "8502:8502"  # Next.js Frontend
      - "5055:5055"  # REST API
    env_file:
      - ./docker.env
    volumes:
      - ./notebook_data:/app/data
    depends_on:
      surrealdb:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5055/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

**Ready to get started?** Follow the Quick Start section above and you'll be up and running in 5 minutes!