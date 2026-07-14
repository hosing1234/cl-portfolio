# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static, zero-dependency portfolio website** (vanilla HTML/CSS/JS). There is no package manager, no build step, no linter, and no automated test suite. See `README.md` for the content authoring workflow (Markdown → JSON → site).

### Running the site (development)

The page uses `fetch('data/portfolio.json')`, so opening `index.html` via `file://` fails on CORS. It must be served over HTTP from the repo root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. (Node's `npx serve .` also works.) There is no hot reload — edit files and refresh the browser.

### Notes / gotchas

- If the page shows "Failed to load portfolio", the cause is almost always invalid `data/portfolio.json` (or `data/master/*.json`). Validate with `python3 -c "import json; json.load(open('data/portfolio.json'))"`.
- There are no dependencies to install; the update script is intentionally a no-op runtime check.
- Deployment is automatic via GitHub Pages on push to `main` (`.github/workflows/deploy.yml`); it uploads the repo root as-is with no build.
