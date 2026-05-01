// js/app.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize UI Elements
    UIManager.init();
    
    // Check if icons need rendering
    if (window.lucide) {
        lucide.createIcons();
    }

    const { generateBtn, conceptInput, artStyleSelect } = UIManager.elements;

    // 2. Bind Generate Action
    generateBtn.addEventListener('click', async () => {
        const concept = conceptInput.value.trim();
        if (!concept) {
            conceptInput.focus();
            return;
        }

        const apiKey = StorageManager.getApiKey();
        if (!apiKey) {
            UIManager.toggleModal(true);
            return;
        }

        UIManager.setLoading(true, "Architecting narrative via OpenAI...");

        try {
            const panels = await ApiClient.generatePanels(concept, apiKey);
            
            if (!panels || panels.length === 0) {
                throw new Error("No sequence was returned from the language model.");
            }

            UIManager.setLoading(false);
            
            // Save to history
            const title = concept.split(' ').slice(0, 5).join(' ') + '...';
            StorageManager.addHistory(title, concept);
            UIManager.renderHistory();

            // Render
            UIManager.renderPanels(panels, artStyleSelect.value);

        } catch (error) {
            console.error("Error during generation:", error);
            UIManager.setLoading(false);
            UIManager.showError(error.message || "An unexpected error occurred during sequence generation.");
        }
    });

    // Support Enter Key (Ctrl+Enter for textareas)
    conceptInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            generateBtn.click();
        }
    });

    // Make utility functions global for inline handlers
    window.UIManager = UIManager;
});