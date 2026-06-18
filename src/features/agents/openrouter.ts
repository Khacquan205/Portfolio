/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared OpenRouter client — every agent talks to its model through
 * OpenRouter's OpenAI-compatible API using a single OPENROUTER_API_KEY.
 */
import OpenAI from "openai";

export function getOpenRouterClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY!,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.APP_URL || "https://github.com",
      "X-Title": "Portfolio AI Agent Team",
    },
  });
}

// Free OpenRouter model used by all agents.
export const OPENROUTER_MODELS = {
  leader: "openai/gpt-oss-20b:free",
  worker: "openai/gpt-oss-20b:free",
} as const;
