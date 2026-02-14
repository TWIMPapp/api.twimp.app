// Reusable AI Service — Anthropic Claude wrapper
// Generic text generation that any game service can use
// SDK is lazy-loaded on first call — never imported at module load time

let anthropicClient: any = null;

async function getClient(): Promise<any> {
    if (!process.env.ANTHROPIC_API_KEY) {
        return null;
    }
    if (!anthropicClient) {
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    return anthropicClient;
}

export interface AIGenerateOptions {
    maxTokens?: number;
    model?: string;
    temperature?: number;
}

export class AIService {
    private static DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';
    private static DEFAULT_MAX_TOKENS = 1024;

    /**
     * Generate text using Claude. Returns the generated text, or null if
     * the API key is missing, the call fails, or no text is returned.
     * Callers should always provide a fallback for the null case.
     */
    static async generateText(
        systemPrompt: string,
        userPrompt: string,
        options: AIGenerateOptions = {}
    ): Promise<string | null> {
        const client = await getClient();
        if (!client) {
            console.warn('[AIService] No ANTHROPIC_API_KEY configured, returning null');
            return null;
        }

        const model = options.model || this.DEFAULT_MODEL;
        const maxTokens = options.maxTokens || this.DEFAULT_MAX_TOKENS;

        try {
            console.log(`[AIService] Generating text with ${model}, maxTokens=${maxTokens}`);
            const response = await client.messages.create({
                model,
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
                temperature: options.temperature ?? 0.8,
            });

            const textBlock = response.content.find((b: any) => b.type === 'text');
            const text = textBlock && 'text' in textBlock ? textBlock.text : null;

            if (text) {
                console.log(`[AIService] Generated ${text.length} chars`);
            } else {
                console.warn('[AIService] No text block in response');
            }

            return text;
        } catch (error: any) {
            console.error('[AIService] Error generating text:', error?.message || error);
            return null;
        }
    }
}
