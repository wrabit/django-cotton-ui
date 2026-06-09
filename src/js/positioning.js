// Shared, collision-aware popover positioning.
//
// Extracted from the dropdown's positionDropdown so combobox, select, datepicker
// (and any future popover) reposition consistently: the content flips its
// position (top/bottom) and alignment (start/end) to stay within the viewport.
//
// The content element must be absolutely positioned inside a `position: relative`
// parent that also contains the trigger. `align: 'stretch'` keeps the content
// full-width (left:0; right:0) and only flips vertically (combobox / select).

export function positionPopover(trigger, content, opts = {}) {
    if (!trigger || !content) return;

    const {
        position = 'bottom',
        align = 'start',
        offset = 4,
        responsive = true,
    } = opts;

    const t = trigger.getBoundingClientRect();
    const off = parseInt(offset, 10) || 0;

    let finalPosition = position;
    let finalAlign = align;

    if (responsive) {
        const c = content.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Vertical flip (top <-> bottom)
        if (position === 'bottom') {
            const below = vh - t.bottom - off;
            const above = t.top - off;
            if (c.height > below && above > below) finalPosition = 'top';
        } else if (position === 'top') {
            const above = t.top - off;
            const below = vh - t.bottom - off;
            if (c.height > above && below > above) finalPosition = 'bottom';
        } else if (position === 'right') {
            const right = vw - t.right - off;
            const left = t.left - off;
            if (c.width > right && left > right) finalPosition = 'left';
        } else if (position === 'left') {
            const left = t.left - off;
            const right = vw - t.right - off;
            if (c.width > left && right > left) finalPosition = 'right';
        }

        // Horizontal flip (start <-> end), only for top/bottom popovers and
        // never for stretched (full-width) content.
        if ((finalPosition === 'bottom' || finalPosition === 'top') && align !== 'stretch') {
            if (align === 'start') {
                const spaceRight = vw - t.left;
                if (c.width > spaceRight && t.right > c.width) finalAlign = 'end';
            } else if (align === 'end') {
                const spaceLeft = t.right;
                if (c.width > spaceLeft && (vw - t.left) > c.width) finalAlign = 'start';
            }
        }
    }

    // Reset
    content.style.top = '';
    content.style.bottom = '';
    content.style.left = '';
    content.style.right = '';
    content.style.transform = '';

    // Place
    if (finalPosition === 'bottom') content.style.top = `calc(100% + ${off}px)`;
    else if (finalPosition === 'top') content.style.bottom = `calc(100% + ${off}px)`;
    else if (finalPosition === 'left') content.style.right = `calc(100% + ${off}px)`;
    else if (finalPosition === 'right') content.style.left = `calc(100% + ${off}px)`;

    // Align
    if (finalPosition === 'top' || finalPosition === 'bottom') {
        if (finalAlign === 'stretch') { content.style.left = '0'; content.style.right = '0'; }
        else if (finalAlign === 'start') content.style.left = '0';
        else if (finalAlign === 'end') content.style.right = '0';
        else if (finalAlign === 'center') { content.style.left = '50%'; content.style.transform = 'translateX(-50%)'; }
    } else {
        if (finalAlign === 'stretch') { content.style.top = '0'; content.style.bottom = '0'; }
        else if (finalAlign === 'start') content.style.top = '0';
        else if (finalAlign === 'end') content.style.bottom = '0';
        else if (finalAlign === 'center') { content.style.top = '50%'; content.style.transform = 'translateY(-50%)'; }
    }

    return { position: finalPosition, align: finalAlign };
}

// Run `callback` on viewport resize / scroll (rAF-throttled). Returns a cleanup.
export function watchReposition(callback) {
    let ticking = false;
    const handler = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { callback(); ticking = false; });
    };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
        window.removeEventListener('resize', handler);
        window.removeEventListener('scroll', handler, true);
    };
}
