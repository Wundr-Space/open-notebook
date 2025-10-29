# Google Cloud Run Setup - Quick Start Guide

This guide walks you through setting up Google Cloud Run for the first time to deploy your Open Notebook fork.

## Prerequisites

- Google account (Gmail or Google Workspace)
- Your OpenAI API key (or other AI provider keys)
- GitHub repository access (your fork)

## Estimated Time: 20-30 minutes

---

## Part 1: Google Cloud Project Setup

### Step 1: Create Google Cloud Account

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. If first time: Accept the terms and conditions
4. **Note**: Google offers $300 in free credits for new accounts (valid 90 days)

### Step 2: Create a New Project

1. Click the project dropdown at the top of the page (next to "Google Cloud")
2. Click "**New Project**"
3. Enter project details:
   - **Project name**: `open-notebook` (or your preferred name)
   - **Organization**: Leave as "No organization" (unless you have one)
4. Click "**Create**"
5. Wait for the project to be created (~30 seconds)
6. **IMPORTANT**: Note your **Project ID** (shown under the project name)
   - Example: `open-notebook-123456`
   - You'll need this later!

### Step 3: Enable Billing (Required)

1. Go to: [https://console.cloud.google.com/billing](https://console.cloud.google.com/billing)
2. Click "**Link a billing account**"
3. Either:
   - Create new billing account (enter payment details)
   - Select existing billing account
4. **Don't worry**: You get $300 free credits + generous free tier
5. For Open Notebook personal use, you'll likely stay within free tier

---

## Part 2: Enable Required APIs

### Option A: Using Cloud Shell (Recommended - Easiest)

1. In Google Cloud Console, click the **Cloud Shell** icon (>_) at the top-right
2. Wait for the terminal to initialize (~10 seconds)
3. Copy and paste these commands ONE AT A TIME:

```bash
# Set your project ID (replace with YOUR project ID from Step 2)
export PROJECT_ID="open-notebook-123456"
gcloud config set project $PROJECT_ID

# Verify it's set correctly
gcloud config get-value project

# Enable required APIs (takes ~2 minutes)
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Verify APIs are enabled
gcloud services list --enabled
```

### Option B: Using Web Console (Click through UI)

1. Go to: [https://console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library)
2. Search for and enable each of these:
   - "Cloud Run API" → Click → Enable
   - "Cloud Build API" → Click → Enable
   - "Artifact Registry API" → Click → Enable
   - "Secret Manager API" → Click → Enable

---

## Part 3: Create Artifact Registry Repository

This stores your Docker images.

**In Cloud Shell:**

```bash
# Create the repository
gcloud artifacts repositories create open-notebook \
  --repository-format=docker \
  --location=us-central1 \
  --description="Open Notebook container images"

# Verify it was created
gcloud artifacts repositories list
```

**Expected output:**
```
Created repository [open-notebook].
```

---

## Part 4: Create Service Account for GitHub Actions

This allows GitHub to deploy to your GCP project.

**In Cloud Shell:**

```bash
# 1. Create the service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account" \
  --description="Service account for GitHub Actions deployments"

# 2. Set the service account email (for next commands)
export SA_EMAIL="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"

# 3. Verify it was created
gcloud iam service-accounts list

# 4. Grant necessary permissions (run each command)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

# 5. Create and download the service account key
gcloud iam service-accounts keys create ~/github-actions-key.json \
  --iam-account="${SA_EMAIL}"

# 6. Display the key (you'll copy this to GitHub)
cat ~/github-actions-key.json
```

**IMPORTANT**:
- Copy the ENTIRE JSON output (from `{` to `}`)
- Save it temporarily in a text file
- You'll add this to GitHub secrets in Part 6

---

## Part 5: Store API Keys in Secret Manager

This securely stores your AI provider API keys.

**In Cloud Shell:**

```bash
# Create secret for OpenAI API key
# Replace YOUR_OPENAI_KEY with your actual key
echo -n "YOUR_OPENAI_KEY" | gcloud secrets create OPENAI_API_KEY \
  --data-file=- \
  --replication-policy="automatic"

# OPTIONAL: Add Anthropic key if you have one
echo -n "YOUR_ANTHROPIC_KEY" | gcloud secrets create ANTHROPIC_API_KEY \
  --data-file=- \
  --replication-policy="automatic"

# Grant Cloud Run access to the secrets
gcloud secrets add-iam-policy-binding OPENAI_API_KEY \
  --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# If you created ANTHROPIC_API_KEY:
gcloud secrets add-iam-policy-binding ANTHROPIC_API_KEY \
  --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Verify secrets were created
gcloud secrets list
```

**Expected output:**
```
NAME                  CREATED
ANTHROPIC_API_KEY     2024-...
OPENAI_API_KEY        2024-...
```

---

## Part 6: Configure GitHub Secrets

Now add your GCP credentials to GitHub so the workflow can deploy.

### Step 1: Go to Your GitHub Repository

1. Open your fork: `https://github.com/YOUR-USERNAME/open-notebook`
2. Click **Settings** (top menu)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click "**New repository secret**"

### Step 2: Add GCP_PROJECT_ID Secret

1. **Name**: `GCP_PROJECT_ID`
2. **Secret**: Your project ID (e.g., `open-notebook-123456`)
3. Click "**Add secret**"

### Step 3: Add GCP_SA_KEY Secret

1. Click "**New repository secret**" again
2. **Name**: `GCP_SA_KEY`
3. **Secret**: Paste the ENTIRE JSON from Part 4, Step 6
   - Should start with `{` and end with `}`
   - Should be ~2,500 characters
4. Click "**Add secret**"

### Step 4: Verify Secrets

You should now see:
- `GCP_PROJECT_ID`
- `GCP_SA_KEY`

---

## Part 7: Test Deployment

### Option 1: Manual Deployment (Recommended for first test)

1. Go to your GitHub repository
2. Click **Actions** tab (top menu)
3. Click "**Deploy to Google Cloud Run**" workflow (left sidebar)
4. Click "**Run workflow**" button (right side)
5. Select your branch: `claude/session-011CUYPaxmPqBie7JVFpGGVw`
6. Click "**Run workflow**"

### Watch the Deployment

1. The workflow will appear and start running
2. Click on the running workflow to see details
3. Watch the steps:
   - ✓ Checkout code
   - ✓ Authenticate to Google Cloud
   - ✓ Build Docker image (~5-10 minutes)
   - ✓ Push to Artifact Registry
   - ✓ Deploy to Cloud Run (~2-3 minutes)

### Get Your Deployment URL

When complete:
1. Scroll to the "**Show deployment URL**" step
2. Look for: `Service URL: https://open-notebook-xxxxx-uc.a.run.app`
3. **Click that URL** to access your deployed Open Notebook!

---

## Part 8: Verify Deployment

### Check in Google Cloud Console

1. Go to: [https://console.cloud.google.com/run](https://console.cloud.google.com/run)
2. You should see your `open-notebook` service
3. Click on it to see:
   - Logs
   - Metrics (requests, CPU, memory)
   - URL

### Test Your Application

1. Open the deployment URL in your browser
2. You should see the Open Notebook interface
3. Try creating a notebook to verify it works

---

## Troubleshooting

### Issue: "Permission Denied" during deployment

**Solution**: Make sure the service account has all 4 roles:
```bash
# Verify roles
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions@*"
```

### Issue: "Cannot access secrets"

**Solution**: Grant Cloud Run access to secrets:
```bash
gcloud secrets add-iam-policy-binding OPENAI_API_KEY \
  --member="serviceAccount:${PROJECT_ID}@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Issue: "Repository not found"

**Solution**: Verify Artifact Registry was created:
```bash
gcloud artifacts repositories list --location=us-central1
```

### Issue: GitHub workflow fails with "Invalid credentials"

**Solution**:
1. Check `GCP_SA_KEY` secret contains valid JSON
2. Regenerate the key if needed:
```bash
gcloud iam service-accounts keys create ~/new-key.json \
  --iam-account="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"
cat ~/new-key.json
```

### Issue: "Billing not enabled"

**Solution**: Enable billing at [https://console.cloud.google.com/billing](https://console.cloud.google.com/billing)

---

## View Logs

**In Cloud Shell:**
```bash
# Stream logs in real-time
gcloud run services logs tail open-notebook --region=us-central1

# Or view in console
# https://console.cloud.google.com/run/detail/us-central1/open-notebook/logs
```

---

## Cost Monitoring

**Set up budget alerts (recommended):**

1. Go to: [https://console.cloud.google.com/billing/budgets](https://console.cloud.google.com/billing/budgets)
2. Click "**Create Budget**"
3. Set amount: `$10` (or your preferred limit)
4. Add email alerts at 50%, 90%, 100%

---

## Next Steps After Successful Deployment

1. ✅ **Test your deployment** - Create a notebook, add sources
2. ✅ **Set up automatic deployments** - Merge to main branch
3. ✅ **Add custom domain** (optional) - See docs/deployment/cloud-run.md
4. ✅ **Monitor costs** - Check billing dashboard weekly
5. ✅ **Submit your PR** - Share this great feature!

---

## Quick Reference Commands

```bash
# Check deployment status
gcloud run services describe open-notebook --region=us-central1

# View logs
gcloud run services logs tail open-notebook --region=us-central1

# Update environment variables
gcloud run services update open-notebook \
  --region=us-central1 \
  --set-env-vars=NEW_VAR=value

# Delete service (if needed)
gcloud run services delete open-notebook --region=us-central1
```

---

## Getting Help

- **GCP Documentation**: [https://cloud.google.com/run/docs](https://cloud.google.com/run/docs)
- **Open Notebook Discord**: [https://discord.gg/37XJPXfz2w](https://discord.gg/37XJPXfz2w)
- **GitHub Issues**: [https://github.com/lfnovo/open-notebook/issues](https://github.com/lfnovo/open-notebook/issues)

---

**Ready to deploy?** Start with Part 1 above! 🚀
