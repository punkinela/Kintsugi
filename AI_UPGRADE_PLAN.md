# AI Upgrade Plan: Pattern Matching → Real AI

**Version:** 1.0
**Created:** 2025-11-29
**Purpose:** Upgrade Kintsugi from pattern matching to real AI using Claude (Anthropic)

---

## Current State Analysis

### What We Have Now
The app currently uses **pattern matching** for:
- Bias detection (keyword lists)
- Sentiment analysis (basic word scoring)
- Insight generation (template-based)
- Affirmation creation (pre-written templates)

### The Problem
- Limited understanding of nuance
- Can't recognize cultural context
- Misses complex emotional states
- Generic, not personalized responses

---

## Upgrade Strategy: Multi-Layer AI

### Architecture

```
User Input
    ↓
┌─────────────────────────────────────┐
│  Layer 1: Local NLP (Fast, Free)    │
│  - sentiment package                │
│  - natural package                  │
│  - Basic emotion detection          │
│  - Privacy: No data leaves device   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Layer 2: LLM (Deep, Paid)          │
│  - Claude claude-sonnet-4-20250514           │
│  - Cultural context awareness       │
│  - Nuanced understanding            │
│  - Personalized insights            │
└─────────────────────────────────────┘
    ↓
Response to User
```

### Why This Approach?
1. **Cost Control:** Local processing handles 80% of cases
2. **Privacy:** Sensitive text stays local when possible
3. **Speed:** Local analysis is instant
4. **Depth:** LLM provides deep insights when needed
5. **Fallback:** Works without API key (graceful degradation)

---

## LLM Selection: Claude (Anthropic)

### Why Claude Over GPT-4?
| Factor | Claude | GPT-4 |
|--------|--------|-------|
| Empathy | Excellent | Good |
| Safety | Built-in | Requires prompting |
| Cost | Lower | Higher |
| Context Window | 200K tokens | 128K tokens |
| Cultural Sensitivity | Strong | Good |

### Model Choice
- **Primary:** `claude-sonnet-4-20250514` (fast, capable, affordable)
- **Fallback:** `claude-3-haiku` (cheaper, for simple tasks)

### Cost Estimates
| Usage Level | Monthly Cost |
|-------------|--------------|
| Light (10 analyses/day) | ~$0.30 |
| Medium (30 analyses/day) | ~$1.00 |
| Heavy (100 analyses/day) | ~$3.00 |

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

#### 1.1 Install Dependencies
```bash
npm install @anthropic-ai/sdk sentiment natural
npm install -D @types/natural @types/sentiment
```

#### 1.2 Create Smart Utilities

**`utils/smartSentiment.ts`**
- Multi-layer sentiment analysis
- Emotion breakdown (joy, pride, frustration, etc.)
- Cultural context support
- Resilience language detection

**`utils/llmClient.ts`**
- Unified client for Claude
- Cost tracking
- Rate limiting
- Error handling
- Privacy features (text anonymization)

#### 1.3 Create API Routes
- `/api/smart/analyze-sentiment`
- `/api/smart/generate-insight`
- `/api/smart/detect-bias`

### Phase 2: Integration (Week 3-4)

#### 2.1 Connect Components
- Update BiasInsightModal to use Smart analysis
- Enhance sentiment display in entries
- Add insight generation to reflections

#### 2.2 Cultural Awareness
- Profile-based context injection
- "We" vs "I" language recognition
- First-gen professional support

### Phase 3: Polish (Week 5-6)

#### 3.1 User Experience
- Loading states for LLM calls
- Graceful fallbacks
- Cost indicator (optional)

#### 3.2 Testing & Optimization
- A/B test AI vs pattern matching
- Optimize prompts
- Reduce unnecessary API calls

---

## Smart Feature Specifications

### 1. Smart Sentiment Analysis

**Input:**
```typescript
{
  text: string;
  culturalContext?: {
    ethnicity?: string;
    isFirstGen?: boolean;
    collectivistOrientation?: boolean;
  };
  useDeepAnalysis?: boolean;
}
```

**Output:**
```typescript
{
  score: number; // -1 to 1
  label: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence: number; // 0 to 1
  emotions: {
    joy: number;
    pride: number;
    hope: number;
    frustration: number;
    anxiety: number;
    sadness: number;
  };
  resilience: {
    detected: boolean;
    indicators: string[];
  };
  culturalNotes?: string;
}
```

### 2. Smart Bias Detection

**Capabilities:**
- Detect 30 cognitive biases
- Provide gentle, supportive reframes
- Cultural context awareness
- Track patterns over time

**Example Reframe:**
```
Detected: Imposter Syndrome
User said: "I just got lucky with that promotion"

Reframe: "Consider this: luck might have opened the door,
but your skills and hard work are why you walked through it.
What specific actions did you take that contributed to this success?"
```

### 3. Smart Insight Generation

**Features:**
- Weekly pattern summaries
- Growth trajectory analysis
- Strength discovery
- Challenge-to-growth connections

---

## Kintsugi-Specific Prompts

### System Prompt Template
```
You are an empathetic analyst for a Kintsugi self-reflection app.

Kintsugi (金継ぎ) is the Japanese art of repairing broken pottery
with gold, celebrating imperfections rather than hiding them.

Your role:
- Help users see challenges as opportunities for golden repair
- Recognize cultural context in how users express themselves
- Be warm, supportive, and growth-focused
- Never dismiss or minimize user experiences
- Connect insights back to the Kintsugi philosophy

User context:
{userProfile}

Analyze the following and provide insights:
{userInput}
```

---

## Privacy & Security

### Data Protection
1. **Anonymization:** Strip names, dates, company names before LLM
2. **No Storage:** LLM provider doesn't store our data
3. **User Control:** Option to disable Smart features
4. **Transparency:** Show when AI is being used

### Implementation
```typescript
function anonymizeText(text: string): string {
  return text
    .replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[NAME]')
    .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]')
    .replace(/\$[\d,]+/g, '[AMOUNT]')
    .replace(/\b[A-Z][a-z]+\s(Inc|Corp|LLC|Ltd)\b/g, '[COMPANY]');
}
```

---

## Cost Management

### Budget Controls
```typescript
const DAILY_BUDGET = 5.00; // USD
const costTracker = {
  today: 0,
  canMakeRequest: () => costTracker.today < DAILY_BUDGET,
  addCost: (cost: number) => costTracker.today += cost,
};
```

### Cost Per Feature
| Feature | Est. Tokens | Cost/Use |
|---------|-------------|----------|
| Sentiment Analysis | ~500 | $0.0015 |
| Bias Detection | ~800 | $0.0024 |
| Insight Generation | ~1200 | $0.0036 |
| Weekly Summary | ~2000 | $0.0060 |

---

## Environment Configuration

### `.env.local.example`
```env
# Anthropic API Key (Primary - Recommended)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Feature Flags
ENABLE_SMART_FEATURES=true
LLM_PROVIDER=anthropic
LLM_MODEL=claude-sonnet-4-20250514

# Cost Controls
LLM_DAILY_BUDGET=5.00
```

---

## Success Criteria

### Technical
- [ ] Smart features work without API key (graceful fallback)
- [ ] Response time < 3 seconds for LLM calls
- [ ] Cost stays under $5/day per user
- [ ] No PII sent to LLM

### User Experience
- [ ] Users report more helpful insights
- [ ] Bias reframes feel personalized
- [ ] Cultural context improves accuracy
- [ ] Engagement increases with Smart features

---

## Rollout Plan

1. **Alpha:** Enable for development/testing
2. **Beta:** Enable for 10% of users with feedback collection
3. **GA:** Full rollout with monitoring
4. **Iterate:** Improve based on usage patterns

---

*"Like Kintsugi, our AI doesn't hide the cracks—it helps you fill them with gold."*
