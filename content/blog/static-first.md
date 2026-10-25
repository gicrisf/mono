+++
title = "Static First, Components Where Needed"
description = "The theme keeps Zola's static output and adds interaction only where it helps."
date = 2026-10-20
[taxonomies]
tags = ["zola", "components"]
categories = ["Zola"]
+++

The site builds with Zola alone. Sass compiles, Markdown renders, and search uses the index Zola already generates. No JavaScript build step is required.

## Components in Content

Cards, tabs, callouts, and labeled code blocks are Tera components. A page calls them in Markdown, and the component body still parses as Markdown.

{% raw %}
```markdown
{% <ui.callout tone="tip"> %}
The callout body can contain **Markdown**.
{% </ui.callout> %}
```
{% endraw %}

## Progressive Interaction

Tabs and code copy buttons are progressive enhancements. Without JavaScript, every tab panel remains visible and every code block remains readable.

## Search

Search loads Zola's elasticlunr index on demand. The trigger opens a panel from the navigation or from the keyboard. The index covers pages and sections without a separate service.
