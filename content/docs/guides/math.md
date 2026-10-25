+++
title = "Math"
description = "Typeset formulas with KaTeX on opted-in pages."
weight = 30

[extra]
lead = "Enable KaTeX per page and write inline or display formulas with familiar delimiters."
toc = true
math = true
+++

## Inline Math

Opt a page in with `math = true` under `[extra]`. Inline formulas use `$...$`.

The mass-energy relation is $E = mc^2$. Fractions such as $\frac{1}{3}$ and subscripts such as $x_{i}$ work inline.

## Display Math

Display formulas use `$$...$$`.

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Source

Fenced code blocks are ignored by the renderer, so they show the source literally.

```markdown
Inline: $E = mc^2$

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$
```

## Notes

- KaTeX supports a large LaTeX subset, not every LaTeX package.[^katex-subset]
- `$...$` can be ambiguous in currency-like prose. Keep paired dollar signs intended as math.
- Search indexes and feeds contain the raw LaTeX source.
- Pages without `math = true` do not load the KaTeX stylesheet or scripts.

[^katex-subset]: KaTeX lists supported commands at <https://katex.org/docs/supported.html>.
