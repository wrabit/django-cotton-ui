from contextlib import suppress

from django.apps import AppConfig


class CottonUiConfig(AppConfig):
    name = "django_cotton_ui"
    verbose_name = "Cotton UI"

    def ready(self):
        # Register the kit's template filters (json_dumps, elided_page_range) as a
        # builtin, so component templates can use them without {% load cotton_ui %}
        # (mirrors how django_cotton registers its own `cotton` tag).
        import django.template
        from django.conf import settings

        tag = "django_cotton_ui.templatetags.cotton_ui"
        for config in settings.TEMPLATES:
            if config.get("BACKEND") == "django.template.backends.django.DjangoTemplates":
                builtins = config.setdefault("OPTIONS", {}).setdefault("builtins", [])
                if tag not in builtins:
                    builtins.append(tag)

        # EngineHandler caches settings.TEMPLATES, force a re-read so the builtin sticks.
        with suppress(AttributeError):
            del django.template.engines.templates
            django.template.engines._engines = {}
