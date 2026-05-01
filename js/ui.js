// js/ui.js
class UIManager {
    static init() {
        this.elements = {
            btnSettings: document.getElementById('btnSettings'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettingsModal: document.getElementById('closeSettingsModal'),
            apiKeyInput: document.getElementById('apiKeyInput'),
            saveSettingsBtn: document.getElementById('saveSettingsBtn'),
            keyStatus: document.getElementById('keyStatus'),
            conceptInput: document.getElementById('conceptInput'),
            generateBtn: document.getElementById('generateBtn'),
            loadingState: document.getElementById('loadingState'),
            loadingText: document.getElementById('loadingText'),
            comicGrid: document.getElementById('comicGrid'),
            emptyState: document.getElementById('emptyState'),
            artStyleSelect: document.getElementById('artStyleSelect'),
            modelSelect: document.getElementById('modelSelect'),
            historyList: document.getElementById('historyList')
        };

        this.bindEvents();
        this.updateKeyStatus();
        this.renderHistory();
    }

    static bindEvents() {
        this.elements.btnSettings.addEventListener('click', () => this.toggleModal(true));
        this.elements.closeSettingsModal.addEventListener('click', () => this.toggleModal(false));
        this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        
        // Close modal on click outside
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) this.toggleModal(false);
        });

        // Initialize input
        this.elements.apiKeyInput.value = StorageManager.getApiKey();
    }

    static toggleModal(show) {
        const m = this.elements.settingsModal;
        const c = document.getElementById('settingsContent');
        if (show) {
            m.classList.remove('hidden');
            setTimeout(() => {
                m.classList.remove('opacity-0');
                c.classList.remove('scale-95');
                c.classList.add('scale-100');
            }, 10);
        } else {
            m.classList.add('opacity-0');
            c.classList.remove('scale-100');
            c.classList.add('scale-95');
            setTimeout(() => m.classList.add('hidden'), 300);
        }
    }

    static saveSettings() {
        const val = this.elements.apiKeyInput.value.trim();
        StorageManager.setApiKey(val);
        this.updateKeyStatus();
        this.toggleModal(false);
    }

    static updateKeyStatus() {
        const hasKey = StorageManager.hasKey();
        const stat = this.elements.keyStatus;
        if (hasKey) {
            stat.innerHTML = '<i data-lucide="check-circle" class="w-3 h-3"></i> Key Configured';
            stat.className = 'text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-md flex items-center gap-1 cursor-pointer hover:bg-green-500/30';
        } else {
            stat.innerHTML = '<i data-lucide="key" class="w-3 h-3"></i> Missing Key';
            stat.className = 'text-xs px-2 py-1 bg-red-500/20 text-red-500 rounded-md flex items-center gap-1 cursor-pointer hover:bg-red-500/30';
        }
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    static setLoading(isLoading, text = "Architecting Storyboard...") {
        this.elements.generateBtn.disabled = isLoading;
        this.elements.conceptInput.disabled = isLoading;
        this.elements.loadingText.innerText = text;

        if (isLoading) {
            this.elements.comicGrid.innerHTML = '';
            this.elements.emptyState.classList.add('hidden');
            this.elements.loadingState.classList.remove('hidden');
            this.elements.loadingState.classList.add('flex');
        } else {
            this.elements.loadingState.classList.add('hidden');
            this.elements.loadingState.classList.remove('flex');
        }
    }

    static renderHistory() {
        const hList = StorageManager.getHistory();
        this.elements.historyList.innerHTML = hList.map(h => `
            <div class="p-3 bg-gray-950 border border-gray-800 rounded-lg hover:border-gray-700 cursor-pointer transition-colors group">
                <div class="text-sm font-medium text-gray-200 truncate group-hover:text-blue-400">
                    ${h.title}
                </div>
                <div class="text-xs text-gray-500 mt-1 truncate">
                    ${h.concept}
                </div>
            </div>
        `).join('');
    }

    static renderPanels(panels, styleValue, apiKey) {
        this.elements.emptyState.classList.add('hidden');
        
        const html = panels.map((prompt, index) => {
            const imgUrl = ApiClient.getImageUrl(prompt, styleValue, index, apiKey);
            
            return `
                <div class="bg-gray-900 border border-gray-800 p-3 rounded-xl shadow-2xl panel-wrapper" style="animation-delay: ${index * 0.15}s">
                    <div class="relative group overflow-hidden rounded-lg bg-gray-950 aspect-square">
                        <!-- Standard Skeleton Loading -->
                        <div class="absolute inset-0 skeleton-bg" id="skel-${index}"></div>
                        
                        <img src="${imgUrl}" alt="Panel ${index+1}" class="w-full h-full object-cover relative z-10 transition-opacity duration-300 opacity-0"
                            onload="
                                this.style.opacity='1'; 
                                document.getElementById('skel-${index}').style.opacity='0';
                                this.parentElement.nextElementSibling.classList.remove('opacity-0');
                                this.parentElement.nextElementSibling.classList.add('opacity-100');
                            ">
                        
                        <!-- Badge -->
                        <div class="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white font-black text-sm px-3 py-1 rounded-md border border-gray-700/50 z-20 shadow-xl">
                            Phase 0${index + 1}
                        </div>
                        
                        <!-- Hover Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                    </div>
                    
                    <p class="text-gray-400 text-sm font-medium mt-4 px-2 pb-2 leading-relaxed tracking-wide opacity-0 transition-opacity duration-500 min-h-[4rem]">
                        ${prompt}
                    </p>
                </div>
            `;
        });

        this.elements.comicGrid.innerHTML = html.join('');
    }

    static showError(msg) {
        this.elements.emptyState.classList.add('hidden');
        this.elements.comicGrid.innerHTML = `
            <div class="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 border border-red-900/50 rounded-xl bg-red-950/20">
                <i data-lucide="alert-triangle" class="text-red-500 w-12 h-12 mb-4"></i>
                <h3 class="text-red-400 font-bold mb-1">Architecture Failure</h3>
                <p class="text-red-300/80 text-center text-sm">${msg}</p>
                <button onclick="UIManager.elements.btnSettings.click()" class="mt-4 px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-200 text-xs rounded-lg transition-colors border border-red-800/50">Open Settings</button>
            </div>
        `;
        if (window.lucide) {
            lucide.createIcons();
        }
    }
}