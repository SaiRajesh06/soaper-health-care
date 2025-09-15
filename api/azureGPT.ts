// src/api/azureGPT.ts
import fetch from 'node-fetch';
import { AZURE_CONFIG, getAzureEndpoint, DEFAULT_GPT_CONFIG } from './config';

export type Message = {
    role: 'system' | 'user' | 'assistant';
    content: any;
};

type ChatCompletionRequest = {
    messages: Message[];
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
};

export class AzureGPTClient {
    private headers: Record<string, string>;

    constructor() {
        console.log('API Key:', AZURE_CONFIG.API_KEY); // Remove this in production
        this.headers = {
            'Content-Type': 'application/json',
            'api-key': AZURE_CONFIG.API_KEY,
            'Authorization': `Bearer ${AZURE_CONFIG.API_KEY}`
        };
    }

    async sendChatCompletion(messages: Message[], config = {}): Promise<any> {
        if (!AZURE_CONFIG.API_KEY) {
            throw new Error('Azure API key is not configured');
        }

        const payload: ChatCompletionRequest = {
            messages,
            ...DEFAULT_GPT_CONFIG,
            ...config,
        };

        try {
            const response = await fetch(getAzureEndpoint(), {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Azure API Response:', {
                    status: response.status,
                    headers: response.headers,
                    body: errorText
                });
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error calling Azure OpenAI:', error);
            throw error;
        }
    }

    async generateResponse(prompt: string, systemMessage?: string): Promise<string> {
        const messages: Message[] = [];
        if (systemMessage) {
            messages.push({
                role: 'system',
                content: systemMessage,
            });
        }
        messages.push({
            role: 'user',
            content: prompt,
        });

        try {
            const response = await this.sendChatCompletion(messages);
            return response.choices?.[0]?.message?.content || '';
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }

    async analyzeImage(imageBase64: string, systemPrompt: string): Promise<any> {
        const messages: Message[] = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/webp;base64,${imageBase64}`
                        }
                    }
                ]
            }
        ];

        try {
            const response = await this.sendChatCompletion(messages);
            return response.choices?.[0]?.message?.content || '';
        } catch (error) {
            console.error('Error analyzing image:', error);
            throw error;
        }
    }
}

export const azureGPT = new AzureGPTClient();