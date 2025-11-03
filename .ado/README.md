# Azure DevOps Pipelines for Open Notebook

Separate build and deploy pipelines for Google Cloud Run deployment.

## 📋 Pipeline Architecture

```
┌─────────────────┐
│  Build Pipeline │  Triggered on code push
└────────┬────────┘
         │
         ▼
  ┌──────────────────┐
  │ Docker Image     │
  │ Artifact Registry│
  └────────┬─────────┘
           │
           ▼
    ┌──────────────┐
    │Deploy Pipeline│  Manual or auto-trigger
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Cloud Run    │
    │ Service      │
    └──────────────┘
```

**Benefits:**
- ✅ Build once, deploy many times
- ✅ Deploy specific versions
- ✅ Faster deployments (no rebuild)
- ✅ Easy rollbacks

---

## 🚀 Quick Start

### 1. Set Up Variable Groups (One-Time)

Create variable groups in ADO for each environment.

#### Go to Library

1. Navigate to: `https://dev.azure.com/wundr/Communi.Team/_library`
2. Click **+ Variable group**

#### Create Dev Variable Group

**Name:** `open-notebook-dev`

**Variables:**

| Name | Value | Secret? |
|------|-------|---------|
| `GCP_PROJECT_ID` | `communi-team-dev` | No |
| `GCP_REGION` | `europe-west2` | No |
| `GCP_SA_KEY` | (Contents of `gcp-key-dev.json`) | **Yes** ✓ |
| `CLOUD_RUN_SERVICE` | `open-notebook-dev` | No |
| `CLOUD_RUN_MEMORY` | `2Gi` | No |
| `CLOUD_RUN_CPU` | `1` | No |
| `CLOUD_RUN_MIN_INSTANCES` | `0` | No |
| `CLOUD_RUN_MAX_INSTANCES` | `5` | No |

#### Create Staging Variable Group (Optional)

**Name:** `open-notebook-staging`

**Variables:**

| Name | Value | Secret? |
|------|-------|---------|
| `GCP_PROJECT_ID` | `communi-team-staging` | No |
| `GCP_REGION` | `europe-west2` | No |
| `GCP_SA_KEY` | (Contents of `gcp-key-staging.json`) | **Yes** ✓ |
| `CLOUD_RUN_SERVICE` | `open-notebook-staging` | No |
| `CLOUD_RUN_MEMORY` | `2Gi` | No |
| `CLOUD_RUN_CPU` | `1` | No |
| `CLOUD_RUN_MIN_INSTANCES` | `0` | No |
| `CLOUD_RUN_MAX_INSTANCES` | `10` | No |

#### Create Prod Variable Group

**Name:** `open-notebook-prod`

**Variables:**

| Name | Value | Secret? |
|------|-------|---------|
| `GCP_PROJECT_ID` | `communi-team-prod` | No |
| `GCP_REGION` | `europe-west2` | No |
| `GCP_SA_KEY` | (Contents of `gcp-key-prod.json`) | **Yes** ✓ |
| `CLOUD_RUN_SERVICE` | `open-notebook` | No |
| `CLOUD_RUN_MEMORY` | `4Gi` | No |
| `CLOUD_RUN_CPU` | `2` | No |
| `CLOUD_RUN_MIN_INSTANCES` | `1` | No |
| `CLOUD_RUN_MAX_INSTANCES` | `20` | No |

---

### 2. Create Build Pipeline

1. Go to: `https://dev.azure.com/wundr/Communi.Team/_build`
2. Click **New Pipeline**
3. Select **Azure Repos Git**
4. Select repository: **open-notebook**
5. Select **Existing Azure Pipelines YAML file**
6. Path: `/ado-pipelines/build-pipeline.yml`
7. Click **Save**
8. Rename to: "Open Notebook - Build"

---

### 3. Create Deploy Pipeline

1. Go to: `https://dev.azure.com/wundr/Communi.Team/_build`
2. Click **New Pipeline**
3. Select **Azure Repos Git**
4. Select repository: **open-notebook**
5. Select **Existing Azure Pipelines YAML file**
6. Path: `/ado-pipelines/deploy-pipeline.yml`
7. Click **Save**
8. Rename to: "Open Notebook - Deploy"

---

### 4. Create Environments (For Approvals)

1. Go to: `https://dev.azure.com/wundr/Communi.Team/_environments`
2. Click **Create environment**
3. Name: `dev`
4. Description: "Development environment"
5. Click **Create**
6. Repeat for `staging` and `prod`

**For Production - Add Approval:**
1. Click on `prod` environment
2. Click **Approvals and checks**
3. Click **+** → **Approvals**
4. Add approvers
5. Save

---

## 🎯 Usage

### Build New Image

#### Automatic (on code push)

Push to `develop`, `staging`, or `main` branch:

```bash
git push origin develop
```

The build pipeline automatically:
1. Builds Docker image
2. Tags with:
   - Build ID (e.g., `12345`)
   - `latest`
   - App version (from `pyproject.toml`)
3. Pushes to Artifact Registry

#### Manual Build

1. Go to **Pipelines**
2. Select **Open Notebook - Build**
3. Click **Run pipeline**
4. Select:
   - **Branch**: Your branch
   - **Environment**: `dev`, `staging`, or `prod`
5. Click **Run**

---

### Deploy Image

#### Deploy Latest Image

1. Go to **Pipelines**
2. Select **Open Notebook - Deploy**
3. Click **Run pipeline**
4. Select:
   - **Environment**: `dev`, `staging`, or `prod`
   - **Image Tag**: `latest`
5. Click **Run**

#### Deploy Specific Version

To deploy a specific build:

1. Note the Build ID from a successful build (e.g., `12345`)
2. Run deploy pipeline
3. Select:
   - **Environment**: Your target environment
   - **Image Tag**: `12345` (or `latest`, or app version)
4. Click **Run**

---

## 🔄 Typical Workflow

### Development

```
1. Code changes
   ↓
2. Push to develop branch
   ↓
3. Build pipeline runs automatically
   ↓
4. Manually trigger deploy to dev
   ↓
5. Test in dev environment
```

### Staging

```
1. Merge develop → staging
   ↓
2. Build pipeline runs automatically
   ↓
3. Deploy to staging
   ↓
4. QA testing
```

### Production

```
1. Merge staging → main
   ↓
2. Build pipeline runs automatically
   ↓
3. Deploy to prod (with approval)
   ↓
4. Monitor production
```

---

## 🎨 Advanced Scenarios

### Deploy Same Build to Multiple Environments

Build once in dev, deploy to staging, then prod:

```
1. Build from develop branch → Build #123
2. Test in dev
3. Deploy Build #123 to staging (imageTag: 123)
4. QA passes
5. Deploy Build #123 to prod (imageTag: 123)
```

### Rollback

Deploy a previous build:

```
1. Check build history
2. Note working build number (e.g., #120)
3. Run deploy pipeline
4. Select environment and imageTag: 120
5. Deploy older version
```

### Emergency Hotfix

```
1. Create hotfix branch
2. Run build pipeline manually from hotfix branch
3. Test deployment to dev
4. Deploy same build to prod (skip staging)
```

---

## 📊 Variable Groups Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GCP_PROJECT_ID` | Google Cloud Project ID | `communi-team-dev` |
| `GCP_REGION` | Deployment region | `europe-west2` |
| `GCP_SA_KEY` | Service account JSON key | `{...}` (keep secret!) |
| `CLOUD_RUN_SERVICE` | Service name | `open-notebook-dev` |

### Optional Variables (with defaults)

| Variable | Description | Default |
|----------|-------------|---------|
| `CLOUD_RUN_MEMORY` | Memory allocation | `2Gi` |
| `CLOUD_RUN_CPU` | CPU allocation | `1` |
| `CLOUD_RUN_MIN_INSTANCES` | Minimum instances | `0` |
| `CLOUD_RUN_MAX_INSTANCES` | Maximum instances | `5` |

---

## 🔐 Security Best Practices

### Service Account Keys

✅ **DO:**
- Store keys in ADO variable groups marked as "secret"
- Use different keys per environment
- Rotate keys quarterly
- Use separate variable groups per environment

❌ **DON'T:**
- Commit keys to git
- Share keys between environments
- Store keys as plain text
- Use personal accounts for deployment

### Permissions

Recommended ADO permissions:

**Developers:**
- Build: Read, Queue
- Deploy Dev: Read, Queue
- Deploy Staging: Read
- Deploy Prod: Read

**DevOps/Leads:**
- All pipelines: Admin
- Can approve prod deployments

---

## 🚨 Troubleshooting

### Build Pipeline Issues

**"Permission denied" on GCP**
- Check `GCP_SA_KEY` variable exists and is secret
- Verify service account has `artifactregistry.writer` role

**"Docker build failed"**
- Check Dockerfile.single exists
- Verify dependencies in package.json/pyproject.toml

### Deploy Pipeline Issues

**"Image not found"**
- Check image was built successfully
- Verify imageTag parameter matches build ID
- Confirm Artifact Registry has the image

**"Secret not found" in Cloud Run**
- Ensure secrets exist in Secret Manager
- Grant Cloud Run service account access:
  ```bash
  gcloud secrets add-iam-policy-binding OPENAI_API_KEY \
    --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
  ```

**"Service is not ready"**
- Check Cloud Run logs: `gcloud run services logs read SERVICE_NAME --region=REGION`
- Verify environment variables are correct
- Check memory/CPU limits are sufficient

---

## 📈 Monitoring

### View Build History

```
Pipelines → Open Notebook - Build → Runs
```

Shows:
- Build number
- Commit
- Branch
- Status
- Duration

### View Deployment History

```
Pipelines → Open Notebook - Deploy → Runs
```

Shows:
- Environment
- Image tag deployed
- Status
- Approval history (for prod)

### Cloud Run Logs

```bash
# View logs
gcloud run services logs tail open-notebook-dev --region=europe-west2

# Or in Cloud Console
https://console.cloud.google.com/run
```

---

## 🔗 Related Files

- `build-pipeline.yml` - Build pipeline definition
- `deploy-pipeline.yml` - Deploy pipeline definition
- `../azure-pipelines.yml` - Combined build+deploy pipeline
- `../scripts/deploy-to-cloudrun.sh` - Local deployment script

---

## 💡 Tips

1. **Use build numbers for deployments** - Easier to track than "latest"
2. **Test in dev first** - Always deploy to dev before staging/prod
3. **Tag releases** - Use git tags for production deployments
4. **Monitor costs** - Check GCP billing regularly
5. **Set up alerts** - Configure Cloud Run alerts for errors

---

## 🆘 Need Help?

- **ADO Issues**: Check pipeline logs
- **GCP Issues**: Check Cloud Run logs
- **Build Issues**: Verify Dockerfile and dependencies
- **Deploy Issues**: Check image exists in Artifact Registry

---

**Happy Deploying!** 🚀
