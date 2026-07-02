"""Minimal Django settings for the kit test suite.

django_cotton's default AppConfig wires the cotton loader and `cotton` builtin into
TEMPLATES on ready(), so having both apps in INSTALLED_APPS is enough for the
app_directories loader to resolve the kit's `cotton/ui/**` component files.
"""

SECRET_KEY = "django-cotton-ui-tests"
DEBUG = True

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "django_cotton",
    "django_cotton_ui",
]

DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"},
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "builtins": ["django_cotton.templatetags.cotton"],
        },
    },
]

USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
