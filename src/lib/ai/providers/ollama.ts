import { z } from 'zod';
import { AIProvider } from '../types';

export class OllamaProvider implements AIProvider {
  name = 'Ollama';
  private endpoint = 'http://localhost:11434';
  private model: string;
  private timeoutMs: number;

  constructor() {
    this.model = process.env.OLLAMA_MODEL || 'llama3';
    // Timeout of 25 seconds by default, configurable
    const configuredTimeout = process.env.OLLAMA_TIMEOUT ? parseInt(process.env.OLLAMA_TIMEOUT, 10) : 25;
    this.timeoutMs = configuredTimeout * 1000;
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Lightweight check: ping endpoint with a 2-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(`${this.endpoint}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  private cleanJSON(text: string): string {
    let clean = text.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(json)?/i, '');
      clean = clean.replace(/```$/, '');
    }
    return clean.trim();
  }

  async generate<T>(
    type: 'business' | 'products' | 'landing_page' | 'marketing',
    prompt: string,
    schema: z.ZodSchema<T>,
    systemPrompt: string
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          format: 'json', // Tells Ollama to structure output as JSON
          stream: false,
          options: {
            temperature: 0.2,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}`);
      }

      const responseData = await response.json();
      const rawText = responseData.message?.content;
      if (!rawText) {
        throw new Error('Ollama returned empty content');
      }

      const cleanedText = this.cleanJSON(rawText);
      const jsonParsed = JSON.parse(cleanedText);

      // Zod validation (First-phase)
      const parseResult = schema.safeParse(jsonParsed);
      if (!parseResult.success) {
        throw new Error(`Ollama JSON failed validation: ${parseResult.error.message}`);
      }

      return parseResult.data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Ollama request timed out after ${this.timeoutMs / 1000}s`);
      }
      throw err;
    }
  }
}
