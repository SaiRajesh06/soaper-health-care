// src/api/config.ts
import { EXPO_PUBLIC_AZURE_API_KEY } from '@env';

export const AZURE_CONFIG = {
    API_KEY: EXPO_PUBLIC_AZURE_API_KEY || '',
    ENDPOINT: 'https://soaper-north.openai.azure.com',
    DEPLOYMENT_NAME: 'soaper-gpt4o',
    API_VERSION: '2024-05-01-preview'
};

export const getAzureEndpoint = () => {
    return `${AZURE_CONFIG.ENDPOINT}/openai/deployments/${AZURE_CONFIG.DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_CONFIG.API_VERSION}`;
};

export const DEFAULT_GPT_CONFIG = {
    temperature: 0,
    top_p: 0.95,
    max_tokens: 4000
};