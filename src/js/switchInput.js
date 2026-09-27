export default (disabled = false, checked = false) => ({
    switchOn: checked,
    disabled: disabled,
    // Transitions are enabled only after the first frame so the thumb/track render
    // at their initial position instantly instead of animating into place on load.
    ready: false,
    init() {
        this.$nextTick(() => {
            // The hidden checkbox is the source of truth: an x-model / wire:model on it
            // may have set its state during init, so adopt that before enabling transitions.
            this.switchOn = this.$refs.input.checked;
            this.ready = true;
        });
    },
    trigger: {
        ['@click']() {
            this.toggle()
        },
        [':aria-checked']() {
            return this.switchOn;
        },
        [':aria-labelledby']() {
            if (this.$refs.input?.labels[0]?.id ?? false) {
                return this.$refs.input.labels[0].id;
            }
        },
        [':aria-label']() {
            if (this.$refs.input?.labels[0]?.innerText ?? false) {
                return this.$refs.input.labels[0].innerText;
            }
        },
    },
    // `x-ref="input"` lives on the checkbox in the template: Alpine does not register
    // an x-ref supplied through an x-bind object, so it can't go in here.
    input: {
        [':disabled']() {
            return this.disabled;
        },
        // The checkbox toggled directly (e.g. its <label> was clicked): follow it.
        ['@change']() {
            this.switchOn = this.$refs.input.checked;
        },
    },
    setSwitchState(value) {
        if (this.disabled || value === this.switchOn) {
            return;
        }

        this.switchOn = value;
        // Drive the real checkbox so it submits with the form, and fire `change` so any
        // binding on it (x-model, wire:model, listeners) sees the new state.
        const input = this.$refs.input;
        input.checked = value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        this.$dispatch('checkedChange');
    },
    toggle() {
        this.setSwitchState(!this.switchOn);
    }
})
