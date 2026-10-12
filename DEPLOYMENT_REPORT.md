# Deployment Report: GitHub Pages Root Deployment

**Date:** 2026-10-13  
**Status:** Resolved & Verified  
**Target URL:** https://parthparthu.github.io/  

---

## 1. Root Cause Analysis of Previous 404
1. **GitHub Pages Repository Naming Requirement**:
   - For a personal/user site on GitHub Pages to be served directly from the root domain (`https://<username>.github.io/`), the repository **must be named exactly** `<username>.github.io`.
   - The repository was previously named `me` (`https://github.com/Parthparthu/me`). Consequently, GitHub Pages published the site to `https://parthparthu.github.io/me/` (subpath project site), which caused the root URL `https://parthparthu.github.io/` to return an HTTP 404 error.
2. **Serverless API Routes on Static Export**:
   - The repository contained `/api/contact` which cannot execute on GitHub Pages (static HTML/CSS/JS export only). Next.js static export does not support serverless endpoints without a Node runtime.
3. **Missing `.nojekyll`**:
   - By default, GitHub Pages processes files through Jekyll, which ignores directories starting with an underscore (such as `_next/`). A `.nojekyll` file was required to serve Next.js static asset bundles properly.

---

## 2. Actions Executed & Technical Fixes
1. **Repository Renamed via GitHub API**:
   - Executed authenticated API call `PATCH /repos/Parthparthu/me` updating the repository name to `parthparthu.github.io`.
   - Verified GitHub Pages configuration updated `html_url` from `https://parthparthu.github.io/me/` to `https://parthparthu.github.io/`.
   - Updated local git remote to point to `https://github.com/Parthparthu/parthparthu.github.io.git`.
2. **GitHub Actions Workflow (.github/workflows/deploy.yml)**:
   - Configured `NEXT_PUBLIC_BASE_PATH: ''` and `NEXT_PUBLIC_SITE_URL: 'https://parthparthu.github.io'`.
   - Pinned official Pages actions:
     - `actions/configure-pages@v5`
     - `actions/upload-pages-artifact@v3`
     - `actions/deploy-pages@v4`
   - Configured trigger on push to `main` branch with `id-token: write` and `pages: write` permissions.
3. **Static Hosting Compatibility**:
   - Created `public/.nojekyll` to ensure `out/.nojekyll` is copied to GitHub Pages root and Jekyll processing is disabled.
   - Configured `trailingSlash: true` in `next.config.ts` so all routes export with directory-level `index.html` files (e.g. `out/projects/index.html`).
   - Implemented trailing-slash normalization and route recovery in `app/not-found.tsx` to handle direct URL deep linking without server redirects.
   - Updated `app/robots.ts`, `app/sitemap.ts`, and Open Graph metadata in `app/layout.tsx` to use `https://parthparthu.github.io`.
4. **Static Client-Side Contact Form**:
   - Removed serverless route `app/api/contact/route.ts`.
   - Updated `components/sections/ContactSection.tsx` with robust client-side submission:
     - Honeypot anti-spam protection (hidden `contact-honeypot` field; rejects bots silently).
     - Full client-side field validation with inline error messaging and auto-focusing of the first invalid field.
     - Integration with free-tier form providers via environment variables:
       - `NEXT_PUBLIC_FORMSPREE_ID`: Submits to `https://formspree.io/f/{id}`
       - `NEXT_PUBLIC_WEB3FORMS_KEY`: Submits to `https://api.web3forms.com/submit`
     - Built-in graceful fallback: If no API key is configured or network fails, automatically triggers the user's local email client (`mailto:pradyumna05@outlook.in`) with pre-filled subject and body.
     - Accessible polite live-region status alerts for success and error states.
     - Keyboard shortcut: `Cmd/Ctrl + Enter` in message textarea submits the form.
     - Loading button retains label `Send Message` with spinner per design standards.

---

## 3. Verification & Build Output
- `npm run typecheck`: Passed with 0 errors.
- `npm run lint`: Passed with 0 errors or warnings.
- `npm run build`: Successfully generated and exported 21 static pages:
  - `/` (Home page)
  - `/projects/` (All projects directory)
  - `/projects/[slug]` (10 individual project case studies)
  - `/resume/` (Resume page)
  - `/privacy/` (Privacy policy)
  - `/terms/` (Terms of service)
  - `404.html` (Fallback page)
  - `sitemap.xml` & `robots.txt`
  - `.nojekyll` present in `out/`
