+++
title="Showcase"
description="a tour of the baseline's content features."
date=2019-08-07
updated=2021-02-03

[taxonomies]
tags = ["rust", "test", "zola"]
categories = ["programming", "misc.",]

[extra]
ToC = true
+++

# hello

This page exercises the white-canvas baseline: headings, tables of contents,
syntax highlighting, lists, tables, blockquotes, footnotes, and taxonomies.

The goal is a small, neutral starting point: keep the template architecture,
then replace the styles and components with your own.

- Markdown content is styled by `sass/_main.scss`.
- Taxonomies are rendered by `templates/partials/post_meta.html`.
- The table of contents is opt-in with `ToC = true`.
- Math is opt-in per page with `math = true`.

## A quick demo

`println!("inline code");`

```rs
fn main(n: String) {
    println!("hello, zola!");
}
```

### Header III

> a somewhat kinda maybe large quote that maybe spans
> more than one line but I mean really who even cares
> okay maybe I do but point being is yes nice.

#### Header IV

| hello | tables    | nice |
|:-----:|:---------:|------|
| wow   | much love | yes  |

Like using Zola? Read the [documentation](https://www.getzola.org/documentation/getting-started/installation/)
and start building.

---

[^1]: fork? port? a little bit of the former, more of the latter?
