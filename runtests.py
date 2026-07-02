#!/usr/bin/env python
"""Standalone test runner for django-cotton-ui (no pytest required).

    python runtests.py                                   # run the whole suite
    python runtests.py django_cotton_ui.tests.integration.test_attribute_forwarding
    python runtests.py <dotted.path.to.TestCase.method>  # run one test

Run from the repo root so the local `django_cotton_ui` package (not an installed
copy) is on the path.
"""
import os
import sys

import django
from django.conf import settings
from django.test.utils import get_runner


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_cotton_ui.tests.settings")
    django.setup()
    runner = get_runner(settings)(verbosity=2)
    labels = sys.argv[1:] or ["django_cotton_ui.tests"]
    sys.exit(bool(runner.run_tests(labels)))


if __name__ == "__main__":
    main()
