+++
title = "Getting Started"
description = "Install the theme and render a first page."
weight = 10

[extra]
lead = "Install the theme and render a first page with the printed-catalog layout."
toc = true
top = true
+++

## Overview

This theme keeps Zola's static output and adds a documentation layout, a blog layout, and a small set of reusable content components.

It uses Tera 2 components, so content can call cards, tabs, and callouts directly.

## Install

Copy the theme into your site's `themes` directory, or use it as the site itself.

```sh
zola build
```

Set `theme = "white-canvas"` in your site configuration when the theme lives under `themes/`.

## Next Steps

Open [Why This Theme](/docs/introduction/why-this-theme/) to see the design goals, or browse the source to inspect the templates.
