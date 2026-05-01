// js/api.js
class ApiClient {
    static async generatePanels(concept, apiKey, modelName = "openai") {
        if (!apiKey) throw new Error("API Key is missing. Please configure it in settings.");
        
        const systemPrompt = `You are a professional storyboard architect. 
        Your job is to break down the user's concept into EXACTLY 4 sequential comic panels.
        Provide a visual descripion for each panel, separated ONLY by the exact delimiter '|||'.
        Respond with nothing else. No prefixes, no panel numbers.`;

        const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: concept }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Failed to generate sequence from Pollinations AI");
        }

        const data = await response.json();
        let textData = "";
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            textData = data.choices[0].message.content;
        } else {
            throw new Error("Invalid response format from Pollinations API");
        }
        
        let panels = textData.split('|||').map(p => p.trim()).filter(p => p.length > 5);
        if (panels.length < 4) {
            panels = textData.split('\n').map(p => p.trim()).filter(p => p.length > 5);
        }
        
        return panels.slice(0, 4);
    }

    static getImageUrl(panelPrompt, style, index) {
        const fullPrompt = `${panelPrompt}. ${style}`;
        const randomSeed = Math.floor(Math.random() * 9999999);
        return `https://gen.pollinations.ai/image/${encodeURIComponent(fullPrompt)}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;
    }
}