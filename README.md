# 📓 Open Notebook — Wundr Space Fork


*A private, multi-model research notebook — operated by Wundr Space for real client work.*

This fork aligns Open Notebook with Wundr Space’s mission: **Agentic AI for Human Connection**.
We use it as a secure, composable **Information Base** for projects (e.g. uploads of calls, docs, PDFs; assisted notes; podcast generation), backed by governed deployments on Google Cloud.

> **Upstream docs remain the canonical feature reference.**
> Please read the community README and guides for core capabilities, supported providers, and UI changes:
> 👉 **Open Notebook (community)**: [https://github.com/lfnovo/open-notebook](https://github.com/lfnovo/open-notebook)

---

## 🔭 What’s different in our fork?

* **Ops & security posture** for client work (Cloud Run, private networking options later, secret management).
* **Pipelines** tuned for repeatable builds and zero-touch deploys to **`communi-team-dev`** (staging) and production later.
* **Environment conventions** (Wundr `.env` layout, provider keys, storage paths).
* **Road to integration** with Wundr Map / Data Lab (export hooks and agent connectors – WIP).

---

## 🗺️ Admin Portals (quick links)

* **Google Cloud Console (Project: `communi-team-dev`)**
  [https://console.cloud.google.com/home/dashboard?project=communi-team-dev](https://console.cloud.google.com/home/dashboard?project=communi-team-dev)
* **Cloud Run – Services**
  [https://console.cloud.google.com/run?project=communi-team-dev](https://console.cloud.google.com/run?project=communi-team-dev)
* **Artifact Registry – Images**
  [https://console.cloud.google.com/artifacts?project=communi-team-dev](https://console.cloud.google.com/artifacts?project=communi-team-dev)
* **Cloud Build – History (if using Cloud Build)**
  [https://console.cloud.google.com/cloud-build/builds?project=communi-team-dev](https://console.cloud.google.com/cloud-build/builds?project=communi-team-dev)
* **Secret Manager**
  [https://console.cloud.google.com/security/secret-manager?project=communi-team-dev](https://console.cloud.google.com/security/secret-manager?project=communi-team-dev)
* **GitHub Repository (Wundr fork)**
  <REPO_URL_OF_THIS_FORK>
* **Upstream Project Docs**
  [https://github.com/lfnovo/open-notebook](https://github.com/lfnovo/open-notebook)

> If you don’t see the resources above, ask for IAM access to **`communi-team-dev`**.

---

## 🛠 Tech Stack (fork)

* **Frontend**: Next.js / React (served at port **8502** inside container)
* **API**: FastAPI (port **5055**)
* **DB**: SurrealDB (embedded in single-container image; external DB optional)
* **Container**: Docker image (community image or Wundr image built from this fork)
* **Hosting**: Google Cloud Run (HTTP, auto-scaling, SSL, custom domains optional)

---

## 🚀 Developer Setup

### 1) Clone & install dev tooling

```bash
git clone <REPO_URL_OF_THIS_FORK>
cd open-notebook
```

> For **local Docker** work you don’t need Node/Python locally; for **source edits** you’ll want the usual Node/Python toolchain as per upstream docs.

### 2) Create environment file

Copy and adapt `.env.example` (create one if not present) to `.env`:

```
# AI providers (pick what you use)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
ELEVENLABS_API_KEY=

# App / API
API_URL=http://localhost:5055
SURREAL_URL=ws://localhost:8000/rpc
SURREAL_USER=root
SURREAL_PASSWORD=root
SURREAL_NAMESPACE=open_notebook
SURREAL_DATABASE=development
```

> **Ports are critical:** 8502 (web) and 5055 (API). For remote access, **API_URL must point to the server’s address**, not `localhost`.

### 3) Run locally (Docker Compose – recommended)

Create `docker-compose.yml` at repo root:

```yaml
services:
  open_notebook:
    image: ghcr.io/lfnovo/open-notebook:v1-latest-single
    # Replace with Wundr image once we publish our build:
    # image: europe-west1-docker.pkg.dev/communi-team-dev/containers/open-notebook:v1
    ports:
      - "8502:8502"
      - "5055:5055"
    env_file:
      - ./.env
    volumes:
      - ./notebook_data:/app/data
      - ./surreal_data:/mydata
    restart: unless-stopped
```

Run:

```bash
docker compose up -d
```

Visit: [http://localhost:8502](http://localhost:8502)

---

## ☁️ Cloud Deployment (Google Cloud Run)

We deploy **one container** that serves both **Next.js (8502)** and **FastAPI (5055)** internally. Cloud Run exposes **one HTTPS endpoint** (we route web to 8502; the app internally proxies `/api/*` to 5055).

### Option A — Build & deploy with **Cloud Build** (no local Docker needed)

1. **Enable services** (one-off):

   * Artifact Registry, Cloud Build, Cloud Run, Secret Manager (as needed)

2. **Submit a build** (from repo root):

```bash
gcloud builds submit \
  --project=communi-team-dev \
  --tag=europe-west1-docker.pkg.dev/communi-team-dev/containers/open-notebook:v1
```

3. **Deploy to Cloud Run**:

```bash
gcloud run deploy open-notebook \
  --project=communi-team-dev \
  --region=europe-west1 \
  --image=europe-west1-docker.pkg.dev/communi-team-dev/containers/open-notebook:v1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8502 \
  --memory=2Gi \
  --min-instances=0 \
  --max-instances=3 \
  --set-env-vars=API_URL=/api,SURREAL_URL=ws://localhost:8000/rpc,SURREAL_USER=root,SURREAL_PASSWORD=root,SURREAL_NAMESPACE=open_notebook,SURREAL_DATABASE=production
```

> We keep `API_URL=/api` in Cloud Run (frontend proxy). If you need a public API endpoint separately, expose 5055 via an additional service or a path mapping behind a proxy (Nginx/Cloud Run sidecar pattern).

4. **Secrets** (recommended): store provider keys in **Secret Manager** and mount/inject them:

```bash
gcloud run services update open-notebook \
  --project=communi-team-dev \
  --region=europe-west1 \
  --set-secrets=OPENAI_API_KEY=OPENAI_API_KEY:latest,ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest,ELEVENLABS_API_KEY=ELEVENLABS_API_KEY:latest
```

### Option B — Build locally, push, then deploy

```bash
docker build -t europe-west1-docker.pkg.dev/communi-team-dev/containers/open-notebook:v1 .
gcloud auth configure-docker europe-west1-docker.pkg.dev
docker push europe-west1-docker.pkg.dev/communi-team-dev/containers/open-notebook:v1

gcloud run deploy open-notebook \
  --project=communi-team-dev \
  --region=europe-west1 \
  --image=europe-west1-docker.pkg.dev/communi-team-dev/containers/open-notebook:v1 \
  --platform=managed --port=8502 --allow-unauthenticated
```

---

## 🔁 CI/CD Pipelines

You can use **GitHub Actions** or **Azure DevOps**; pick one per repo to avoid drift. Both patterns below produce the same result: build → push to Artifact Registry → deploy to Cloud Run.

### Option 1 — GitHub Actions

**Secrets (GitHub → Settings → Secrets and variables → Actions):**

* `GCP_SA_KEY` → JSON for a service account with roles:
  Cloud Run Admin, Cloud Build Editor, Artifact Registry Writer, Service Account User
* `GCP_PROJECT_ID` → `communi-team-dev`
* `GCP_REGION` → `europe-west1`
* `AR_REPO` → `containers` (or the repo name you created)

**`.github/workflows/deploy.yml`**

```yaml
name: Build & Deploy (Cloud Run)

on:
  push:
    branches: [ develop, main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: auth
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker europe-west1-docker.pkg.dev --quiet

      - name: Build image
        run: |
          IMAGE="europe-west1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/${{ secrets.AR_REPO }}/open-notebook:${{ github.sha }}"
          echo "IMAGE=$IMAGE" >> $GITHUB_ENV
          docker build -t "$IMAGE" .

      - name: Push image
        run: docker push "$IMAGE"

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy open-notebook \
            --project=${{ secrets.GCP_PROJECT_ID }} \
            --region=${{ secrets.GCP_REGION }} \
            --image="$IMAGE" \
            --platform=managed \
            --allow-unauthenticated \
            --port=8502 \
            --memory=2Gi \
            --min-instances=0 \
            --max-instances=3
```

> Add a second job gated on `main` if you want a separate **prod** service name (`open-notebook-prod`) and domain.

### Option 2 — Azure DevOps (classic YAML)

**Service connection:** create a GCP service account JSON and store as a **Secure File** or variable secret.
**Pipeline variables:** `GCP_PROJECT_ID`, `GCP_REGION`, `AR_REPO`.

`azure-pipelines.yml`

```yaml
trigger:
  branches: { include: [ develop, main ] }

pool:
  vmImage: ubuntu-latest

steps:
  - checkout: self

  - task: Bash@3
    displayName: 'Install gcloud & auth'
    inputs:
      targetType: inline
      script: |
        curl -sSL https://sdk.cloud.google.com | bash > /dev/null
        source "$HOME/google-cloud-sdk/path.bash.inc"
        echo "$GCP_SA_KEY" > /tmp/sa.json
        gcloud auth activate-service-account --key-file=/tmp/sa.json
        gcloud --quiet auth configure-docker europe-west1-docker.pkg.dev

    env:
      GCP_SA_KEY: $(GCP_SA_KEY_JSON)  # set as secret variable

  - task: Bash@3
    displayName: 'Build & push image'
    inputs:
      targetType: inline
      script: |
        IMAGE="europe-west1-docker.pkg.dev/$(GCP_PROJECT_ID)/$(AR_REPO)/open-notebook:$(Build.SourceVersion)"
        echo "Using image: $IMAGE"
        docker build -t "$IMAGE" .
        docker push "$IMAGE"
        echo "##vso[task.setvariable variable=IMAGE]$IMAGE"

  - task: Bash@3
    displayName: 'Deploy Cloud Run'
    inputs:
      targetType: inline
      script: |
        source "$HOME/google-cloud-sdk/path.bash.inc"
        gcloud run deploy open-notebook \
          --project=$(GCP_PROJECT_ID) \
          --region=$(GCP_REGION) \
          --image="$(IMAGE)" \
          --platform=managed \
          --allow-unauthenticated \
          --port=8502 \
          --memory=2Gi \
          --min-instances=0 \
          --max-instances=3
```

---

## 🔐 Secrets & Config (Wundr conventions)

We prefer **Secret Manager** for production keys, referenced by Cloud Run env **or** mounted as files.
Local development uses `.env` (never commit).

Minimum keys commonly used:

* `OPENAI_API_KEY` (or alternative providers)
* `ELEVENLABS_API_KEY` (podcasts)
* `GOOGLE_API_KEY` / Vertex credentials (if using Google GenAI)
* `API_URL` (Cloud Run: use `/api`; remote servers: `https://host:5055`)
* `SURREAL_*` (use upstream defaults unless externalising DB)

---

## 🧭 Branching & Environments

* `develop` → **staging** deployment on Cloud Run (`open-notebook`)
* `main` → **production** deployment later (`open-notebook-prod`)
* Feature branches → PRs, review, merge

> Keep PRs focused. Use **Conventional Commits** (`feat:`, `fix:`, `chore:`) for clean changelogs.

---

## 🧰 Troubleshooting (quick wins)

| Symptom                               | Likely cause               | Fix                                                                              |
| ------------------------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| Web loads, actions fail               | API not reachable          | Ensure **both** ports mapped in local Docker. In Cloud Run, keep `API_URL=/api`. |
| Works on server but not other devices | `API_URL` uses `localhost` | Use server IP or domain (e.g. `http://192.168.1.20:5055`) for remote setups.     |
| 404s on `/api`                        | Proxy not applied          | Stay on the single-container image; don’t add `/api` to `API_URL` in Cloud Run.  |
| High cold-start latency               | Min instances = 0          | Raise `--min-instances=1` for steadier performance.                              |

---

## 📚 Upstream Documentation (read these)

* **Getting Started:** `docs/getting-started/index.md`
* **Deployment:** `docs/deployment/index.md`
* **Troubleshooting:** `docs/troubleshooting/quick-fixes.md`
* **Provider Support Matrix:** see upstream README

We periodically rebase from upstream to keep in step. If you plan a large change, open an issue in our fork first.

---

## 👥 Team Roles & Access (Wundr)

| Role      | Access                                                        |
| --------- | ------------------------------------------------------------- |
| Tech Lead | Approves PRs, manages releases, Cloud Run admin               |
| Devs      | Create feature branches, open PRs, can trigger staging deploy |
| Ops       | Secret Manager, IAM, domain & SSL, incident response          |

For access requests, post in **#platform-ops**.

---

## 📄 Licence

* **Upstream:** MIT (see upstream `LICENSE`)
* **Fork additions:** © Wundr Space Ltd — 2025. All rights reserved unless otherwise stated.
