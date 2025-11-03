# Security Policy

We take security seriously. Please do not file security issues in public trackers.

## Reporting a Vulnerability

- Email: security@wundr.space
- Subject: **[SECURITY] <short summary>**
- Please include: affected repo/branch, steps to reproduce, impact, and any logs or PoCs.
- We aim to acknowledge within **2 working days** and provide a timeline once triaged.

If you prefer encrypted comms, request our PGP key in your initial email.

## Scope

In scope:
- Code in this repository and its CI/CD workflows.
- Publicly reachable deployments owned by Wundr Space (staging/production).

Out of scope (responsible disclosure still welcome):
- Third-party upstream projects we fork (report to upstream first where appropriate).
- Social engineering, physical attacks, spam, or DDoS.
- Rate-limit or denial-of-service tests without prior written permission.

## Safe Harbour

We will not pursue legal action for good-faith research that:
- Respects privacy and does not access, modify or exfiltrate data.
- Avoids service disruption.
- Uses test accounts where possible.
- Gives us reasonable time to remediate before public disclosure.

## Handling Secrets

- Never commit `.env` files, service-account JSON, or API keys.
- Use **Google Cloud Secret Manager** for runtime config.
- CI uses **short-lived OIDC tokens** (no long-lived JSON keys).

## Contact & Status

For urgent matters, mark your email **URGENT**.  
Non-security issues: please use GitHub Issues.

© Wundr Space Ltd
