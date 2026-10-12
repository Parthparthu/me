# Deployment Architecture and GitHub Pages Guide

This document clarifies the GitHub Pages hosting setup, root URL handling, environment variables, and static routing architecture for this portfolio.

---

## 1. Current Live Hosting Architecture

The portfolio is hosted as a GitHub Pages Project Site under the repository:
- **Repository Name**: `Parthparthu/me`
- **Live Canonical URL**: `https://parthparthu.github.io/me/`
- **Base Path**: `/me`

### Why `https://parthparthu.github.io/` Returned 404

On GitHub Pages, a user site at the root domain (`https://<username>.github.io/`) requires a repository named exactly `<username>.github.io`.
Because this repository is named `me`, GitHub Pages automatically maps it to `https://<username>.github.io/<repository-name>/` (which is `https://parthparthu.github.io/me/`). Accessing the bare username root (`https://parthparthu.github.io/`) returns a 404 from GitHub's edge routers unless a dedicated root repository exists.

---

## 2. Two Deployment Options for the User

Depending on how you want visitors to access your portfolio, you have two clean paths forward:

### Option A: Maintain Project Site at `/me` (Current Default)

Keep the repository named `me`. The portfolio is served at:
`https://parthparthu.github.io/me/`

- **GitHub Actions Configuration**:
  The workflow `.github/workflows/deploy.yml` sets:
  ```yaml
  NEXT_PUBLIC_BASE_PATH: ${{ vars.NEXT_PUBLIC_BASE_PATH || '/me' }}
  NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL || 'https://parthparthu.github.io/me' }}
  ```
- **Root URL Redirect**:
  If you want requests to `https://parthparthu.github.io/` to redirect automatically to `https://parthparthu.github.io/me/`, create a lightweight public repository named `parthparthu.github.io` on GitHub and commit the contents of `docs/root-redirect/` (`index.html` and `404.html`) to its `main` branch.

### Option B: Host Directly at Root (`https://parthparthu.github.io/`)

To serve the portfolio directly at the apex user domain without the `/me` subpath:
1. Rename the repository on GitHub from `me` to `parthparthu.github.io` (via GitHub Settings -> General -> Repository name).
2. Set repository variables or GitHub Secrets in GitHub Settings:
   - `NEXT_PUBLIC_BASE_PATH`: `""` (empty string)
   - `NEXT_PUBLIC_SITE_URL`: `"https://parthparthu.github.io"`
3. Push or re-run the deployment workflow. The site will publish directly to the root.

---

## 3. Environment Variables Reference

| Variable | Default in CI | Purpose |
|:---|:---|:---|
| `NEXT_PUBLIC_BASE_PATH` | `'/me'` | Prefixes static assets, script chunks, CSS stylesheets, and client routes for subpath hosting. |
| `NEXT_PUBLIC_SITE_URL` | `'https://parthparthu.github.io/me'` | Used in canonical tags, Open Graph tags, sitemap generation, and Twitter card metadata. |
| `NEXT_PUBLIC_FORMSPREE_ID` | `""` | Optional Formspree endpoint ID for client-side contact inquiries. |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | `""` | Optional Web3Forms API key for client-side contact inquiries. |
| `CONTACT_EMAIL` | `'pradyumna05@outlook.in'` | Direct recipient address used for client submissions and fallback mailto links. |

---

## 4. Static Export & Client-Side Routing

The portfolio builds via Next.js static HTML export (`output: 'export'`):
- **Trailing Slashes**: `trailingSlash: true` is configured in `next.config.ts`. Every route generates a directory with an `index.html` file (for example `out/projects/index.html` and `out/privacy/index.html`). This ensures compatibility with static web servers without requiring server-side URL rewriting rules.
- **NoJekyll Flag**: An empty `.nojekyll` file is added to `out/` during the CI build to prevent GitHub Pages from processing asset paths through Jekyll, ensuring folders starting with underscores (such as `_next/`) are served properly.
- **404 Handling**: A custom `404.html` is generated at build time in `out/404.html`. GitHub Pages automatically serves this file when a requested path is not found.
