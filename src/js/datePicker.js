import { format as dateFormat } from "date-fns";
import { positionPopover, watchReposition } from "./positioning.js";

export default (open, value, mode, format, value_format, locale, close_on_complete, trap = true) => ({
    open: open,
    value: null,
    mode: mode,
    format: format,
    value_format: value_format || 'yyyy-MM-dd',
    locale: locale || '',
    close_on_complete: close_on_complete,
    trap: trap,
    root: {
        ['@keydown.esc']() {
            return this.closePicker();
        },
        ['x-cloak']() {
            return true;
        },
    },
    trigger: {
        ['@click']() {
            return this.togglePicker();
        },
        ['@keyup.esc']() {
            return this.closePicker();
        },
        ['@keydown.space']() {
            return this.togglePicker();
        },
        [':class']() {
            return !this.value && "text-muted-foreground";
        },
    },
    calendar: {
        ['x-show']() {
            return this.open;
        },
        ['x-cloak']() {
            return true;
        },
        ['x-transition']() {
            return true;
        },
        ['@click.away']() {
            return this.closePicker();
        },
        ['x-trap.noscroll']() {
            return this.open && this.trap;
        },
    },
    init() {
        this.value = value
        // Keep the open calendar within the viewport (flip on both axes).
        this._cleanupReposition = watchReposition(() => {
            if (this.open) this.position();
        });
    },
    destroy() {
        this._cleanupReposition && this._cleanupReposition();
    },
    position() {
        positionPopover(this.$refs.datePickerInput, this.$refs.content, {
            position: 'bottom', align: 'start', offset: 8, responsive: true,
        });
    },
    openPicker() {
        this.open = true
        this.$nextTick(() => this.position())
    },
    closePicker() {
        this.open = false
    },
    togglePicker() {
        this.open ? this.closePicker() : this.openPicker()
    },
    // Close once the selection is complete: single -> a date is picked,
    // range -> both ends set, multiple -> never auto-closes.
    onCalendarChange(detail) {
        if (!this.close_on_complete || !this.open) return;
        const v = detail && detail.value;
        if (this.mode === 'range') {
            if (v && v.from && v.to) this.closePicker();
        } else if (this.mode === 'multiple') {
            // no defined completion point
        } else if (v) {
            this.closePicker();
        }
    },
    formatDate(date) {
        if (date == null) {
            return null;
        }
        const d = new Date(date);
        // 'auto' (and the dateStyle keywords) format per the user's locale via Intl;
        // any other value is treated as a date-fns format string. Display only —
        // the submitted value is governed by value_format and stays machine-readable.
        const styleKeywords = ['auto', 'short', 'medium', 'long', 'full'];
        if (styleKeywords.includes(this.format)) {
            const dateStyle = this.format === 'auto' ? 'short' : this.format;
            return new Intl.DateTimeFormat(this.locale || undefined, { dateStyle }).format(d);
        }
        return dateFormat(d, this.format)
    },
    // Serialised (submitted) value. Formatted locally so a date never shifts a
    // day via a UTC round-trip (toISOString). Default 'yyyy-MM-dd'.
    formatValue(date) {
        if (date == null) {
            return '';
        }
        return dateFormat(new Date(date), this.value_format)
    }
})
