+++
title = "Theming"
description = "Change the palette, font stacks, spacing, and shadows."
weight = 20

[extra]
lead = "Change the palette, font stacks, spacing, and shadows in the Sass tokens."
toc = true
+++

## Overview

All design tokens are CSS custom properties in `sass/_tokens.scss`. The layout reads them through `var()`, so a consuming site can override them in `static/custom.css`.

| Token | Default | Use |
| --- | --- | --- |
| `--color-desk` | `#ececec` | Area around the sheet |
| `--color-paper` | `#ffffff` | Sheet and controls |
| `--color-ink` | `#000000` | Text, rules, and shadows |
| `--color-link` | `#0047ab` | Links and focus |
| `--color-chip` | `#fff3a8` | Labels and highlights |

## Override the Palette

Import a custom stylesheet from the site configuration, then override the properties on `:root`.

{% <ui.code_file title="static/custom.css"> %}
```css
:root {
  --color-desk: #f4f1e8;
  --color-paper: #fffdf6;
  --color-accent: #0047ab;
}
```
{% </ui.code_file> %}

```toml
[extra]
custom_css = "custom.css"
```

## Typography

The theme ships IBM Plex Mono as the fallback monospace face. Change `--font-mono` to use another monospace font, or `--font-sans` to use a different sans-serif stack.

{% <ui.callout tone="warning"> %}
The diagram font and the page font are separate concerns. A consuming site can set `--ondine-font` when it adds diagrams later.
{% </ui.callout> %}

## Spacing

Spacing tokens use the `--space-*` names. The hard shadows use `--shadow-hard` and `--shadow-sheet`.
