// ============================================================
// STORYFRAME STUDIO — Application Controller
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    // ── 1. Handle OAuth redirect ──
    const redirectedKey = AuthManager.handleRedirect();
    if (redirectedKey) {
        UIManager.toast('Account connected successfully!', 'success');
        AuthManager.fetchProfile(redirectedKey);
        AuthManager.fetchBalance(redirectedKey);
    }

    // ── 2. Load models into dropdowns ──
    try {
        const { text, image } = await ModelManager.loadAll();
        const textSelect = document.getElementById('textModelSelect');
        const imageSelect = document.getElementById('imageModelSelect');
        const studioImageSelect = document.getElementById('studioImageModel');

        if (textSelect && text.html) textSelect.innerHTML = text.html;
        if (imageSelect && image.html) imageSelect.innerHTML = image.html;
        if (studioImageSelect && image.html) studioImageSelect.innerHTML = image.html;
    } catch (e) {
        console.error('Failed to load models:', e);
    }

    // ── 3. Update UI state ──
    UIManager.updateKeyStatus();
    UIManager.renderHistory();

    // ── 4. Sidebar navigation ──
    document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
        item.addEventListener('click', () => UIManager.navigate(item.dataset.page));
    });

    // ── 5. Storyboard generation ──
    const storyboardBtn = document.getElementById('storyboardGenBtn');
    const storyboardPrompt = document.getElementById('storyboardPrompt');

    if (storyboardBtn) {
        storyboardBtn.addEventListener('click', async () => {
            const concept = storyboardPrompt.value.trim();
            if (!concept) { storyboardPrompt.focus(); return; }

            const apiKey = StorageManager.getApiKey();
            if (!apiKey) {
                UIManager.toast('Connect your account first.', 'warning');
                UIManager.navigate('settings');
                return;
            }

            const textModel = document.getElementById('textModelSelect')?.value || 'openai';
            const imageModel = document.getElementById('imageModelSelect')?.value || 'flux';
            const artStyle = document.getElementById('artStyleSelect')?.value || '';
            const panelCount = parseInt(document.getElementById('panelCountSelect')?.value || '4');

            UIManager.setLoading('storyboard', true, `Generating ${panelCount}-panel storyboard...`);

            try {
                const panels = await ApiClient.generatePanels(concept, apiKey, textModel, panelCount);
                if (!panels?.length) throw new Error('No panels generated.');

                UIManager.setLoading('storyboard', false);

                const title = concept.split(' ').slice(0, 6).join(' ') + '…';
                StorageManager.addHistory(title, concept, panels);
                UIManager.renderHistory();
                UIManager.renderPanels(panels, artStyle, apiKey, imageModel);
                UIManager.toast(`${panels.length} panels generated!`, 'success');
            } catch (err) {
                UIManager.setLoading('storyboard', false);
                UIManager.toast(err.message, 'error');
                document.getElementById('storyboardContent').innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: var(--sf-space-12); color: var(--sf-error);">
                        <p style="font-weight: 600; margin-bottom: var(--sf-space-2);">Generation Failed</p>
                        <p style="font-size: var(--sf-text-sm); color: var(--sf-text-tertiary);">${err.message}</p>
                    </div>`;
                document.getElementById('storyboardContent').style.display = '';
                document.getElementById('storyboardEmpty').style.display = 'none';
            }
        });

        // Ctrl+Enter
        storyboardPrompt?.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') storyboardBtn.click();
        });
    }

    // ── 6. Image Studio generation ──
    const studioBtn = document.getElementById('studioGenBtn');
    const studioPrompt = document.getElementById('studioPrompt');

    if (studioBtn) {
        studioBtn.addEventListener('click', async () => {
            const prompt = studioPrompt.value.trim();
            if (!prompt) { studioPrompt.focus(); return; }

            const apiKey = StorageManager.getApiKey();
            if (!apiKey) {
                UIManager.toast('Connect your account first.', 'warning');
                UIManager.navigate('settings');
                return;
            }

            const model = document.getElementById('studioImageModel')?.value || 'flux';
            const width = document.getElementById('studioWidth')?.value || '1024';
            const height = document.getElementById('studioHeight')?.value || '1024';
            const seed = document.getElementById('studioSeed')?.value || '';

            const canvas = document.getElementById('studioCanvas');
            canvas.innerHTML = `<div class="loading-state active"><div class="loading-spinner"></div><div class="loading-text">Generating image...</div></div>`;

            try {
                const url = await ApiClient.generateImage(prompt, apiKey, {
                    model, width: parseInt(width), height: parseInt(height),
                    seed: seed ? parseInt(seed) : undefined
                });

                const img = new Image();
                img.onload = () => {
                    canvas.innerHTML = '';
                    canvas.appendChild(img);
                    GalleryManager.addImage(url, prompt, model, '');
                    UIManager.toast('Image generated!', 'success');
                };
                img.onerror = () => {
                    canvas.innerHTML = `<div class="studio-canvas-empty"><p style="color: var(--sf-error)">Failed to load image. Check your API key and try again.</p></div>`;
                    UIManager.toast('Image generation failed.', 'error');
                };
                img.src = url;
                img.style.cursor = 'zoom-in';
                img.onclick = () => GalleryManager.openLightbox(url);
            } catch (err) {
                canvas.innerHTML = `<div class="studio-canvas-empty"><p style="color: var(--sf-error)">${err.message}</p></div>`;
                UIManager.toast(err.message, 'error');
            }
        });

        studioPrompt?.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') studioBtn.click();
        });
    }

    // ── 7. Settings ──
    const saveKeyBtn = document.getElementById('saveKeyBtn');
    const keyInput = document.getElementById('apiKeyInput');
    const oauthBtn = document.getElementById('oauthBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (saveKeyBtn && keyInput) {
        keyInput.value = StorageManager.getApiKey();
        saveKeyBtn.addEventListener('click', async () => {
            const key = keyInput.value.trim();
            if (!key) { UIManager.toast('Enter an API key.', 'warning'); return; }
            saveKeyBtn.disabled = true;
            saveKeyBtn.textContent = 'Connecting...';
            await AuthManager.loginWithKey(key);
            UIManager.updateKeyStatus();
            UIManager.toast('API key saved for this session.', 'success');
            saveKeyBtn.disabled = false;
            saveKeyBtn.textContent = 'Save Key';
        });
    }

    if (oauthBtn) {
        oauthBtn.addEventListener('click', () => AuthManager.startOAuth());
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AuthManager.logout();
            keyInput.value = '';
            UIManager.updateKeyStatus();
            UIManager.toast('Disconnected. Data cleared.', 'info');
        });
    }

    // ── 8. Lightbox close ──
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', () => GalleryManager.closeLightbox());
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && GalleryManager.isLightboxActive()) GalleryManager.closeLightbox();
    });

    // ── 9. Default page ──
    UIManager.navigate('storyboard');
});