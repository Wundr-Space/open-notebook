#!/bin/bash
# init-ollama-models.sh
# Ensures required Ollama models are downloaded on container startup

set -e

echo "Checking Ollama models..."

# Wait for Ollama to be ready
max_attempts=30
attempt=0
while ! curl -sf http://ollama:11434/api/tags > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "ERROR: Ollama did not become ready in time"
        exit 1
    fi
    echo "Waiting for Ollama to start... (attempt $attempt/$max_attempts)"
    sleep 2
done

echo "Ollama is ready!"

# List of required models
REQUIRED_MODELS=(
    "nomic-embed-text"
    "qwen2.5:3b"
)

# Check and pull each model
for model in "${REQUIRED_MODELS[@]}"; do
    echo "Checking for model: $model"
    if docker compose exec -T ollama ollama list | grep -q "$model"; then
        echo "✓ Model $model already exists"
    else
        echo "⬇ Downloading model: $model"
        docker compose exec -T ollama ollama pull "$model"
        echo "✓ Model $model downloaded successfully"
    fi
done

echo "All Ollama models are ready!"
