import type { AiProvider, PromptContext, Suggestion } from "./provider";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export class OpenRouterProvider implements AiProvider {
  name = "OpenRouter";
  private apiKey: string;
  private model: string;
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async callApi(messages: Message[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": globalThis.location?.origin ?? "https://pix3lprompt.app",
        "X-Title": "Pix3lPrompt",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        (err as Record<string, Record<string, string>>)?.error?.message ??
          `OpenRouter API error: ${response.status}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async optimize(prompt: string, context: PromptContext): Promise<string> {
    const systemPrompt = `You are an expert AI prompt engineer. Optimize the following prompt for ${context.targetModel}. Rules:
- Reorder keywords by importance (most important first)
- Remove redundant terms
- Add appropriate weights where beneficial
- Suggest negative prompts if missing
- Keep the user's creative intent intact
- Return ONLY the optimized prompt text, no explanations.`;

    return this.callApi([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Optimize this prompt:\n\n${prompt}` },
    ]);
  }

  async generateVariations(
    prompt: string,
    count: number,
    context: PromptContext
  ): Promise<string[]> {
    const systemPrompt = `You are an expert AI prompt engineer. Generate exactly ${count} variations of the given prompt for ${context.targetModel}. Each variation should explore a different direction:
1. More detailed version
2. Different style/mood
3. Simplified/minimal version
4. Creative reinterpretation
${count > 4 ? "5-8. Additional creative explorations" : ""}
Return each variation on a new line, separated by "---". No explanations, just the prompts.`;

    const response = await this.callApi([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate ${count} variations of:\n\n${prompt}`,
      },
    ]);
    return response
      .split("---")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  async suggestImprovements(
    prompt: string,
    rating: number,
    notes: string
  ): Promise<Suggestion[]> {
    const systemPrompt = `You are an expert AI prompt engineer. Based on the user's rating and notes about a prompt result, suggest specific improvements. Return as JSON array: [{"type": "add"|"remove"|"modify", "target": "keyword or section", "suggestion": "what to change", "reason": "why"}]`;

    const response = await this.callApi([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Prompt: ${prompt}\nRating: ${rating}/5\nNotes: ${notes}\n\nSuggest improvements.`,
      },
    ]);

    try {
      return JSON.parse(response);
    } catch {
      return [
        {
          type: "modify",
          target: "prompt",
          suggestion: response,
          reason: "AI suggestion (unparseable JSON)",
        },
      ];
    }
  }

  async testConnection(): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    return response.ok;
  }
}
