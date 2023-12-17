// translateText.tsx

interface TranslateTextParams {
    text: string;
    translationMethod: string;  // 使用 string 类型
    targetLanguage: string;
    sourceLanguage: string;
    apiKey?: string;
}

export const translateText = async ({
    text,
    translationMethod,
    targetLanguage,
    sourceLanguage,
    apiKey,
}: TranslateTextParams): Promise<string | null> => {
    try {
        switch (translationMethod) {
            case "google": {
                const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        q: text,
                        target: targetLanguage,
                        source: sourceLanguage,
                    }),
                });

                const data = await response.json();
                return data.data.translations[0].translatedText;
            }
            case "deepl": {
                const response = await fetch("/api/deepl", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: text,
                        target_lang: targetLanguage,
                        source_lang: sourceLanguage,
                        authKey: apiKey,
                    }),
                });

                const data = await response.json();
                return data.translations[0].text;
            }
            case "deeplx": {
                const url = `https://deeplx.aishort.top/translate`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: text,
                        target_lang: targetLanguage,
                        source_lang: sourceLanguage,
                    }),
                });

                const data = await response.json();
                return data.data;
            }
            default:
                throw new Error(`Unsupported translation method: ${translationMethod}`);
        }
    } catch (error) {
        console.error(`Failed to translate text: ${error}`);
        return null;
    }
};
