import { z } from 'zod';
import { AIProvider } from '../types';

export class GroqProvider implements AIProvider {
  name = 'Groq';
  private apiKey: string | undefined;
  private model = 'llama-3.3-70b-versatile'; // Standard high-speed Groq model

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
  }

  async isHealthy(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      // Lightweight check: ping Groq model list using AbortController with 2s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Strip markdown code block wrappers if any
  private cleanJSON(text: string): string {
    let clean = text.trim();
    if (clean.startsWith('```')) {
      // Remove starting ```json or ```
      clean = clean.replace(/^```(json)?/i, '');
      // Remove ending ```
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
    if (!this.apiKey) {
      throw new Error('Groq API Key is not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout limit

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const responseData = await response.json();
      const rawText = responseData.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error('Groq returned empty chat completion content');
      }

      const cleanedText = this.cleanJSON(rawText);
      const jsonParsed = JSON.parse(cleanedText);

      // The router normalizes provider JSON before schema validation. Validating
      // here would reject repairable AI drift, such as "LinkedIn Post".
      void schema;
      return jsonParsed as T;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Groq API request timed out (15s limit)');
      }
      throw err;
    }
  }
}
