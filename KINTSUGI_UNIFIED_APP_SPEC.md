# Kintsugi Unified App Specification

**Version:** 2.0
**Created:** 2025-11-29
**Purpose:** Combine main app (`/`) and journey page (`/journey`) into one cohesive, robust experience

---

## Executive Summary

The Kintsugi app helps users own their professional impact by documenting wins, reframing challenges, and building resilience through the Kintsugi philosophy. This unified specification merges the two separate experiences into a single, powerful 5-tab application designed for skeptics and growth-minded individuals alike.

---

## Core Philosophy

### Kintsugi (金継ぎ)
The Japanese art of repairing broken pottery with gold, celebrating imperfections rather than hiding them. In our app:
- **Cracks** = Challenges you've faced
- **Gold repairs** = Growth and learning from those challenges
- **The vessel** = Your professional journey, made more beautiful by your experiences

### User-Facing Language
- Use **"Reflections"** instead of "Journal"
- Use **"Smart"** instead of "AI" for user-facing features
- Keep technical documentation references to AI for course purposes

---

## Unified 5-Tab Structure

### Tab 1: Dashboard (Home)
**Purpose:** Daily engagement hub and quick actions

**Components:**
- Welcome banner with Kintsugi philosophy
- Quick Entry card (capture wins/challenges fast)
- Daily streak tracker
- Fresh Start prompts (Monday, 1st of month, etc.)
- Personalized wisdom based on user profile
- XP/Level progress

### Tab 2: Reflections
**Purpose:** Document and analyze professional experiences

**Components:**
- Growth Mindset Tracker (detailed entries)
- Quick capture for fast logging
- Smart analysis of entries (sentiment, patterns)
- Before/After reframing tool
- Mushin reflection mode (distraction-free writing)
- Entry history with search

### Tab 3: Insights
**Purpose:** Discover patterns and receive personalized guidance

**Components:**
- Personal Stats Dashboard
- Transformation Heatmap
- Golden Seam Timeline
- Smart bias detection with gentle reframes
- Mood trends over time
- Word cloud visualization
- Weekly/Monthly summaries

### Tab 4: Your Edge
**Purpose:** Professional development tools

**Components:**
- Kintsugi Portfolio Generator
- Performance Review Generator
- Interview Prep Generator
- Strength Archaeology (discover hidden strengths)
- Career Gap Analyzer
- Confidence Score Tracker
- Skills library integration (Lightcast)

### Tab 5: Profile
**Purpose:** Personalization and settings

**Components:**
- User profile with cultural context
- Pottery/vessel customization
- Theme selection (6 color schemes)
- Data management (backup/restore/export)
- Achievements panel
- Notification preferences
- Privacy settings

---

## Cultural Awareness Framework

### Why It Matters
Different cultural backgrounds shape how people express accomplishments:
- **Collectivist cultures** (Latino, Asian, etc.): Use "we" language, emphasize team success
- **Individualist cultures**: Use "I" language, emphasize personal achievement
- **First-generation professionals**: Navigate imposter syndrome, family expectations

### Implementation
1. **Profile Setup:** Optional ethnicity, background, profession fields
2. **Smart Analysis:** Recognize "we" language isn't deflection
3. **Personalized Wisdom:** Quotes and guidance from user's heritage
4. **Bias Detection:** Cultural context prevents misinterpretation

---

## Research-Backed Engagement Strategies

### For Skeptics (Foot-in-the-Door Technique)

| Stage | Commitment | Example |
|-------|------------|---------|
| 1 | Micro | "Rate your day 1-5" (2 seconds) |
| 2 | Small | "Add one word about today" (5 seconds) |
| 3 | Medium | "Quick win capture" (30 seconds) |
| 4 | Full | "Full reflection with analysis" (2-5 min) |

### Fresh Start Effect

| Trigger | Message |
|---------|---------|
| Monday | "New week, fresh perspective" |
| 1st of Month | "Monthly reset - what matters this month?" |
| Birthday | "Another year of growth" |
| Work Anniversary | "Celebrate your journey" |
| After Break | "Welcome back - you were missed" |

### Retention Strategies

| Strategy | Implementation |
|----------|----------------|
| Variable Rewards | Random wisdom, surprise achievements |
| Social Proof | "Join 1,000+ professionals documenting impact" |
| Loss Aversion | "Don't lose your 7-day streak!" |
| Commitment | Public sharing options, exported portfolios |
| Progress Visibility | XP bar, level badges, vessel growth |

---

## Smart Features (Technical for AI Course)

### Multi-Layer Sentiment Analysis
1. **Layer 1 (Local):** Fast NLP using `sentiment` and `natural` packages
2. **Layer 2 (LLM):** Deep analysis using Claude for nuanced understanding
3. **Cultural Context:** Adjust interpretation based on user background

### Bias Detection (30 Cognitive Biases)

**Core 24 Biases:**
1. Imposter Syndrome
2. Negativity Bias
3. Catastrophizing
4. All-or-Nothing Thinking
5. Discounting Positives
6. Mind Reading
7. Fortune Telling
8. Should Statements
9. Labeling
10. Personalization
11. Blame Externalization
12. Emotional Reasoning
13. Overgeneralization
14. Mental Filtering
15. Magnification/Minimization
16. Jumping to Conclusions
17. Control Fallacy
18. Fallacy of Fairness
19. Fallacy of Change
20. Always Being Right
21. Heaven's Reward Fallacy
22. Comparison Trap
23. Sunk Cost Fallacy
24. Attribution Error

**Additional 6 Biases:**
25. Availability Heuristic
26. Anchoring Bias
27. Dunning-Kruger Effect
28. Spotlight Effect
29. Status Quo Bias
30. Self-Serving Bias

### Privacy-First Design
- Text anonymization before LLM calls
- No PII sent to external services
- Local processing when possible
- User controls data retention

---

## Gamification System (50 Levels)

### Kintsugi-Themed Progression

| Level Range | Title | Philosophy |
|-------------|-------|------------|
| 1-5 | Apprentice | Learning to see beauty in cracks |
| 6-10 | Gatherer | Collecting fragments of experience |
| 11-15 | Mixer | Preparing the lacquer of reflection |
| 16-20 | Applier | Beginning to fill the cracks |
| 21-25 | Gilder | Adding gold to repairs |
| 26-30 | Artisan | Crafting with intention |
| 31-35 | Craftmaster | Mastering the repair process |
| 36-40 | Philosopher | Understanding deeper meaning |
| 41-45 | Sage | Teaching through example |
| 46-50 | Kintsugi Master | Embodying the philosophy |

### XP Sources
- Daily login: 10 XP
- Quick entry: 25 XP
- Full reflection: 50 XP
- Weekly summary viewed: 30 XP
- Achievement unlocked: 100 XP
- Streak milestone: 50-500 XP
- Bias reframe: 75 XP

---

## Implementation Roadmap

### Phase 1: Foundation (Current)
- [x] Blur fixes and vessel improvements
- [x] Theme-aware vessel colors
- [x] Basic gamification
- [ ] Smart utilities setup
- [ ] API routes for Smart features

### Phase 2: Smart Integration
- [ ] Implement smartSentiment.ts
- [ ] Implement llmClient.ts
- [ ] Create Smart API routes
- [ ] Connect to Anthropic Claude

### Phase 3: Unified Experience
- [ ] Merge `/` and `/journey` pages
- [ ] Implement 5-tab navigation
- [ ] Update all "Journal" → "Reflections"
- [ ] Update all "AI" → "Smart"

### Phase 4: Polish & Launch
- [ ] User testing
- [ ] Performance optimization
- [ ] Documentation update
- [ ] Netlify deployment

---

## Technical Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Local NLP:** sentiment, natural packages
- **LLM:** Anthropic Claude (claude-sonnet-4-20250514)
- **Deployment:** Netlify
- **Data:** localStorage (privacy-first, no backend)

---

## Success Metrics

1. **Engagement:** Daily active users, session duration
2. **Retention:** 7-day, 30-day return rates
3. **Depth:** Entries per user, reflection quality
4. **Growth:** Bias reframes completed, XP earned
5. **Satisfaction:** User feedback, NPS score

---

*"The pottery that has been broken and repaired with gold is more beautiful than that which was never broken."*
