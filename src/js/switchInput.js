export default (disabled = false, checked = false) => ({
    switchOn: checked,
    disabled: disabled,
    // Transitions are enabled only after the first frame so the thumb/track render
    // at their initial position instantly instead of animating into place on load.
    ready: false,
    init() {
        this.$nextTick(() => { this.ready = true; });
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
            if (this.$refs.input?.labels[0].innerText ?? false) {
                return this.$refs.input.labels[0].innerText;
            }
        },
    },
    input: {
        ['x-model.boolean']() {
            return "switchOn";
        },
        ['x-ref']() {
            return "input";
        },
        [':disabled']() {
            return this.disabled;
        },
    },
    setSwitchState(value) {
        if (this.disabled) {
            return;
        }

        this.switchOn = value;
        this.$dispatch('checkedChange');
    },
    toggle() {
        this.setSwitchState(!this.switchOn);
    }
})
