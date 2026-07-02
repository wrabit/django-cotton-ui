"""Test helpers for rendering kit components.

Mirrors django-cotton core's `get_compiled` / `get_rendered`: compile a component
source string with the cotton compiler, then render it. The kit's real component
files (`cotton/ui/**`) are resolved by the cotton loader, so tests exercise the
shipped templates, not fixtures.
"""
import re

from django.template import Context, Template
from django.test import SimpleTestCase

from django_cotton.cotton_loader import Loader as CottonLoader


def get_compiled(template_string):
    return CottonLoader(engine=None).cotton_compiler.process(template_string)


def get_rendered(template_string, context=None):
    return Template(get_compiled(template_string)).render(Context(context or {}))


def opening_tag(html, pattern):
    """Return the first opening tag matching `pattern`, or '' if not found.

    Whitespace is collapsed first so patterns can assume single-space-separated
    attributes regardless of how the source template wraps the tag across lines.
    """
    match = re.search(pattern, re.sub(r"\s+", " ", html))
    return match.group(0) if match else ""


class CottonUITestCase(SimpleTestCase):
    """Base case: render a component source string against the real kit templates."""

    def render(self, source, **context):
        return get_rendered(source, context)
