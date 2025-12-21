import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, never expose the key on the client side without restrictions.
// We will use a placeholder logic if the key isn't present in environment.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const generateTutorResponse = async (
    history: { role: string; text: string }[], 
    userMessage: string
): Promise<string> => {
    
    if (!ai) {
        // Fallback simulation if no API key is set for the demo
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("🤖 Modo Demo: Para respuestas reales de IA, por favor configura tu API KEY de Google Gemini. Mientras tanto: ¡Esa es una excelente pregunta sobre el curso! Te recomiendo revisar la clase del Martes de la Semana 1.");
            }, 1000);
        });
    }

    try {
        const model = 'gemini-3-flash-preview';
        const systemInstruction = "Eres un tutor experto y amigable del programa de educación 'SimpleData'. Ayudas a los estudiantes a entender conceptos de IA, Python, y Automatización. Tus respuestas son concisas, motivadoras y usan emojis ocasionalmente.";

        // Construct context from history limited to last few turns for efficiency
        const context = history.slice(-5).map(h => `${h.role}: ${h.text}`).join('\n');
        const prompt = `${context}\nuser: ${userMessage}`;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text || "Lo siento, no pude generar una respuesta en este momento.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Tuve un problema conectando con mi cerebro digital. Por favor intenta de nuevo.";
    }
};