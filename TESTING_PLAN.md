# Comprehensive Testing Plan - Phase 1 & 2

## Prerequisites
- [ ] Localhost running: `npm run dev`
- [ ] Browser: Chrome, Firefox, or Safari (for audio support)
- [ ] Clean browser cache (optional, for fresh start)

---

## Phase 1: Pronunciation Guide Testing

### Test 1: Header Pronunciation Badge
**Location**: Top header bar (desktop only)

1. [ ] Open localhost:3000 on **desktop browser**
2. [ ] Verify you see the Kintsugi header
3. [ ] Look for amber/orange badge to the right of "Kintsugi" text
4. [ ] Badge should show: "金継ぎ kin • **TSU** • gi" with a speaker icon
5. [ ] **Expected**: Badge visible on large screens (lg breakpoint)
6. [ ] Resize browser to mobile width
7. [ ] **Expected**: Badge should hide on mobile

**Pass Criteria**: ✅ Badge appears on desktop, hidden on mobile

### Test 2: Header Badge Audio
**Location**: Header pronunciation badge

1. [ ] Click the pronunciation badge in header
2. [ ] **Expected**: Hear audio pronunciation "keen tsoo gee"
3. [ ] **Listen for**: 3 syllables with emphasis on middle "TSU"
4. [ ] Volume should be audible but not jarring
5. [ ] Rate should be slower (0.7x speed) for clarity

**Pass Criteria**: ✅ Audio plays correctly with proper pronunciation

### Test 3: Lightning FAB Pronunciation Option
**Location**: Bottom-left floating action button

1. [ ] Click the **purple gradient FAB** (bottom-left corner)
2. [ ] **Expected**: 3 action buttons appear above it
3. [ ] Look for the **amber/orange** "金継ぎ (kin-TSU-gi)" button with Volume2 icon
4. [ ] Click it
5. [ ] **Expected**: Tooltip appears with enhanced pronunciation

**Pass Criteria**: ✅ Pronunciation option appears in FAB menu

### Test 4: Enhanced Pronunciation Tooltip
**Location**: Lightning FAB → Pronunciation tooltip

1. [ ] Click pronunciation option from FAB
2. [ ] **Expected**: Large tooltip appears above FAB with:
   - Title: "金継ぎ Kintsugi"
   - Phonetic: "kin • **TSU** • gi" (TSU in larger, bold, gold text)
   - "Listen" button with speaker icon
   - Definition: "The art of repairing broken pottery with gold"
3. [ ] Verify TSU is visually emphasized (larger, bolder, gold color)
4. [ ] Tooltip should have amber-to-orange gradient background
5. [ ] Auto-dismiss after 3 seconds

**Pass Criteria**: ✅ Tooltip displays with all enhanced formatting

### Test 5: Tooltip Audio Playback
**Location**: Pronunciation tooltip "Listen" button

1. [ ] Open FAB → Click pronunciation option
2. [ ] Click the **"Listen" button** in the tooltip
3. [ ] **Expected**: Hear "keen tsoo gee" pronunciation
4. [ ] Same audio as header badge
5. [ ] Button should have hover effect (bg-white/30)

**Pass Criteria**: ✅ Audio plays from tooltip button

### Test 6: Dark Mode Compatibility
**Location**: Header and FAB

1. [ ] Toggle dark mode (theme toggle in header)
2. [ ] Verify header badge colors adapt:
   - Dark mode: amber-900/20 to orange-900/20 background
   - Border: amber-700
3. [ ] Verify FAB tooltip readable in dark mode
4. [ ] All text should have good contrast

**Pass Criteria**: ✅ Pronunciation features work in both light and dark mode

---

## Phase 2: Voice Learning System Testing

### Test 7: Access Voice Profile Settings
**Location**: Settings → Voice Profile tab

1. [ ] Press **Ctrl+Shift+S** (or click Settings icon in header)
2. [ ] **Expected**: Settings modal opens
3. [ ] Look for tabs: Profile, Data Management, Appearance, **Voice Profile**, Diagnostic
4. [ ] Click **"Voice Profile"** tab
5. [ ] **Expected**: Voice Profile Manager loads

**Pass Criteria**: ✅ Voice Profile tab accessible in Settings

### Test 8: Initial Voice Profile State
**Location**: Settings → Voice Profile → Add Samples tab

1. [ ] First time opening Voice Profile
2. [ ] **Expected**: Confidence banner shows:
   - "Voice Profile Confidence: 0%"
   - Amber/orange color (not yet confident)
   - "No samples yet • Add more samples to improve accuracy"
3. [ ] Three tabs visible: "Add Samples", "Voice Insights", "Preferences"
4. [ ] Currently on "Add Samples" tab

**Pass Criteria**: ✅ Initial state shows 0% confidence, prompts for samples

### Test 9: Add First Writing Sample
**Location**: Voice Profile → Add Samples tab

**Sample text to use** (paste this):
```
I led the redesign of our authentication system, improving login speed by 40% and reducing errors by 65%. The project involved coordinating with three teams and shipping the update to 50,000 users. I learned TypeScript and Next.js specifically for this project, which helped me build a more maintainable codebase. The biggest challenge was migrating legacy data without downtime, which I solved by implementing a dual-write pattern. Overall, I'm proud of how the project turned out and the positive feedback from users.
```

**Steps**:
1. [ ] Select sample type: "Professional Email"
2. [ ] Paste the sample text above (word count should show ~90 words)
3. [ ] Verify "Add to Voice Profile" button is enabled
4. [ ] Click **"Add to Voice Profile"**
5. [ ] **Expected**:
   - Button shows "Analyzing..." with spinner
   - Green success message appears: "Sample added!"
   - Confidence score increases (should be 20-25%)
   - Sample count shows "1 sample analyzed"

**Pass Criteria**: ✅ Sample added successfully, confidence score updates

### Test 10: Voice Insights Display
**Location**: Voice Profile → Voice Insights tab

1. [ ] Click **"Voice Insights"** tab
2. [ ] **Expected**: Two cards display:
   - **Writing Style** card:
     - Formality: /10
     - Avg Sentence Length: ~words
     - Active Voice: ~%
   - **Voice Characteristics** card:
     - Tone: (reserved/enthusiastic/balanced)
     - Detail Level: (concise/detailed/comprehensive)
3. [ ] Below: "Your Most Common Words" section
4. [ ] Should show top 20 words as purple badges with frequency counts
5. [ ] All metrics should be calculated from your sample

**Pass Criteria**: ✅ Insights display calculated metrics

### Test 11: Add Second Sample (Increase Confidence)
**Location**: Voice Profile → Add Samples tab

**Sample text to use**:
```
I developed a comprehensive testing strategy that caught 15 critical bugs before production. This included setting up automated end-to-end tests using Playwright and implementing visual regression testing. The tests now run on every pull request, giving the team confidence to ship faster. I documented the entire process so other developers could contribute tests easily. The coverage increased from 40% to 85% in three months.
```

**Steps**:
1. [ ] Return to "Add Samples" tab
2. [ ] Paste second sample (~80 words)
3. [ ] Add to voice profile
4. [ ] **Expected**: Confidence increases to ~30-40%
5. [ ] Status should change to green: "Ready to use"

**Pass Criteria**: ✅ Confidence reaches 30%+, status turns green

### Test 12: Add Avoided Words
**Location**: Voice Profile → Preferences tab

1. [ ] Click **"Preferences"** tab
2. [ ] Find "Words to Avoid" section
3. [ ] Type "leverage" in the input field
4. [ ] Click the plus (+) button
5. [ ] **Expected**: "leverage" appears as a red badge
6. [ ] Repeat for: "utilize", "synergy", "stakeholder"
7. [ ] Each word should have an X button to remove it

**Pass Criteria**: ✅ Avoided words added and displayed as red badges

### Test 13: Add Preferred Phrases
**Location**: Voice Profile → Preferences tab

1. [ ] Find "Preferred Phrases" section
2. [ ] Type "made it happen" in input
3. [ ] Press Enter or click plus (+)
4. [ ] **Expected**: Phrase appears as green badge
5. [ ] Add another: "figured out"

**Pass Criteria**: ✅ Preferred phrases added and displayed as green badges

### Test 14: Voice-Matched Performance Review Generation
**Location**: Insights tab → AI Performance Review Generator

**Prerequisites**: Need some journal entries
1. [ ] Go to "Impact Log" tab
2. [ ] Add 3-5 accomplishments (any text, 20+ words each)
3. [ ] Return to "Insights" tab
4. [ ] Scroll to **"AI Performance Review Generator"**

**Steps**:
1. [ ] **Expected**: Voice matching status banner appears
2. [ ] With 30%+ confidence, should show:
   - Purple/pink gradient background
   - Volume2 icon
   - "Voice Matching Active"
   - Message: "Voice matching active with X% confidence"
3. [ ] Select timeframe: "Quarter"
4. [ ] Click **"Generate Performance Review"**
5. [ ] **Expected**:
   - Review generates
   - Purple badge appears: "This review matches your authentic writing style"
   - Review should NOT contain avoided words (leverage, utilize, synergy, stakeholder)

**Pass Criteria**: ✅ Voice matching active, avoided words filtered out

### Test 15: Voice Matching Disabled State
**Location**: AI Performance Review Generator

**Scenario**: New user with no voice profile

1. [ ] Open browser incognito/private window
2. [ ] Go to localhost:3000
3. [ ] Complete profile setup (minimal info)
4. [ ] Add 1-2 journal entries
5. [ ] Go to Insights → AI Performance Review Generator
6. [ ] **Expected**: Amber/orange status banner:
   - Info icon (not Volume2)
   - "Voice Matching Not Active"
   - Message: "Add X more samples to enable voice matching"
   - Instructions: "Add writing samples in Settings → Voice Profile"

**Pass Criteria**: ✅ Disabled state prompts user to add samples

### Test 16: Voice Profile Persistence
**Location**: Settings → Voice Profile

1. [ ] Add 2+ writing samples
2. [ ] Add avoided words
3. [ ] Close browser tab
4. [ ] Reopen localhost:3000
5. [ ] Go to Settings → Voice Profile
6. [ ] **Expected**: All data persists (localStorage)
   - Samples still there
   - Confidence score maintained
   - Avoided words preserved
   - Insights still display

**Pass Criteria**: ✅ Voice profile data persists across sessions

---

## Cross-Browser Testing

### Test 17: Chrome
1. [ ] All Phase 1 tests pass
2. [ ] All Phase 2 tests pass
3. [ ] Audio works (SpeechSynthesis API)

### Test 18: Firefox
1. [ ] All Phase 1 tests pass
2. [ ] All Phase 2 tests pass
3. [ ] Audio works

### Test 19: Safari
1. [ ] All Phase 1 tests pass
2. [ ] All Phase 2 tests pass
3. [ ] Audio works (may have different voice)

---

## Edge Cases & Error Handling

### Test 20: Minimum Word Count Validation
1. [ ] Try adding sample with < 50 words
2. [ ] **Expected**: Alert: "Please paste at least 50 words"
3. [ ] Button should be disabled when word count < 50

### Test 21: Audio Browser Support
1. [ ] Test in browser without SpeechSynthesis
2. [ ] **Expected**: Audio button still present
3. [ ] Click should fail gracefully (no crash)

### Test 22: Empty State Handling
1. [ ] Voice Insights tab with 0 samples
2. [ ] **Expected**: Should show empty state or prompt

---

## Performance Testing

### Test 23: Voice Profile Load Time
1. [ ] Time how long Voice Profile Manager takes to load
2. [ ] **Expected**: < 500ms

### Test 24: Sample Analysis Speed
1. [ ] Time how long it takes to analyze a sample
2. [ ] **Expected**: < 2 seconds (mostly UI delay)

---

## Issues to Report

If any test fails, please note:
- ❌ Test number that failed
- 🖥️ Browser and version
- 📝 What happened vs. what was expected
- 📸 Screenshot if visual issue
- 🔄 Steps to reproduce

---

## Summary Checklist

After completing all tests:

**Phase 1 - Pronunciation**:
- [ ] Header badge works (desktop)
- [ ] Header audio plays
- [ ] FAB pronunciation option works
- [ ] Tooltip displays correctly
- [ ] Tooltip audio plays
- [ ] Dark mode compatible

**Phase 2 - Voice Learning**:
- [ ] Voice Profile tab accessible
- [ ] Samples can be added
- [ ] Confidence score updates
- [ ] Insights display
- [ ] Avoided words work
- [ ] Preferred phrases work
- [ ] Voice matching applies to reviews
- [ ] Data persists

**Overall**:
- [ ] No console errors
- [ ] Works in Chrome/Firefox/Safari
- [ ] Dark mode fully functional
- [ ] No crashes or freezes
