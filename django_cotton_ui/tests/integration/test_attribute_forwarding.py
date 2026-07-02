"""Arbitrary-attribute forwarding across kit form controls.

Client frameworks bind a value by setting a namespaced attribute on the element that
submits it, e.g. `some:attribute="q"` (this is the shape of Livewire's `wire:model`,
Interlace's `lace:model`, Alpine's `x-model`, and plain `data-*` hooks). Set on a
component tag, such an attribute must reach the *value-bearing* control:

    <c-ui.input some:attribute="q" />   ->   <input ... some:attribute="q" ...>

`class` is presentational: it stays on the component's visible root, and must never be
duplicated onto (which would silently break) the underlying control.

Components split into two shapes:
  - the control IS the root (input, textarea, native select, range) -> attrs land
    directly on the control;
  - a visible root wraps a hidden value control (checkbox, radio, switch, combobox)
    -> `class` stays on the root, all other attrs go to the hidden control.
"""
import unittest

from django_cotton_ui.tests.utils import CottonUITestCase, opening_tag


class ControlIsRootTests(CottonUITestCase):
    """The rendered control is itself the root element; attrs land on it."""

    def test_input(self):
        html = self.render('<c-ui.input name="q" some:attribute="q" data-role="search" />')
        el = opening_tag(html, r"<input\b[^>]*>")
        self.assertIn('some:attribute="q"', el)
        self.assertIn('data-role="search"', el)

    def test_input_field_wrapped(self):
        # A field wrapper (label/description) must not swallow the binding.
        html = self.render('<c-ui.input name="q" label="Query" some:attribute="q" />')
        self.assertIn('some:attribute="q"', opening_tag(html, r"<input\b[^>]*>"))

    def test_textarea_with_dotted_modifier(self):
        html = self.render('<c-ui.textarea name="b" some:attribute.live="body" />')
        self.assertIn('some:attribute.live="body"', opening_tag(html, r"<textarea\b[^>]*>"))

    def test_native_select(self):
        html = self.render(
            '<c-ui.select name="c" some:attribute="country">'
            '<option value="1">One</option></c-ui.select>'
        )
        self.assertIn('some:attribute="country"', opening_tag(html, r"<select\b[^>]*>"))

    def test_range(self):
        html = self.render('<c-ui.range name="v" some:attribute="vol" />')
        self.assertIn('some:attribute="vol"', opening_tag(html, r'<input type="range"[^>]*>'))


class RootWrapsHiddenControlTests(CottonUITestCase):
    """A visible root wraps a hidden value control: class -> root, attrs -> control."""

    def _assert_binding_on_control_only(self, control, root, binding, css):
        self.assertIn(binding, control)
        self.assertNotIn(css, control)
        self.assertEqual(control.count("class="), 1, f"duplicate class on control: {control}")
        self.assertIn(css, root)
        self.assertNotIn(binding, root)

    def test_checkbox(self):
        html = self.render('<c-ui.checkbox name="cb" value="1" some:attribute="agree" class="mb-2" />')
        control = opening_tag(html, r'<input type="checkbox"[^>]*>')
        self.assertIn('class="sr-only"', control)  # hidden state preserved
        self._assert_binding_on_control_only(
            control, opening_tag(html, r"<label\b[^>]*>"), 'some:attribute="agree"', "mb-2"
        )

    def test_radio(self):
        html = self.render('<c-ui.radio name="rb" value="1" some:attribute="pick" class="mb-2" />')
        control = opening_tag(html, r'<input type="radio"[^>]*>')
        self.assertIn('class="sr-only"', control)
        self._assert_binding_on_control_only(
            control, opening_tag(html, r"<label\b[^>]*>"), 'some:attribute="pick"', "mb-2"
        )

    def test_switch(self):
        html = self.render('<c-ui.switch name="sw" some:attribute="on" class="ml-4" />')
        control = opening_tag(html, r'<input type="checkbox"[^>]*>')
        self.assertIn('class="sr-only"', control)
        self._assert_binding_on_control_only(
            control, opening_tag(html, r"<button\b[^>]*>"), 'some:attribute="on"', "ml-4"
        )

    def test_combobox(self):
        html = self.render(
            "<c-ui.combobox name=\"cbo\" some:attribute=\"tags\" class=\"mt-3\" :options=\"['a','b']\" />"
        )
        control = opening_tag(html, r'<select x-ref="hiddenSelect"[^>]*>')
        root = opening_tag(html, r'<div x-data="combobox\(.*?>')
        self._assert_binding_on_control_only(control, root, 'some:attribute="tags"', "mt-3")


class PendingNestedControlTests(CottonUITestCase):
    """Value element lives inside a sub-component (calendar / menu). Forwarding into
    the nested control is not wired yet; these document the target end-state."""

    @unittest.expectedFailure
    def test_datepicker(self):
        html = self.render('<c-ui.datepicker name="d" some:attribute="date" />')
        hidden = opening_tag(html, r'<input[^>]*x-model="value"[^>]*>')
        self.assertIn('some:attribute="date"', hidden)

    @unittest.expectedFailure
    def test_listbox_select(self):
        html = self.render(
            '<c-ui.select variant="listbox" name="ls" some:attribute="v">'
            '<option value="1">One</option></c-ui.select>'
        )
        self.assertIn('some:attribute="v"', opening_tag(html, r'<input[^>]*name="ls"[^>]*>'))
