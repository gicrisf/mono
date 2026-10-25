+++
title = "mount"
description = "Insert precompiled output into an element."
weight = 10

[extra]
lead = "Insert precompiled output into an element without a client-side compiler."
toc = true
+++

## Signature

```ts
function mount(element: Element, output: mount.Output): void
```

## Parameters

### `element`

The target element. The operation replaces its children.

### `output`

The compiled output, including its markup and dimensions.

## Return Type

`mount` returns `void`. It emits no client-side runtime and starts no background work.

{% <ui.callout tone="important"> %}
`mount` accepts trusted output only. Escape authored strings before they reach the page.
{% </ui.callout> %}
