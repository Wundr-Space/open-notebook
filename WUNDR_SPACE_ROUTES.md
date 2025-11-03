# Wundr Space Route Structure

## Overview
The Wundr Space managed service interface is separated from the main Open Notebook dashboard to avoid authentication conflicts and enable independent deployment.

## Route Architecture

```
/                          → Redirects to /notebooks (default Open Notebook behavior)
/notebooks                 → Main dashboard (requires auth)
/space                     → Wundr Space landing page (public, no auth)
/space/onboard            → Onboarding wizard (public, no auth)
```

## Directory Structure

```
frontend/src/app/
├── (auth)/                      # Authentication routes
│   ├── layout.tsx              # Auth layout with ConnectionGuard
│   └── login/
│       └── page.tsx
│
├── (dashboard)/                 # Protected dashboard routes
│   ├── layout.tsx              # Dashboard layout with auth checks
│   ├── notebooks/
│   ├── sources/
│   └── ... (all protected routes)
│
├── (public)/                    # Public routes (no auth required)
│   ├── layout.tsx              # Simple public layout
│   └── space/
│       ├── page.tsx            # Landing page
│       └── onboard/
│           └── page.tsx        # Onboarding wizard (Phase 2)
│
├── layout.tsx                   # Root layout
└── page.tsx                     # Root redirect
```

## Key Features

### Landing Page (`/space`)
- **Public Access**: No API connection or authentication required
- **Wundr Space Branding**: Full branding with Knowledge Ops messaging
- **Value Propositions**: Privacy by Design, Complete Control, Ready in Minutes
- **Professional Services Links**: Wundr Map & Wundr AI Lab
- **CTAs**: Multiple calls-to-action leading to onboarding

### Onboarding (`/space/onboard`)
- **Phase 2 Placeholder**: Currently shows what's coming
- **Future Implementation**: Multi-step wizard for instance provisioning

## Development

### Running Locally
```bash
cd frontend
npm install
npm run dev
```

Access:
- Landing page: http://localhost:3000/space
- Onboarding: http://localhost:3000/space/onboard
- Dashboard: http://localhost:3000/notebooks

### Testing
```bash
# Build to verify
npm run build

# The build should show both routes:
# ○ /space
# ○ /space/onboard
```

## Deployment Strategy

### Current (Monolithic)
Both public and protected routes deployed together in single Next.js app.

### Future Option (Microservices)
The `(public)` route group can be extracted into a separate Next.js app:
```bash
frontend/          # Dashboard app
frontend-public/   # Landing + onboarding
```

This enables:
- Independent scaling
- Separate domains (e.g., wundr.space vs app.wundr.space)
- Different deployment cadences

## Phase 2 Implementation

When building the onboarding wizard in Phase 2:

1. **Work in**: `frontend/src/app/(public)/space/onboard/page.tsx`
2. **No auth conflicts**: Public layout ensures no authentication required
3. **API integration**: Will call backend provisioning endpoints
4. **State management**: Use React Hook Form + Zustand for wizard state

## Middleware

The `frontend/src/middleware.ts` file is minimal - it doesn't redirect or enforce auth. All routing logic is handled by Next.js app router and individual layouts.

## Notes

- Root (`/`) redirects to `/notebooks` to maintain existing Open Notebook behavior
- Users can still access dashboard directly via `/notebooks`
- Landing page is completely isolated from auth system
- Easy to add more public routes under `(public)/` if needed
