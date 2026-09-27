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


class SwitchStateTests(CottonUITestCase):
    """#26: the hidden checkbox must carry the switch's state. The runtime toggling
    lives in switchInput.js; these cover the server-rendered half it depends on."""

    CHECKBOX = r'<input type="checkbox"[^>]*>'

    def test_checked_is_server_rendered(self):
        html = self.render('<c-ui.switch name="sw" :checked="True" />')
        self.assertRegex(opening_tag(html, self.CHECKBOX), r"\schecked\s")

    def test_unchecked_by_default(self):
        html = self.render('<c-ui.switch name="sw" />')
        self.assertNotRegex(opening_tag(html, self.CHECKBOX), r"\schecked\s")

    def test_checkbox_has_template_ref(self):
        # switchInput.js reaches the checkbox via $refs.input; Alpine ignores an x-ref
        # supplied through an x-bind object, so it must be on the element itself.
        html = self.render('<c-ui.switch name="sw" />')
        self.assertIn('x-ref="input"', opening_tag(html, self.CHECKBOX))
