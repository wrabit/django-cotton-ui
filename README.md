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

Then wire up Tailwind v4 (scan the component templates, import the theme) and the
Alpine bundle. See the [installation guide](https://django-cotton.com/ui/installation)
for the full setup.

## Usage

Components use the `c-ui.` prefix:

```django
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
- Tailwind CSS **v4** with a build step (the same setup any Tailwind project uses; the Play CDN and v3 won't work, as the kit's styles are compiled from your `@source`-scanned templates)
- Alpine.js v3

## License

MIT
