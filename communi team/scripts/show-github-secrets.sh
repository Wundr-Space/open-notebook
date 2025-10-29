#!/bin/bash

#####################################################################
# GitHub Secrets Helper Script
#
# This script displays the GitHub secrets you need to add,
# with the actual key file contents ready to copy.
#
# Usage:
#   ./show-github-secrets.sh [ENVIRONMENT]
#
# Examples:
#   ./show-github-secrets.sh dev
#   ./show-github-secrets.sh staging
#   ./show-github-secrets.sh prod
#   ./show-github-secrets.sh all
#
#####################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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

show_secrets_for_env() {
    local ENV=$1
    local ENV_UPPER=$(echo "$ENV" | tr '[:lower:]' '[:upper:]')
    local KEY_FILE="./gcp-keys/gcp-key-${ENV}.json"
    local REF_FILE="./gcp-keys/github-secrets-${ENV}.txt"

    print_header "${ENV_UPPER} Environment Secrets"

    if [ ! -f "$KEY_FILE" ]; then
        print_error "Key file not found: ${KEY_FILE}"
        print_info "Run ./scripts/setup-gcp-environment.sh first"
        return 1
    fi

    # Read project ID from reference file or JSON key file
    PROJECT_ID=""
    if [ -f "$REF_FILE" ]; then
        # Try to read from reference file
        PROJECT_ID=$(grep "^Value: " "$REF_FILE" | head -1 | cut -d' ' -f2-)
    fi

    # If not found in reference file, extract from JSON key file
    if [ -z "$PROJECT_ID" ] && [ -f "$KEY_FILE" ]; then
        PROJECT_ID=$(grep '"project_id"' "$KEY_FILE" | cut -d'"' -f4)
    fi

    echo "Add these secrets to GitHub:"
    echo "https://github.com/YOUR_USERNAME/open-notebook/settings/secrets/actions"
    echo ""

    echo -e "${GREEN}Secret 1 of 2${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}Name:${NC}"
    echo "GCP_PROJECT_ID_${ENV_UPPER}"
    echo ""
    echo -e "${BLUE}Value:${NC}"
    if [ -n "$PROJECT_ID" ]; then
        echo "$PROJECT_ID"
    else
        print_warning "Project ID not found in reference file"
    fi
    echo ""

    echo -e "${GREEN}Secret 2 of 2${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}Name:${NC}"
    echo "GCP_SA_KEY_${ENV_UPPER}"
    echo ""
    echo -e "${BLUE}Value:${NC} (copy entire JSON below)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat "$KEY_FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    print_info "Quick copy commands:"
    echo ""
    echo "  macOS (copy key to clipboard):"
    echo "    cat $KEY_FILE | pbcopy"
    echo ""
    echo "  Linux (copy key to clipboard):"
    echo "    cat $KEY_FILE | xclip -selection clipboard"
    echo ""
}

# Main script
ENVIRONMENT="$1"

if [ -z "$ENVIRONMENT" ]; then
    print_error "Environment is required"
    echo ""
    echo "Usage: $0 [ENVIRONMENT]"
    echo ""
    echo "Examples:"
    echo "  $0 dev       # Show DEV secrets"
    echo "  $0 staging   # Show STAGING secrets"
    echo "  $0 prod      # Show PROD secrets"
    echo "  $0 all       # Show ALL environment secrets"
    exit 1
fi

clear

cat << "EOF"
   ____ _ _   _   _       _       ____                     _
  / ___(_) |_| | | |_   _| |__   / ___|  ___  ___ _ __ ___| |_ ___
 | |  _| | __| |_| | | | | '_ \  \___ \ / _ \/ __| '__/ _ \ __/ __|
 | |_| | | |_|  _  | |_| | |_) |  ___) |  __/ (__| | |  __/ |_\__ \
  \____|_|\__|_| |_|\__,_|_.__/  |____/ \___|\___|_|  \___|\__|___/

EOF

if [ "$ENVIRONMENT" == "all" ]; then
    print_header "All Environment Secrets"

    for ENV in dev staging prod; do
        KEY_FILE="./gcp-keys/gcp-key-${ENV}.json"
        if [ -f "$KEY_FILE" ]; then
            show_secrets_for_env "$ENV"
            echo ""
            read -p "Press Enter to continue to next environment..."
            clear
        fi
    done

    print_success "All secrets displayed"
else
    show_secrets_for_env "$ENVIRONMENT"
fi

echo ""
print_header "After Adding Secrets to GitHub"

echo "1. Go to Actions tab in your GitHub repository"
echo "2. Select 'Deploy to Google Cloud Run (Multi-Environment)'"
echo "3. Click 'Run workflow'"
echo "4. Select environment: ${ENVIRONMENT}"
echo "5. Watch your deployment! 🚀"
echo ""

print_success "Ready to deploy!"
