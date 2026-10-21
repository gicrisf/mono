# white canvas

A clean, neutral starting point for a [Zola](https://www.getzola.org/) theme.

## requirements

- Zola 0.23 or newer
- No JavaScript build step

## quick start

```sh
npm run serve     # zola serve
npm run build     # zola build
npm run check     # zola check
```

Edit `zola.toml` first:

```toml
base_url = "https://example.com"
title = "My site"
description = "What this site is about."

[extra]
author = "Your Name"
logo_text = "my site"
main_menu = [
  {url = "/about/", name = "about"},
  {url = "/contact/", name = "contact"},
]
```

Then replace the demo content in `content/` and the styles in `sass/`.

## what is included

```
templates/
  index.html              base template with overridable blocks
  page.html               article template
  section.html            section template
  404.html                not-found page
  tags/, categories/      taxonomy templates
  partials/               head, header, list, article, post meta, covers,
                          pagination, search, theme switcher, comments
  components/             Tera components: toc, youtube, twitter/x
  snippets/               editable support/follow/newsletter blocks
sass/
  _tokens.scss            color, type, spacing, and width tokens
  _main.scss              reset and base content styles
  _header.scss            header, menu, responsive navigation
  _post.scss              article and list styles
  _pagination.scss        pagination styles
  _footer.scss            footer styles
  _search.scss, _toc.scss, _buttons.scss, _after_page.scss
static/assets/
  js/menu.js              mobile menu and submenu behavior
  js/search.js            elasticlunr results rendering
  katex/                  KaTeX assets
  js/lunr-languages/      search stemmers
```

## component map

The partial and component boundaries are the API. Replace one without touching
the rest of the templates:

| Component | File |
| --- | --- |
| Head, SEO, feeds, KaTeX | `templates/partials/head.html` |
| Header, tools, menu | `templates/partials/header.html` |
| Post list | `templates/partials/list.html` |
| Article | `templates/partials/article.html` |
| Post metadata, tags, translations | `templates/partials/post_meta.html` |
| Cover images | `templates/partials/cover.html` |
| Pagination | `templates/partials/pagination.html`, `pagination_page.html` |
| Search | `templates/partials/header.html`, `search_script.html` |
| Theme switcher | `templates/partials/theme_init.html`, `theme_script.html` |
| Comments | `templates/partials/comments.html` |
| Table of contents | `templates/components/toc.html` |
| YouTube / Twitter | `templates/components/` |
| Support / follow / newsletter | `templates/snippets/` |

`templates/index.html` exposes blocks for `title`, `main`, `pagination`,
`copyright`, and `script`. Add site-wide header markup in
`templates/partials/extended_header.html` and footer markup in
`templates/partials/extended_footer.html`.

Zola 0.23 uses Tera 2, where macros were replaced by components. The baseline
uses includes for context-aware layout fragments and components for
parameterized pieces such as the table of contents and shortcodes.

## styling

- Defaults are light: white background, neutral text, system fonts.
- `sass/_tokens.scss` holds all design tokens. Override them there or in a
  `static/custom.css` file referenced by `custom_css`.
- A matching dark token set is included under `[data-theme="dark"]`.
- No web fonts are required. Replace `--font-sans` / `--font-mono` to change
  typography.
- Code highlighting uses Zola's Giallo themes in CSS-class mode. The generated
  `giallo-light.css` / `giallo-dark.css` files are linked from `head::styling`.

## optional features

All optional integrations are off by default, except KaTeX (the demo includes a
math page). Enable them in `[extra]`:

```toml
theme_switcher = true       # light/dark toggle; remembers the choice
ddg_search = true           # DuckDuckGo form in the header
enable_katex = true         # pages opt in with math = true
support_us = true           # post-page snippet
follow_me = true            # post-page snippet
url_to_clipboard = true     # copy-page-URL block
newsletter = true           # newsletter snippet
post_view_navigation = true # previous/next post links
show_author = false         # show author in post metadata
show_categories = true      # show categories in post metadata
show_tags = true            # show tags in post metadata
show_covers_in_lists = true # show cover images in lists
```

### search

Set `build_search_index = true` in `zola.toml`. The baseline includes the
elasticlunr client and the search UI. For a non-English site, set
`default_language`; the matching Lunr stemmer is loaded automatically.

### DuckDuckGo

Set `ddg_search = true`. This renders a plain form and does not require
JavaScript.

### shortcodes

Zola 0.23 shortcodes are Tera components. Call them from Markdown with the
component syntax:

```markdown
{{<youtube id="9Gj47G2e1Jc" />}}
{{<twitter id="1085870671291310081" />}}
```

### table of contents

Enable globally with `ToC = true` in `[extra]`, or per page with:

```toml
[extra]
ToC = true
```

### comments

```toml
[extra]
disqus = { enabled = true, short_name = "your-short-name" }
```

### support / follow / newsletter

Enable the relevant flag and edit the matching file in `templates/snippets/`.

MIT licensed. See `LICENSE.md`.
