+++
title = "Components"
description = "Cards, tabs, callouts, and labeled code blocks."
weight = 30

[extra]
lead = "Use Tera components in Markdown to build the recurring documentation pieces."
toc = true
+++

## Cards

Cards link to related pages.

{% <ui.cards> %}
{{<ui.card title="Getting Started" to="/docs/introduction/getting-started/" description="Install the theme and render a first page." />}}
{{<ui.card title="Why This Theme" to="/docs/introduction/why-this-theme/" description="Read the design goals behind the printed surface." />}}
{% </ui.cards> %}

## Tabs

Tabs keep equivalent instructions together. Every panel remains in the document without JavaScript.

{% <ui.tabs> %}
{% <ui.tab title="Zola"> %}
Build the site with Zola's built-in command.

```sh
zola build
```
{% </ui.tab> %}
{% <ui.tab title="Serve"> %}
Preview the site while editing.

```sh
zola serve
```
{% </ui.tab> %}
{% </ui.tabs> %}

## Callouts

Callouts label a short note.

{% <ui.callout tone="tip"> %}
Tera components run before Markdown is parsed, so a component body can contain fenced code, lists, and tables.
{% </ui.callout> %}

## Code Blocks

Use `ui.code_file` when a fence needs a filename label.

{% <ui.code_file title="zola.toml"> %}
```toml
title = "My Site"
build_search_index = true
```
{% </ui.code_file> %}
