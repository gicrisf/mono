# Mermaid Diagrams with Ondine — Future Analysis

Status: idea, not implemented.
Date: 2026-10-25

This document captures the research and implementation options for adding Mermaid diagram support to mono. The recommended approach is Ondine's in-browser WebAssembly compiler with per-page opt-in, mirroring the KaTeX integration.

## Context

Mono currently supports:

- KaTeX, vendored locally and loaded only on pages with `[extra] math = true`.
- Fenced code blocks with language labels and copy buttons.
- A static-first build with no JavaScript build step.
- Monochrome print styling using design tokens.

Mermaid should follow the same model:

- Author diagrams in fenced ` ```mermaid ` blocks.
- Load the diagram engine only on opted-in pages.
- Keep the raw source visible when JavaScript or the engine fails.
- Theme diagrams with mono's color and font tokens.

## Research Summary

Ondine is a fast, small diagram engine for Mermaid syntax, written in Rust and compiled to WebAssembly.

- Package: `ondine@0.0.3`
- Repository: `https://github.com/wevm/ondine`
- License: MIT
- Syntax target: Mermaid 12.1.0
- Output: monochrome SVG with CSS custom properties for theming
- Browser compiler entry: `ondine/compiler/wasm`
- Runtime mounting entry: `ondine` (`mount` only; no compiler)

Ondine's design differs from Mermaid.js:

- Mermaid.js parses, measures text with the DOM, and lays out diagrams in the browser.
- Ondine compiles Mermaid source to SVG. It can do this at build time, in Node, in a Worker, or in the browser via WebAssembly.
- Monochrome SVG and CSS-variable theming fit mono's printed-catalog style better than Mermaid.js's default themes.

### Browser compiler assets

The browser compiler needs a small JavaScript module tree and one WASM module:

- `dist/compiler/wasm.js` — exports `create` and `RenderError`
- `dist/Render.js` — renderer implementation
- `dist/internal/Wasm.js` — WASM instantiation and result decoding
- `dist/internal/all.generated.wasm` — size-optimized module for every diagram type
- `LICENSE`

Sizes:

- `all.generated.wasm`: about 1.48 MB raw, roughly 630 KB gzip
- JavaScript glue: about 8 KB total
- There is also a faster `all.fast.generated.wasm` at about 3.68 MB; use the size-optimized module by default.

The module paths matter. `compiler/wasm.js` imports `../Render.js`, and `Render.js` imports `./internal/Wasm.js`. Vendored files must preserve that structure.

### Browser usage

```js
import { create } from '/assets/ondine/compiler/wasm.js'

const wasm = await WebAssembly.compileStreaming(fetch('/assets/ondine/all.wasm'))
const renderer = create({ modules: { all: wasm } })
const result = renderer.render('flowchart LR\n  A --> B', {
  maxWidth: 760,
  fontSize: 16,
  responsive: true,
  idPrefix: 'mermaid-0',
})
```

`result` contains `svg`, `type`, `width`, `height`, and `links`.

`render` options include:

- `autoDirection`
- `directionBreakpoint`
- `fontSize`
- `idPrefix`
- `limit`
- `maxEdges`
- `maxWidth`
- `now`
- `outputLimit`
- `padding`
- `responsive`

`RenderError` includes `code`, `line`, `column`, `snippet`, and `type`.

### Theming

Ondine reads CSS custom properties from the root SVG or an ancestor:

- `--ondine-bg`
- `--ondine-fg`
- `--ondine-line`
- `--ondine-border`
- `--ondine-muted`
- `--ondine-surface`
- `--ondine-surface-alt`
- `--ondine-accent`
- `--ondine-critical`
- `--ondine-series-1` through `--ondine-series-8`
- `--ondine-font`
- `--ondine-stroke`
- `--ondine-radius`
- `--ondine-title-weight`
- `--ondine-heading-weight`
- `--ondine-bold-weight`

The output SVG has classes `ondine` and `ondine-<type>`.

## Recommended Architecture

### 1. Per-page opt-in

Use the same pattern as math:

```toml
[extra]
mermaid = true
```

No global config switch.

Pages without the flag load no Ondine JavaScript or WASM.

### 2. Vendor Ondine assets

Add under `static/assets/ondine/`:

```text
static/assets/ondine/
  compiler/wasm.js
  Render.js
  internal/Wasm.js
  all.wasm
  LICENSE
```

Vendor from `ondine@0.0.3`. Rename `all.generated.wasm` to `all.wasm` for clarity. Keep the JS files in their relative structure.

The theme's existing `static/assets/katex/` provides a precedent for vendoring a local JS/CSS/font dependency.

### 3. Conditional script loading

In `templates/partials/scripts.html`, after the regular scripts:

```html
{% if page is defined and page.extra.mermaid | default(value=false) %}
<script
  defer
  src="{{ get_url(path='assets/js/mermaid.js', cachebust=true) }}"
  data-ondine-module="{{ get_url(path='assets/ondine/compiler/wasm.js', cachebust=true) }}"
  data-ondine-wasm="{{ get_url(path='assets/ondine/all.wasm', cachebust=true) }}"
></script>
{% endif %}
```

The script is a classic deferred script. It uses dynamic `import()` to load the Ondine ESM module.

No additional stylesheet is needed in `head.html`; diagram styles live in the main theme stylesheet.

### 4. `static/assets/js/mermaid.js`

The script should:

1. Find Mermaid code blocks:
   - `pre[data-lang="mermaid"]`
   - `pre > code[data-lang="mermaid"]`
   - `pre > code.language-mermaid` as a fallback
2. Return immediately if there are none, so the WASM is never fetched unnecessarily.
3. Read `data-ondine-module` and `data-ondine-wasm` from `document.currentScript` or a script selector.
4. Dynamically import the Ondine module.
5. Fetch and compile the WASM:
   - Prefer `WebAssembly.compileStreaming(fetch(url))`.
   - Fall back to fetching an `ArrayBuffer` and `WebAssembly.compile(...)` if streaming or MIME handling fails.
6. Create one renderer with `create({ modules: { all: module } })`.
7. For each Mermaid block:
   - Extract `code.textContent` as the source.
   - Render with `maxWidth` from the containing article width, `fontSize: 16`, `responsive: true`, and a unique `idPrefix`.
   - Create `<figure class="mermaid-diagram">` containing the returned SVG and a visually hidden `<figcaption>` using the detected diagram type.
   - Remove the existing `.code-block` wrapper from `code.js` if present; otherwise replace the `<pre>`.
   - Preserve the original code block if compilation fails.
8. On `RenderError`, replace the block with a `.mermaid-error` box containing the error message, line/column, and the original source.
9. On module or WASM load failure, leave the source code blocks untouched.

No-JS behavior: the original fenced code block remains visible.

### 5. Diagram styles

Create `sass/_mermaid.scss` and import it from `style.scss`:

```scss
.ondine {
  --ondine-bg: var(--color-paper);
  --ondine-fg: var(--color-ink);
  --ondine-muted: var(--color-muted);
  --ondine-font: var(--font-mono);
  --ondine-stroke: 1.5px;
  --ondine-radius: 0;
}

.mermaid-diagram {
  border: 1px solid var(--color-rule);
  box-shadow: var(--shadow-hard);
  margin-block: var(--space-lg);
  overflow-x: auto;
  padding: var(--space-md);

  svg {
    display: block;
    height: auto;
    margin-inline: auto;
    max-width: 100%;
  }

  figcaption {
    // visually hidden, or a visible caption if added later
  }
}

.mermaid-error {
  border: 1px solid var(--color-signal);
  color: var(--color-signal);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  margin-block: var(--space-lg);
  padding: var(--space-md);
  white-space: pre-wrap;
}
```

The wrapper uses mono's paper, rule, hard-shadow, and monospace tokens.

Wide diagrams use Ondine's `autoDirection` and responsive layout, with the wrapper as an overflow fallback.

### 6. Docs guide

Add `content/docs/guides/mermaid.md`:

- `weight = 40` after Math.
- `[extra] mermaid = true`
- `[extra] toc = true`
- Live flowchart and sequence diagram examples.
- A fenced source example using a `markdown` code block.
- Notes:
  - Ondine compiler and version.
  - Pages must opt in.
  - Search indexes and feeds keep the raw Mermaid source.
  - No-JS fallback keeps the source block.
  - Diagrams are styled with mono tokens.

Update `content/docs/guides/_index.md` body to mention diagrams.

### 7. README

Add a Mermaid section covering:

- `[extra] mermaid = true`
- Fenced ` ```mermaid ` syntax
- Ondine 0.0.3, MIT license
- Per-page loading; no build step
- The 1.48 MB WASM module (roughly 630 KB gzip)
- Theming with `--ondine-*` variables
- Search/feed raw source
- No-JS fallback

Update the Files list:

```text
static/
  assets/js/              progressive enhancement scripts
  assets/katex/           KaTeX 0.19.1 styles, scripts, and fonts
  assets/ondine/          Ondine 0.0.3 Mermaid compiler and WASM
```

Remove “Diagrams” from the README's “not part of this theme” note.

## Verification When Implemented

- `npm run check`, `npm run build`.
- Confirm the Ondine script tag appears only on the Mermaid guide.
- Confirm the WASM and JS module are copied to `public/assets/ondine/`.
- Verify flowchart and sequence diagrams render with mono colors and fonts.
- Test a wide diagram at desktop and mobile widths.
- Test an invalid diagram and confirm the error box includes message and source.
- Confirm pages without `mermaid = true` load no Ondine assets.
- Confirm no-JS shows the original source blocks.
- Confirm the `code.js` copy button and label are removed for rendered diagrams.
- Commit as `add mermaid diagrams with ondine`.

## Alternatives Considered

### Ondine build-time SVG

Use `npx ondine` or the Node compiler to render Mermaid to SVG during the build.

Advantages:

- No client-side compiler or WASM.
- Fastest pages.
- Broken diagrams fail the build.

Disadvantages:

- Requires a prebuild step outside Zola.
- Requires a content workflow for precompiled SVG files or rewritten Markdown fences.
- Breaks the theme's “no JavaScript build step” promise.

### Mermaid.js client-side

Load Mermaid.js on opted-in pages and render fenced blocks in the browser.

Advantages:

- Familiar Mermaid integration.
- All rendering happens client-side with no build step.

Disadvantages:

- Much larger runtime.
- DOM measurement and runtime layout.
- Default themes do not match mono's monochrome print style.
- More work to theme consistently.

### Ondine image Worker

Link diagrams as SVG images from `https://ondine.sh`.

Advantages:

- No local compiler or WASM.
- Very small pages.

Disadvantages:

- External service dependency.
- No offline support.
- Images cannot read the page's CSS variables, reducing theme control.

## Risks and Open Questions

- Ondine 0.0.3 is pre-1.0. The API and asset paths may change. Pin the version and vendor assets.
- The browser compiler WASM is about 1.48 MB raw. It loads only on opted-in pages, but that is still a noticeable download.
- Client-side compilation takes time after page load. The source block remains visible until rendering completes.
- WASM MIME handling varies by host. Keep the `ArrayBuffer` fallback.
- Search and feeds contain raw Mermaid source unless separately customized.
- Theming depends on Ondine's CSS custom properties; verify all diagram types respect them.
- Accessibility depends on the generated SVG and the wrapper caption; verify keyboard and screen-reader behavior.
- The `mermaid.js` script must preserve the no-JS fallback and avoid loading the WASM on pages without diagrams.

## Open Decisions

1. Integration engine:
   - Ondine in-browser WASM (recommended)
   - Ondine build-time SVG
   - Mermaid.js client-side
   - Ondine image Worker

2. Documentation:
   - Add a Mermaid guide page (recommended)
   - Verify with temporary content only

3. If the in-browser WASM approach is chosen, decide whether to use the size-optimized `all.wasm` (recommended) or the faster, larger `all.fast.wasm`.
