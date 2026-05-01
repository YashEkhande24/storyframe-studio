// js/storage.js
class StorageManager {
    static getApiKey() {
        return localStorage.getItem('sb_openai_key') || '';
    }

    static setApiKey(key) {
        localStorage.setItem('sb_openai_key', key);
    }

    static hasKey() {
        return !!this.getApiKey();
    }

    static getHistory() {
        try {
            return JSON.parse(localStorage.getItem('sb_history')) || [];
        } catch {
            return [];
        }
    }

    static addHistory(title, concept) {
        const history = this.getHistory();
        history.unshift({
            id: Date.now().toString(),
            title: title,
            concept: concept,
            date: new Date().toISOString()
        });
        localStorage.setItem('sb_history', JSON.stringify(history));
        return history;
    }
}