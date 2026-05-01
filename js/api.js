// ============================================================
// STORYFRAME STUDIO — API Client
// ============================================================

const ApiClient = (() => {
    const BASE = 'https://gen.pollinations.ai';

    function authHeaders(apiKey) {
        const h = { 'Content-Type': 'application/json' };
        if (apiKey) h['Authorization'] = `Bearer ${apiKey}`;
        return h;
    }

    return {
        /**
         * Generate storyboard panel descriptions via chat completions
         */
        async generatePanels(concept, apiKey, modelName = 'openai', panelCount = 4) {
            if (!apiKey) throw new Error('API key required. Connect your account in Settings.');

            const systemPrompt = `You are a professional storyboard architect and visual storyteller.
Break down the user's concept into EXACTLY ${panelCount} sequential visual panels for a cinematic storyboard.
For each panel, write a vivid, detailed visual description (2-3 sentences) focusing on composition, lighting, characters, and mood.
Separate each panel description ONLY by the exact delimiter '|||'.
Do NOT include panel numbers, prefixes, or any other text. Only the descriptions separated by |||.`;

            const res = await fetch(`${BASE}/v1/chat/completions`, {
                method: 'POST',
                headers: authHeaders(apiKey),
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: concept }
                    ],
                    temperature: 0.75,
                    max_tokens: 800
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error?.message || `Model error (${res.status})`);
            }

            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || '';
            if (!text) throw new Error('Empty response from language model.');

            let panels = text.split('|||').map(p => p.trim()).filter(p => p.length > 10);
            if (panels.length < panelCount) {
                // Fallback: try splitting by newlines
                panels = text.split('\n').map(p => p.replace(/^\d+[\.\)\-:]\s*/, '').trim()).filter(p => p.length > 10);
            }
            return panels.slice(0, panelCount);
        },

        /**
         * Get image URL for a panel/prompt
         */
        getImageUrl(prompt, style, apiKey, opts = {}) {
            const fullPrompt = style ? `${prompt}. ${style}` : prompt;
            const params = new URLSearchParams({
                seed: opts.seed || Math.floor(Math.random() * 9999999),
                width: opts.width || 1024,
                height: opts.height || 1024,
                nologo: 'true'
            });
            if (opts.model) params.set('model', opts.model);
            if (apiKey) params.set('key', apiKey);
            return `${BASE}/image/${encodeURIComponent(fullPrompt)}?${params}`;
        },

        /**
         * Generate single image via POST endpoint (for studio)
         */
        async generateImage(prompt, apiKey, opts = {}) {
            const params = new URLSearchParams({
                seed: opts.seed || Math.floor(Math.random() * 9999999),
                width: opts.width || 1024,
                height: opts.height || 1024,
                nologo: 'true'
            });
            if (opts.model) params.set('model', opts.model);
            if (apiKey) params.set('key', apiKey);

            const url = `${BASE}/image/${encodeURIComponent(prompt)}?${params}`;
            return url;
        },

        /**
         * Simple text generation
         */
        async generateText(prompt, apiKey, model = 'openai') {
            const res = await fetch(`${BASE}/v1/chat/completions`, {
                method: 'POST',
                headers: authHeaders(apiKey),
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error?.message || `Error (${res.status})`);
            }
            const data = await res.json();
            return data.choices?.[0]?.message?.content || '';
        }
    };
})();