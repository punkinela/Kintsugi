# Kintsugi Product Requirements Document (PRD)

**Version:** 2.0
**Last Updated:** November 30, 2024
**Product Owner:** Tere
**Status:** Active Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision & Philosophy](#product-vision--philosophy)
3. [Current State (November 2024)](#current-state-november-2024)
4. [Smart API Features](#smart-api-features)
5. [Feature Catalog](#feature-catalog)
6. [Technical Architecture](#technical-architecture)
7. [Future Roadmap](#future-roadmap)
8. [API Enhancement Recommendations](#api-enhancement-recommendations)
9. [Success Metrics](#success-metrics)
10. [Research Foundation](#research-foundation)

---

## Executive Summary

**Kintsugi** is a professional impact documentation platform that transforms how people view their career setbacks and challenges. Unlike traditional career tracking tools that focus solely on wins, Kintsugi embraces the full career story—both accomplishments AND the growth from challenges—treating setbacks as valuable "golden seams" that make careers more unique and valuable.

### Key Differentiators
- **Philosophy-driven UX**: Every feature embodies the Japanese art of Kintsugi (金継ぎ)
- **Smart AI Features**: Hybrid local + cloud AI with cultural awareness
- **Wholeness over perfection**: Celebrates challenges as part of the story
- **Evidence-based design**: Built on cognitive bias research and growth mindset science
- **Privacy-first**: Text anonymized before AI processing, local fallbacks available
- **Culturally personalized**: Adapts wisdom and language to user's heritage

---

## Product Vision & Philosophy

### Vision Statement
*"Help professionals recognize that their career 'cracks' (setbacks, challenges, gaps) become 'golden seams' (unique strengths) when properly documented and reflected upon."*

### Core Philosophy: Kintsugi (金継ぎ)

The product is built on five philosophical pillars:

| Pillar | Meaning | Implementation |
|--------|---------|----------------|
| **Embrace Imperfection** | Scars are beautiful, not shameful | Growth Mindset Tracker for setbacks |
| **Honor Your Full History** | Breaks are part of the story | Impact Log captures wins AND challenges |
| **Transformation Through Healing** | Challenges make you stronger | Pottery cracks "heal" with gold |
| **Value in Repair** | What was broken becomes MORE valuable | Performance Review Builder highlights growth |
| **Wholeness Over Perfection** | Golden seams make you unique | No hiding or deleting setback entries |

---

## Current State (November 2024)

### Unified App Architecture

The app has been consolidated into a **single unified experience** with 5 main tabs:

```
CURRENT STRUCTURE (v2.0):
/                    → 5 unified tabs (everything under one roof)
/journey             → REDIRECTS to / (server-side 301)
/admin               → REDIRECTS to / (server-side 301)
/test-features       → Testing ground (development only)
```

### The 5 Main Tabs

| Tab | Name | Purpose | Key Features |
|-----|------|---------|--------------|
| 1 | **Dashboard** | Your golden overview | Welcome banner, streaks, vessel visualization, philosophy quotes, affirmations |
| 2 | **Reflections** | All your writing | Quick Entry, journal entries, heatmap, timeline, streak calendar |
| 3 | **Insights** | Analytics & patterns | AI insights, bias detection, sentiment analysis, word clouds |
| 4 | **Your Edge** | Career AI tools | Resume builder, performance reviews, interview prep, skills discovery |
| 5 | **Profile** | You & settings | 7 sub-tabs with journey analytics, settings, data management |

### Profile Sub-Tabs (7 Total)

| Sub-Tab | Name | Features |
|---------|------|----------|
| 1 | **Golden Gallery** | Stats dashboard, transformation metrics |
| 2 | **Your Golden Seams** | Journal entries display |
| 3 | **Your Profile** | User demographics, preferences |
| 4 | **Transformation Path** | Journey visualization |
| 5 | **Patterns of Repair** | Analytics and pattern detection |
| 6 | **Growth Mindset** | Growth tracking and metrics |
| 7 | **Workshop Tools** | Voice learning, backups, exports |

### Header & Navigation

| Element | Location | Features |
|---------|----------|----------|
| **Logo** | Left | Kintsugi branding with pronunciation guide |
| **Navigation Tabs** | Center | 5 main tabs with dropdowns for Insights/Your Edge |
| **Theme Toggle** | Right | Light/dark mode switch |
| **Notifications Bell** | Right | Weekly digest, achievements |
| **Philosophy Button** | Right | Opens AboutPhilosophyModal |
| **Help/FAQ Button** | Right | Opens FAQSidebar |
| **User Menu** | Right | Profile, settings, sign out |

---

## Smart API Features

### Current Implementation Status

| API Endpoint | Purpose | Status |
|--------------|---------|--------|
| `/api/smart/analyze-sentiment` | Hybrid sentiment analysis (local + LLM) | ✅ Implemented |
| `/api/smart/detect-bias` | Cognitive bias detection with reframes | ✅ Implemented |
| `/api/smart/generate-insight` | Personalized Kintsugi insights | ✅ Implemented |
| `/api/affirmations` | Journey-aware affirmations | ✅ Implemented |
| `/api/bias-insight` | Bias research and strategies | ✅ Implemented |

### Smart API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SMART API LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Sentiment  │    │    Bias     │    │   Insight   │     │
│  │  Analysis   │    │  Detection  │    │ Generation  │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         └────────────┬─────┴──────────────────┘             │
│                      │                                      │
│              ┌───────▼───────┐                              │
│              │  LLM Client   │                              │
│              │ (Anthropic/   │                              │
│              │   OpenAI)     │                              │
│              └───────┬───────┘                              │
│                      │                                      │
│         ┌────────────┴────────────┐                         │
│         │                         │                         │
│  ┌──────▼──────┐          ┌──────▼──────┐                   │
│  │   Claude    │          │   OpenAI    │                   │
│  │   (Primary) │          │  (Fallback) │                   │
│  └─────────────┘          └─────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Smart Features

#### 1. Hybrid Analysis (Local + Cloud)
- **Local NLP First**: Fast, free sentiment analysis runs always
- **LLM Enhancement**: Deep analysis when Smart features enabled
- **Graceful Fallback**: Works locally if API unavailable

#### 2. Cultural Awareness
- **Collectivist Language**: Recognizes "we" language as strength, not deflection
- **First-Gen Support**: Acknowledges extra significance of achievements
- **Cultural Context**: Adapts prompts based on user heritage

#### 3. Privacy-First Design
- **Text Anonymization**: Names, emails, amounts redacted before LLM calls
- **Cost Tracking**: Daily budget limits ($5/day default)
- **No External Storage**: All personal data stays local

#### 4. Bias Detection (6 Types)
| Bias | Pattern | Kintsugi Reframe |
|------|---------|------------------|
| **Imposter Syndrome** | "I just got lucky" | Your success isn't luck—it's skill, effort, preparation |
| **Discounting Positives** | "It's not a big deal" | What feels routine to you is remarkable to others |
| **Catastrophizing** | "I ruined everything" | This challenge is where your gold will go |
| **All-or-Nothing** | "Complete failure" | Beauty exists in imperfection |
| **Mind Reading** | "They probably think..." | Focus on your journey, not assumptions |
| **Should Statements** | "I should have..." | Replace 'should' with 'could' or 'want to' |

---

## Feature Catalog

### Dashboard Features

| Feature | Description | Philosophy |
|---------|-------------|------------|
| **Kintsugi Welcome Banner** | Personalized greeting with streak info | Wholeness over perfection |
| **Interactive Kintsugi Vessel** | 3D pottery visualization with gold-filled cracks | All five pillars |
| **Journey Richness Score** | Gamified authenticity metric | Value in repair |
| **Kintsugi Quotes Widget** | Daily philosophy-based inspiration | Embrace imperfection |
| **Personalized Wisdom** | Cultural-aware wisdom panel | Honor your full history |
| **Writing Prompts Panel** | Guided journaling starters | Transformation through healing |
| **Journey-Aware Affirmations** | Research-backed daily affirmations | Embrace imperfection |
| **Golden Repairs Panel** | Documents transformation moments | Value in repair |
| **Impermanence Reminder** | Past challenges overcome | Honor your full history |
| **Return Motivation** | Next goals and encouragement | Transformation through healing |

### Reflections Features

| Feature | Description | AI-Powered |
|---------|-------------|------------|
| **AI Smart Tagging Search** | Semantic search across entries | Yes |
| **Quick Entry Card** | 30-second accomplishment capture | No |
| **Kintsugi Philosophy Prompts** | Wisdom-driven journaling starters | No |
| **Transformation Heatmap** | 6-month golden repair visualization | No |
| **Golden Seam Timeline** | Connect challenges to growth | No |
| **Streak Calendar** | Engagement tracking | No |
| **Your Impact Log** | Journal entries list | No |
| **Smart Analysis Panel** | Generate AI insights from entries | Yes |

### Insights Features

| Feature | Description | AI-Powered |
|---------|-------------|------------|
| **AI Insights Dashboard** | Automated pattern analysis | Yes |
| **Bias Research Showcase** | 24+ cognitive biases with strategies | Yes |
| **AI Confidence Score Tracker** | Writing confidence over time | Yes |
| **Mood Tracker** | Emotional pattern tracking | No |
| **Word Cloud Visualization** | Key themes display | No |
| **Personal Stats Dashboard** | Custom metrics | No |
| **Strength Archaeology** | Hidden strengths from adversity | Yes |
| **Before/After Reframing** | Transformation stories | No |

### Your Edge Features (Premium)

| Feature | Description | AI-Powered |
|---------|-------------|------------|
| **AI Performance Review Generator** | Self-review in your voice | Yes |
| **Kintsugi Portfolio Generator** | Professional portfolio creation | Yes |
| **AI Career Gap Analyzer** | Skills gap identification | Yes |
| **Resume Generator** | Journal to resume bullets | Yes |
| **Interview Prep Generator** | Behavioral question practice | Yes |
| **Strength Discovery** | Skills revealed through struggles | Yes |
| **Auto-Profile Builder** | AI extracts skills from entries | Yes |
| **Confidence Tracker** | Confidence metrics over time | No |

### Profile Features

| Feature | Description | Location |
|---------|-------------|----------|
| **Date Range Filters** | 7d, 30d, 90d, all time | Golden Gallery |
| **Export Options** | JSON, CSV, Complete Data | Workshop Tools |
| **Theme Customization** | 6 color themes + pottery styles | Your Profile |
| **Voice Profile Learning** | Writing style capture | Workshop Tools |
| **Auto Backup & Restore** | Data protection | Workshop Tools |
| **Emergency Reset** | Factory reset option | Workshop Tools |

---

## Technical Architecture

### Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **AI (Primary)** | Anthropic Claude (claude-sonnet-4-20250514) |
| **AI (Fallback)** | OpenAI GPT-4 |
| **Storage** | localStorage (client-side) |
| **Hosting** | Netlify |

### Data Storage Keys

| Key | Purpose |
|-----|---------|
| `kintsugi_engagement` | Impact Log entries |
| `imperfectionReflections` | Growth Mindset entries |
| `kintsugi_theme` | Theme preferences |
| `kintsugi_pottery_data` | Vessel data |
| `kintsugi_user` | User profile |
| `xp_data` | XP and levels |
| `achievements_data` | Achievement progress |

### Component Count

| Category | Count |
|----------|-------|
| **Total Components** | 116 |
| **AI/Smart Components** | 10 |
| **Analytics Components** | 8 |
| **Kintsugi Philosophy** | 10 |
| **Engagement Components** | 12 |
| **Professional Tools** | 6 |
| **Other UI** | 60+ |

---

## Future Roadmap

### Phase 1: API Robustness (Q1 2025)

| Enhancement | Priority | Status |
|-------------|----------|--------|
| Rate Limiting | High | Planned |
| Request Caching | High | Planned |
| Retry with Exponential Backoff | High | Planned |
| Cost Tracking Dashboard | Medium | Planned |
| Usage Analytics | Medium | Planned |

### Phase 2: Cool Features (Q1-Q2 2025)

| Feature | Priority | Description |
|---------|----------|-------------|
| **Streaming Responses** | High | Stream long AI responses for better UX |
| **Response Caching** | High | Cache similar insights to save API costs |
| **Usage Dashboard** | Medium | Show users their Smart analysis count |
| **Webhook Notifications** | Medium | Weekly digest via email (optional) |
| **Voice Input** | Low | Speak to journal instead of type |

### Phase 3: Advanced AI (Q2 2025)

| Feature | Priority | Description |
|---------|----------|-------------|
| **Skill Extraction (Lightcast)** | High | Extract skills from journal entries |
| **Career Path Suggestions** | Medium | Based on patterns and skills |
| **Team/Manager Version** | Medium | Enterprise features |
| **Mobile App** | Low | Native iOS/Android |

### Phase 4: Community & Scale (Q3-Q4 2025)

| Feature | Priority | Description |
|---------|----------|-------------|
| **Anonymous Story Sharing** | Medium | Community growth stories |
| **Peer Support System** | Medium | Connect with similar journeys |
| **Coaching Integration** | Low | Connect with human coaches |
| **Internationalization** | Low | Multiple languages |

---

## API Enhancement Recommendations

### 1. Rate Limiting (High Priority)

**Current State**: No rate limiting
**Recommendation**: Add request throttling to prevent abuse

```typescript
// Recommended implementation
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute per user
};
```

### 2. Response Caching (High Priority)

**Current State**: No caching
**Recommendation**: Cache similar insights to reduce API costs

```typescript
// Cache key based on content hash
const cacheKey = hashContent(text + insightType);
const cached = await cache.get(cacheKey);
if (cached) return cached;
```

**Benefits**:
- 30-50% reduction in API costs
- Faster response times for repeated queries
- Reduced latency for users

### 3. Streaming Responses (Medium Priority)

**Current State**: Full response wait
**Recommendation**: Stream long responses for better UX

```typescript
// Stream AI responses
const stream = await complete(messages, { stream: true });
for await (const chunk of stream) {
  yield chunk.content;
}
```

**Benefits**:
- Perceived faster responses
- Better user experience
- Reduced timeout issues

### 4. Usage Dashboard (Medium Priority)

**Current State**: Cost tracked internally only
**Recommendation**: Show users their Smart analysis usage

```typescript
// User-facing metrics
interface UsageMetrics {
  insightsGenerated: number;
  biasesDetected: number;
  sentimentAnalyses: number;
  totalCostSaved: number; // vs. career coaching
}
```

**Benefits**:
- User engagement
- Value demonstration
- Premium upgrade justification

### 5. Webhook Notifications (Low Priority)

**Current State**: In-app notifications only
**Recommendation**: Optional email digest

```typescript
// Weekly digest email
interface WeeklyDigest {
  entriesLogged: number;
  streakDays: number;
  insightsGenerated: number;
  topStrength: string;
  encouragement: string;
}
```

---

## Success Metrics

### Engagement Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Daily Active Users | 60% of weekly | TBD |
| Weekly Retention | 70% | TBD |
| Entries per Week | 3+ | TBD |
| Smart Feature Usage | 40% of users | TBD |

### Philosophy Adherence

| Metric | Target | Measures |
|--------|--------|----------|
| Setback Documentation | 30% | Users with Growth Mindset entries |
| Reflection Depth | 50% | Entries with 50+ char reflections |
| Full History Honoring | 40% | Users with both wins AND challenges |

### AI Feature Usage

| Metric | Target | Measures |
|--------|--------|----------|
| Sentiment Analysis | 50% | Users who run analysis |
| Bias Detection | 30% | Users who check for biases |
| Insight Generation | 40% | Users who generate insights |
| Performance Review | 20% | Users who generate reviews |

---

## Research Foundation

### Core Research Pillars

| Research Area | Key Citation | Application |
|---------------|--------------|-------------|
| **Growth Mindset** | Dweck (2006) | 50-level progression, language |
| **Cognitive Bias** | Kahneman (2011) | Bias detection, reframes |
| **Narrative Identity** | McAdams (2001) | Journal structure, storytelling |
| **Self-Efficacy** | Bandura (1997) | Progress tracking, affirmations |
| **Strengths-Based** | Seligman (2011) | Strength Archaeology |
| **Cultural Psychology** | Markus & Kitayama (1991) | Cultural adaptation |
| **Post-Traumatic Growth** | Tedeschi & Calhoun (2004) | Imperfection Gratitude |

### Research-Backed Language

**What we say:**
- "Documenting small wins increases motivation by 28%" (Amabile & Kramer, 2011)
- "Reflective writing reduces anxiety by 25%" (Pennebaker, 1997)
- "Growth mindset increases resilience by 30%" (Dweck, 2006)
- "Using strengths daily increases engagement 6x" (Clifton & Harter, 2003)

**What we avoid:**
- "Be your best self!" (vague, no evidence)
- "Just think positive!" (toxic positivity)
- Generic self-help platitudes

---

## Appendix A: Kintsugi Philosophy Key Terms

| Japanese Term | Meaning | App Application |
|---------------|---------|-----------------|
| **Kintsugi** (金継ぎ) | Golden joinery | Core metaphor - repair with gold |
| **Wabi-sabi** (侘寂) | Beauty in imperfection | Embracing flaws |
| **Kintsukuroi** (金繕い) | Golden repair | Alternative term |
| **Mottainai** (もったいない) | Too precious to waste | Value in all experiences |
| **Kaizen** (改善) | Continuous improvement | Growth mindset alignment |
| **Mono no aware** (物の哀れ) | Awareness of transience | Impermanence reminder |

---

## Appendix B: Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `ANTHROPIC_API_KEY` | Claude API access | For Smart features |
| `OPENAI_API_KEY` | OpenAI fallback | Optional |
| `ENABLE_SMART_FEATURES` | Enable Smart APIs | Yes (set to "true") |
| `LLM_DAILY_BUDGET` | Daily cost limit | Optional (default $5) |
| `LLM_MODEL` | Claude model version | Optional |
| `LLM_PROVIDER` | anthropic or openai | Optional |

---

## Appendix C: Premium Features

### Free Tier (Always Available)
- Impact Log - unlimited entries
- Quick Entry - 30-second wins
- Growth Mindset Tracker - unlimited reflections
- Interactive Kintsugi Vessel
- Basic cultural wisdom
- XP & Level system
- Basic achievements
- 6 themes
- Week in Review digest
- Data export/backup

### Premium Tier ($9.99/month)
- AI Performance Review Generator
- AI Interview Prep
- AI Resume Generator
- AI Career Gap Analyzer
- Advanced Bias Insights (unlimited)
- Kintsugi Portfolio Generator
- Voice Profile Manager
- Advanced Analytics
- Priority Support

---

**Document Status:** Living document, updated as product evolves
**Next Review:** December 2024
**Feedback:** Share thoughts with Tere

---

*"The pottery was always Kintsugi—we just wait until you're ready to see the gold."*
