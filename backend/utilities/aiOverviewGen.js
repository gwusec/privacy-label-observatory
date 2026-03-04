import { GoogleGenAI  } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePrivacySummary(appName, privacyData) {
    try {
        const prompt = `
            You are analyzing app privacy labels from an app on the app store.
            Do NOT use Markdown formatting (no asterisks).
            Ensure each section starts on a new line.
            The app name is: ${appName}

            Privacy label data (JSON):
            ${JSON.stringify(privacyData, null, 2)}

            Write a short, neutral summary in the format below (dont use bullet points). If there is No Data Collected for any of the 3 sections below, omit it:
            Data Used to Track You:
            - (1-2) sentence summary of tracking data changes even if there's only a couple of changes

            Data Linked to You:
            - (1-2) sentence summary of linked data changes even if there's only a couple of changes

            Data Not Linked to You:
            - (1-2) sentence summary of non-linked data changes even if there's only a couple of changes

            If there is no privacy data available or there's no changes "No changes in data collection or usage.".
            Avoid legal language. Be concise.
            `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [prompt],
            generationConfig: {
                temperature: 0.1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 1024,
            }
        });
        return response.text;
    }
    catch (error) {
        console.error("Error generating privacy summary:", error);
        return "Unable to generate privacy summary at this time.";
    }
}