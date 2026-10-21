+++
title = "Ondine"
description = "A documentation and blog theme for Zola, styled as a printed catalog."
template = "home.html"
sort_by = "weight"

[extra]
kicker = "Documentation and blog"
lead = "A documentation and blog theme for Zola. Pages read as printed sheets, with boxed navigation, dotted rules, hard shadows, and monospace labels."
primary_url = "/docs/"
primary_label = "Get Started →"
secondary_url = "/blog/"
secondary_label = "Read the Blog →"
+++

## Start Here

{% <ui.cards> %}
{{<ui.card title="Getting Started" to="/docs/introduction/getting-started/" description="Install the theme and render a first page." />}}
{{<ui.card title="Components" to="/docs/introduction/components/" description="Use cards, tabs, callouts, and labeled code blocks." />}}
{{<ui.card title="Theming" to="/docs/guides/theming/" description="Adjust the design tokens and typography." />}}
{{<ui.card title="API Reference" to="/docs/api/compiler/" description="Browse the compiler API pages and nested navigation." />}}
{{<ui.card title="Blog" to="/blog/" description="Read short notes about the theme." />}}
{{<ui.card title="Source" to="https://github.com/wevm/ondine" description="Inspect the project this theme is modeled on." />}}
{% </ui.cards> %}
