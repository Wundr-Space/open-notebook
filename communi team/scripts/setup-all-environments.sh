#!/bin/bash

#####################################################################
# Multi-Environment GCP Setup Script
#
# This script sets up ALL environments (dev, staging, prod) in one go.
# It runs the single-environment script for each project.
#
# Usage:
#   ./setup-all-environments.sh
#
# The script will prompt you for:
# - Project IDs for each environment
# - API keys (can reuse same keys or use different ones)
#
#####################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

clear

cat << "EOF"
   ____                                        _   _____
  / ___|___  _ __ ___  _ __ ___  _   _ _ __ (_) |_   _|__  __ _ _ __ ___
 | |   / _ \| '_ ` _ \| '_ ` _ \| | | | '_ \| |   | |/ _ \/ _` | '_ ` _ \
 | |__| (_) | | | | | | | | | | | |_| | | | | |   | |  __/ (_| | | | | | |
  \____\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|_|   |_|\___|\__,_|_| |_| |_|

  Multi-Environment GCP Setup

EOF

print_header "Welcome to Multi-Environment Setup!"

echo "This script will set up multiple GCP environments for Communi Team."
echo ""
print_info "What you'll need:"
echo "  • Google Cloud project IDs (you should have created these already)"
echo "  • API keys (OpenAI, Anthropic, etc.)"
echo "  • About 10-15 minutes"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Setup cancelled"
    exit 0
fi

# Ask which environments to set up
print_header "Select Environments to Set Up"

echo "Which environments do you want to set up?"
echo ""
read -p "Set up DEV environment? (y/n) " -n 1 -r
echo ""
SETUP_DEV=$REPLY

read -p "Set up STAGING environment? (y/n) " -n 1 -r
echo ""
SETUP_STAGING=$REPLY

read -p "Set up PROD environment? (y/n) " -n 1 -r
echo ""
SETUP_PROD=$REPLY

if [[ ! $SETUP_DEV =~ ^[Yy]$ ]] && [[ ! $SETUP_STAGING =~ ^[Yy]$ ]] && [[ ! $SETUP_PROD =~ ^[Yy]$ ]]; then
    print_error "No environments selected!"
    exit 1
fi

# Collect project IDs
print_header "Project IDs"

if [[ $SETUP_DEV =~ ^[Yy]$ ]]; then
    read -p "Enter DEV project ID: " DEV_PROJECT_ID
    print_info "DEV: ${DEV_PROJECT_ID}"
fi

if [[ $SETUP_STAGING =~ ^[Yy]$ ]]; then
    read -p "Enter STAGING project ID: " STAGING_PROJECT_ID
    print_info "STAGING: ${STAGING_PROJECT_ID}"
fi

if [[ $SETUP_PROD =~ ^[Yy]$ ]]; then
    read -p "Enter PROD project ID: " PROD_PROJECT_ID
    print_info "PROD: ${PROD_PROJECT_ID}"
fi

echo ""
print_warning "Make sure the single-environment script exists"
SINGLE_ENV_SCRIPT="./scripts/setup-gcp-environment.sh"

if [ ! -f "$SINGLE_ENV_SCRIPT" ]; then
    print_error "Script not found: ${SINGLE_ENV_SCRIPT}"
    exit 1
fi

# Make it executable
chmod +x "$SINGLE_ENV_SCRIPT"

# Set up each environment
if [[ $SETUP_DEV =~ ^[Yy]$ ]]; then
    print_header "Setting Up DEV Environment"
    "$SINGLE_ENV_SCRIPT" "$DEV_PROJECT_ID" "dev"
    print_success "DEV environment complete!"
    echo ""
    read -p "Press Enter to continue to next environment..."
fi

if [[ $SETUP_STAGING =~ ^[Yy]$ ]]; then
    print_header "Setting Up STAGING Environment"
    "$SINGLE_ENV_SCRIPT" "$STAGING_PROJECT_ID" "staging"
    print_success "STAGING environment complete!"
    echo ""
    read -p "Press Enter to continue to next environment..."
fi

if [[ $SETUP_PROD =~ ^[Yy]$ ]]; then
    print_header "Setting Up PROD Environment"
    "$SINGLE_ENV_SCRIPT" "$PROD_PROJECT_ID" "prod"
    print_success "PROD environment complete!"
fi

# Final summary
print_header "🎉 All Environments Set Up!"

echo "Summary of what was created:"
echo ""

if [[ $SETUP_DEV =~ ^[Yy]$ ]]; then
    echo "✓ DEV Environment"
    echo "  Project: ${DEV_PROJECT_ID}"
    echo "  Key: ./gcp-keys/gcp-key-dev.json"
    echo ""
fi

if [[ $SETUP_STAGING =~ ^[Yy]$ ]]; then
    echo "✓ STAGING Environment"
    echo "  Project: ${STAGING_PROJECT_ID}"
    echo "  Key: ./gcp-keys/gcp-key-staging.json"
    echo ""
fi

if [[ $SETUP_PROD =~ ^[Yy]$ ]]; then
    echo "✓ PROD Environment"
    echo "  Project: ${PROD_PROJECT_ID}"
    echo "  Key: ./gcp-keys/gcp-key-prod.json"
    echo ""
fi

print_header "Next Steps"

echo "1. Review the key files in ./gcp-keys/"
echo ""
echo "2. Add secrets to GitHub:"
echo "   Go to: https://github.com/YOUR_USERNAME/open-notebook/settings/secrets/actions"
echo ""

if [[ $SETUP_DEV =~ ^[Yy]$ ]]; then
    echo "   DEV secrets:"
    echo "   • GCP_PROJECT_ID_DEV = ${DEV_PROJECT_ID}"
    echo "   • GCP_SA_KEY_DEV = (contents of gcp-key-dev.json)"
    echo ""
fi

if [[ $SETUP_STAGING =~ ^[Yy]$ ]]; then
    echo "   STAGING secrets:"
    echo "   • GCP_PROJECT_ID_STAGING = ${STAGING_PROJECT_ID}"
    echo "   • GCP_SA_KEY_STAGING = (contents of gcp-key-staging.json)"
    echo ""
fi

if [[ $SETUP_PROD =~ ^[Yy]$ ]]; then
    echo "   PROD secrets:"
    echo "   • GCP_PROJECT_ID_PROD = ${PROD_PROJECT_ID}"
    echo "   • GCP_SA_KEY_PROD = (contents of gcp-key-prod.json)"
    echo ""
fi

echo "3. Test deployment to DEV first"
echo ""
echo "4. View detailed instructions in the reference files:"
ls -la gcp-keys/*.txt 2>/dev/null || true
echo ""

print_success "Multi-environment setup complete!"
print_info "Happy deploying! 🚀"
