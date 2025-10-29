#!/bin/bash

#####################################################################
# Google Cloud Run Environment Setup Script
#
# This script automates steps 4-6 of the GCP setup:
# - Creates service account for GitHub Actions
# - Grants necessary IAM roles
# - Generates and saves service account key
# - Creates secrets in Secret Manager
# - Grants Cloud Run access to secrets
#
# Usage:
#   ./setup-gcp-environment.sh [PROJECT_ID] [ENVIRONMENT]
#
# Examples:
#   ./setup-gcp-environment.sh communi-team-dev dev
#   ./setup-gcp-environment.sh communi-team-prod prod
#
#####################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Get project ID and environment
if [ -z "$1" ]; then
    print_error "Project ID is required"
    echo "Usage: $0 PROJECT_ID ENVIRONMENT"
    echo "Example: $0 communi-team-dev dev"
    exit 1
fi

if [ -z "$2" ]; then
    print_error "Environment is required"
    echo "Usage: $0 PROJECT_ID ENVIRONMENT"
    echo "Example: $0 communi-team-dev dev"
    exit 1
fi

PROJECT_ID="$1"
ENVIRONMENT="$2"
REGION="europe-west2"  # London, UK

print_header "GCP Environment Setup for ${ENVIRONMENT}"

print_info "Project ID: ${PROJECT_ID}"
print_info "Environment: ${ENVIRONMENT}"
print_info "Region: ${REGION}"

# Confirm with user
echo ""
read -p "Continue with this configuration? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Setup cancelled"
    exit 0
fi

# Set the project
print_header "Step 1: Setting Project"
print_info "Setting active project to ${PROJECT_ID}..."
gcloud config set project "$PROJECT_ID"
print_success "Project set to ${PROJECT_ID}"

# Verify project exists
print_info "Verifying project exists..."
if ! gcloud projects describe "$PROJECT_ID" &>/dev/null; then
    print_error "Project ${PROJECT_ID} not found!"
    print_info "Please create the project first in the GCP Console"
    exit 1
fi
print_success "Project verified"

# Create service account
print_header "Step 2: Creating Service Account"
SA_NAME="github-actions"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

print_info "Service account: ${SA_EMAIL}"

if gcloud iam service-accounts describe "$SA_EMAIL" &>/dev/null; then
    print_warning "Service account already exists, skipping creation"
else
    print_info "Creating service account..."
    gcloud iam service-accounts create "$SA_NAME" \
        --display-name="GitHub Actions - ${ENVIRONMENT}" \
        --description="Service account for GitHub Actions deployments to ${ENVIRONMENT}"
    print_success "Service account created"
fi

# Grant IAM roles
print_header "Step 3: Granting IAM Roles"

ROLES=(
    "roles/run.admin"
    "roles/artifactregistry.writer"
    "roles/iam.serviceAccountUser"
    "roles/secretmanager.secretAccessor"
)

for ROLE in "${ROLES[@]}"; do
    print_info "Granting ${ROLE}..."
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:${SA_EMAIL}" \
        --role="$ROLE" \
        --condition=None \
        >/dev/null 2>&1
    print_success "Granted ${ROLE}"
done

# Create service account key
print_header "Step 4: Creating Service Account Key"

KEY_FILE="gcp-key-${ENVIRONMENT}.json"
OUTPUT_DIR="./gcp-keys"

mkdir -p "$OUTPUT_DIR"

if [ -f "${OUTPUT_DIR}/${KEY_FILE}" ]; then
    print_warning "Key file already exists at ${OUTPUT_DIR}/${KEY_FILE}"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping key creation"
        KEY_FILE_SKIPPED=true
    fi
fi

if [ -z "$KEY_FILE_SKIPPED" ]; then
    print_info "Creating service account key..."
    gcloud iam service-accounts keys create "${OUTPUT_DIR}/${KEY_FILE}" \
        --iam-account="${SA_EMAIL}"
    print_success "Key created: ${OUTPUT_DIR}/${KEY_FILE}"
fi

# Create secrets
print_header "Step 5: Creating Secrets in Secret Manager"

print_info "This will prompt you to enter your API keys"
print_warning "Keys are stored securely in Google Secret Manager"
echo ""

# OpenAI API Key
print_info "Creating OPENAI_API_KEY secret..."
if gcloud secrets describe OPENAI_API_KEY &>/dev/null; then
    print_warning "OPENAI_API_KEY already exists, skipping"
else
    read -sp "Enter your OpenAI API key: " OPENAI_KEY
    echo ""
    if [ -z "$OPENAI_KEY" ]; then
        print_warning "No OpenAI key provided, skipping"
    else
        echo -n "$OPENAI_KEY" | gcloud secrets create OPENAI_API_KEY \
            --data-file=- \
            --replication-policy="automatic"
        print_success "OPENAI_API_KEY secret created"
    fi
fi

# Anthropic API Key (optional)
print_info "Creating ANTHROPIC_API_KEY secret (optional)..."
if gcloud secrets describe ANTHROPIC_API_KEY &>/dev/null; then
    print_warning "ANTHROPIC_API_KEY already exists, skipping"
else
    read -sp "Enter your Anthropic API key (or press Enter to skip): " ANTHROPIC_KEY
    echo ""
    if [ -z "$ANTHROPIC_KEY" ]; then
        print_info "Skipping Anthropic API key"
    else
        echo -n "$ANTHROPIC_KEY" | gcloud secrets create ANTHROPIC_API_KEY \
            --data-file=- \
            --replication-policy="automatic"
        print_success "ANTHROPIC_API_KEY secret created"
    fi
fi

# Grant Cloud Run access to secrets
print_header "Step 6: Granting Cloud Run Access to Secrets"

CLOUD_RUN_SA="${PROJECT_ID}@appspot.gserviceaccount.com"

for SECRET in OPENAI_API_KEY ANTHROPIC_API_KEY; do
    if gcloud secrets describe "$SECRET" &>/dev/null; then
        print_info "Granting access to ${SECRET}..."
        gcloud secrets add-iam-policy-binding "$SECRET" \
            --member="serviceAccount:${CLOUD_RUN_SA}" \
            --role="roles/secretmanager.secretAccessor" \
            >/dev/null 2>&1
        print_success "Access granted to ${SECRET}"
    fi
done

# Summary
print_header "Setup Complete! 🎉"

print_success "Environment ${ENVIRONMENT} is configured"
echo ""
print_info "Service Account: ${SA_EMAIL}"
print_info "Key File: ${OUTPUT_DIR}/${KEY_FILE}"
print_info "Region: ${REGION}"
echo ""

print_header "Next Steps"

echo "1. Add these secrets to GitHub:"
echo ""
echo "   GitHub Repository → Settings → Secrets and variables → Actions"
echo ""
echo "   For single-environment setup:"
echo "   • GCP_PROJECT_ID = ${PROJECT_ID}"
echo "   • GCP_SA_KEY = (contents of ${OUTPUT_DIR}/${KEY_FILE})"
echo ""
echo "   For multi-environment setup:"
echo "   • GCP_PROJECT_ID_$(echo $ENVIRONMENT | tr '[:lower:]' '[:upper:]') = ${PROJECT_ID}"
echo "   • GCP_SA_KEY_$(echo $ENVIRONMENT | tr '[:lower:]' '[:upper:]') = (contents of ${OUTPUT_DIR}/${KEY_FILE})"
echo ""

print_info "To view the key contents:"
echo "   cat ${OUTPUT_DIR}/${KEY_FILE}"
echo ""

print_info "To copy the key to clipboard (macOS):"
echo "   cat ${OUTPUT_DIR}/${KEY_FILE} | pbcopy"
echo ""

print_info "To copy the key to clipboard (Linux):"
echo "   cat ${OUTPUT_DIR}/${KEY_FILE} | xclip -selection clipboard"
echo ""

print_header "GitHub Secrets Reference"

ENV_UPPER=$(echo "$ENVIRONMENT" | tr '[:lower:]' '[:upper:]')

cat > "${OUTPUT_DIR}/github-secrets-${ENVIRONMENT}.txt" <<EOF
GitHub Secrets for ${ENVIRONMENT}
================================

Secret Name: GCP_PROJECT_ID_${ENV_UPPER}
Value: ${PROJECT_ID}

Secret Name: GCP_SA_KEY_${ENV_UPPER}
Value: <contents of ${KEY_FILE}>

To add to GitHub:
1. Go to: https://github.com/YOUR_USERNAME/open-notebook/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret above

Service Account Email: ${SA_EMAIL}
Region: ${REGION}
Key File: ${OUTPUT_DIR}/${KEY_FILE}

Created: $(date)
EOF

print_success "Reference file created: ${OUTPUT_DIR}/github-secrets-${ENVIRONMENT}.txt"

echo ""
print_info "Run this script again for other environments (staging, prod)"
echo ""

print_warning "IMPORTANT: Keep the key file secure!"
print_warning "Add ${OUTPUT_DIR}/ to .gitignore to prevent accidental commits"
echo ""

# Add to .gitignore
if ! grep -q "gcp-keys/" .gitignore 2>/dev/null; then
    echo "gcp-keys/" >> .gitignore
    print_success "Added gcp-keys/ to .gitignore"
fi

print_success "Setup complete!"
