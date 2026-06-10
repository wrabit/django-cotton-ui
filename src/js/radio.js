export default (name, initialValue = null) => ({
    value: initialValue,
    name: name,

    init() {
        // Initialize value from checked option if not provided
        if (this.value === null) {
            const checkedInput = this.$el.querySelector('input[type="radio"]:checked');
            if (checkedInput) {
                this.value = checkedInput.value;
            }
        }
    },

    select(optionValue) {
        this.value = optionValue;
        this.$dispatch('change', { value: optionValue });
    },

    isSelected(optionValue) {
        return this.value === optionValue;
    },

    selectNext() {
        const radios = Array.from(this.$el.querySelectorAll('[role="radio"]:not([aria-disabled="true"])'));
        const currentIndex = radios.findIndex(r => r === document.activeElement);

        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % radios.length;
        radios[nextIndex].focus();
        this.select(radios[nextIndex].dataset.value);
    },

    selectPrevious() {
        const radios = Array.from(this.$el.querySelectorAll('[role="radio"]:not([aria-disabled="true"])'));
        const currentIndex = radios.findIndex(r => r === document.activeElement);

        if (currentIndex === -1) return;

        const prevIndex = currentIndex === 0 ? radios.length - 1 : currentIndex - 1;
        radios[prevIndex].focus();
        this.select(radios[prevIndex].dataset.value);
    },

    hasRovingTabindex(optionValue) {
        // Roving tabindex pattern: selected option or first option gets tabindex="0"
        if (this.value === optionValue) return true;

        // If nothing selected, first option gets focus
        const radios = Array.from(this.$el.querySelectorAll('[role="radio"]:not([aria-disabled="true"])'));
        if (!this.value && radios[0] && radios[0].dataset.value === optionValue) return true;

        return false;
    },

    // Per-item variant classes. The variant lives on the group ([data-variant]) and is
    // read here client-side; `accent` is the item's server-side prop. The class tokens
    // live in this file and are picked up by the release build's @source of src/js, so
    // they ship in the precompiled cotton-ui.css (the `default` variant adds none).
    itemClasses(el, value, accent) {
        const variant = el.closest('[data-variant]')?.dataset.variant || 'default';
        const selected = this.isSelected(value);
        const classes = [];

        if (variant === 'segmented') {
            classes.push('px-4', 'py-2', 'font-medium', 'transition-[background-color,color]', 'border-r', 'border-zinc-200', 'dark:border-zinc-700', 'last:border-r-0', 'first:rounded-l-[var(--radius-control)]', 'last:rounded-r-[var(--radius-control)]');
            if (selected) {
                classes.push(...(accent ? ['bg-accent', 'text-accent-foreground'] : ['bg-zinc-100', 'dark:bg-zinc-700']));
            } else {
                classes.push('hover:bg-zinc-50', 'dark:hover:bg-zinc-700/50');
            }
        } else if (variant === 'pill') {
            classes.push('px-4', 'py-1.5', 'font-medium', 'transition-[background-color,color]', 'rounded-[calc(var(--radius-control)*0.66)]');
            if (selected) {
                classes.push('bg-accent', 'text-accent-foreground');
            } else {
                classes.push('text-zinc-600', 'dark:text-zinc-400', 'hover:bg-zinc-100', 'dark:hover:bg-zinc-700/50');
            }
        } else if (variant === 'cards') {
            classes.push('flex', 'flex-1', 'gap-4', 'rounded-box', 'border-2', 'p-4', 'transition-[background-color]');
            if (selected) {
                classes.push(...(accent ? ['border-accent', 'bg-accent/5'] : ['border-[var(--color-muted,currentColor)]', 'bg-[color-mix(in_oklab,var(--color-muted,currentColor)_5%,transparent)]']));
            } else {
                classes.push('border-zinc-200', 'dark:border-zinc-700');
            }
        }

        return classes;
    }
})
