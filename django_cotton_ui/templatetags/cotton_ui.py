"""Template tags and filters for Cotton UI components."""

import json
from urllib.parse import quote

from django import template

register = template.Library()


@register.filter
def json_dumps(value):
    """JSON-serialize for a bare JS literal in an x-data expression, e.g.
    x-data='radio("{{ name }}", {{ value|json_dumps }})'. Django auto-escapes the
    quotes and the browser decodes them, so the literal stays valid (and safe)."""
    return json.dumps(value)


@register.filter
def json_dumps_uri(value):
    """JSON + URL-encode, for values passed as a quoted string and read back with
    decodeURIComponent (combobox). Use json_dumps for bare x-data literals."""
    return quote(json.dumps(value))


@register.filter
def elided_page_range(page_obj):
    """
    The current page's elided range (with ellipses) for a Django Page object,
    so <c-ui.pagination :page_obj="page_obj" /> can render itself. Ellipses are
    returned as the plain string "..." for easy comparison in the template.

    Usage:
        {% for num in page_obj|elided_page_range %} ... {% endfor %}
    """
    paginator = page_obj.paginator
    pages = paginator.get_elided_page_range(
        page_obj.number, on_each_side=1, on_ends=1
    )
    return ["..." if p == paginator.ELLIPSIS else p for p in pages]
