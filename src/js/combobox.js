import { positionPopover, watchReposition } from './positioning.js';

export default (config) => ({
    isOpen: false,
    highlightedIndex: 0,
    searchTerm: '',
    tags: [],
    options: [],

    // Config
    name: config.name,
    maxTags: config.maxTags,
    writable: config.writable,
    searchable: config.searchable,
    closeAfterSelecting: config.closeAfterSelecting,
    autoclose: config.autoclose,
    disabled: config.disabled,
    placeholder: config.placeholder,

    init() {
        // Keep the open dropdown placed within the viewport as it changes.
        this._cleanupReposition = watchReposition(() => {
            if (this.isOpen) this.positionDropdown();
        });
    },

    destroy() {
        this._cleanupReposition && this._cleanupReposition();
    },

    positionDropdown() {
        positionPopover(this.$refs.trigger, this.$refs.content, {
            position: 'bottom', align: 'stretch', offset: 4, responsive: true,
        });
    },

    initSelected(selected_encoded) {
        let selected = JSON.parse(decodeURIComponent(selected_encoded));
        this.tags = Array.isArray(selected) ? selected : (selected ? [selected] : []);
        this.updateHiddenSelect();
    },

    initOptions(options_encoded) {
        let options = JSON.parse(decodeURIComponent(options_encoded));
        this.options = Array.isArray(options) ? options : [];
    },

    get filteredOptions() {
        if (!this.searchTerm) return this.options;
        return this.options.filter(option =>
            option.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    },

    get showCreateOption() {
        return this.writable && this.searchTerm && !this.filteredOptions.includes(this.searchTerm) && !this.tags.includes(this.searchTerm);
    },

    get hasTagsRemaining() {
        return this.maxTags > 0 ? this.maxTags > this.tags.length : true
    },

    get getPlaceholder() {
        if (this.isOpen && !this.hasTagsRemaining) return 'Maximum reached';
        if (this.tags.length === 0) {
            if (this.placeholder) return this.placeholder;
            return this.writable ? 'Search or type new...' : 'Select options...';
        }
        return '';
    },

    openDropdown() {
        if (this.disabled) return;
        this.isOpen = true;
        this.$nextTick(() => {
            this.positionDropdown();
            if (this.searchable || this.writable) {
                this.$refs.searchInput.focus();
            }
            this.highlightedIndex = 0;
        });
    },

    closeDropdown() {
        this.isOpen = false;
        this.searchTerm = '';
        this.$el.querySelector('[tabindex="0"]').focus();
    },

    selectOption(option) {
        if (this.tags.includes(option)) {
            // Option already selected - toggle OFF
            this.removeTag(option);
        } else {
            // Option not selected - prepare to add

            // Single-select mode: auto-replace existing selection
            if (this.maxTags === 1 && this.tags.length > 0) {
                this.removeTag(this.tags[0]);
            }

            this.addTag(option);
        }
    },

    addTag(tag) {
        if (this.disabled) return;
        if (this.maxTags !== -1 && this.tags.length >= this.maxTags) return;

        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.updateHiddenSelect();

            // Check if we should close the dropdown
            const shouldAutoclose = this.autoclose && this.maxTags !== -1 && this.tags.length >= this.maxTags;

            if (this.closeAfterSelecting || shouldAutoclose) {
                this.closeDropdown();
            } else {
                this.searchTerm = '';
                if (this.searchable || this.writable) {
                    this.$refs.searchInput.focus();
                }
            }
        }
    },

    removeTag(tag) {
        if (this.disabled) return;
        this.tags = this.tags.filter(t => t !== tag);
        this.updateHiddenSelect();
    },

    removeLastTag() {
        if (this.tags.length > 0 && !this.searchTerm) {
            this.removeTag(this.tags[this.tags.length - 1]);
        }
    },

    handleEnter() {
        // If create option is highlighted (index === filteredOptions.length)
        if (this.showCreateOption && this.highlightedIndex === this.filteredOptions.length) {
            this.addTag(this.searchTerm);
        } else if (this.filteredOptions.length > 0 && this.highlightedIndex < this.filteredOptions.length) {
            this.selectOption(this.filteredOptions[this.highlightedIndex]);
        } else if (this.writable && this.searchTerm) {
            this.addTag(this.searchTerm);
        }
    },

    highlightNext() {
        const maxIndex = this.showCreateOption ? this.filteredOptions.length : this.filteredOptions.length - 1;
        if (this.highlightedIndex < maxIndex) {
            this.highlightedIndex++;
            this.scrollToHighlighted();
        }
    },

    highlightPrev() {
        if (this.highlightedIndex > 0) {
            this.highlightedIndex--;
            this.scrollToHighlighted();
        }
    },

    scrollToHighlighted() {
        this.$nextTick(() => {
            const list = this.$refs.optionsList;
            if (!list) return;
            const items = list.querySelectorAll('[data-combobox-option]');
            const el = items[this.highlightedIndex];
            if (el) el.scrollIntoView({ block: 'nearest' });
        });
    },

    updateHiddenSelect() {
        // Handled by Alpine's x-model on hidden select?
        // No, we are manually building options.
        // Actually, x-ref="hiddenSelect" content is rebuilt by x-for.
        // But we need to trigger change event for forms?
        this.$nextTick(() => {
            this.$dispatch('change', this.tags);
        });
    }
})
