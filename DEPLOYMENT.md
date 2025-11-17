# Deployment Guide - Open Notebook with Ollama

This guide covers deploying Open Notebook with Ollama models via Azure DevOps pipelines.

## Overview

The deployment ensures:
- ✅ Docker containers are deployed and healthy
- ✅ Ollama models persist across deployments
- ✅ Models are automatically downloaded if missing
- ✅ No downtime during updates (with proper health checks)

## Deployment Options

### Option 1: Azure DevOps Pipeline (Recommended)

Use the provided `azure-pipelines.yml` for automated deployments.

**Setup Steps:**

1. **Configure SSH Service Connection** in Azure DevOps:
   - Go to Project Settings > Service Connections
   - Create a new SSH connection to your deployment server
   - Name it (e.g., "ProductionServer")
   - Update `SSH_SERVICE_CONNECTION` variable in pipeline

2. **Set Variables** in Azure DevOps:
   - `DEPLOYMENT_PATH`: Path on server where app will be deployed (e.g., `/opt/open-notebook`)
   - `SSH_SERVICE_CONNECTION`: Name of your SSH service connection

3. **Prepare Deployment Server:**
   ```bash
   # Install Docker and Docker Compose
   sudo apt update
   sudo apt install -y docker.io docker-compose-plugin

   # Create deployment directory
   sudo mkdir -p /opt/open-notebook
   sudo chown $USER:$USER /opt/open-notebook

   # Create docker.env file with your configuration
   cd /opt/open-notebook
   cat > docker.env <<EOF
   OPENAI_API_KEY=your-key-here
   SURREAL_URL=ws://surrealdb:8000/rpc
   SURREAL_USER=root
   SURREAL_PASSWORD=root
   SURREAL_NAMESPACE=open_notebook
   SURREAL_DATABASE=production
   EOF
   ```

4. **Run the Pipeline:**
   - Push to `main` or `develop` branch
   - Pipeline will automatically deploy
   - Models will be downloaded on first deployment only

### Option 2: Manual Deployment with Persistent Volumes

For manual deployments on a server:

```bash
# 1. Clone repository
git clone https://github.com/your-org/open-notebook.git
cd open-notebook

# 2. Create docker.env file (see above)

# 3. Deploy with production overrides
docker compose -f docker-compose.full.yml -f docker-compose.prod.yml up -d

# 4. Wait for containers to be healthy
docker compose -f docker-compose.full.yml -f docker-compose.prod.yml ps

# 5. Download Ollama models (one-time)
./scripts/init-ollama-models.sh
```

### Option 3: Custom Ollama Image (Advanced)

Build a custom Ollama image with pre-downloaded models:

**Not recommended** - Models are large (2-5GB each) and will bloat your image.
Better to use persistent volumes.

## Data Persistence

### Production Volumes

The `docker-compose.prod.yml` uses **named volumes** that persist across deployments:

- `ollama_models`: Stores downloaded Ollama models (~5-10GB)
- `surreal_data`: Database storage
- `notebook_data`: User uploads and data

### Volume Locations

On Linux, Docker named volumes are stored in:
```
/var/lib/docker/volumes/
```

View volumes:
```bash
docker volume ls
docker volume inspect open-notebook_ollama_models
```

### Backup Strategy

**Backup important data:**
```bash
# Backup all volumes
docker run --rm -v open-notebook_ollama_models:/data -v $(pwd):/backup \
  ubuntu tar czf /backup/ollama_models_backup.tar.gz /data

docker run --rm -v open-notebook_surreal_data:/data -v $(pwd):/backup \
  ubuntu tar czf /backup/surreal_data_backup.tar.gz /data

docker run --rm -v open-notebook_notebook_data:/data -v $(pwd):/backup \
  ubuntu tar czf /backup/notebook_data_backup.tar.gz /data
```

**Restore from backup:**
```bash
# Restore Ollama models volume
docker run --rm -v open-notebook_ollama_models:/data -v $(pwd):/backup \
  ubuntu tar xzf /backup/ollama_models_backup.tar.gz -C /
```

## Ollama Models

### Required Models

- **nomic-embed-text** (~274MB) - Embedding model for search
- **qwen2.5:3b** (~2GB) - Language model for chat

### Adding More Models

To add additional models, update `scripts/init-ollama-models.sh`:

```bash
REQUIRED_MODELS=(
    "nomic-embed-text"
    "qwen2.5:3b"
    "llama3.2:3b"        # Add new models here
    "deepseek-r1:latest"  # Add new models here
)
```

Or manually download after deployment:
```bash
docker compose exec ollama ollama pull <model-name>
```

### Model Storage

Models are stored in `/root/.ollama` inside the Ollama container, which is mapped to:
- **Development**: `./ollama_data` directory
- **Production**: `ollama_models` named volume

Once downloaded, models persist across:
- Container restarts
- Container rebuilds
- Application deployments

## Health Checks

The production compose file includes health checks for all services:

- **SurrealDB**: Checks `/health` endpoint
- **Ollama**: Checks `/api/tags` endpoint
- **Open Notebook**: Checks `/health` endpoint

Deployment waits for all services to be healthy before proceeding.

## Deployment Verification

After deployment, verify everything works:

```bash
# Check all services are running
docker compose -f docker-compose.full.yml -f docker-compose.prod.yml ps

# Test Ollama
curl http://localhost:11434/api/tags

# Test Open Notebook
curl http://localhost:5055/health

# List Ollama models
docker compose exec ollama ollama list
```

## Troubleshooting

### Models Not Found After Deployment

If models are missing after deployment:

```bash
# Check if Ollama is running
docker compose ps ollama

# Check Ollama logs
docker compose logs ollama

# Manually pull models
docker compose exec ollama ollama pull nomic-embed-text
docker compose exec ollama ollama pull qwen2.5:3b

# Verify models exist
docker compose exec ollama ollama list
```

### Volume Permissions Issues

If you have permission issues with volumes:

```bash
# Check volume permissions
docker volume inspect open-notebook_ollama_models

# Fix permissions (run as root if needed)
sudo chown -R 1000:1000 /var/lib/docker/volumes/open-notebook_ollama_models
```

### Pipeline Failures

Common issues:

1. **SSH connection fails**: Verify SSH service connection is configured correctly
2. **Timeout waiting for health**: Increase timeout in pipeline or check service logs
3. **Model download timeout**: Models can be large (2-5GB), ensure adequate network bandwidth

## Performance Tuning

### For Production Servers

Add resource limits to `docker-compose.prod.yml`:

```yaml
services:
  ollama:
    deploy:
      resources:
        limits:
          memory: 8G
          cpus: '4.0'
        reservations:
          memory: 4G
          cpus: '2.0'
```

### For Azure VM

Recommended VM sizes:
- **Minimum**: Standard_D2s_v3 (2 vCPU, 8GB RAM)
- **Recommended**: Standard_D4s_v3 (4 vCPU, 16GB RAM)
- **With GPU** (for larger models): NC6s_v3 (6 vCPU, 112GB RAM, 1 GPU)

## Security Considerations

1. **Set OPEN_NOTEBOOK_PASSWORD** in docker.env for production
2. **Use firewall rules** to restrict access to ports 8502 and 5055
3. **Enable HTTPS** via reverse proxy (nginx, Traefik, etc.)
4. **Rotate API keys** regularly
5. **Keep Docker and images updated**

## Next Steps

1. Configure monitoring (Prometheus, Grafana)
2. Set up automated backups
3. Configure log aggregation (ELK, Azure Monitor)
4. Set up SSL/TLS certificates
5. Configure auto-scaling (if using Azure Container Instances or Kubernetes)
