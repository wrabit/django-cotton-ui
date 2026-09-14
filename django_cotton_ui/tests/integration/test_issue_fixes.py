"""Regression tests for reported issues."""
from django_cotton_ui.tests.utils import CottonUITestCase, opening_tag


class TextareaNameTests(CottonUITestCase):
    """#25: `name` is a declared var on <c-ui.textarea> (so the field wrapper can
    use it) and so is stripped from attrs; it must still reach the <textarea>."""

    def test_name_reaches_textarea(self):
        html = self.render('<c-ui.textarea name="my_field_name" />')
        self.assertIn('name="my_field_name"', opening_tag(html, r"<textarea\b[^>]*>"))
        self.assertEqual(html.count('name="my_field_name"'), 1)

    def test_name_reaches_textarea_when_field_wrapped(self):
        html = self.render('<c-ui.textarea name="bio" label="Bio" placeholder="Tell us" />')
        el = opening_tag(html, r"<textarea\b[^>]*>")
        self.assertIn('name="bio"', el)
        self.assertIn('placeholder="Tell us"', el)

    def test_no_empty_name_when_omitted(self):
        html = self.render('<c-ui.textarea placeholder="x" />')
        self.assertNotIn("name=", opening_tag(html, r"<textarea\b[^>]*>"))


class ButtonTypeTests(CottonUITestCase):
    """#24: toggle buttons inside a <form> must not submit it."""

    def test_accordion_trigger_is_type_button(self):
        html = self.render(
            '<c-ui.accordion><c-ui.accordion.item header="Q">A</c-ui.accordion.item></c-ui.accordion>'
        )
        self.assertIn('type="button"', opening_tag(html, r'<button\b[^>]*x-bind="trigger"[^>]*>'))

    def test_navlist_group_toggle_is_type_button(self):
        html = self.render('<c-ui.navlist.group heading="G" :expandable="True">x</c-ui.navlist.group>')
        self.assertIn('type="button"', opening_tag(html, r"<button\b[^>]*>"))
