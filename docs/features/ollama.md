# Ollama Setup Guide

Ollama provides free, local AI models that run on your own hardware. This guide covers everything you need to know about setting up Ollama with Open Notebook, with a focus on containerized deployment using Docker.

## Why Choose Ollama?

- **🆓 Completely Free**: No API costs after initial setup
- **🔒 Full Privacy**: Your data never leaves your local network
- **📱 Offline Capable**: Works without internet connection
- **🚀 Fast**: Local inference with no network latency
- **🧠 Reasoning Models**: Support for advanced reasoning models like DeepSeek-R1
- **💾 Model Variety**: Access to hundreds of open-source models

## Quick Start (Docker - Recommended)

The easiest way to run Ollama with Open Notebook is using Docker Compose, where both services run in containers.

### 1. Create Docker Compose Configuration

Create or update your `docker-compose.yml`:

```yaml
services:
  open_notebook:
    image: lfnovo/open_notebook:v1-latest-single
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
```

### 2. Add to your `docker.env`

```env
OLLAMA_API_BASE=http://ollama:11434
```

### 3. Start the Containers

```bash
docker compose up -d
```

### 4. Download Models into Ollama Container

```bash
# Language models (choose one or more)
docker exec -it ollama ollama pull qwen3              # Excellent general purpose, 7B
docker exec -it ollama ollama pull gemma3            # Google's model
docker exec -it ollama ollama pull deepseek-r1       # Advanced reasoning
docker exec -it ollama ollama pull phi4              # Microsoft's efficient model

# Embedding model (REQUIRED for search functionality)
docker exec -it ollama ollama pull mxbai-embed-large
```

### 5. Configure Models in Open Notebook

1. Open Open Notebook at `http://localhost:8502`
2. Go to Settings → Models
3. Configure:
   - **Language Model**: `qwen3`
   - **Embedding Model**: `mxbai-embed-large`
4. Click Save

That's it! You now have a fully containerized, privacy-focused AI setup.

## Network Configuration Guide

The `OLLAMA_API_BASE` environment variable tells Open Notebook where to find your Ollama server. The correct value depends on your deployment scenario:

### Scenario 1: Both in Docker (Recommended)

**When both Open Notebook and Ollama run in the same Docker Compose stack:**

```bash
export OLLAMA_API_BASE=http://ollama:11434
```

This is the recommended approach because:
- ✅ Simple networking - services communicate by service name
- ✅ Easy to manage - single `docker compose` command
- ✅ Portable - works the same on all platforms
- ✅ Isolated - all dependencies containerized
- ✅ GPU support available (for NVIDIA)

See the Quick Start section above for the complete docker-compose.yml example.

### Scenario 2: Remote Ollama Container

**When Ollama runs in Docker on a different machine in your network:**

```bash
export OLLAMA_API_BASE=http://192.168.1.100:11434
# Replace 192.168.1.100 with your Ollama server's IP address
```

Example on the remote machine:
```bash
# On the remote machine (192.168.1.100)
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker exec -it ollama ollama pull qwen3
```

**Security Note:** Only use this in trusted networks. Ollama doesn't have built-in authentication.

### Alternative: Local Installation (Advanced Users)

If you prefer not to use Docker, you can install Ollama directly on your host machine:

#### Scenario 3: Both Running Locally (No Docker)

When both Open Notebook and Ollama run directly on your machine:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh  # Linux/macOS
# or download from ollama.ai for Windows

# Pull models
ollama pull qwen3
ollama pull mxbai-embed-large

# Configure Open Notebook
export OLLAMA_API_BASE=http://localhost:11434
```

#### Scenario 4: Open Notebook in Docker, Ollama on Host

When Open Notebook runs in Docker but Ollama runs on your host machine:

```bash
export OLLAMA_API_BASE=http://host.docker.internal:11434
```

**⚠️ CRITICAL: Ollama must accept external connections:**
```bash
# Start Ollama with external access enabled
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

**Why `host.docker.internal`?**
- Docker containers can't reach `localhost` on the host
- `host.docker.internal` is Docker's special hostname for the host machine
- Available on Docker Desktop for Mac/Windows and recent Linux versions

**Why `OLLAMA_HOST=0.0.0.0:11434`?**
- By default, Ollama only binds to localhost and rejects external connections
- Docker containers are considered "external" even when running on the same machine
- Setting `OLLAMA_HOST=0.0.0.0:11434` allows connections from Docker containers

### Scenario 5: Custom Port

If you've configured Ollama to use a different port:

```bash
# Start Ollama on custom port
OLLAMA_HOST=0.0.0.0:8080 ollama serve

# Configure Open Notebook
export OLLAMA_API_BASE=http://localhost:8080
```

## Model Recommendations

### Language Models

| Model | Size | Best For | Quality | Speed |
|-------|------|----------|---------|-------|
| **qwen3** | 7B | General purpose, coding | Excellent | Fast |
| **deepseek-r1** | 7B | Reasoning, problem-solving | Exceptional | Medium |
| **gemma3** | 7B | Balanced performance | Very Good | Fast |
| **phi4** | 14B | Efficiency on small hardware | Good | Very Fast |
| **llama3** | 8B | General purpose | Very Good | Medium |

### Embedding Models

| Model | Best For | Performance |
|-------|----------|-------------|
| **mxbai-embed-large** | General search | Excellent |
| **nomic-embed-text** | Document similarity | Good |
| **all-minilm** | Lightweight option | Fair |

### Installation Commands

```bash
# Essential models
ollama pull qwen3                 # Primary language model
ollama pull mxbai-embed-large     # Search embeddings

# Optional reasoning model
ollama pull deepseek-r1           # Advanced reasoning

# Alternative language models
ollama pull gemma3                # Google's model
ollama pull phi4                  # Microsoft's efficient model
```

## Hardware Requirements

### Minimum Requirements
- **RAM**: 8GB (for 7B models)
- **Storage**: 10GB free space per model
- **CPU**: Modern multi-core processor

### Recommended Setup
- **RAM**: 16GB+ (for multiple models)
- **Storage**: SSD with 50GB+ free space
- **GPU**: NVIDIA GPU with 8GB+ VRAM (optional but faster)

### GPU Acceleration

**NVIDIA GPU (CUDA):**
```bash
# Install NVIDIA Container Toolkit for Docker
# Then use the Docker Compose example above with GPU support

# For local installation, Ollama auto-detects CUDA
ollama pull qwen3
```

**Apple Silicon (M1/M2/M3):**
```bash
# Ollama automatically uses Metal acceleration
# No additional setup required
ollama pull qwen3
```

**AMD GPUs:**
```bash
# ROCm support varies by model and system
# Check Ollama documentation for latest compatibility
```

## Troubleshooting

### Common Issues

**1. "Ollama unavailable" in Open Notebook**

**For Docker setups (Recommended):**

```bash
# Check both containers are running
docker compose ps

# Should show both open_notebook and ollama as "Up"

# Test Ollama from Open Notebook container
docker exec -it open_notebook curl http://ollama:11434/api/tags

# If that fails, check Ollama directly
docker exec -it ollama ollama list
```

**If containers aren't communicating:**
```bash
# Ensure OLLAMA_API_BASE is set correctly in docker.env
cat docker.env | grep OLLAMA

# Should show: OLLAMA_API_BASE=http://ollama:11434

# Restart containers
docker compose restart
```

**For local installations:**

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# If Open Notebook is in Docker but Ollama is on host:
# Ollama must bind to all interfaces
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

**2. Models not available after download**

```bash
# List models in Ollama container
docker exec -it ollama ollama list

# If empty, pull models again
docker exec -it ollama ollama pull qwen3
docker exec -it ollama ollama pull mxbai-embed-large
```

**3. Models not downloading**

**For Docker:**
```bash
# Check disk space in container
docker exec -it ollama df -h

# Check container logs
docker logs ollama

# Manual model pull with verbose output
docker exec -it ollama ollama pull qwen3 --verbose

# Clear failed downloads
docker exec -it ollama ollama rm qwen3
docker exec -it ollama ollama pull qwen3
```

**For local installation:**
```bash
# Check disk space
df -h

# Manual model pull
ollama pull qwen3 --verbose
```

**4. Slow performance**

**Check model size vs available RAM:**
```bash
ollama ps  # Show running models
free -h    # Check available memory
```

**Use smaller models:**
```bash
ollama pull phi4         # Instead of larger models
ollama pull gemma3:2b   # 2B parameter variant
```

**5. Port conflicts**

**Check what's using port 11434:**
```bash
lsof -i :11434
netstat -tulpn | grep 11434
```

**Use custom port:**
```bash
OLLAMA_HOST=0.0.0.0:8080 ollama serve
export OLLAMA_API_BASE=http://localhost:8080
```

### Docker-Specific Troubleshooting

**1. Host networking on Linux:**
```bash
# Use host networking if host.docker.internal doesn't work
docker run --network host lfnovo/open_notebook:v1-latest-single
export OLLAMA_API_BASE=http://localhost:11434
```

**2. Custom bridge network:**
```yaml
version: '3.8'
networks:
  ollama_network:
    driver: bridge

services:
  open-notebook:
    networks:
      - ollama_network
    environment:
      - OLLAMA_API_BASE=http://ollama:11434

  ollama:
    networks:
      - ollama_network
```

**3. Firewall issues:**
```bash
# Allow Ollama port through firewall
sudo ufw allow 11434
# or
sudo firewall-cmd --add-port=11434/tcp --permanent
```

## Performance Optimization

### Model Management

**List installed models:**
```bash
ollama list
```

**Remove unused models:**
```bash
ollama rm model_name
```

**Show running models:**
```bash
ollama ps
```

**Preload models for faster startup:**
```bash
# Keep model in memory
curl http://localhost:11434/api/generate -d '{
  "model": "qwen3",
  "prompt": "test",
  "keep_alive": -1
}'
```

### System Optimization

**Linux: Increase file limits:**
```bash
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf
```

**macOS: Increase memory limits:**
```bash
# Add to ~/.zshrc or ~/.bash_profile
export OLLAMA_MAX_LOADED_MODELS=2
export OLLAMA_NUM_PARALLEL=4
```

**Docker: Resource allocation:**
```yaml
services:
  ollama:
    deploy:
      resources:
        limits:
          memory: 8G
          cpus: '4'
```

## Advanced Configuration

### Environment Variables

```bash
# Ollama server configuration
export OLLAMA_HOST=0.0.0.0:11434      # Bind to all interfaces
export OLLAMA_KEEP_ALIVE=5m            # Keep models in memory
export OLLAMA_MAX_LOADED_MODELS=3      # Max concurrent models
export OLLAMA_MAX_QUEUE=512            # Request queue size
export OLLAMA_NUM_PARALLEL=4           # Parallel request handling
export OLLAMA_FLASH_ATTENTION=1        # Enable flash attention (if supported)

# Open Notebook configuration
export OLLAMA_API_BASE=http://localhost:11434
```

### Custom Model Imports

**Import custom models:**
```bash
# Create Modelfile
cat > Modelfile << EOF
FROM qwen3
PARAMETER temperature 0.7
PARAMETER top_p 0.9
SYSTEM "You are a helpful research assistant."
EOF

# Create custom model
ollama create my-research-model -f Modelfile
```

**Use in Open Notebook:**
1. Go to Models
2. Add new model: `my-research-model`
3. Set as default for specific tasks

### Monitoring and Logging

**Monitor Ollama logs:**
```bash
# Linux (systemd)
journalctl -u ollama -f

# Docker
docker logs -f ollama

# Manual run with verbose logging
OLLAMA_DEBUG=1 ollama serve
```

**Resource monitoring:**
```bash
# CPU and memory usage
htop

# GPU usage (NVIDIA)
nvidia-smi -l 1

# Model-specific metrics
ollama ps
```

## Integration Examples

### Python Script Integration

```python
import requests
import os

# Test Ollama connection
ollama_base = os.environ.get('OLLAMA_API_BASE', 'http://localhost:11434')
response = requests.get(f'{ollama_base}/api/tags')
print(f"Available models: {response.json()}")

# Generate text
payload = {
    "model": "qwen3",
    "prompt": "Explain quantum computing",
    "stream": False
}
response = requests.post(f'{ollama_base}/api/generate', json=payload)
print(response.json()['response'])
```

### Health Check Script

```bash
#!/bin/bash
# ollama-health-check.sh

OLLAMA_API_BASE=${OLLAMA_API_BASE:-"http://localhost:11434"}

echo "Checking Ollama health..."
if curl -s "${OLLAMA_API_BASE}/api/tags" > /dev/null; then
    echo "✅ Ollama is running"
    echo "Available models:"
    curl -s "${OLLAMA_API_BASE}/api/tags" | jq -r '.models[].name'
else
    echo "❌ Ollama is not accessible at ${OLLAMA_API_BASE}"
    exit 1
fi
```

## Migration from Other Providers

### Coming from OpenAI

**Similar performance models:**
- GPT-4 → `qwen3` or `deepseek-r1`
- GPT-3.5 → `gemma3` or `phi4`
- text-embedding-ada-002 → `mxbai-embed-large`

**Cost comparison:**
- OpenAI: $0.01-0.06 per 1K tokens
- Ollama: $0 after hardware investment

### Coming from Anthropic

**Claude replacement suggestions:**
- Claude 3.5 Sonnet → `deepseek-r1` (reasoning)
- Claude 3 Haiku → `phi4` (speed)

## Best Practices

### Security

1. **Network Security:**
   - Run Ollama only on trusted networks
   - Use firewall rules to limit access
   - Consider VPN for remote access

2. **Model Verification:**
   - Only pull models from trusted sources
   - Verify model checksums when possible

3. **Resource Limits:**
   - Set memory and CPU limits in production
   - Monitor resource usage regularly

### Performance

1. **Model Selection:**
   - Use appropriate model size for your hardware
   - Smaller models for simple tasks
   - Reasoning models only when needed

2. **Resource Management:**
   - Preload frequently used models
   - Remove unused models regularly
   - Monitor system resources

3. **Network Optimization:**
   - Use local networks for better latency
   - Consider SSD storage for faster model loading

## Getting Help

**Community Resources:**
- [Ollama GitHub](https://github.com/jmorganca/ollama) - Official repository
- [Ollama Discord](https://discord.gg/ollama) - Community support
- [Open Notebook Discord](https://discord.gg/37XJPXfz2w) - Integration help

**Debugging Resources:**
- Check Ollama logs for error messages
- Test connection with curl commands
- Verify environment variables
- Monitor system resources

This comprehensive guide should help you successfully deploy and optimize Ollama with Open Notebook. Start with the Quick Start section and refer to specific scenarios as needed.