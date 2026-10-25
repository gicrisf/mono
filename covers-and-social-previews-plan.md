# Covers and Social Previews — Future Plan

Status: planned, not implemented.
Date: 2026-10-25

This document is the implementation spec for adding blog cover images and social preview metadata. No demo content is required; verification should use temporary assets that are removed before committing.

## Scope

- Post cover images with responsive `srcset`.
- Optional compact covers in blog lists, behind a config flag.
- Open Graph and Twitter preview image metadata.
- No generated social images.
- No committed demo content.

## 1. Image paths and front matter

### Cover image

```toml
[extra]
cover_image = "covers/my-post.png"
cover_alt = "Optional alt text"
cover_caption = "Optional visible caption"
```

- `cover_image` is a path resolvable by Zola’s `resize_image` search:
  - project root
  - `static/`
  - `content/`
- Recommended convention: `static/covers/<name>.png`.
- Do not implement zerm’s bare colocated-filename logic in the first pass. It would require duplicate path-resolution logic in the head and body. Use explicit Zola-resolvable paths instead.
- Raster formats: PNG, JPEG, WebP. SVG covers render in-page but are not used for social previews.
- Alt priority: `cover_alt` → `cover_caption` → `page.title`.
- If `cover_image` is missing or invalid, treat that as an author error; `resize_image` should fail the build.

### Social overrides

```toml
[extra]
og_image = "covers/my-post-social.png"
twitter_user = "@author"
```

```toml
[extra]
og_preview_img = "covers/social.png"
twitter_site = "@site"
twitter_user = "@site_author"
show_covers_in_lists = false
```

## 2. `post.cover` component

Create `templates/components/post.html` with:

```jinja2
{% component post.cover(page, compact=false) %}
```

The component reads `page.extra.cover_image`, `cover_alt`, and `cover_caption`.

### Raster covers

Generate 2:1 variants with `op="fill"`:

- `400x200`
- `800x400`
- `1200x600`

Output:

```html
<figure class="post-cover">
  <img
    src="…800…"
    srcset="…400… 400w, …800… 800w, …1200… 1200w"
    sizes="(max-width: 768px) 100vw, 46rem"
    width="800"
    height="400"
    alt="…"
  >
  <figcaption>…</figcaption>
</figure>
```

- Use the `800x400` URL as `src`.
- Add `loading="lazy"` only for compact/list covers.
- Use `sizes="(max-width: 640px) 100vw, 18rem"` for compact covers.

### SVG covers

Render directly:

```html
<img src="{{ get_url(path=image) }}" alt="…">
```

No `resize_image`, no social preview image from the SVG.

### Placement

- Blog post: after `</header>` and before `<div class="prose">`.
- TOC posts: the cover stays in the article column; the TOC sidebar/mobile disclosure is unaffected.
- Blog list, only when `config.extra.show_covers_in_lists` is true:
  - At the top of each `.post-list__item` when `entry.extra.cover_image` exists.
  - Call `post.cover` with `compact={true}`.
  - Default flag is `false`.

## 3. Cover styles

Add to `_blog.scss`:

- `.post-cover`
  - paper background
  - `1px` solid rule border
  - hard shadow
  - `margin-block: var(--space-lg)`
  - `overflow: hidden`
- `.post-cover img`
  - `display: block`
  - `width: 100%`
  - `aspect-ratio: 2 / 1`
  - `object-fit: cover`
- `.post-cover figcaption`
  - dashed top border
  - monospace, muted, small
  - padding
- `.post-cover--compact`
  - `margin-block: 0 var(--space-sm)`
  - `max-width: 18rem`
  - full width at `$phone`

## 4. Social preview metadata

Extend `templates/partials/head.html`.

### Image priority

1. `page.extra.og_image`
2. `page.extra.cover_image`, only if raster
3. `config.extra.og_preview_img`

### Page-provided image

- Resize to `1200x630` with `op="fill"`.
- Build an absolute URL:

```jinja2
{% set og_path = resized.url | trim_start_matches(pat="/") %}
{% set og_image_url = config.base_url ~ og_path %}
```

- For the site fallback, use `get_url(path=config.extra.og_preview_img)`.
- If the source is SVG and no raster override exists, emit no preview image.

### Output when an image exists

```html
<meta property="og:image" content="…">
<meta property="og:image:alt" content="…">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="…">
<meta name="twitter:image:alt" content="…">
<meta name="twitter:card" content="summary_large_image">
```

### Output when no image exists

```html
<meta name="twitter:card" content="summary">
```

### Twitter identity

- `twitter:site` from `config.extra.twitter_site`.
- `twitter:creator` from `page.extra.twitter_user` or `config.extra.twitter_user`.

### Existing metadata stays

- `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`
- `article:published_time`, `article:modified_time`
- `<meta name="author">`
- canonical URL

### Important caveat

`base_url` must be the production URL for social preview URLs to be absolute. With the demo’s `base_url = "/"`, preview URLs will remain relative.

## 5. Config and documentation

Add commented examples to `zola.toml`:

```toml
# show_covers_in_lists = false
# og_preview_img = "covers/social.png"
# twitter_site = "@your_site"
# twitter_user = "@you"
```

Add a README “Covers and social previews” section covering:

- `cover_image`, `cover_alt`, `cover_caption`
- Zola-resolvable path convention
- Raster vs SVG behavior
- 2:1 in-page crop and 1200x630 social crop
- `show_covers_in_lists`
- Social image priority
- `og_preview_img`, `twitter_site`, `twitter_user`
- Production `base_url` requirement
- No generated social images

Update the Files list for:

- `templates/components/post.html`
- cover-related styles in `_blog.scss`

## 6. Verification when implemented

- Use a temporary raster cover on one post; do not commit demo content.
- Build and inspect:
  - generated `srcset` and processed image variants
  - post cover at desktop/mobile
  - OG and Twitter image metadata
  - `og:image:alt` / `twitter:image:alt`
- Test a post without a cover:
  - no cover markup
  - no `og:image`
  - `twitter:card` remains `summary`
- Test an SVG cover:
  - renders in-page
  - does not become the social preview image
- Test `og_image` override and `og_preview_img` fallback.
- Test `show_covers_in_lists` both false and true.
- Run `zola check` and `zola build`.
- Remove temporary images/content before committing.
- Commit message: `add covers and social previews`.

## Open choices for later

- Enable list covers by default or keep the flag off. Recommendation: off.
- Keep the 2:1 visible cover ratio or switch to 16:9. Recommendation: 2:1 for mono’s printed-plate look, 1200x630 for social.
- Add zerm’s bare colocated filename convention later if desired. Recommendation: start with explicit paths only.
