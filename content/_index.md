+++
title = "mono"
description = "A blog theme for Zola, styled as a printed catalog."
template = "home.html"
sort_by = "weight"

[extra]
kicker = "Blog"
lead = "A blog theme for Zola. Pages read as printed sheets, with boxed navigation, dotted rules, hard shadows, and monospace labels."
primary_url = "/blog/"
primary_label = "Read the Blog →"
secondary_url = "https://github.com/gicrisf/mono"
secondary_label = "Source →"
+++

## Recent Notes

{% <ui.cards> %}
{{<ui.card title="A Printed Surface" to="/blog/printed-surface/" description="Why the theme frames every page as a sheet instead of a plain column." />}}
{{<ui.card title="A Printed Surface, Revisited" to="/blog/printed-surface-revisited/" description="A second pass over the layout, with a table of contents enabled." />}}
{{<ui.card title="Static First, Components Where Needed" to="/blog/static-first/" description="Keep Zola's static output and add interaction only where it helps." />}}
{{<ui.card title="Source" to="https://github.com/gicrisf/mono" description="Inspect the theme source." />}}
{% </ui.cards> %}
