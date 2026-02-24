/**
 * @file llm-client.ts
 * @description Claude LLM integration wrapper with error handling and model configuration
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import Anthropic from '@anthropic-ai/sdk';
import { UXPilotError } from './types.js';

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 8192;

export interface LLMClientOptions {
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

export class LLMClient {
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor(options: LLMClientOptions) {
    if (!options.apiKey) {
      throw new UXPilotError(
        'Anthropic API key is required',
        'INVALID_INPUT',
        { field: 'apiKey' },
      );
    }

    this.client = new Anthropic({ apiKey: options.apiKey });
    this.model = options.model ?? process.env['ANTHROPIC_MODEL'] ?? DEFAULT_MODEL;
    this.maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  }

  async chat(
    systemPrompt: string,
    userMessage: string,
    options: ChatOptions = {},
  ): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: options.maxTokens ?? this.maxTokens,
        temperature: options.temperature ?? 0.3,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new UXPilotError(
          'LLM returned no text content',
          'LLM_ERROR',
          { stopReason: response.stop_reason },
        );
      }

      return textBlock.text;
    } catch (error: unknown) {
      if (error instanceof UXPilotError) {
        throw error;
      }

      if (error instanceof Anthropic.APIError) {
        throw new UXPilotError(
          `Anthropic API error: ${error.message}`,
          'LLM_ERROR',
          {
            status: error.status,
            type: error.error?.type ?? 'unknown',
          },
        );
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new UXPilotError(
        `Unexpected LLM error: ${message}`,
        'LLM_ERROR',
        { originalError: message },
      );
    }
  }

  async chatJSON<T>(
    systemPrompt: string,
    userMessage: string,
    options: ChatOptions = {},
  ): Promise<T> {
    const raw = await this.chat(
      systemPrompt + '\n\nYou MUST respond with valid JSON only. No markdown fences, no commentary.',
      userMessage,
      options,
    );

    try {
      const cleaned = raw.replace(/^```(?:json)?\n?/gm, '').replace(/```$/gm, '').trim();
      return JSON.parse(cleaned) as T;
    } catch {
      throw new UXPilotError(
        'Failed to parse LLM response as JSON',
        'PARSE_ERROR',
        { rawResponse: raw.slice(0, 500) },
      );
    }
  }
}
