# mono

A documentation and blog theme for [Zola](https://www.getzola.org/), styled as a printed catalog. The layout is inspired by the Ondine documentation site, with a paper sheet, boxed navigation, dotted rules, hard shadows, and monospace labels.

## Requirements

- Zola 0.23 or newer
- No JavaScript build step

## Quick Start

```sh
npm run serve     # zola serve
npm run build     # zola build
npm run check     # zola check
```

## Install as a Theme

Place this repository under your site's `themes` directory.

```sh
git clone <theme-url> themes/mono
```

Set the theme in your site's `zola.toml`.

```toml
theme = "mono"
```

Copy the `[extra]` values from this repository's `zola.toml`, then change the title, menu, and footer for your site.

## Configuration

Theme behavior lives under `[extra]`.

```toml
[extra]
logo_text = "mono"
logo_home_link = "/"
github_url = "https://github.com/gicrisf/mono"
docs_section = "docs"

main_menu = [
  {url = "/docs/", name = "Docs", section = "docs"},
  {url = "/blog/", name = "Blog", section = "blog"},
]

edit_page = false
docs_repo = "https://github.com/gicrisf/mono"
repo_branch = "main"

copyright = 'mono · <a href="https://github.com/gicrisf/mono/blob/main/LICENSE">MIT License</a>'
```

The optional `section` value on a menu entry marks the entry as current when `current_path` starts with the entry URL. If it is omitted, the entry is never marked as current.

Set `edit_page = true` to show an edit link on documentation pages. The link uses `docs_repo` and `repo_branch`.

Enable Zola's search index in the site configuration.

```toml
build_search_index = true
```

## Documentation Content

A documentation section sets `template` and `page_template` in its `_index.md`.

```toml
+++
title = "Docs"
description = "Install, configure, and build with the theme."
template = "docs/section.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 1
+++
```

Nest sections for grouped navigation. The sidebar renders each subsection as a group and each nested subsection as a collapsible topic.

Documentation pages use these optional values.

| Value | Purpose |
| --- | --- |
| `weight` | Sidebar and pager order within the section |
| `[extra] lead` | Article subtitle, rendered as HTML |
| `[extra] toc` | Show the outline. Defaults to true |
| `[extra] top` | Mark the first page and suppress its previous link |

The previous and next pager crosses section and subsection boundaries.

## Blog Content

A blog section sets the list template, article template, date sorting, and page size.

```toml
+++
title = "Blog"
description = "Short notes about the theme."
template = "blog/section.html"
page_template = "blog/page.html"
sort_by = "date"
paginate_by = 5
+++
```

Posts use Zola's `date`, `description`, and `taxonomies` values. Tags render with a `#` prefix; categories render as `{Category}` links in the list and article footer. The tags and categories indexes use the same cards as the home page. Tag term pages use a `tags ∋ #tag (N posts)` heading. Both taxonomies link to their taxonomy pages and breadcrumbs.

Posts also support Zola's optional `authors` and `updated` values. When present, the post kicker shows the authors and updated date, and the document head adds author and `article:modified_time` metadata. When absent, nothing changes.

```toml
+++
title = "Example Post"
date = 2026-10-22
updated = 2026-10-24
authors = ["Your Name"]
+++
```

Long posts can opt into a table of contents with `toc = true` under `[extra]`. On wide screens it sits in a sticky left column beside the article; at `860px` and below it becomes a collapsed “On This Page” disclosure above the post header, matching the documentation navigation sidebar. It is off by default for blog posts, while the documentation outline remains on by default.

```toml
+++
title = "A Long Post"
[extra]
toc = true
+++
```

## Breadcrumbs

Content templates call the `breadcrumb.trail` component. The trail starts at Home and ends with the current title. Pages and sections pass their section ancestors and the site base URL.

```jinja2
{{<breadcrumb.trail title={page.title} ancestors={page.ancestors} base_url={config.base_url} />}}
```

Taxonomy templates pass an optional parent label and URL. List pages omit both and pass an empty ancestor list.

```jinja2
{% set tag_taxonomy = get_taxonomy(kind="tags") %}
{% set tag_title = "#" ~ term.name %}
{{<breadcrumb.trail title={tag_title} ancestors={[]} base_url={config.base_url} parent_label="Tags" parent_url={tag_taxonomy.permalink} />}}
```

## Footnotes

Footnotes use Zola's Markdown syntax and require `bottom_footnotes = true` under `[markdown]`.

```toml
[markdown]
bottom_footnotes = true
```

```markdown
A note.[^1]

[^1]: The footnote text.
```

Zola renders the notes at the end of the article with back-references. The theme styles the note section and also handles the default inline `.footnote-definition` output if `bottom_footnotes` is left false. The Math guide includes a live example.

## Components

Components are Tera 2 components. Zola renders them before it parses Markdown, so component bodies can contain Markdown, lists, tables, and fenced code.

### Cards

```markdown
{% <ui.cards> %}
{{<ui.card title="Getting Started" to="/docs/introduction/getting-started/" description="Install the theme and render a first page." />}}
{{<ui.card title="Theming" to="/docs/guides/theming/" description="Change the palette and typography." />}}
{% </ui.cards> %}
```

### Tabs

````markdown
{% <ui.tabs> %}
{% <ui.tab title="Zola"> %}
Build the site.

```sh
zola build
```
{% </ui.tab> %}
{% <ui.tab title="Serve"> %}
Preview the site.

```sh
zola serve
```
{% </ui.tab> %}
{% </ui.tabs> %}
````

Tabs work without JavaScript. The script adds a tablist and keyboard navigation when it loads.

### Callouts

```markdown
{% <ui.callout tone="tip"> %}
The callout body supports **Markdown**.
{% </ui.callout> %}
```

Tones are `note`, `tip`, `warning`, `caution`, and `important`.

### Labeled Code Blocks

````markdown
{% <ui.code_file title="zola.toml"> %}
```toml
build_search_index = true
```
{% </ui.code_file> %}
````

Every code block receives a language label and a copy button. A labeled block uses the filename instead.

## Math

Opt individual pages into KaTeX with `math = true` under `[extra]`.

```toml
+++
title = "A Formula"
[extra]
math = true
+++
```

KaTeX 0.19.1 is vendored under `static/assets/katex/`, so no CDN or build step is required. Pages without the flag load no KaTeX CSS or JavaScript.

Inline math uses `$...$`; display math uses `$$...$$`. Fenced code blocks are ignored. Keep currency-like prose away from paired dollar signs, which the renderer treats as math. Search indexes and feeds keep the raw LaTeX source.

KaTeX implements a large LaTeX subset, not every package. Its assets are MIT licensed; see `static/assets/katex/LICENSE`.

## Styling

The design tokens are CSS custom properties in `sass/_tokens.scss`. Override them in a custom stylesheet.

```css
:root {
  --color-desk: #f4f1e8;
  --color-paper: #fffdf6;
  --color-accent: #0047ab;
}
```

Set `custom_css` in `[extra]` to load the file.

```toml
[extra]
custom_css = "custom.css"
```

The theme ships IBM Plex Mono 400, 500, and 700 as the fallback monospace face. The sans-serif stack uses the system fonts available to the reader.

## JavaScript

All scripts are progressive enhancements and ship as plain files.

- `nav.js` collapses the site navigation into a menu button on small screens.
- `code.js` adds language labels and copy buttons to code blocks.
- `tabs.js` adds the tablist and keyboard behavior.
- `search.js` opens the search panel with `/` or `Cmd/Ctrl+K`, then handles arrow keys, Enter, and Escape.
- `outline.js` marks the current documentation heading.
- `math.js` renders opted-in pages with KaTeX after the DOM loads.

## Files

```
templates/
  index.html              page shell
  home.html               landing page
  page.html               generic page
  section.html            generic section
  docs/                   documentation layouts
  blog/                   blog layouts
  components/             breadcrumb, docs navigation, and UI components
  partials/               head, header, footer, search, pagers, blog TOC
sass/
  _tokens.scss            colors, fonts, spacing, shadows
  _main.scss              reset and base elements
  _shell.scss             sheet, masthead, navigation, footer
  _home.scss              landing page
  _prose.scss             article typography
  _breadcrumb.scss        breadcrumb and halftone divider
  _docs.scss              documentation layout
  _blog.scss              blog list and pagination
  _components.scss        cards, tabs, callouts, code blocks
  _search.scss            search panel
static/
  assets/js/              progressive enhancement scripts
  assets/katex/           KaTeX 0.19.1 styles, scripts, and fonts
  fonts/                  self-hosted IBM Plex Mono
```

## Notes

- The theme targets Zola 0.23 and Tera 2 components. It does not use shortcodes.
- Wrap literal `{{` or `{%` in a code sample with `{% raw %}` and `{% endraw %}`.
- Diagrams, a browser playground, MDX, and generated social images are not part of this theme.

## License

MIT. See `LICENSE.md`.
