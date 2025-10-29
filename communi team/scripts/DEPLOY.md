# Deploy Open Notebook to Google Cloud Run

Quick deployment script for deploying Open Notebook to Google Cloud Run.

## 🚀 Quick Deploy

```bash
# Deploy to dev environment
./scripts/deploy-to-cloudrun.sh dev

# Deploy to staging
./scripts/deploy-to-cloudrun.sh staging

# Deploy to production
./scripts/deploy-to-cloudrun.sh prod
```

## 📋 Prerequisites

Before running the script, make sure you have:

1. ✅ **Google Cloud CLI installed**
   ```bash
   # Check if installed
   gcloud --version

   # Install if needed (macOS)
   brew install google-cloud-sdk
   ```

2. ✅ **Docker installed and running**
   ```bash
   # Check if running
   docker ps
   ```

3. ✅ **Authenticated to Google Cloud**
   ```bash
   # Login with your Google account
   gcloud auth login
   ```

4. ✅ **GCP project set up** (from setup scripts)
   - Project created
   - APIs enabled
   - Artifact Registry created
   - Secrets configured

## 🎯 What the Script Does

The deployment script automatically:

1. ✅ Verifies authentication
2. ✅ Sets the correct GCP project
3. ✅ Sets up Docker multi-platform builder
4. ✅ Builds Docker image for AMD64 (Cloud Run compatible)
5. ✅ Pushes image to Artifact Registry
6. ✅ Deploys to Cloud Run with correct configuration
7. ✅ Shows deployment URL
8. ✅ Opens the URL in your browser

**Time**: ~8-12 minutes per deployment

## 🔧 Environment Configuration

The script automatically configures resources based on environment:

### Dev Environment
```
Project:       communi-team-dev
Service:       open-notebook-dev
Memory:        2Gi
CPU:           1
Min/Max:       0-5 instances
```

### Staging Environment
```
Project:       communi-team-staging
Service:       open-notebook-staging
Memory:        2Gi
CPU:           1
Min/Max:       0-10 instances
```

### Production Environment
```
Project:       communi-team-prod
Service:       open-notebook
Memory:        4Gi
CPU:           2
Min/Max:       1-20 instances (always on)
```

## 📊 Deployment Process

```
Start
  ↓
Check Authentication
  ↓
Set GCP Project
  ↓
Setup Docker Builder
  ↓
Build Image (5-10 min)
  ├─ Build for linux/amd64
  └─ Push to Artifact Registry
  ↓
Deploy to Cloud Run (2-3 min)
  ├─ Create/Update service
  ├─ Configure env vars
  ├─ Set secrets
  └─ Configure scaling
  ↓
Get Deployment URL
  ↓
Open in Browser
  ↓
Done! 🎉
```

## 🎬 Example Usage

### First-Time Deployment

```bash
# Make sure you're in the repo root
cd ~/path/to/open-notebook

# Run the deployment script
./scripts/deploy-to-cloudrun.sh dev
```

**Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 Deploying Open Notebook to Cloud Run
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ℹ Environment: dev
ℹ Project: communi-team-dev
ℹ Service: open-notebook-dev
ℹ Region: europe-west2

Continue with deployment? (y/n) y

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Step 1: Checking Authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Authenticated as: your-email@domain.com

[... deployment continues ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎉 Deployment Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────┐
│  Deployment Summary                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Environment:  dev                                      │
│  Service:      open-notebook-dev                        │
│  Region:       europe-west2                             │
│  Project:      communi-team-dev                         │
│                                                         │
│  🔗 Access your deployment:                             │
│  https://open-notebook-dev-xxxxx-ew.a.run.app          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Update Existing Deployment

Just run the same command:

```bash
./scripts/deploy-to-cloudrun.sh dev
```

The script will:
- Build new image
- Update the existing Cloud Run service
- Deploy new revision
- Route traffic to new revision

**No downtime!** Cloud Run handles zero-downtime deployments.

## 🚨 Troubleshooting

### "Not authenticated to Google Cloud"

**Solution:**
```bash
gcloud auth login
```

### "Permission denied" errors

**Solution:**
```bash
# Make sure you're logged in with your personal account, not service account
gcloud auth list

# Switch to correct account
gcloud config set account your-email@domain.com
```

### "Artifact Registry not found"

**Solution:**
```bash
# Create the repository
gcloud config set project communi-team-dev
gcloud artifacts repositories create open-notebook \
  --repository-format=docker \
  --location=europe-west2
```

### "Secret not found" or "Permission denied on secret"

**Solution:**
```bash
# Grant Cloud Run service account access to secrets
gcloud secrets add-iam-policy-binding OPENAI_API_KEY \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding ANTHROPIC_API_KEY \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Build fails on Apple Silicon Mac

The script already handles this by building for `linux/amd64`, but if you get errors:

```bash
# Recreate the buildx builder
docker buildx rm cloudrun-builder
docker buildx create --name cloudrun-builder --use
```

### Deployment shows "Unable to Connect to API"

**Solution:** The script now automatically sets `API_URL=http://localhost:5055`, but if you still see this:

```bash
gcloud run services update open-notebook-dev \
  --region=europe-west2 \
  --update-env-vars=API_URL=http://localhost:5055
```

## 🔍 Viewing Logs

After deployment, view logs:

```bash
# Real-time logs
gcloud run services logs tail open-notebook-dev --region=europe-west2

# Recent logs
gcloud run services logs read open-notebook-dev --region=europe-west2 --limit=100
```

## 🛑 Rolling Back

If something goes wrong:

```bash
# List revisions
gcloud run revisions list \
  --service=open-notebook-dev \
  --region=europe-west2

# Rollback to previous revision
gcloud run services update-traffic open-notebook-dev \
  --region=europe-west2 \
  --to-revisions=PREVIOUS_REVISION_NAME=100
```

## 🔄 Updating Configuration

### Update Environment Variables

```bash
gcloud run services update open-notebook-dev \
  --region=europe-west2 \
  --update-env-vars=NEW_VAR=value
```

### Update Resource Limits

```bash
gcloud run services update open-notebook-dev \
  --region=europe-west2 \
  --memory=4Gi \
  --cpu=2
```

### Update Scaling

```bash
gcloud run services update open-notebook-dev \
  --region=europe-west2 \
  --min-instances=1 \
  --max-instances=10
```

## 💡 Pro Tips

1. **First build is slow** (~10 min) - subsequent builds use cache (~5-7 min)
2. **Deploy during low-traffic** for production
3. **Test in dev first** before deploying to prod
4. **Monitor costs** in GCP Console
5. **Set up budget alerts** to avoid surprises

## 📚 Related Documentation

- [Google Cloud Run Setup Guide](./docs/deployment/cloud-run.md)
- [Multi-Environment Setup](./docs/deployment/cloud-run-multi-environment.md)
- [GCP Setup Scripts](./scripts/GCP_SETUP_README.md)

## 🆘 Need Help?

- **View logs**: `gcloud run services logs read open-notebook-dev --region=europe-west2`
- **Service details**: `gcloud run services describe open-notebook-dev --region=europe-west2`
- **Check status**: Visit [Google Cloud Console](https://console.cloud.google.com/run)
- **Discord**: [Open Notebook Community](https://discord.gg/37XJPXfz2w)

## ✅ Quick Reference

```bash
# Deploy to dev
./scripts/deploy-to-cloudrun.sh dev

# Deploy to staging
./scripts/deploy-to-cloudrun.sh staging

# Deploy to production
./scripts/deploy-to-cloudrun.sh prod

# View logs
gcloud run services logs tail open-notebook-dev --region=europe-west2

# Get service URL
gcloud run services describe open-notebook-dev \
  --region=europe-west2 \
  --format="value(status.url)"

# Rollback
gcloud run revisions list --service=open-notebook-dev --region=europe-west2
gcloud run services update-traffic open-notebook-dev \
  --region=europe-west2 \
  --to-revisions=REVISION_NAME=100
```

---

**Happy Deploying!** 🚀
