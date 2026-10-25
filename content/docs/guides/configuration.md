+++
title = "Configuration"
description = "Set the site title, menu, footer, search, and page actions."
weight = 10

[extra]
lead = "Set the site metadata and optional behavior in zola.toml."
toc = true
+++

## Overview

Theme behavior lives in `zola.toml` under `[extra]`. The menu and footer accept ordinary Zola values, so a consuming site can change them without editing templates.

```toml
[extra]
logo_text = "mono"
logo_home_link = "/"
github_url = "https://github.com/gicrisf/mono"

main_menu = [
  {url = "/docs/", name = "Docs", section = "docs"},
  {url = "/blog/", name = "Blog", section = "blog"},
]
```

The `section` value marks the current navigation entry. It must match the start of the page path.

## Search

Zola builds the search index when `build_search_index` is true. The theme renders the index in a small panel that opens from the navigation or the keyboard.

```toml
build_search_index = true
```

## Page Actions

Set `edit_page` to show an edit link on documentation pages. The link uses `docs_repo` and `repo_branch`.

{% <ui.callout tone="note"> %}
Leave `edit_page` disabled when the content is not stored in a public repository.
{% </ui.callout> %}

## Footer

The footer accepts HTML for a license or project link.

```toml
[extra]
copyright = 'mono · <a href="https://github.com/gicrisf/mono/blob/main/LICENSE">MIT License</a>'
```
