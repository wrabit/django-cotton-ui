# Django Cotton UI

An optional kit of accessible, themeable UI components for [Django Cotton](https://github.com/wrabit/django-cotton), built with Tailwind CSS v4 and Alpine.js.

### 📖 Documentation: **[django-cotton.com/ui](https://django-cotton.com/ui)**

The docs cover installation, theming and every component with live examples.

## Install

```bash
pip install django-cotton-ui
```

Add it to `INSTALLED_APPS` after `django_cotton`:

```python
INSTALLED_APPS = [
    # ...
    "django_cotton",
    "django_cotton_ui",
]
```

Then `<link>` the kit's precompiled stylesheet and load the Alpine bundle in your base
template, no build step is required to use the components, and you re-theme by overriding
the CSS-variable tokens in any stylesheet. A Tailwind v4 build is only needed if your own
pages use Tailwind utility classes (the usual reason any project runs Tailwind); the kit
itself never needs one. If you do run a build, set `@custom-variant dark (&:where(.dark, .dark *))`
so its dark mode matches the kit's (class-based). See the
[installation guide](https://django-cotton.com/ui/installation) for the full setup.

## Usage

Components use the `c-ui.` prefix:

```html
<c-ui.button variant="primary">Save</c-ui.button>
<c-ui.input name="email" label="Email" placeholder="you@example.com" />

<c-ui.card>
    <h3 class="font-semibold">Title</h3>
    <p>Content goes here.</p>
</c-ui.card>
```

Browse the full set with live examples in the [component docs](https://django-cotton.com/ui).

## Requirements

- Python ≥ 3.8 · Django ≥ 4.2 · django-cotton ≥ 2.5
- A precompiled stylesheet ships with the package: just `<link>` it, no build step needed to use the components, and theming is done by overriding the CSS-variable tokens in any stylesheet. Tailwind CSS **v4** is optional, only if your own pages use Tailwind utility classes.
- Alpine.js v3

## Roadmap

- **CDN** — a CDN-hosted stylesheet + bundle for quick prototyping and zero-setup trials.

## License

MIT
