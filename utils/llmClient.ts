/**
 * Unified LLM Client for Kintsugi
 * Handles communication with Claude (Anthropic) API
 * Part of the Kintsugi AI Upgrade
 */

// Types
export interface LLMConfig {
  provider: 'anthropic' | 'openai';
  model: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
  model: string;
  cached?: boolean;
}

export interface CostTracker {
  today: number;
  total: number;
  lastReset: string;
  canMakeRequest: () => boolean;
  addCost: (cost: number) => void;
  reset: () => void;
}

// Cost per 1M tokens (as of 2024)
const PRICING = {
  'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'gpt-4o': { input: 5.00, output: 15.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
};

// Daily budget (default $5)
const DAILY_BUDGET = parseFloat(process.env.LLM_DAILY_BUDGET || '5.00');

// Cost tracker
let costTracker: CostTracker = {
  today: 0,
  total: 0,
  lastReset: new Date().toDateString(),
  canMakeRequest: function() {
    // Reset if new day
    const today = new Date().toDateString();
    if (this.lastReset !== today) {
      this.today = 0;
      this.lastReset = today;
    }
    return this.today < DAILY_BUDGET;
  },
  addCost: function(cost: number) {
    this.today += cost;
    this.total += cost;
  },
  reset: function() {
    this.today = 0;
    this.lastReset = new Date().toDateString();
  }
};

/**
 * Calculate cost for a request
 */
function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = PRICING[model as keyof typeof PRICING] || PRICING['claude-sonnet-4-20250514'];
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Anonymize text before sending to LLM
 * Removes potentially identifying information
 */
export function anonymizeText(text: string): string {
  return text
    // Names (First Last pattern)
    .replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[NAME]')
    // Email addresses
    .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]')
    // Phone numbers
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
    // Dates
    .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]')
    // Money amounts
    .replace(/\$[\d,]+(\.\d{2})?/g, '[AMOUNT]')
    // Company names (Inc, Corp, LLC, Ltd)
    .replace(/\b[A-Z][a-z]+\s(Inc|Corp|LLC|Ltd|Company|Co)\b/gi, '[COMPANY]')
    // Social Security Numbers
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
}

/**
 * Get default config from environment
 */
export function getDefaultConfig(): LLMConfig {
  return {
    provider: (process.env.LLM_PROVIDER as 'anthropic' | 'openai') || 'anthropic',
    model: process.env.LLM_MODEL || 'claude-sonnet-4-20250514',
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || '',
    maxTokens: 1024,
    temperature: 0.7,
  };
}

/**
 * Check if Smart features are enabled
 */
export function isSmartEnabled(): boolean {
  return process.env.ENABLE_SMART_FEATURES === 'true' && !!getDefaultConfig().apiKey;
}

/**
 * Make a completion request to the LLM
 */
export async function complete(
  messages: LLMMessage[],
  config?: Partial<LLMConfig>
): Promise<LLMResponse> {
  const fullConfig = { ...getDefaultConfig(), ...config };

  if (!fullConfig.apiKey) {
    throw new Error('No API key configured for LLM');
  }

  if (!costTracker.canMakeRequest()) {
    throw new Error('Daily budget exceeded. Smart features will resume tomorrow.');
  }

  if (fullConfig.provider === 'anthropic') {
    return callAnthropic(messages, fullConfig);
  } else {
    return callOpenAI(messages, fullConfig);
  }
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
  // Separate system message from user/assistant messages
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system: systemMessage?.content || KINTSUGI_SYSTEM_PROMPT,
      messages: conversationMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  const inputTokens = data.usage?.input_tokens || 0;
  const outputTokens = data.usage?.output_tokens || 0;
  const cost = calculateCost(config.model, inputTokens, outputTokens);

  costTracker.addCost(cost);

  return {
    content: data.content[0]?.text || '',
    usage: {
      inputTokens,
      outputTokens,
      totalCost: cost,
    },
    model: config.model,
  };
}

/**
 * Call OpenAI API (fallback)
 */
async function callOpenAI(messages: LLMMessage[], config: LLMConfig): Promise<LLMResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  const inputTokens = data.usage?.prompt_tokens || 0;
  const outputTokens = data.usage?.completion_tokens || 0;
  const cost = calculateCost(config.model, inputTokens, outputTokens);

  costTracker.addCost(cost);

  return {
    content: data.choices[0]?.message?.content || '',
    usage: {
      inputTokens,
      outputTokens,
      totalCost: cost,
    },
    model: config.model,
  };
}

/**
 * Convenience method for single-turn completion with system prompt
 */
export async function completeWithSystem(
  systemPrompt: string,
  userPrompt: string,
  config?: Partial<LLMConfig>
): Promise<LLMResponse> {
  return complete([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], config);
}

/**
 * Get current cost tracker status
 */
export function getCostStatus(): { today: number; budget: number; remaining: number } {
  return {
    today: costTracker.today,
    budget: DAILY_BUDGET,
    remaining: Math.max(0, DAILY_BUDGET - costTracker.today),
  };
}

// Kintsugi-specific system prompts
export const KINTSUGI_SYSTEM_PROMPT = `You are an empathetic analyst for a Kintsugi self-reflection app.

Kintsugi (金継ぎ) is the Japanese art of repairing broken pottery with gold, celebrating imperfections rather than hiding them. In this app:
- Cracks represent challenges users have faced
- Gold repairs represent growth and learning from those challenges
- The vessel represents their professional journey, made more beautiful by experiences

Your role:
- Help users see challenges as opportunities for golden repair
- Recognize cultural context in how users express themselves
- Be warm, supportive, and growth-focused
- Never dismiss or minimize user experiences
- Connect insights back to the Kintsugi philosophy
- Use "Smart" instead of "AI" when referring to app features

Remember: You're helping professionals own their impact by documenting wins AND honoring their resilience through challenges.`;

export const KINTSUGI_PROMPTS = {
  sentimentAnalysis: `${KINTSUGI_SYSTEM_PROMPT}

Analyze the emotional tone and content of the user's reflection. Consider:
1. Overall sentiment (positive, negative, mixed)
2. Specific emotions present (pride, frustration, hope, etc.)
3. Signs of resilience or growth mindset
4. Cultural context if mentioned

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral|mixed",
  "confidence": 0.0-1.0,
  "emotions": {"pride": 0-1, "frustration": 0-1, ...},
  "resilience": {"detected": true/false, "indicators": []},
  "insight": "Brief Kintsugi-themed insight"
}`,

  biasDetection: `${KINTSUGI_SYSTEM_PROMPT}

You are a supportive coach helping users recognize self-limiting cognitive biases. Look for patterns like:
- Imposter syndrome ("I just got lucky")
- Discounting positives ("It wasn't a big deal")
- Catastrophizing ("This will ruin everything")
- All-or-nothing thinking ("I completely failed")

If you detect a bias:
1. Name it gently
2. Validate the feeling
3. Offer a reframe that honors their experience
4. Connect to Kintsugi philosophy

Respond in JSON format:
{
  "biasDetected": true/false,
  "biasType": "name of bias or null",
  "originalThought": "what they said",
  "reframe": "gentle reframe suggestion",
  "kintsugiConnection": "how this relates to golden repair"
}`,

  insightGeneration: `${KINTSUGI_SYSTEM_PROMPT}

Generate a personalized insight based on the user's recent reflections. Consider:
1. Patterns in their entries
2. Growth trajectory
3. Strengths they may not see
4. Challenges they're working through

Make the insight:
- Specific to their situation
- Actionable when appropriate
- Connected to Kintsugi philosophy
- Warm and encouraging, not preachy`,

  affirmationGeneration: `${KINTSUGI_SYSTEM_PROMPT}

Create a personalized affirmation for this user based on their profile and recent reflections. The affirmation should:
- Feel authentic, not generic
- Acknowledge their specific journey
- Connect to Kintsugi philosophy
- Be something they could say to themselves

Respond with just the affirmation text, nothing else.`,
};
