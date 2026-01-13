# Phase 1: Progressive Disclosure - Feature-to-Level Mapping

> **Status:** APPROVED - Ready for Implementation
> **Created:** December 6, 2025
> **Updated:** December 6, 2025
> **Purpose:** Define which features unlock at each level to reduce new user overwhelm while preserving all 130+ components

---

## User Decisions (Approved)

| Question | Decision |
|----------|----------|
| Growth Mindset Tracker | **Level 2** (core to philosophy) |
| Your Edge Tab | **Level 10** (end of Practice phase) |
| New Features (LinkedIn, STAR, Skills) | **Plan now** (include in roadmap) |
| Existing Users | **Grandfathered** (full access preserved) |

---

## Design Principles

1. **First 30 Seconds = Success** - New users should feel a win immediately
2. **Philosophy First** - Each phase ties to a Kintsugi principle
3. **Earn the Complexity** - Advanced features feel like rewards, not obstacles
4. **Nothing Removed** - All features preserved, just revealed progressively
5. **Core Always Available** - Impact Entries and XP never gated

---

## Growth Phases Overview

| Phase | Levels | Kintsugi Principle | Theme |
|-------|--------|-------------------|-------|
| **Awakening** | 1-5 | Embrace Imperfection | Learn the basics, build first habit |
| **Practice** | 6-10 | Honor Your History | Deepen reflection, see patterns |
| **Integration** | 11-20 | Transform Through Healing | Use insights, track growth |
| **Mastery** | 21-30 | Value in Repair | Professional outputs, career tools |
| **Wisdom** | 31-50 | Wholeness Over Perfection | Full access, community, legacy |

---

## Feature Unlock Map

### 🌱 ALWAYS AVAILABLE (Level 1+)
*Core experience - never gated*

| Feature | Component | Rationale |
|---------|-----------|-----------|
| Document Impact (Quick Entry) | `QuickCapture.tsx` | Core action - must be immediate |
| XP Bar & Level Display | `XPBar.tsx` | Motivation visible from start |
| Avatar Selection (Basic) | `SimpleAvatarPicker.tsx` | Personalization = ownership |
| Daily Affirmation | `AffirmationCard.tsx` | Immediate value, low effort |
| Streak Counter | `StreakCalendar.tsx` | Habit formation from day 1 |
| FAQ / Help | `FAQSidebar.tsx` | Support always available |
| Profile Settings | `ProfileSetup.tsx` | Basic customization |
| Theme Toggle | `ThemeProvider.tsx` | Accessibility need |

### 🔵 AWAKENING PHASE (Levels 1-5)
*"Embrace Imperfection" - Learning that scars are beautiful*

| Level | Unlock | Component | Celebration Message |
|-------|--------|-----------|---------------------|
| 1 | Welcome + First Entry Prompt | `OnboardingTour.tsx` | "Welcome to your journey of golden repair" |
| 2 | **Growth Mindset Tracker** | `GrowthMindsetTracker.tsx` | "Now track how setbacks become strengths" |
| 3 | View Past Entries | `EnhancedProgressJournal.tsx` | "You're building your story" |
| 4 | Mood Tracking (Basic) | `MoodTracker.tsx` | "Understanding your patterns begins" |
| 5 | **PHASE COMPLETE** - Insights Tab Unlocks | `InsightsTab` | "You've embraced imperfection. Now see your patterns." |

**Level 5 Unlock Bundle:**
- Insights Tab becomes visible
- Basic Analytics (entry count, streak stats)
- Kintsugi Quotes rotation
- Nature Avatar Collection (5 new avatars)

---

### 🟢 PRACTICE PHASE (Levels 6-10)
*"Honor Your History" - Recognizing breaks are part of your story*

| Level | Unlock | Component | Celebration Message |
|-------|--------|-----------|---------------------|
| 6 | Week in Review Digest | `InAppWeeklyDigest.tsx` | "See your week's golden moments" |
| 7 | Entry Categories & Tags | Enhanced `QuickCapture` | "Organize your impact by type" |
| 8 | Mood Analytics & Trends | `MoodAnalytics.tsx` | "Your emotional patterns revealed" |
| 9 | Journal Prompts | `JournalPromptCarousel.tsx` | "Guided reflection unlocked" |
| 10 | **PHASE COMPLETE** - Your Edge Tab + Golden Avatars | `YourEdgeTab` | "The Golden Thread is yours. Professional tools await!" |

**Level 10 Unlock Bundle:**
- **Your Edge Tab** (Performance Reviews, Resume, Portfolio)
- Golden Avatar Collection (5 rare avatars)
- Advanced Search
- Export to Markdown
- Cultural Wisdom personalization
- Daily Challenges visible

---

### 🟡 INTEGRATION PHASE (Levels 11-20)
*"Transform Through Healing" - Challenges make you stronger*

| Level | Unlock | Component | Celebration Message |
|-------|--------|-----------|---------------------|
| 11 | AI Insights Generation | `AIInsightsDashboard.tsx` | "AI-powered patterns await" |
| 12 | Strength Archaeology | `StrengthArchaeology.tsx` | "Uncover hidden strengths" |
| 13 | Bias Awareness Insights | `BiasInsightModal.tsx` | "See what holds you back" |
| 14 | Confidence Score Tracking | `AIConfidenceScoreTracker.tsx` | "Track your growing confidence" |
| 15 | Transformation Heatmap | `TransformationHeatmap.tsx` | "Visualize your growth journey" |
| 16 | Goal Setting | `GoalsManager.tsx` | "Set intentions, track progress" |
| 17 | Before/After Reframing | `BeforeAfterReframing.tsx` | "See your transformation" |
| 18 | **LinkedIn Post Generator** | *New Feature* | "Share your wins professionally" |
| 19 | **STAR Story Formatter** | *New Feature* | "One-click interview stories" |
| 20 | **PHASE COMPLETE** - Transformer Avatars | `emojiCharacters.ts` | "You transform through healing. Mastery awaits." |

**Level 20 Unlock Bundle:**
- Transformer Avatar Collection (5 epic avatars)
- LinkedIn Post Generator
- STAR Story Formatter
- Voice Profile analysis
- Full analytics suite

---

### 🟣 MASTERY PHASE (Levels 21-30)
*"Value in Repair" - What was broken becomes MORE valuable*

| Level | Unlock | Component | Celebration Message |
|-------|--------|-----------|---------------------|
| 21 | Interview Prep Generator | `AIInterviewPrepGenerator.tsx` | "Turn entries into interview gold" |
| 22 | **Skills Evidence Tracker** | *New Feature* | "Link accomplishments to skills" |
| 23 | Full Portfolio Generator | `KintsugiPortfolioGenerator.tsx` | "Create your career portfolio" |
| 24 | Advanced Export (PDF/Word) | `ExportManager.tsx` | "Professional document exports" |
| 25 | Career Gap Analyzer | `AICareerGapAnalyzer.tsx` | "Identify growth opportunities" |
| 26 | Accomplishment Enhancer | `AIAccomplishmentEnhancer.tsx` | "AI-powered writing improvement" |
| 27 | Custom Affirmations | `CustomAffirmationsManager.tsx` | "Create personal affirmations" |
| 28 | **Career Milestone Linking** | *New Feature* | "Connect entries to promotions" |
| 29 | Advanced Voice Profile | `VoiceProfileManager.tsx` | "Perfect your professional voice" |
| 30 | **PHASE COMPLETE** - Master Avatars | `emojiCharacters.ts` | "What was broken is now MORE valuable. Wisdom calls." |

**Level 30 Unlock Bundle:**
- Master Avatar Collection (5 legendary avatars)
- Skills Evidence Tracker
- Career Milestone Linking
- Full export capabilities
- "Kintsugi Master" title

---

### 🟠 WISDOM PHASE (Levels 31-50)
*"Wholeness Over Perfection" - Golden seams make you unique*

| Level | Unlock | Component | Celebration Message |
|-------|--------|-----------|---------------------|
| 31 | Journey Analytics Dashboard | `AdvancedAnalytics.tsx` | "Your complete story visualized" |
| 35 | 3D Interactive Vessel | `InteractiveKintsugiVessel.tsx` | "See your golden seams in 3D" |
| 40 | Resilience Map | `ResilienceMap.tsx` | "Your full transformation journey" |
| 45 | Legacy Features | Future | "Leave your mark" |
| 50 | **MASTERWORK COMPLETE** | All Features | "You are a masterwork in progress. Always growing." |

**Wisdom Phase Features:**
- All analytics and visualizations
- Community features (when added)
- Beta feature access
- "Living Kintsugi" title
- Exclusive Wisdom avatars

---

## Tab Visibility by Level

| Tab | Unlock Level | Contents Before Unlock |
|-----|--------------|------------------------|
| **Home** | Always | Full access |
| **Golden Seams** | Always | Impact entries list |
| **Insights** | Level 5 | Hidden (shows "Unlock at Level 5" teaser) |
| **Your Edge** | Level 10 | Hidden (shows "Unlock at Level 10" teaser) |

> **Note:** Existing users are **grandfathered** with full access to all tabs regardless of level.

---

## Home Tab Simplification (Levels 1-4)

**What NEW users see:**
```
┌─────────────────────────────────────────┐
│  🏺 Welcome to Kintsugi                 │
│  Level 1 • Awakening Phase              │
│  ═══════════════════════════════════════│
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📝 Document Your Impact        │   │
│  │  [What did you accomplish?]     │   │
│  │                         [Save]  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ✨ Daily Affirmation           │   │
│  │  "Your journey matters..."      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🔥 Streak: 1 day               │   │
│  │  ████░░░░░░ Level 2 in 2 entries│   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔒 Insights unlock at Level 5         │
│  🔒 Your Edge unlocks at Level 10      │
│                                         │
└─────────────────────────────────────────┘
```

**What EXPERIENCED users see (Level 10+):**
- Full current Home tab
- All widgets visible
- Week in Review
- Daily Challenges
- Cultural Wisdom
- Quick Entry + Growth Mindset access

---

## Unlock Celebration Flow

When a user unlocks a new feature:

1. **Confetti Animation** (gold themed)
2. **Modal with:**
   - New level number
   - Title earned
   - Philosophy message (from `LEVEL_UP_MESSAGES`)
   - Feature(s) unlocked with icons
   - "Try it now" button → navigates to new feature
3. **Persistent "New" badge** on unlocked feature until used

---

## XP Requirements Reference

| Level | XP Needed | Entries to Reach (approx) |
|-------|-----------|---------------------------|
| 2 | 150 | 3 entries |
| 3 | 225 | 5 entries |
| 4 | 300 | 6 entries |
| 5 | 375 | 8 entries |
| 10 | 825 | ~17 entries |
| 15 | 1,600 | ~32 entries |
| 20 | 2,100 | ~42 entries |
| 30 | 4,100 | ~82 entries |

*Note: Includes daily visit XP, streaks, and achievements*

---

## Implementation Checklist

### Phase 1.1 - This Document ✅
- [x] Map all features to levels
- [x] Align with growth phases
- [x] Define unlock celebrations
- [x] Plan tab visibility

### Phase 1.2 - Simplified Home Tab
- [ ] Create `SimplifiedHomeTab.tsx` for Levels 1-4
- [ ] Add level-based conditional rendering
- [ ] Add "unlock teaser" components

### Phase 1.3 - Level-Gated Tabs
- [ ] Create `useFeatureUnlock` hook
- [ ] Add tab visibility logic to main layout
- [ ] Create "locked tab" placeholder component

### Phase 1.4 - First Win Celebration
- [ ] Create `FirstWinCelebration.tsx`
- [ ] Trigger on first saved entry
- [ ] Include philosophy message

### Phase 1.5 - Updated Onboarding
- [ ] Simplify to 3 steps (was 5)
- [ ] Focus on first entry
- [ ] Remove advanced feature mentions

### Phase 1.6 - FAQ Updates
- [ ] Add "How do I unlock features?"
- [ ] Add "What are the growth phases?"
- [ ] Update existing feature FAQs with unlock info

---

## Questions - RESOLVED ✅

| Question | Decision | Rationale |
|----------|----------|-----------|
| Growth Mindset Level | **Level 2** | Core to Kintsugi philosophy |
| Your Edge Tab | **Level 10** | Don't discourage users from progressing |
| New Features | **Plan now** | LinkedIn, STAR, Skills in roadmap |
| Existing Users | **Grandfathered** | Full access preserved |

---

## Next Steps - Implementation

1. ✅ Document approved with user decisions
2. 🔲 Phase 1.2: Create simplified Home tab for new users
3. 🔲 Phase 1.3: Build level-gated tab visibility system
4. 🔲 Phase 1.4: Add 'First Win' celebration for first entry
5. 🔲 Phase 1.5: Update onboarding tour for simplified flow
6. 🔲 Phase 1.6: Update FAQ for Phase 1 changes
7. 🔲 Test with fresh browser (new user simulation)
8. 🔲 Test with existing account (grandfathered access)

---

*Document created for Kintsugi App Enhancement - Phase 1*
