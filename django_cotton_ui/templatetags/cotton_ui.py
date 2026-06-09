"""Template tags and filters for Cotton UI components."""

import json
from urllib.parse import quote

from django import template

register = template.Library()


@register.filter
def json_dumps(value):
    """
    Serialize value to JSON and URL-encode for safe embedding in HTML attributes.

    Used by components like combobox that need to pass Python data structures
    to Alpine.js via HTML attributes.

    Usage:
        {{ my_list|json_dumps }}
    """
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
