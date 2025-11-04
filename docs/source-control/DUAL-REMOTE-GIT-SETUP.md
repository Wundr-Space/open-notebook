# Dual-Remote Git Setup  

### Push to Azure DevOps (ADO), Pull from GitHub

This repository is configured to use **Azure DevOps** as the *primary source of truth* (push target) and **GitHub** as a *read-only secondary remote* (pull-only).  
This allows you to pull updates or branches from GitHub as needed, while ensuring all commits are only pushed to ADO.

---

## Remote Repositories

| Remote Name | Purpose | URL |
|--------------|----------|-----|
| `origin` | Primary remote (push + pull) | https://dev.azure.com/wundr/Communi.Team/_git/open-notebook |
| `github` | Secondary remote (fetch + pull only) | https://github.com/Wundr-Space/open-notebook |

---

## One-Time Setup

1. **Check existing remotes**

```bash
git remote -v
````

You should see something like:

```
origin  https://dev.azure.com/wundr/Communi.Team/_git/open-notebook (fetch)
origin  https://dev.azure.com/wundr/Communi.Team/_git/open-notebook (push)
```

2. **Add GitHub as a second remote (pull-only)**

```bash
git remote add github https://github.com/Wundr-Space/open-notebook
```

3. **Ensure all pushes go to ADO**

```bash
git config remote.pushDefault origin
```

4. *(Optional but recommended)* **Prevent accidental pushes to GitHub**

```bash
mkdir -p .git/hooks
cat > .git/hooks/pre-push <<'SH'
#!/usr/bin/env bash
remote_name="$1"
if [ "$remote_name" = "github" ]; then
   echo "❌ Blocked: pushing to 'github' is disabled for this repository."
   exit 1
fi
SH
chmod +x .git/hooks/pre-push
```

---

## Typical Usage

### 🔄 Pulling updates from GitHub

When you want to bring changes from GitHub into your local branch:

```bash
git fetch github
git rebase github/main    # or: git merge github/main
```

Or a one-liner:

```bash
git pull github main
```

### ⬆️ Pushing to ADO

All pushes go to the ADO remote:

```bash
git push           # defaults to ADO (origin)
# or explicitly:
git push origin main
```

---

## Verifying Your Setup

```bash
# List remotes
git remote -v

# Confirm push default
git config remote.pushDefault
```

You should see:

```
origin  https://dev.azure.com/wundr/Communi.Team/_git/open-notebook (fetch)
origin  https://dev.azure.com/wundr/Communi.Team/_git/open-notebook (push)
github  https://github.com/Wundr-Space/open-notebook (fetch)
github  https://github.com/Wundr-Space/open-notebook (push)
remote.pushDefault=origin
```

> The `.git/hooks/pre-push` script ensures that even if a push to GitHub is attempted, it will be blocked safely.

---

## Common Commands

| Purpose                                   | Command                                                              |
| ----------------------------------------- | -------------------------------------------------------------------- |
| Fetch all branches from GitHub            | `git fetch github '+refs/heads/*:refs/remotes/github/*'`             |
| Cherry-pick a specific commit from GitHub | `git fetch github && git cherry-pick <commit-sha>`                   |
| Sync ADO main with GitHub main            | `git fetch github && git rebase github/main && git push origin main` |

---

## Summary

* **Push target:** Azure DevOps
* **Pull-only remote:** GitHub
* **Safety measure:** Local hook prevents accidental GitHub pushes
* **Workflow benefit:** Keeps ADO canonical while allowing selective updates from GitHub

