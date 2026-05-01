// ============================================================
// STORYFRAME STUDIO — UI Manager
// ============================================================

const UIManager = (() => {
    const ICON = {
        storyboard: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>',
        image: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
        gallery: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/></svg>',
        settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
        wand: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>',
        sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>',
        download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
        key: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>',
        logout: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
        zap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
        grid: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>',
        user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        pollen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    };

    let currentPage = 'storyboard';

    function el(id) { return document.getElementById(id); }

    // ── Toast System ──
    function toast(message, type = 'info') {
        const container = el('toastContainer');
        const t = document.createElement('div');
        t.className = `sf-toast sf-toast-${type}`;
        t.innerHTML = `<span>${message}</span>`;
        container.appendChild(t);
        setTimeout(() => { t.classList.add('removing'); }, 3000);
        setTimeout(() => { t.remove(); }, 3400);
    }

    // ── Navigation ──
    function navigateTo(page) {
        currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.sidebar-item[data-page]').forEach(i => i.classList.remove('active'));

        const target = el('page-' + page);
        const navItem = document.querySelector(`.sidebar-item[data-page="${page}"]`);
        if (target) target.classList.add('active');
        if (navItem) navItem.classList.add('active');

        // Update header title
        const titles = { storyboard: 'Storyboard', studio: 'Image Studio', gallery: 'Gallery', settings: 'Settings' };
        el('headerTitle').textContent = titles[page] || page;

        if (page === 'gallery') {
            GalleryManager.render(el('galleryGrid'));
        }
    }

    // ── Key Status ──
    function updateKeyStatus() {
        const indicator = el('keyStatus');
        const sidebarAuth = el('sidebarAuthArea');
        if (StorageManager.hasKey()) {
            indicator.className = 'key-status connected';
            indicator.innerHTML = `<span class="key-status-dot"></span> Connected`;

            // Update sidebar user area
            const profile = StorageManager.getUserProfile();
            if (profile) {
                const avatar = profile.picture
                    ? `<img src="${profile.picture}" alt="">`
                    : (profile.preferred_username || 'U').charAt(0).toUpperCase();
                const avatarHTML = profile.picture
                    ? `<div class="sidebar-user-avatar"><img src="${profile.picture}" alt=""></div>`
                    : `<div class="sidebar-user-avatar">${avatar}</div>`;
                sidebarAuth.innerHTML = `
                    <div class="sidebar-user" onclick="UIManager.navigate('settings')">
                        ${avatarHTML}
                        <div class="sidebar-user-info">
                            <div class="sidebar-user-name sf-truncate">${profile.preferred_username || profile.name || 'User'}</div>
                            <div class="sidebar-user-tier">${profile.tier || 'Free'} tier</div>
                        </div>
                    </div>`;
            } else {
                sidebarAuth.innerHTML = `
                    <div class="sidebar-user" onclick="UIManager.navigate('settings')">
                        <div class="sidebar-user-avatar">${ICON.key}</div>
                        <div class="sidebar-user-info">
                            <div class="sidebar-user-name">Key Active</div>
                            <div class="sidebar-user-tier">Session</div>
                        </div>
                    </div>`;
            }

            // Balance
            const bal = StorageManager.getBalance();
            const balEl = el('balancePill');
            if (bal && balEl) {
                const amount = typeof bal === 'object' ? (bal.remaining ?? bal.balance ?? '?') : bal;
                balEl.innerHTML = `${ICON.pollen} <span>${amount} pollen</span>`;
                balEl.style.display = 'flex';
            }
        } else {
            indicator.className = 'key-status disconnected';
            indicator.innerHTML = `<span class="key-status-dot"></span> No Key`;
            sidebarAuth.innerHTML = `
                <button class="sf-btn sf-btn-primary" style="width:100%" onclick="UIManager.navigate('settings')">
                    ${ICON.key} Connect Account
                </button>`;
            const balEl = el('balancePill');
            if (balEl) balEl.style.display = 'none';
        }
    }

    // ── Loading ──
    function setLoading(page, isLoading, text = '') {
        const loadEl = el(page + 'Loading');
        const contentEl = el(page + 'Content');
        const emptyEl = el(page + 'Empty');

        if (isLoading) {
            if (loadEl) { loadEl.classList.add('active'); loadEl.style.display = 'flex'; }
            if (contentEl) contentEl.style.display = 'none';
            if (emptyEl) emptyEl.style.display = 'none';
            if (text && loadEl) {
                const textEl = loadEl.querySelector('.loading-text');
                if (textEl) textEl.textContent = text;
            }
        } else {
            if (loadEl) { loadEl.classList.remove('active'); loadEl.style.display = 'none'; }
            if (contentEl) contentEl.style.display = '';
        }
    }

    // ── Render Storyboard Panels ──
    function renderPanels(panels, styleValue, apiKey, imageModel) {
        const grid = el('storyboardContent');
        const empty = el('storyboardEmpty');
        if (empty) empty.style.display = 'none';
        if (!grid) return;
        grid.style.display = '';

        grid.innerHTML = panels.map((prompt, i) => {
            const url = ApiClient.getImageUrl(prompt, styleValue, apiKey, { model: imageModel });
            GalleryManager.addImage(url, prompt, imageModel, styleValue);
            return `
                <div class="panel-card" style="animation-delay: ${i * 0.12}s">
                    <div class="panel-card-img">
                        <div class="sf-skeleton" style="position:absolute;inset:0" id="skel-${i}"></div>
                        <img src="${url}" alt="Panel ${i+1}" onload="this.classList.add('loaded');document.getElementById('skel-${i}').style.display='none'">
                        <div class="panel-card-badge">PANEL ${String(i+1).padStart(2,'0')}</div>
                        <div class="panel-card-overlay">
                            <div class="panel-card-actions">
                                <a href="${url}" download="panel-${i+1}.png" class="sf-btn sf-btn-sm sf-btn-secondary" onclick="event.stopPropagation()">${ICON.download} Save</a>
                            </div>
                        </div>
                    </div>
                    <div class="panel-card-text">${prompt}</div>
                </div>`;
        }).join('');
    }

    // ── Render History ──
    function renderHistory() {
        const list = el('historyList');
        if (!list) return;
        const items = StorageManager.getHistory();
        if (!items.length) {
            list.innerHTML = `<div style="padding: var(--sf-space-4); color: var(--sf-text-muted); font-size: var(--sf-text-xs); text-align: center;">No storyboards this session</div>`;
            return;
        }
        list.innerHTML = items.map(h => `
            <div class="sidebar-item" onclick="document.getElementById('storyboardPrompt').value='${h.concept.replace(/'/g, "\\'")}'; UIManager.navigate('storyboard');">
                <span class="sf-truncate" style="flex:1">${h.title}</span>
            </div>`).join('');
    }

    return {
        ICON,
        toast,
        navigate: navigateTo,
        updateKeyStatus,
        setLoading,
        renderPanels,
        renderHistory,
        getCurrentPage() { return currentPage; }
    };
})();