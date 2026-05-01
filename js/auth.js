// ============================================================
// STORYFRAME STUDIO — Auth Module (BYOP OAuth)
// ============================================================

const AuthManager = (() => {
    const AUTH_BASE = 'https://enter.pollinations.ai';
    const USERINFO_URL = AUTH_BASE + '/api/device/userinfo';
    const BALANCE_URL = 'https://gen.pollinations.ai/account/balance';

    return {
        /**
         * Redirect user to Pollinations authorize screen
         */
        startOAuth() {
            const params = new URLSearchParams({
                redirect_uri: window.location.origin + window.location.pathname,
                budget: '50',
                expiry: '1',  // 1 day — session app
            });
            window.location.href = `${AUTH_BASE}/authorize?${params}`;
        },

        /**
         * Check URL fragment for api_key after redirect
         * Returns the key if found, null otherwise
         */
        handleRedirect() {
            const hash = window.location.hash;
            if (!hash) return null;

            const params = new URLSearchParams(hash.slice(1));
            const apiKey = params.get('api_key');
            const error = params.get('error');

            // Clear the hash
            history.replaceState(null, '', window.location.pathname + window.location.search);

            if (error) {
                console.warn('OAuth denied:', error);
                return null;
            }

            if (apiKey) {
                StorageManager.setApiKey(apiKey);
                return apiKey;
            }
            return null;
        },

        /**
         * Fetch user profile from userinfo endpoint
         */
        async fetchProfile(apiKey) {
            if (!apiKey) return null;
            try {
                const res = await fetch(USERINFO_URL, {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (!res.ok) return null;
                const profile = await res.json();
                StorageManager.setUserProfile(profile);
                return profile;
            } catch (e) {
                console.warn('Failed to fetch profile:', e);
                return null;
            }
        },

        /**
         * Fetch account balance
         */
        async fetchBalance(apiKey) {
            if (!apiKey) return null;
            try {
                const res = await fetch(BALANCE_URL, {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (!res.ok) return null;
                const balance = await res.json();
                StorageManager.setBalance(balance);
                return balance;
            } catch (e) {
                console.warn('Failed to fetch balance:', e);
                return null;
            }
        },

        /**
         * Full login flow: manual key entry
         */
        async loginWithKey(apiKey) {
            StorageManager.setApiKey(apiKey);
            const [profile, balance] = await Promise.allSettled([
                this.fetchProfile(apiKey),
                this.fetchBalance(apiKey)
            ]);
            return {
                profile: profile.status === 'fulfilled' ? profile.value : null,
                balance: balance.status === 'fulfilled' ? balance.value : null
            };
        },

        /**
         * Logout
         */
        logout() {
            StorageManager.clearKey();
        },

        /**
         * Check if we have a valid session
         */
        isAuthenticated() {
            return StorageManager.hasKey();
        }
    };
})();
