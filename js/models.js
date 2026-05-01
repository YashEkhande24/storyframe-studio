// ============================================================
// STORYFRAME STUDIO — Dynamic Model Fetcher
// ============================================================

const ModelManager = (() => {
    const BASE = 'https://gen.pollinations.ai';

    // Provider grouping based on model name patterns
    const PROVIDERS = {
        'OpenAI':      m => m.name.startsWith('openai') || m.name.startsWith('gpt'),
        'Claude':      m => m.name.startsWith('claude'),
        'Gemini':      m => m.name.startsWith('gemini'),
        'DeepSeek':    m => m.name.startsWith('deepseek'),
        'Grok':        m => m.name.startsWith('grok'),
        'Qwen':        m => m.name.startsWith('qwen'),
        'Meta Llama':  m => m.name.startsWith('llama'),
        'Mistral':     m => m.name.startsWith('mistral'),
        'Perplexity':  m => m.name.startsWith('perplexity') || m.name.startsWith('sonar'),
        'Kimi':        m => m.name.startsWith('kimi'),
        'MiniMax':     m => m.name.startsWith('minimax'),
        'Nova':        m => m.name.startsWith('nova'),
        'GLM':         m => m.name.startsWith('glm'),
        'Flux':        m => m.name === 'flux' || m.name.startsWith('flux') || m.name === 'klein' || m.name === 'kontext',
        'GPT Image':   m => m.name.startsWith('gptimage') || m.name.startsWith('gpt-image'),
        'NanoBanana':  m => m.name.startsWith('nanobanana'),
        'Wan':         m => m.name.startsWith('wan'),
        'Other':       () => true
    };

    function groupByProvider(models) {
        const groups = {};
        const assigned = new Set();

        for (const [provName, matchFn] of Object.entries(PROVIDERS)) {
            const matched = models.filter(m => !assigned.has(m.name) && matchFn(m));
            if (matched.length > 0) {
                groups[provName] = matched;
                matched.forEach(m => assigned.add(m.name));
            }
        }
        return groups;
    }

    async function fetchModels(type) {
        // Check session cache first
        const cached = StorageManager.getModelCache(type);
        if (cached) return cached;

        try {
            const res = await fetch(`${BASE}/${type}/models`);
            if (!res.ok) throw new Error(`Failed to fetch ${type} models`);
            const models = await res.json();
            StorageManager.setModelCache(type, models);
            return models;
        } catch (e) {
            console.error(`Error fetching ${type} models:`, e);
            return [];
        }
    }

    function buildSelectHTML(models, type) {
        // Filter: for text, remove specialized. For image, only image output.
        let filtered = models;
        if (type === 'text') {
            filtered = models.filter(m =>
                !m.is_specialized &&
                !m.name.includes('audio') &&
                !m.name.includes('safety') &&
                !m.name.includes('polly')
            );
        } else if (type === 'image') {
            filtered = models.filter(m =>
                m.output_modalities && m.output_modalities.includes('image')
            );
        }

        const groups = groupByProvider(filtered);
        let html = '';

        for (const [provider, provModels] of Object.entries(groups)) {
            if (provModels.length === 0) continue;
            html += `<optgroup label="${provider}">`;
            for (const m of provModels) {
                const badges = [];
                if (m.reasoning) badges.push('🧠');
                if (m.paid_only) badges.push('💎');
                if (m.tools) badges.push('🔧');
                const badgeStr = badges.length ? ' ' + badges.join('') : '';
                const desc = m.description || m.name;
                html += `<option value="${m.name}" title="${desc}">${desc}${badgeStr}</option>`;
            }
            html += `</optgroup>`;
        }
        return html;
    }

    return {
        async loadTextModels() {
            const models = await fetchModels('text');
            return { models, html: buildSelectHTML(models, 'text') };
        },

        async loadImageModels() {
            const models = await fetchModels('image');
            return { models, html: buildSelectHTML(models, 'image') };
        },

        async loadAll() {
            const [text, image] = await Promise.all([
                this.loadTextModels(),
                this.loadImageModels()
            ]);
            return { text, image };
        }
    };
})();
