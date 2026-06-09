# Contributing to Django Cotton UI

Thanks for helping improve the kit. This guide covers the repo layout, the local dev
setup and the build/release steps.

## Repo layout

```
django_cotton_ui/              # the Python package (this ships on PyPI)
├── templates/cotton/ui/       # component templates (the c-ui.* components)
└── static/cotton-ui/          # BUILT assets — do not edit by hand (see below)
    ├── cotton-ui.css          #   the stylesheet (copied from src/css)
    ├── cotton-ui.js / .esm.js #   the Alpine bundle (built from src/js)
    └── cotton-ui.min.js[.map] #   minified bundle
src/                           # frontend source (NOT shipped)
├── css/cotton-ui.css          # the stylesheet — SOURCE OF TRUTH
├── js/                        # Alpine component source, entry: js/cotton-ui.js
├── build.js                   # esbuild bundler config
└── package.json               # npm scripts
pyproject.toml                 # Poetry project / packaging
```

Two things are easy to get wrong:

- **`django_cotton_ui/static/cotton-ui/` is generated.** Never edit those files directly.
  Edit `src/css/cotton-ui.css` and `src/js/**`, then rebuild (below). The build copies the
  CSS and bundles the JS into the package, and those built files are committed so the wheel
  ships them.
- The package directory is `django_cotton_ui` (underscore); the repo and the distribution
  are `django-cotton-ui` (hyphen).

## Prerequisites

- Python ≥ 3.8 and [Poetry](https://python-poetry.org/)
- Node ≥ 18 and npm
- Familiarity with Tailwind CSS **v4** and Alpine.js v3 (the kit is built on both)

## Python setup

```bash
poetry install
```

## Frontend build

All frontend tooling lives in `src/`.

```bash
cd src
npm install        # first time only
npm run build      # bundle JS + copy CSS into django_cotton_ui/static/cotton-ui/
```

While developing, use the watcher (rebuilds the JS bundle on change; the CSS is plain
CSS so it's just copied):

```bash
npm run watch
```

`npm run build` produces, in `django_cotton_ui/static/cotton-ui/`:

- `cotton-ui.css` — copied verbatim from `src/css/cotton-ui.css`
- `cotton-ui.js` / `cotton-ui.esm.js` — the Alpine component bundle
- `cotton-ui.min.js` (+ `.map`) — minified build
- `manifest.json`

**Commit the rebuilt `static/` files** along with your `src/` changes, the package ships
them.

## Previewing components

The kit has no standalone dev server, you render it from a host project. Two ways:

### Option A — the documentation project (recommended)

The django-cotton docs site serves both the core and UI kit docs with live examples for
every component, and it's already wired for kit development: a Docker Compose stack with a
Django server, Redis and a Tailwind v4 watcher that scans the kit's templates. It
bind-mounts this repo, so your edits show up without reinstalling anything.

1. Check out the core repo (it holds the docs project) **as a sibling of this one**:

   ```
   <parent>/
   ├── django-cotton/        # core repo; docs project lives under docs/
   └── django-cotton-ui/     # this repo
   ```

2. From the core repo, build the image and start the stack:

   ```bash
   docs/docker/bin/build.sh       # add 'mac' on Apple Silicon: build.sh mac
   docs/docker/bin/run-dev.sh     # docker compose up
   ```

3. Open <http://localhost:8002>.

How edits propagate:

- **Templates** under `django_cotton_ui/templates/` are bind-mounted, so they show on
  reload, and the Tailwind watcher recompiles utility classes on save.
- **Built assets**: the docs import the kit's compiled `static/cotton-ui/` (both the CSS and
  the Alpine bundle), so after editing `src/css/**` or `src/js/**`, rerun `npm run build`
  (or `npm run watch`) here to regenerate them.

### Option B — your own Django project

Install the package into any Django project configured with the Tailwind v4 build (scan the
templates with `@source`, import `cotton-ui.css`, load the Alpine bundle), exactly the setup
in the [installation guide](https://django-cotton.com/ui/installation).

## Conventions

The kit is styled with Tailwind v4 and compiles from `@source`-scanned template source, so:

- **No runtime-interpolated arbitrary classes.** A class like `max-w-[{{ var }}]` never
  reaches the compiler. Use a fixed class, a CSS variable (`max-w-[var(--x)]`) or an inline
  `style`.
- **Theme via tokens.** Surfaces, radius, shadows, the focus ring and the accent are all CSS
  variables (see the [theming guide](https://django-cotton.com/ui/theming)). Prefer a token
  over a hardcoded colour so components stay themeable. Structural surfaces use the `box`
  role (`--radius-box`, `--color-box-border`, `--shadow-box`); form controls use `control`.
- **Django comments are single-line.** `{# … #}` must stay on one line, a multi-line one
  leaks into the HTML. Use `{% comment %}…{% endcomment %}` for multi-line notes.
- Keep new components accessible (labels, roles, focus management) and matching the existing
  component API patterns (`c-vars` props, named slots, `{{ attrs }}` passthrough).

## Releasing

1. Bump the version in **both** `pyproject.toml` and `src/package.json` (keep them in sync).
2. `cd src && npm run build`, then commit the rebuilt `static/` assets.
3. Commit and push the version bump.
4. Publish: run the **"Publish to PyPI (manual bump)"** workflow from the GitHub Actions tab
   (`workflow_dispatch`). It builds with Poetry and publishes using the `PYPI_TOKEN` secret.

Pre-1.0 versioning follows the 0.x convention: breaking changes bump the **minor**
(0.1 → 0.2), fixes bump the **patch** (0.1.0 → 0.1.1).
