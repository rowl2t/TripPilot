export interface StructuredResponseRequest {
  model: string;
  prompt: string;
  schemaName: string;
}

export interface StructuredResponseResult<T> {
  output: T;
  usage: { inputTokens: number; outputTokens: number };
}

export interface OpenAIResponsesAdapter {
  generateStructured<T>(request: StructuredResponseRequest, mock: T): Promise<StructuredResponseResult<T>>;
}

export const createOpenAIResponsesAdapter = (): OpenAIResponsesAdapter => ({
  async generateStructured<T>(_request: StructuredResponseRequest, mock: T) {
    return { output: mock, usage: { inputTokens: 500, outputTokens: 800 } };
  }
});
