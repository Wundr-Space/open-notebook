# GCP Setup Automation Scripts

Automated scripts to set up Google Cloud Platform environments for Open Notebook deployment.

## Overview

These scripts automate steps 4-6 of the GCP setup process, saving time and reducing errors.

## Scripts

### 1. `setup-gcp-environment.sh` - Single Environment Setup

Sets up one GCP environment (dev, staging, or prod).

**What it does:**
- Creates service account for GitHub Actions
- Grants necessary IAM roles
- Generates and saves service account key
- Creates secrets in Secret Manager
- Grants Cloud Run access to secrets
- Generates GitHub secrets reference file

**Usage:**
```bash
cd open-notebook
chmod +x scripts/setup-gcp-environment.sh
./scripts/setup-gcp-environment.sh PROJECT_ID ENVIRONMENT
```

**Examples:**
```bash
# Set up dev environment
./scripts/setup-gcp-environment.sh communi-team-dev dev

# Set up prod environment
./scripts/setup-gcp-environment.sh communi-team-prod prod
```

**Output:**
- Service account key: `./gcp-keys/gcp-key-{environment}.json`
- Reference file: `./gcp-keys/github-secrets-{environment}.txt`

---

### 2. `setup-all-environments.sh` - Multi-Environment Setup

Sets up all environments (dev, staging, prod) in one go.

**What it does:**
- Prompts for which environments to set up
- Runs single-environment script for each
- Creates summary of all environments

**Usage:**
```bash
chmod +x scripts/setup-all-environments.sh
./scripts/setup-all-environments.sh
```

**Interactive prompts:**
1. Select environments to set up (dev/staging/prod)
2. Enter project IDs
3. Enter API keys (prompted once per environment)

**Output:**
- Multiple key files in `./gcp-keys/`
- Reference files for each environment
- Summary of all created resources

---

### 3. `show-github-secrets.sh` - Display Secrets

Displays GitHub secrets in easy-to-copy format.

**What it does:**
- Shows the exact secret names to use in GitHub
- Displays the key file contents ready to copy
- Provides clipboard copy commands

**Usage:**
```bash
chmod +x scripts/show-github-secrets.sh

# Show secrets for one environment
./scripts/show-github-secrets.sh dev
./scripts/show-github-secrets.sh staging
./scripts/show-github-secrets.sh prod

# Show secrets for all environments
./scripts/show-github-secrets.sh all
```

---

## Quick Start Guide

### Option 1: Set Up Single Environment (Testing)

```bash
# 1. Complete manual steps 1-3 first
#    (create project, enable APIs, create Artifact Registry)

# 2. Run setup script
./scripts/setup-gcp-environment.sh communi-team-dev dev

# 3. Display secrets for GitHub
./scripts/show-github-secrets.sh dev

# 4. Copy secrets to GitHub manually

# 5. Test deployment
```

### Option 2: Set Up All Environments (Production)

```bash
# 1. Create all projects and enable APIs

# 2. Run multi-environment setup
./scripts/setup-all-environments.sh

# 3. Display all secrets
./scripts/show-github-secrets.sh all

# 4. Add secrets to GitHub

# 5. Deploy!
```

---

## Prerequisites

Before running, complete these manual steps:

1. ✅ Create GCP projects
2. ✅ Enable APIs (run, cloudbuild, artifactregistry, secretmanager)
3. ✅ Create Artifact Registry repository
4. ✅ Have API keys ready (OpenAI, Anthropic, etc.)

---

## What Gets Created

### In GCP (per environment):
- Service account: `github-actions@{project}.iam.gserviceaccount.com`
- IAM roles: run.admin, artifactregistry.writer, iam.serviceAccountUser, secretmanager.secretAccessor
- Secrets: OPENAI_API_KEY, ANTHROPIC_API_KEY
- Service account key (JSON file)

### On Your Computer:
```
gcp-keys/
├── gcp-key-dev.json
├── gcp-key-staging.json
├── gcp-key-prod.json
├── github-secrets-dev.txt
├── github-secrets-staging.txt
└── github-secrets-prod.txt
```

---

## GitHub Secrets

### Single Environment:
- `GCP_PROJECT_ID`
- `GCP_SA_KEY`

### Multi-Environment:
- `GCP_PROJECT_ID_DEV` + `GCP_SA_KEY_DEV`
- `GCP_PROJECT_ID_STAGING` + `GCP_SA_KEY_STAGING`
- `GCP_PROJECT_ID_PROD` + `GCP_SA_KEY_PROD`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied | `chmod +x scripts/*.sh` |
| Project not found | Create project in GCP Console first |
| Service account exists | Script will skip, this is safe |
| Secret already exists | Script will skip, or delete and re-run |

---

## Security

- ✅ `gcp-keys/` automatically added to `.gitignore`
- ✅ Scripts only grant minimum required permissions
- ✅ Keys are stored locally, never uploaded
- ✅ Rotate keys every 3-6 months

---

## Support

- **Docs**: `docs/deployment/cloud-run-multi-environment.md`
- **Issues**: https://github.com/lfnovo/open-notebook/issues
- **Discord**: https://discord.gg/37XJPXfz2w
