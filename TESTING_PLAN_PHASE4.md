# Phase 4 Testing Plan: Pottery Visual Feature + Enhancements 🏺✨

## Overview
Comprehensive testing plan for Phase 4 pottery visual feature including recent enhancements: pronunciation badge, pottery UX improvements, sounds, export, info tooltips, and text readability fixes.

---

## Prerequisites
- [ ] Branch: `claude/phase-4-testing-plan-011CV2Pf3sBff9XwEV2DCTzz`
- [ ] Run: `npm run dev`
- [ ] Browser: Chrome, Firefox, or Safari
- [ ] Test in both light and dark modes
- [ ] Test across all 4 color themes (green, blue, red, purple)
- [ ] Test on desktop (1920x1080+) and mobile (375px width)

### User Interaction Required
**IMPORTANT**: Sound effects require at least one user interaction (click/tap) before playing due to browser autoplay policies.

---

## Part A: New Phase 4 Enhancements 🆕

### Test 1: Pronunciation Badge
**Location**: Main app home page, welcome banner

**Steps**:
1. [ ] Navigate to main app home page
2. [ ] Look at welcome banner header next to "Welcome back"

**Expected**:
- [ ] Badge shows "金継ぎ Kintsugi (kin-TSU-gi)"
- [ ] Gold gradient styling visible
- [ ] Badge visible on desktop (>768px)
- [ ] Badge hidden on mobile (<768px)
- [ ] No layout shift when resizing

**Pass Criteria**: ✅ Pronunciation badge educates users on Kintsugi

---

### Test 2: Enhanced Pottery Selection Modal
**Location**: Pottery selection modal (first-time or Workshop Tools)

**Steps**:
1. [ ] Clear localStorage to trigger modal OR click "Change Pottery" in Workshop Tools
2. [ ] Observe modal content

**Expected**:
- [ ] Header shows "Choose Your Vessel 🏺"
- [ ] **NEW**: Badge shows "4 Unique Vessels Available" at top
- [ ] **NEW**: Each pottery card has numbered badge (1-4) in top-left
- [ ] **NEW**: "About Pottery" info box visible with blue/purple gradient
- [ ] All 4 pottery options visible with SVG previews
- [ ] Selected pottery has amber border and checkmark
- [ ] Locked pottery shows lock icon

**"About Pottery" Info Box Content**:
- [ ] Title: "How Pottery Unlocking Works" with Sparkles icon
- [ ] Shows all 4 vessels with unlock requirements:
  - Tea Bowl: "Available immediately"
  - Tall Vase: "After 5 entries (~1 week)"
  - Serving Plate: "After 12 entries (~2-3 weeks)"
  - Storage Jar: "After 25 entries (~1 month)"
- [ ] Bottom note mentions "Personal Insights → Workshop Tools"
- [ ] **NO use of word "journal"** (should say "log accomplishments and challenges")

**Pass Criteria**: ✅ Modal clearly shows all 4 vessels with improved discoverability

---

### Test 3: Info Tooltip on Main App
**Location**: Main app welcome banner, pottery visual

**Steps**:
1. [ ] View pottery on main app
2. [ ] Look for info icon (ℹ️) next to pottery name
3. [ ] Click info icon
4. [ ] Test across all 4 color themes

**Info Icon Visibility**:
- [ ] Green theme: White info icon clearly visible
- [ ] Blue theme: White info icon clearly visible
- [ ] Red theme: White info icon clearly visible
- [ ] Purple theme: White info icon clearly visible
- [ ] Icon size h-4 w-4 (not too small)
- [ ] Hover state works (lighter white)

**Tooltip Behavior**:
- [ ] Tooltip appears ABOVE pottery name
- [ ] Tooltip is CENTERED horizontally (not off to side)
- [ ] White background in light mode
- [ ] Dark gray background in dark mode
- [ ] Amber border visible (border-amber-300/700)
- [ ] X button in top-right corner works
- [ ] Clicking outside closes tooltip
- [ ] Smooth fade animation

**Tooltip Content**:
- [ ] Title: "Unlock New Pottery Styles" with Sparkles icon
- [ ] Tea Bowl: "Now" (amber colored)
- [ ] Tall Vase: "5 entries"
- [ ] Serving Plate: "12 entries"
- [ ] Storage Jar: "25 entries"
- [ ] Bottom text mentions "Personal Insights → Workshop Tools"
- [ ] **NO use of word "journal"**

**Pass Criteria**: ✅ Info tooltip accessible from main app, readable on all themes

---

### Test 4: Pottery Text Readability (All Themes)
**Location**: Main app pottery visual stats

**Steps**:
1. [ ] View pottery stats on main app
2. [ ] Switch between all 4 color themes
3. [ ] Test in both light and dark modes

**Stats Text Check** (Green Theme):
- [ ] "cracks" number: Bold white, clearly readable
- [ ] "cracks" label: White/80 opacity, readable
- [ ] "golden seams" number: Amber-300, stands out
- [ ] "golden seams" label: White/80 opacity, readable
- [ ] "healed" percentage: Bold white, clearly readable
- [ ] "healed" label: White/80 opacity, readable
- [ ] Pottery name (e.g., "Tea Bowl"): White/90, italic, readable

**Stats Text Check** (Blue Theme):
- [ ] All text clearly readable (same as green)
- [ ] No blur or low contrast issues

**Stats Text Check** (Red Theme):
- [ ] All text clearly readable (same as green)
- [ ] User quote: "it looks great even in the red color scheme" ✅

**Stats Text Check** (Purple Theme):
- [ ] All text clearly readable (same as green)
- [ ] No blur or low contrast issues

**Pass Criteria**: ✅ All pottery text readable on all color schemes with no blur

---

### Test 5: Change Pottery Style Feature
**Location**: Personal Insights → Workshop Tools tab

**Steps**:
1. [ ] Navigate to /admin (Personal Insights)
2. [ ] Click "Workshop Tools" tab
3. [ ] Find "Change Pottery Style 🎨" section

**Expected Content**:
- [ ] Section title: "Change Pottery Style 🎨"
- [ ] Shows current pottery style name
- [ ] Shows small pottery preview (SVG)
- [ ] Shows unlock progress (e.g., "1/4 vessels unlocked" or "4/4 vessels unlocked")
- [ ] Shows total golden seams count (e.g., "3 golden seams repaired")
- [ ] "Change Pottery" button visible

**Change Pottery Flow**:
1. [ ] Click "Change Pottery" button
2. [ ] Pottery selection modal opens
3. [ ] Current pottery is pre-selected (checkmark)
4. [ ] Locked pottery shows lock icons
5. [ ] Select different unlocked pottery
6. [ ] Click confirm
7. [ ] Sound plays (if sounds enabled)
8. [ ] Modal closes
9. [ ] Return to main app
10. [ ] **Expected**: Pottery visual updates to new style
11. [ ] **Expected**: Existing cracks preserved on new pottery shape

**Pass Criteria**: ✅ Users can change pottery style after initial selection

---

### Test 6: Sound Effects System
**Location**: Throughout app (pottery events)

**Prerequisites**:
- [ ] Ensure at least one user interaction (click anywhere on page first)
- [ ] Check localStorage: `kintsugi_sounds_enabled` = "true" (default)

**Test 6.1: Pottery Selection Sound**
1. [ ] Open pottery selection modal
2. [ ] Select a pottery style
3. [ ] Click confirm
4. [ ] **Expected**: Soft chime sound plays

**Test 6.2: Crack Sound**
1. [ ] Create journal entry with "Challenging" or "Difficult" mood
2. [ ] Save entry
3. [ ] **Expected**: Ceramic crack sound plays
4. [ ] Check pottery visual shows new crack

**Test 6.3: Gold Fill Sound**
1. [ ] Add reflection to entry with associated crack
2. [ ] Trigger gold fill update
3. [ ] **Expected**: Warm shimmer/chime sound plays
4. [ ] Check pottery shows increased gold percentage

**Test 6.4: Golden Seam Complete Sound**
1. [ ] Complete a crack to 100% gold fill
2. [ ] **Expected**: 3-note celebration sound plays (more celebratory)
3. [ ] **Expected**: Sparkles appear on pottery
4. [ ] **Expected**: "golden seams" count increases

**Test 6.5: Sound Toggle**
1. [ ] Open browser console
2. [ ] Run: `localStorage.setItem('kintsugi_sounds_enabled', 'false')`
3. [ ] Perform action that triggers sound
4. [ ] **Expected**: No sound plays
5. [ ] Run: `localStorage.setItem('kintsugi_sounds_enabled', 'true')`
6. [ ] Perform action again
7. [ ] **Expected**: Sound plays

**Pass Criteria**: ✅ All sound effects work correctly and can be toggled

---

### Test 7: Export Pottery as Image
**Location**: Main app pottery visual (medium/large size)

**Steps**:
1. [ ] View pottery on main app with some cracks and gold
2. [ ] Look for "Export as Image" button below pottery
3. [ ] Verify button visible (purple/pink gradient with download icon)
4. [ ] Verify button NOT visible on small pottery size
5. [ ] Click "Export as Image" button
6. [ ] Wait for download

**Expected Download**:
- [ ] PNG file downloads automatically
- [ ] Filename format: `kintsugi-pottery-{style}-{date}.png`
- [ ] Example: `kintsugi-pottery-tea-bowl-2025-11-12.png`
- [ ] File opens successfully

**Image Quality Check**:
- [ ] Image size: 1200x1200px (high resolution)
- [ ] White background (clean for sharing)
- [ ] Pottery shape clear and visible
- [ ] Cracks visible (dark lines)
- [ ] Gold fill visible (golden lines)
- [ ] Colors accurate
- [ ] No pixelation or blur when zoomed in

**Pass Criteria**: ✅ Export creates high-quality shareable PNG

---

### Test 8: Reduced Unlock Requirements
**Location**: Pottery unlock system

**Verify New Unlock Thresholds**:
- [ ] Tea Bowl: 0 entries (always available)
- [ ] Tall Vase: 5 entries (~1 week casual use) - **WAS 10**
- [ ] Serving Plate: 12 entries (~2-3 weeks) - **WAS 25**
- [ ] Storage Jar: 25 entries (~1 month) - **WAS 50**

**Test Flow**:
1. [ ] Fresh user (0 entries): Only Tea Bowl unlocked
2. [ ] Create 5 entries total
3. [ ] Refresh page
4. [ ] Open pottery selection: Vase should be unlocked ✅
5. [ ] Create 7 more entries (12 total)
6. [ ] Refresh page
7. [ ] Open pottery selection: Plate should be unlocked ✅
8. [ ] Create 13 more entries (25 total)
9. [ ] Refresh page
10. [ ] Open pottery selection: Jar should be unlocked ✅
11. [ ] Workshop Tools shows "4/4 vessels unlocked"

**Pass Criteria**: ✅ More forgiving unlock progression (5/12/25 not 10/25/50)

---

### Test 9: Terminology Verification (No "Journal")
**Location**: All pottery-related UI

**Search for word "journal" - should NOT appear in**:
- [ ] Pottery selection modal text
- [ ] "About Pottery" info box
- [ ] Info tooltip on main app
- [ ] Workshop Tools pottery section
- [ ] Any pottery-related UI text

**Should use instead**:
- [ ] "document your impact"
- [ ] "log accomplishments and challenges"
- [ ] "entries"

**Pass Criteria**: ✅ Consistent terminology aligned with app branding

---

## Part B: Core Pottery Visual Feature 🏺

### Test 10: First-Time User - Pottery Selection
**Location**: Home page, welcome banner

**Steps**:
1. [ ] Clear localStorage (simulate new user)
2. [ ] Reload localhost:3000
3. [ ] Complete profile setup if prompted
4. [ ] **Expected**: Pottery selection modal appears automatically

**Modal Content** (covered in Test 2, but verify):
- [ ] Title: "Choose Your Vessel 🏺"
- [ ] 4 pottery options with numbered badges
- [ ] Tea Bowl selectable (default)
- [ ] Other 3 locked with requirements shown
- [ ] "Begin My Kintsugi Journey with Tea Bowl" button

**Actions**:
- [ ] Try clicking locked pottery (should not select)
- [ ] Select Tea Bowl
- [ ] Click confirm button
- [ ] **Expected**: Modal closes, pottery saved, sound plays

**Pass Criteria**: ✅ Selection modal works for new users

---

### Test 11: Pottery Visual in Welcome Banner
**Location**: Home page, welcome banner

**Steps**:
1. [ ] After selecting pottery, check welcome banner
2. [ ] **Expected** (Desktop): Pottery visual on left side
3. [ ] **Expected** (Mobile): Pottery hidden (responsive)

**Pottery Visual Elements**:
- [ ] SVG pottery shape visible
- [ ] Ceramic brown/tan color (#8B7355)
- [ ] No cracks yet (new user)
- [ ] Stats below pottery:
  - "0 cracks" (white text)
  - "0 golden seams" (amber text)
  - "0% healed" (white text)
- [ ] Pottery style name: "Tea Bowl" (white/90 italic)
- [ ] Info icon visible next to name
- [ ] Export button visible below

**Pass Criteria**: ✅ Pottery displays correctly with all new enhancements

---

### Test 12: Cracks Appear on Challenging Entry
**Location**: Golden Seams tab (journal entry creation)

**Steps**:
1. [ ] Go to "Golden Seams" tab
2. [ ] Create new entry with:
   - Mood: "Challenging" or "Difficult"
   - Accomplishment: "Dealt with difficult team conflict"
3. [ ] Save entry
4. [ ] **Expected**: Crack sound plays (ceramic break)
5. [ ] Return to Home tab
6. [ ] Check pottery visual

**Expected**:
- [ ] Pottery shows 1 crack (dark line)
- [ ] Crack is SVG path
- [ ] Crack animation plays (line draws in)
- [ ] Stats updated:
  - "1 cracks"
  - "0 golden seams"
  - "~0-10% healed" (some initial fill)

**Pass Criteria**: ✅ Cracks auto-create from challenging entries with sound

---

### Test 13: Gold Fills Over Time
**Location**: Home page, pottery visual

**Theory**:
- [ ] Gold fill increases 1% per day (up to 30%)
- [ ] Gold fill increases 10% per reflection (up to 40%)
- [ ] Total cap: 100% = "golden seam"

**To Test**:
1. [ ] Add reflection to challenging entry
2. [ ] Reload page
3. [ ] **Expected**: Gold fill sound plays
4. [ ] Check pottery - gold should overlay crack (golden line)
5. [ ] Stats show higher % healed
6. [ ] If reaches 100%: Celebration sound + sparkles appear

**Pass Criteria**: ✅ Gold fill logic works with appropriate sounds

---

### Test 14: Pottery Data Persistence
**Steps**:
1. [ ] Select pottery style
2. [ ] Create entries with cracks
3. [ ] Add some gold fill via reflections
4. [ ] Note current state (X cracks, Y% healed)
5. [ ] Close browser tab completely
6. [ ] Reopen localhost:3000
7. [ ] **Expected**: Same pottery, same cracks, same gold fill percentage

**Pass Criteria**: ✅ Pottery data persists in localStorage

---

## Part C: Personal Insights Integration 🪞

### Test 15: Access Personal Insights
**Location**: /admin URL

**Steps**:
1. [ ] Navigate to localhost:3000/admin
2. [ ] **Expected**: Page loads with branding

**Header Check**:
- [ ] Title: "Personal Insights"
- [ ] Subtitle: "Your Transformation Journey, Visualized"
- [ ] Theme toggle works
- [ ] "Back to App" button works

**Pass Criteria**: ✅ Personal Insights accessible

---

### Test 16: Privacy Notice Banner
**Location**: Top of Personal Insights page

**Content**:
- [ ] Blue/purple gradient background
- [ ] Shield icon
- [ ] Title: "Your Data, Your Eyes Only"
- [ ] Message explains local storage, privacy
- [ ] Mentions "Personal reflection mirror 🪞"

**Pass Criteria**: ✅ Privacy notice clear

---

### Test 17: Workshop Tools Tab
**Location**: Personal Insights → Workshop Tools

**Verify Tab Content**:
- [ ] Tab name: "Workshop Tools" with Settings icon
- [ ] "Change Pottery Style 🎨" section present (Test 5)
- [ ] Current pottery shown
- [ ] Unlock progress shown
- [ ] Golden seams count shown
- [ ] Change button works

**Pass Criteria**: ✅ Workshop Tools includes pottery management

---

## Part D: Cross-Feature Integration Tests

### Test 18: Pottery + Personal Insights Together
**End-to-end flow**:
1. [ ] Select pottery style (Tea Bowl)
2. [ ] Create 5 entries, 2 with "challenging" mood
3. [ ] Add reflections to challenging entries
4. [ ] Check pottery in welcome banner:
   - 2 cracks visible
   - Some gold fill on cracks
   - Stats updated
5. [ ] Go to Personal Insights /admin
6. [ ] Verify "Golden Moments" stat shows 5
7. [ ] Go to Workshop Tools
8. [ ] Check pottery stats (1/4 unlocked, 2 golden seams if 100% filled)
9. [ ] Change to Vase (unlocked at 5 entries)
10. [ ] Return to home
11. [ ] **Expected**: Pottery now shows Vase shape with same 2 cracks

**Pass Criteria**: ✅ All features integrate seamlessly

---

### Test 19: Responsive Design
**Viewports to test**:
- [ ] **Desktop** (1920x1080):
  - Pottery visible in banner
  - Pronunciation badge visible
  - Export button visible
  - Info icon clickable
- [ ] **Tablet** (768x1024):
  - Pottery might hide at certain breakpoints
  - Stats stack nicely
  - Modal scrollable
- [ ] **Mobile** (375x667):
  - Pottery hidden
  - Pronunciation badge hidden
  - Modal responsive
  - Info tooltip stays on screen

**Personal Insights responsiveness**:
- [ ] Stat cards stack vertically on mobile
- [ ] Charts responsive
- [ ] Tabs wrap appropriately

**Pass Criteria**: ✅ Works beautifully on all screen sizes

---

### Test 20: Dark Mode Compatibility
**Location**: Entire app

**Steps**:
1. [ ] Toggle dark mode
2. [ ] Test all pottery features:
   - Pottery visual (colors still visible)
   - Pottery selection modal (dark background)
   - Info tooltip (dark gray background)
   - "About Pottery" box (dark blue/purple)
   - Workshop Tools (dark theme)
   - Export button (visible)

**Verify**:
- [ ] Text readable (good contrast)
- [ ] White pottery text visible on dark backgrounds
- [ ] Amber colors still pop
- [ ] Borders visible
- [ ] No invisible elements

**Pass Criteria**: ✅ Perfect dark mode support

---

## Part E: Edge Cases & Error Handling

### Test 21: localStorage Cleared During Session
**Steps**:
1. [ ] Use app with pottery
2. [ ] Open browser console
3. [ ] Run: `localStorage.clear()`
4. [ ] Refresh page

**Expected**:
- [ ] Pottery selection modal appears again
- [ ] No errors in console
- [ ] Can select pottery again
- [ ] App recovers gracefully

**Pass Criteria**: ✅ Handles localStorage loss

---

### Test 22: Invalid localStorage Data
**Steps**:
1. [ ] Open console
2. [ ] Run: `localStorage.setItem('kintsugi_pottery_data', 'invalid json')`
3. [ ] Refresh page

**Expected**:
- [ ] App doesn't crash
- [ ] Pottery selection modal appears
- [ ] Console shows error but app recovers
- [ ] Can select pottery normally

**Pass Criteria**: ✅ Robust error handling

---

### Test 23: Sound Autoplay Policy (No User Interaction)
**Steps**:
1. [ ] Open fresh page
2. [ ] Create challenging entry immediately (no clicks)
3. [ ] Observe sound behavior

**Expected**:
- [ ] Sound may not play (browser blocks autoplay)
- [ ] No errors in console
- [ ] App works normally
- [ ] After first click, sounds work

**Pass Criteria**: ✅ Graceful handling of browser policies

---

## Part F: Performance Tests

### Test 24: Load Time
**Steps**:
1. [ ] Clear cache
2. [ ] Reload localhost:3000
3. [ ] Time until pottery appears

**Expected**:
- [ ] Pottery visible in < 1 second
- [ ] No lag or jank
- [ ] Animations smooth

**Pass Criteria**: ✅ Fast load performance

---

### Test 25: Animation Performance
**Steps**:
1. [ ] Create entry with challenging mood
2. [ ] Watch crack animation
3. [ ] Watch gold fill animation
4. [ ] Watch sparkle animation (if 100% filled)

**Expected**:
- [ ] Smooth animations (60fps)
- [ ] No stuttering
- [ ] No memory leaks (check DevTools)

**Pass Criteria**: ✅ Butter-smooth animations

---

## Summary Checklist

### Phase 4 Enhancements ✨
- [ ] Pronunciation badge visible and responsive
- [ ] Pottery selection shows "4 Unique Vessels" with numbers
- [ ] "About Pottery" info box in modal with correct unlock requirements
- [ ] Info icon and tooltip on main app (white, centered, readable)
- [ ] Pottery text readable on all 4 color themes (white/amber)
- [ ] Change pottery feature works in Workshop Tools
- [ ] All 4 sound effects play correctly (can be toggled)
- [ ] Export downloads high-quality PNG (1200x1200)
- [ ] Reduced unlock requirements (5/12/25 not 10/25/50)
- [ ] No use of word "journal" in pottery UI

### Core Pottery Features 🏺
- [ ] Pottery selection modal works for new users
- [ ] Pottery displays in welcome banner (desktop)
- [ ] Cracks auto-create from challenging entries
- [ ] Gold fill increases with reflections and time
- [ ] Pottery styles unlock at correct entry counts
- [ ] Data persists in localStorage
- [ ] Responsive design (hides on mobile)

### Personal Insights Integration 🪞
- [ ] Workshop Tools includes pottery management
- [ ] Can change pottery style after initial selection
- [ ] Pottery stats shown in Workshop Tools
- [ ] Personal Insights accessible

### Quality & Polish ✅
- [ ] Dark mode works perfectly
- [ ] Responsive on all devices (desktop/tablet/mobile)
- [ ] No console errors
- [ ] Smooth animations (60fps)
- [ ] Fast load times (< 1 second)
- [ ] Graceful error handling
- [ ] All 4 color themes supported
- [ ] Sounds respect browser autoplay policies

---

## Issues to Report

If any test fails, document:
- ❌ Test number and name
- 🖥️ Browser and version
- 📝 What happened vs. expected
- 📸 Screenshot if visual issue
- 🔄 Steps to reproduce

---

## Next Steps After Testing

1. ✅ Document any bugs or issues found
2. ✅ Note any UX improvements
3. ✅ Suggest enhancements
4. ✅ Verify all features work together
5. ✅ Ready to merge or iterate based on feedback

---

**Total Tests**: 25 comprehensive tests covering all Phase 4 features and enhancements
**Estimated Testing Time**: 60-90 minutes for complete coverage
**Priority Tests** (quick validation): 2, 3, 4, 5, 6.1, 7, 8, 9, 11, 12

---

✅ **This testing plan ensures Phase 4 pottery visual feature with all enhancements works flawlessly across devices, themes, and user scenarios.**
