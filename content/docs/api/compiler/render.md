+++
title = "render"
description = "Render a documentation page."
weight = 10

[extra]
lead = "Render a documentation page from Markdown and frontmatter."
toc = true
+++

## Signature

```ts
function render(source: string, options?: render.Options): render.ReturnType
```

## Parameters

### `source`

The Markdown source for one page.

### `options`

Options for the render pass.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `idPrefix` | `string` | `""` | Prefix for generated element IDs |
| `maxWidth` | `number` | `0` | Maximum content width |

## Return Type

`render.ReturnType` contains the compiled HTML and the page metadata.

```ts
const { html } = render("# Hello")
```

## Errors

The function throws a `RenderError` when the source is invalid. The error includes the line and column of the failure.
