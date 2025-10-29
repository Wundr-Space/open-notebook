#!/bin/bash

#####################################################################
# Deploy Open Notebook to Google Cloud Run
#
# This script builds and deploys Open Notebook to Cloud Run
#
# Usage:
#   ./deploy-to-cloudrun.sh [ENVIRONMENT]
#
# Examples:
#   ./deploy-to-cloudrun.sh dev
#   ./deploy-to-cloudrun.sh staging
#   ./deploy-to-cloudrun.sh prod
#
#####################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions for colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Get environment (default to dev)
ENVIRONMENT="${1:-dev}"
REGION="europe-west2"

# Set project ID and service name based on environment
case "$ENVIRONMENT" in
    dev)
        PROJECT_ID="communi-team-dev"
        SERVICE_NAME="open-notebook-dev"
        MEMORY="2Gi"
        CPU="1"
        MIN_INSTANCES="0"
        MAX_INSTANCES="5"
        ;;
    staging)
        PROJECT_ID="communi-team-staging"
        SERVICE_NAME="open-notebook-staging"
        MEMORY="2Gi"
        CPU="1"
        MIN_INSTANCES="0"
        MAX_INSTANCES="10"
        ;;
    prod)
        PROJECT_ID="communi-team-prod"
        SERVICE_NAME="open-notebook"
        MEMORY="4Gi"
        CPU="2"
        MIN_INSTANCES="1"
        MAX_INSTANCES="20"
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT"
        echo "Valid options: dev, staging, prod"
        exit 1
        ;;
esac

IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/open-notebook/${SERVICE_NAME}"

print_header "🚀 Deploying Open Notebook to Cloud Run"

print_info "Environment: ${ENVIRONMENT}"
print_info "Project: ${PROJECT_ID}"
print_info "Service: ${SERVICE_NAME}"
print_info "Region: ${REGION}"
echo ""

# Confirm
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Deployment cancelled"
    exit 0
fi

# Check if logged in
print_header "Step 1: Checking Authentication"
CURRENT_ACCOUNT=$(gcloud config get-value account 2>/dev/null)
if [ -z "$CURRENT_ACCOUNT" ]; then
    print_error "Not authenticated to Google Cloud"
    print_info "Run: gcloud auth login"
    exit 1
fi
print_success "Authenticated as: ${CURRENT_ACCOUNT}"

# Set project
print_header "Step 2: Setting Project"
gcloud config set project "${PROJECT_ID}" --quiet
print_success "Project set to: ${PROJECT_ID}"

# Check if buildx builder exists, create if not
print_header "Step 3: Setting Up Docker Builder"
if ! docker buildx inspect cloudrun-builder &>/dev/null; then
    print_info "Creating multi-platform builder..."
    docker buildx create --name cloudrun-builder --use
    print_success "Builder created"
else
    print_info "Using existing builder"
    docker buildx use cloudrun-builder
fi

# Configure Docker for Artifact Registry
print_header "Step 4: Configuring Docker Authentication"
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
print_success "Docker configured for Artifact Registry"

# Build and push image
print_header "Step 5: Building Docker Image"
print_info "Building for linux/amd64 platform..."
print_warning "This may take 5-10 minutes..."

docker buildx build \
    --platform linux/amd64 \
    -t ${IMAGE_URL}:latest \
    -f Dockerfile.single \
    --push \
    .

print_success "Image built and pushed to: ${IMAGE_URL}:latest"

# Deploy to Cloud Run
print_header "Step 6: Deploying to Cloud Run"
print_info "Deploying service: ${SERVICE_NAME}"
print_info "Resources: ${MEMORY} RAM, ${CPU} CPU"
print_info "Scaling: ${MIN_INSTANCES}-${MAX_INSTANCES} instances"

gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_URL}:latest \
    --region=${REGION} \
    --platform=managed \
    --port=8502 \
    --memory=${MEMORY} \
    --cpu=${CPU} \
    --min-instances=${MIN_INSTANCES} \
    --max-instances=${MAX_INSTANCES} \
    --allow-unauthenticated \
    --timeout=300 \
    --set-env-vars="ENVIRONMENT=${ENVIRONMENT},SURREAL_URL=ws://localhost:8000/rpc,SURREAL_USER=root,SURREAL_PASSWORD=root,SURREAL_NAMESPACE=open_notebook,SURREAL_DATABASE=${ENVIRONMENT},API_URL=http://localhost:5055" \
    --set-secrets="OPENAI_API_KEY=OPENAI_API_KEY:latest,ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest" \
    --quiet

print_success "Service deployed!"

# Get service URL
print_header "Step 7: Getting Service URL"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --region=${REGION} \
    --format="value(status.url)")

print_success "Deployment URL: ${SERVICE_URL}"

# Summary
print_header "🎉 Deployment Complete!"

echo ""
echo "┌─────────────────────────────────────────────────────────┐"
echo "│  Deployment Summary                                     │"
echo "├─────────────────────────────────────────────────────────┤"
echo "│                                                         │"
echo "│  Environment:  ${ENVIRONMENT}"
echo "│  Service:      ${SERVICE_NAME}"
echo "│  Region:       ${REGION}"
echo "│  Project:      ${PROJECT_ID}"
echo "│                                                         │"
echo "│  🔗 Access your deployment:                             │"
echo "│  ${SERVICE_URL}"
echo "│                                                         │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""

print_info "Opening deployment in browser..."
open "${SERVICE_URL}" 2>/dev/null || xdg-open "${SERVICE_URL}" 2>/dev/null || echo "Visit: ${SERVICE_URL}"

echo ""
print_success "Deployment complete!"
print_info "View logs: gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
