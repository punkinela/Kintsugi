# User Voice/Tone Learning System

## Executive Summary
The Voice Learning System is the **competitive moat** that differentiates this app from generic ChatGPT. It ensures all AI-generated content matches the user's authentic writing style, preventing the "ChatGPT-ified" language that makes professional documents sound inauthentic.

## Problem Statement
- Generic AI tools produce content with telltale patterns ("collaborate," "leverage," "synergies")
- Users who never use certain words suddenly have documents full of corporate buzzwords
- This undermines authenticity and can be obvious to reviewers
- Users need prompt engineering skills to get good results

## Solution: Persistent Voice Profile
A system that learns and remembers each user's unique writing style over time.

---

## Architecture

### 1. Voice Profile Data Structure

```typescript
interface VoiceProfile {
  userId: string;

  // Vocabulary Analysis
  commonWords: Array<{ word: string; frequency: number; context: string[] }>;
  avoidedWords: string[]; // Words user NEVER uses
  preferredPhrases: string[]; // Signature expressions
  industryTerms: string[]; // Domain-specific vocabulary

  // Style Metrics
  avgSentenceLength: number;
  formalityScore: number; // 1-10 scale
  activeVoicePercentage: number;
  personalPronounUsage: { I: number; we: number; my: number };

  // Tone Characteristics
  emotionalTone: 'reserved' | 'enthusiastic' | 'balanced';
  detailLevel: 'concise' | 'detailed' | 'comprehensive';

  // Learning Data
  writingSamples: Array<{
    text: string;
    source: 'journal' | 'uploaded' | 'edited';
    date: string;
  }>;

  // User Corrections
  rejectedWords: Array<{ word: string; context: string; rejectedCount: number }>;
  preferredReplacements: Array<{ original: string; preferred: string }>;

  // Metadata
  lastUpdated: string;
  confidenceScore: number; // How much data we have
  sampleCount: number;
}
```

### 2. Voice Analysis Pipeline

#### Phase 1: Initial Collection (Onboarding)
```
User provides writing samples:
├── Past performance reviews
├── Professional emails
├── Cover letters
├── LinkedIn posts
└── Journal entries
```

#### Phase 2: Analysis
```
For each sample:
├── Tokenize and analyze vocabulary
├── Calculate style metrics
├── Extract n-grams and phrases
├── Identify domain terminology
└── Generate initial voice profile
```

#### Phase 3: Continuous Learning
```
As user writes:
├── Analyze each journal entry
├── Track words in user-edited AI content
├── Build "avoid list" from rejected suggestions
├── Refine voice profile with new data
└── Update confidence score
```

---

## Implementation Plan

### Components to Create

#### 1. `VoiceProfileManager` Component
**Location:** `/components/VoiceProfileManager.tsx`

**Features:**
- Upload writing samples (PDF, DOCX, TXT)
- Paste text directly
- View current voice profile insights
- Manually add words to avoid/prefer lists
- See voice profile confidence score

#### 2. `VoiceAnalyzer` Utility
**Location:** `/utils/voiceAnalyzer.ts`

**Functions:**
```typescript
// Analyze text and extract voice characteristics
analyzeWritingSample(text: string): VoiceMetrics

// Update user's voice profile with new sample
updateVoiceProfile(userId: string, sample: string, source: string): VoiceProfile

// Get voice profile for AI prompt generation
getVoiceProfile(userId: string): VoiceProfile

// Track when user rejects AI-generated words
recordRejectedWord(userId: string, word: string, context: string): void

// Generate voice-matching instructions for AI
generateVoicePrompt(voiceProfile: VoiceProfile): string
```

#### 3. `VoiceMatchedAIService` Utility
**Location:** `/utils/voiceMatchedAI.ts`

**Purpose:** Wrapper around AI calls that automatically includes voice-matching instructions

```typescript
interface VoiceMatchedRequest {
  userId: string;
  task: string; // "resume", "review", "cover_letter"
  content: string; // User's raw content
  additionalInstructions?: string;
}

async function generateVoiceMatchedContent(request: VoiceMatchedRequest): Promise<string> {
  const voiceProfile = await getVoiceProfile(request.userId);
  const voiceInstructions = generateVoicePrompt(voiceProfile);

  const prompt = `
    ${voiceInstructions}

    Task: ${request.task}
    Content: ${request.content}
    ${request.additionalInstructions || ''}
  `;

  // Call AI with voice-aware prompt
  const result = await callAI(prompt);

  // Post-process to remove avoided words
  return filterAvoidedWords(result, voiceProfile.avoidedWords);
}
```

#### 4. Voice Prompt Generation
**Example output for AI:**
```
WRITING STYLE REQUIREMENTS:
- Write at a formality level of 7/10 (professional but approachable)
- Use average sentence length of 15-18 words
- Prefer active voice (user uses it 78% of the time)
- Use "I" frequently, rarely use "we" (this user works independently)

VOCABULARY PREFERENCES:
- Common words to use: [impact, delivered, improved, created, designed]
- NEVER use these words: [collaborate, leverage, synergize, utilize, facilitate]
- Preferred phrases: ["made it happen", "figured out", "worked through"]
- Industry terms to include: [API, microservices, CI/CD, observability]

TONE:
- Enthusiastic but grounded
- Detailed explanations (user provides context)
- Direct and clear, not flowery

CRITICAL: Match this user's natural voice. If you're unsure whether they'd say something,
err on the side of simpler, more direct language.
```

---

## Integration Points

### 1. **Career-Ready Resume Generator**
```typescript
// Before: Generic AI generation
const resume = await generateResume(userAccomplishments);

// After: Voice-matched generation
const resume = await generateVoiceMatchedContent({
  userId: user.id,
  task: 'resume',
  content: userAccomplishments
});
```

### 2. **Performance Review Generator**
```typescript
const review = await generateVoiceMatchedContent({
  userId: user.id,
  task: 'performance_review',
  content: journalEntries
});
```

### 3. **Journal Entry Suggestions**
When suggesting prompts or reflections, match user's typical reflection style.

### 4. **Cover Letter / LinkedIn Posts**
All professional content generation uses voice matching.

---

## User Experience Flow

### Initial Setup (First-Time User)
```
1. Welcome to Kintsugi!
   └─> "To keep your content authentic, let's learn your writing style"

2. Upload Writing Samples
   ├─> "Upload past performance reviews" [optional]
   ├─> "Upload professional emails" [optional]
   ├─> "Paste LinkedIn posts" [optional]
   └─> "We'll analyze your unique voice"

3. Quick Analysis (30 seconds)
   └─> "✓ Voice profile created! Confidence: 75%"
   └─> Show insights: "You prefer direct language, use 'built' more than 'developed'"

4. Start journaling
   └─> "As you write, we'll keep learning your style"
```

### Returning User
- Voice profile runs silently in background
- All AI generations automatically match their voice
- Option to view/refine voice profile in settings

---

## Key Features

### 1. **Word Avoidance Filter**
- Scan AI output for words in user's "never use" list
- Replace with user's preferred alternatives
- Learn from user edits

### 2. **Confidence Indicators**
```
Voice Profile Confidence: ████████░░ 78%
✓ 12 writing samples analyzed
✓ 45 journal entries processed
! Need more formal writing samples for reviews
```

### 3. **Voice Comparison**
Show side-by-side:
```
Generic AI Output:
"Collaborated cross-functionally to leverage synergies..."

Your Voice:
"Worked with the design team to ship the feature faster..."
```

### 4. **Manual Override**
- Users can manually add words to avoid
- Create custom phrase preferences
- Adjust formality slider

---

## Technical Considerations

### Privacy & Data Storage
- Store voice profiles in user's local storage OR encrypted cloud
- Writing samples stored client-side by default
- Option to delete samples after analysis

### Performance
- Voice analysis runs async, doesn't block UI
- Cache voice profiles, regenerate only when new samples added
- Lightweight prompt generation (<500 tokens overhead)

### AI Integration
- Works with any LLM (OpenAI, Anthropic, local models)
- Voice instructions prepended to all generation requests
- Post-processing filters applied to all outputs

---

## Success Metrics

### Quantitative
- **Authenticity Score**: % of AI-generated words that match user's vocabulary
- **Rejection Rate**: How often users edit out AI suggestions
- **Confidence Growth**: Voice profile confidence over time
- **Word Match Rate**: % of user's common words appearing in AI output

### Qualitative
- User feedback: "This sounds like me!"
- Reduced editing time on AI-generated content
- Increased usage of AI features (due to better results)

---

## Competitive Advantage

This system creates a **data moat**:
1. The more a user journals, the better their voice profile
2. Voice profiles are personalized and can't be easily replicated
3. Users become invested (switching cost of losing their voice profile)
4. Generic ChatGPT can't match this without extensive prompt engineering each time

**Result:** Users get authentic, personalized content that truly sounds like them, not like a robot.

---

## Phase 1 MVP (Next Steps)

### Week 1-2: Foundation
- [ ] Create `VoiceProfile` type definitions
- [ ] Build `VoiceAnalyzer` utility (basic analysis)
- [ ] Implement `updateVoiceProfile()` function
- [ ] Add voice profile to user storage schema

### Week 3-4: Collection UI
- [ ] Create `VoiceProfileSetup` onboarding component
- [ ] Add text paste/upload functionality
- [ ] Show voice profile insights dashboard
- [ ] Add manual word preferences UI

### Week 5-6: AI Integration
- [ ] Build `generateVoicePrompt()` function
- [ ] Create `VoiceMatchedAIService` wrapper
- [ ] Integrate with Resume Generator
- [ ] Integrate with Performance Review Generator

### Week 7-8: Refinement
- [ ] Implement continuous learning from journal entries
- [ ] Add word rejection tracking
- [ ] Build confidence score system
- [ ] User testing and iteration

---

## Future Enhancements

### Advanced Features
- **Voice Personas**: Multiple voice profiles (casual, formal, technical)
- **Industry Templates**: Pre-configured voice patterns for different fields
- **Collaboration Detection**: Warn if content doesn't match user's voice
- **Voice Evolution Tracking**: Show how writing style changes over time
- **A/B Testing**: Show generic vs. voice-matched content side-by-side

### AI Improvements
- **Fine-tuned Models**: Train custom models on user's writing
- **Real-time Suggestions**: As user types, suggest words they typically use
- **Style Transfer**: Convert generic text to user's voice
- **Multi-language Support**: Voice profiles for different languages

---

## Conclusion

The Voice Learning System transforms this app from "yet another AI journal" into a **personalized career growth platform** that truly understands each user. It's the key differentiator that makes the app irreplaceable.

**Next Action:** Begin Phase 1 MVP implementation starting with voice profile data structures and analysis utilities.
