// ============================================================
// STORYFRAME STUDIO — Gallery Module (in-memory + sessionStorage)
// ============================================================

const GalleryManager = (() => {
    let lightboxActive = false;

    function renderGrid(container) {
        const items = StorageManager.getGallery();
        if (!items.length) {
            container.innerHTML = `
                <div class="gallery-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    <h3>No images yet</h3>
                    <p>Generated images from Storyboard and Image Studio will appear here during this session.</p>
                </div>`;
            return;
        }

        container.innerHTML = items.map((item, i) => `
            <div class="gallery-item" style="animation-delay: ${i * 0.05}s" onclick="GalleryManager.openLightbox('${item.url}')">
                <div class="gallery-item-img">
                    <img src="${item.url}" alt="${item.prompt || ''}" loading="lazy">
                </div>
                <div class="gallery-item-meta">
                    <div class="gallery-item-model">${item.model || 'Unknown'} · ${item.style || ''}</div>
                    <div class="gallery-item-prompt">${item.prompt || ''}</div>
                </div>
            </div>
        `).join('');
    }

    function openLightbox(url) {
        const overlay = document.getElementById('lightbox');
        if (!overlay) return;
        overlay.querySelector('img').src = url;
        overlay.classList.add('active');
        lightboxActive = true;
    }

    function closeLightbox() {
        const overlay = document.getElementById('lightbox');
        if (!overlay) return;
        overlay.classList.remove('active');
        lightboxActive = false;
    }

    return {
        render(container) { renderGrid(container); },
        openLightbox,
        closeLightbox,
        isLightboxActive() { return lightboxActive; },

        addImage(url, prompt, model, style) {
            StorageManager.addToGallery({ url, prompt, model, style });
        }
    };
})();
