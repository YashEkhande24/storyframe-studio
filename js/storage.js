// ============================================================
// STORYFRAME STUDIO — Session Storage (sessionStorage only)
// All data cleared when browser tab closes. Zero persistence.
// ============================================================

const StorageManager = (() => {
    const PREFIX = 'sf_';

    function _get(key) {
        try { return JSON.parse(sessionStorage.getItem(PREFIX + key)); }
        catch { return null; }
    }

    function _set(key, value) {
        sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
    }

    function _remove(key) {
        sessionStorage.removeItem(PREFIX + key);
    }

    return {
        // ── API Key ──
        getApiKey()  { return _get('api_key') || ''; },
        setApiKey(k) { _set('api_key', k); },
        hasKey()     { return !!this.getApiKey(); },
        clearKey()   { _remove('api_key'); _remove('user_profile'); _remove('balance'); },

        // ── User Profile ──
        getUserProfile()  { return _get('user_profile'); },
        setUserProfile(p) { _set('user_profile', p); },

        // ── Balance ──
        getBalance()  { return _get('balance'); },
        setBalance(b) { _set('balance', b); },

        // ── Gallery (in-memory backed by sessionStorage) ──
        getGallery() { return _get('gallery') || []; },
        addToGallery(item) {
            const gallery = this.getGallery();
            gallery.unshift({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                timestamp: Date.now(),
                ...item
            });
            // Keep max 50 items in session
            if (gallery.length > 50) gallery.length = 50;
            _set('gallery', gallery);
            return gallery;
        },
        clearGallery() { _remove('gallery'); },

        // ── Storyboard History ──
        getHistory() { return _get('history') || []; },
        addHistory(title, concept, panels) {
            const history = this.getHistory();
            history.unshift({
                id: Date.now().toString(36),
                title, concept, panels,
                date: new Date().toISOString()
            });
            if (history.length > 20) history.length = 20;
            _set('history', history);
            return history;
        },

        // ── Preferences (also session-only) ──
        getPref(key, fallback) { const v = _get('pref_' + key); return v !== null ? v : fallback; },
        setPref(key, value)    { _set('pref_' + key, value); },

        // ── Model Cache ──
        getModelCache(type) { return _get('models_' + type); },
        setModelCache(type, data) { _set('models_' + type, data); },

        // ── Full Clear ──
        clearAll() {
            const keys = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const k = sessionStorage.key(i);
                if (k.startsWith(PREFIX)) keys.push(k);
            }
            keys.forEach(k => sessionStorage.removeItem(k));
        }
    };
})();