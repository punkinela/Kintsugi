# Testing Plan - Phase 4: Pottery Visual + Personal Insights

## Prerequisites
- [ ] Branch: `claude/pottery-visual-011CUyRbNDcToDJDxGJdgmka`
- [ ] Run: `npm run dev`
- [ ] Browser: Chrome, Firefox, or Safari
- [ ] Optional: Clear localStorage to test new user experience

---

## Part A: Pottery Visual Feature 🏺

### Test 1: First-Time User - Pottery Selection
**Location**: Home page, welcome banner

**Steps**:
1. [ ] Clear localStorage (to simulate new user)
2. [ ] Reload localhost:3000
3. [ ] Complete profile setup if prompted
4. [ ] **Expected**: Pottery selection modal appears automatically

**Modal Content**:
- [ ] Title: "Choose Your Vessel 🏺"
- [ ] Description mentions cracks and gold
- [ ] 4 pottery options visible:
  - Tea Bowl (unlocked, default selected)
  - Tall Vase (locked - needs 10 entries)
  - Serving Plate (locked - needs 25 entries)
  - Storage Jar (locked - needs 50 entries)
- [ ] Selected pottery has checkmark
- [ ] Locked pottery shows lock icon and unlock requirement
- [ ] SVG preview shows for each pottery style
- [ ] Bottom button: "Begin My Kintsugi Journey with Tea Bowl"

**Actions**:
- [ ] Try clicking locked pottery (should not select)
- [ ] Select Tea Bowl
- [ ] Click confirm button
- [ ] **Expected**: Modal closes, pottery data saved

**Pass Criteria**: ✅ Selection modal works, pottery saved to localStorage

---

### Test 2: Pottery Visual in Welcome Banner
**Location**: Home page, welcome banner (left side on desktop)

**Steps**:
1. [ ] After selecting pottery, check welcome banner
2. [ ] **Expected** (Desktop): Pottery visual appears on left side
3. [ ] **Expected** (Mobile): Pottery hidden (responsive design)

**Pottery Visual Elements**:
- [ ] SVG pottery shape visible
- [ ] Ceramic brown/tan color (#8B7355)
- [ ] No cracks yet (new user)
- [ ] Stats below pottery:
  - "0 cracks"
  - "0 golden seams"
  - "0% healed"
- [ ] Pottery style name: "Tea Bowl"

**Pass Criteria**: ✅ Pottery displays correctly in banner

---

### Test 3: Cracks Appear on Challenging Entry
**Location**: Golden Seams tab (journal entry creation)

**Setup**: Create pottery system test entries

**Steps**:
1. [ ] Go to "Golden Seams" tab
2. [ ] Create a new entry with:
   - Mood: "Challenging" or "Difficult"
   - Accomplishment: "Dealt with difficult team conflict"
   - Save entry
3. [ ] Return to Home tab
4. [ ] Check pottery visual in welcome banner

**Expected**:
- [ ] Pottery now shows 1 crack (dark line)
- [ ] Crack is visible as SVG path
- [ ] Stats updated:
  - "1 cracks"
  - "0 golden seams"
  - "~0-5% healed" (depends on logic)
- [ ] Crack animation plays (line draws in)

**Pass Criteria**: ✅ Cracks auto-create from challenging entries

---

### Test 4: Gold Fills Over Time
**Location**: Home page, pottery visual

**Note**: This is harder to test without time manipulation

**Theory**:
- [ ] Gold fill increases 1% per day (up to 30%)
- [ ] Gold fill increases 10% per reflection (up to 40%)
- [ ] Total cap: 100% = "golden seam"

**To test**:
1. [ ] Add reflection to challenging entry
2. [ ] Reload page
3. [ ] Check pottery - gold should fill slightly more
4. [ ] Stats should show higher % healed

**Future Enhancement**: Add "fast-forward time" debug button

**Pass Criteria**: ✅ Gold fill logic works (theoretical)

---

### Test 5: Unlocking New Pottery Styles
**Location**: Pottery selection (reopen modal)

**Steps**:
1. [ ] Create 10 journal entries (any mood)
2. [ ] Refresh page
3. [ ] Check welcome banner pottery
4. [ ] **Expected**: Vase should now be unlocked

**To reopen pottery selection** (feature request):
- [ ] Settings → "Change Pottery Style" button (if added)
- OR manually test by clearing pottery data in localStorage

**Pass Criteria**: ✅ Pottery unlocks at correct entry counts

---

### Test 6: Pottery Data Persistence
**Steps**:
1. [ ] Select pottery style
2. [ ] Create entries with cracks
3. [ ] Close browser tab
4. [ ] Reopen localhost:3000
5. [ ] **Expected**: Same pottery, same cracks, same gold fill

**Pass Criteria**: ✅ Pottery data persists in localStorage

---

## Part B: Personal Insights (Admin → Transformed) 🪞

### Test 7: Access Personal Insights
**Location**: /admin URL

**Steps**:
1. [ ] Navigate to localhost:3000/admin
2. [ ] **Expected**: Page loads with new branding

**Header Check**:
- [ ] Title: "Personal Insights" (not "Admin Dashboard")
- [ ] Subtitle: "Your Transformation Journey, Visualized"
- [ ] Icon: BarChart3 (keep or could change to pottery)
- [ ] Theme toggle present
- [ ] "Back to App" button works

**Pass Criteria**: ✅ Header shows Personal Insights branding

---

### Test 8: Privacy Notice Banner
**Location**: Top of Personal Insights page

**Content**:
- [ ] Blue/purple gradient background
- [ ] Shield icon (🔒)
- [ ] Title: "Your Data, Your Eyes Only"
- [ ] Message explains:
  - Data is local (browser localStorage)
  - No server transmission
  - Private to you only
  - "Personal reflection mirror 🪞"

**Pass Criteria**: ✅ Privacy notice is prominent and clear

---

### Test 9: Tab Names - Kintsugi Transformation
**Location**: Personal Insights navigation tabs

**Verify tabs show**:
- [ ] **"Golden Gallery"** (was "Overview") with Sparkles icon
- [ ] **"Your Golden Seams"** (was "Impact Log") with BookOpen icon
- [ ] **"Your Profile"** (was "Demographics") with User icon
- [ ] **"Transformation Path"** (was "User Journey") with Map icon
- [ ] **"Patterns of Repair"** (was "Insights") with Brain icon
- [ ] **"Workshop Tools"** (was "Settings") with Settings icon

**Actions**:
- [ ] Click each tab, verify it loads correct content
- [ ] Tabs highlight when active (gold color)

**Pass Criteria**: ✅ All tabs renamed with Kintsugi philosophy

---

### Test 10: Golden Gallery - Metric Transformations
**Location**: Personal Insights → Golden Gallery tab

**Opening Section**:
- [ ] Title: "Your Golden Gallery 🏺"
- [ ] Description: "...personal transformation archive...honor your cracks and fill them with gold"

**Stat Cards** (verify all 4):
1. **"Your Journey"**
   - [ ] Value: "Active" (for single user)
   - [ ] Icon: Sparkles
   - [ ] Trend: "X% this week"
   - [ ] Color: Amber/orange gradient

2. **"Golden Moments"**
   - [ ] Value: Number of accomplishments
   - [ ] Icon: Award
   - [ ] Trend: "X day healing streak"
   - [ ] Color: Purple/pink gradient

3. **"Healing Resonance"**
   - [ ] Value: "X.X ❤️" (rating with heart)
   - [ ] Icon: Heart
   - [ ] Trend: "X reflections"
   - [ ] Color: Pink/rose gradient

4. **"Transformation Energy"**
   - [ ] Value: "X/Y" (positive/total)
   - [ ] Icon: Sparkles
   - [ ] Trend: "Glowing with hope"
   - [ ] Color: Green/teal gradient

**Pass Criteria**: ✅ All metrics use Kintsugi language and gold colors

---

### Test 11: Chart Title Transformations
**Location**: Personal Insights → Golden Gallery

**Chart 1: "The Golden Wave"**
- [ ] Title: "The Golden Wave" (was "Engagement Trend")
- [ ] Subtitle: "Watch how healing spreads through time ✨"
- [ ] Icon: TrendingUp
- [ ] Chart shows area graph with gold gradient

**Chart 2: "Tools for Repair"**
- [ ] Title: "Tools for Repair" (was "Feature Usage")
- [ ] Subtitle: "Which golden practices resonate most? 🛠️"
- [ ] Icon: Target
- [ ] Chart shows bar graph

**Pass Criteria**: ✅ Charts use poetic Kintsugi metaphors

---

### Test 12: Your Golden Seams Tab
**Location**: Personal Insights → Your Golden Seams

**Check**:
- [ ] Tab loads journal/entry visualizations
- [ ] Kintsugi Journal Insights component displays
- [ ] Transformation Heatmap shows
- [ ] Golden Seam Timeline present
- [ ] All existing visualizations work

**Pass Criteria**: ✅ Journal tab functions with new name

---

### Test 13: Your Profile Tab
**Location**: Personal Insights → Your Profile

**Check**:
- [ ] Shows your current profile info
- [ ] Name, gender, profession, ethnicity displayed
- [ ] Note: "This is your current profile. Demographics shown below include all users..."
- [ ] Demographic breakdowns below (if multi-user data exists)

**Pass Criteria**: ✅ Profile tab shows personal data

---

### Test 14: Dark Mode Compatibility
**Location**: Personal Insights, all tabs

**Steps**:
1. [ ] Toggle dark mode (button in header)
2. [ ] Check each tab in dark mode:
   - Golden Gallery
   - Your Golden Seams
   - Your Profile
   - Transformation Path
   - Patterns of Repair
   - Workshop Tools
3. [ ] Verify:
   - Text is readable (good contrast)
   - Cards have dark backgrounds
   - Gold/amber colors still visible
   - Charts render correctly
   - Privacy banner looks good

**Pass Criteria**: ✅ All content readable and beautiful in dark mode

---

### Test 15: Export Buttons (Verify Still Work)
**Location**: Personal Insights → Golden Gallery

**Buttons**:
- [ ] "JSON" - Downloads analytics JSON
- [ ] "Feedback CSV" - Downloads feedback CSV
- [ ] "Complete Data" - Downloads all data CSV

**Actions**:
- [ ] Click each button
- [ ] Verify file downloads with correct data
- [ ] File names should include date

**Pass Criteria**: ✅ Export functionality still works

---

## Integration Tests

### Test 16: Pottery + Personal Insights Together
**End-to-end flow**:
1. [ ] Select pottery style (Tea Bowl)
2. [ ] Create 5 entries, 2 with "challenging" mood
3. [ ] Add reflections to challenging entries
4. [ ] Check pottery in welcome banner (should show 2 cracks with some gold)
5. [ ] Go to Personal Insights /admin
6. [ ] Verify "Golden Moments" stat shows 5
7. [ ] Check "Your Golden Seams" tab shows entries
8. [ ] Return to home, pottery still displays correctly

**Pass Criteria**: ✅ Both features work together seamlessly

---

### Test 17: Responsive Design
**Viewports to test**:
- [ ] **Desktop** (1920x1080): Pottery visible in banner
- [ ] **Tablet** (768x1024): Pottery might hide, stats stack
- [ ] **Mobile** (375x667): Pottery hidden, single column layout

**Personal Insights responsiveness**:
- [ ] Stat cards stack vertically on mobile
- [ ] Charts are scrollable/responsive
- [ ] Tabs wrap on narrow screens

**Pass Criteria**: ✅ Works on all screen sizes

---

## Performance Tests

### Test 18: Load Time
**Steps**:
1. [ ] Clear cache
2. [ ] Reload localhost:3000
3. [ ] Time how long until pottery appears
4. [ ] **Expected**: < 1 second

**Pass Criteria**: ✅ Fast load, no lag

---

### Test 19: Animation Performance
**Steps**:
1. [ ] Create entry with challenging mood
2. [ ] Watch crack animation
3. [ ] Should be smooth, not janky
4. [ ] Check DevTools Performance tab if issues

**Pass Criteria**: ✅ Animations are smooth

---

## Issues to Report

If any test fails, note:
- ❌ Test number and name
- 🖥️ Browser and version
- 📝 What happened vs. expected
- 📸 Screenshot if visual issue
- 🔄 Steps to reproduce

---

## Summary Checklist

**Phase 4A - Pottery Visual**:
- [ ] Pottery selection modal works
- [ ] Pottery displays in welcome banner
- [ ] Cracks auto-create from challenging entries
- [ ] Gold fill logic works
- [ ] Pottery styles unlock correctly
- [ ] Data persists in localStorage
- [ ] Responsive design (hides on mobile)
- [ ] Animations are smooth

**Phase 4B - Personal Insights**:
- [ ] Header renamed to "Personal Insights"
- [ ] Privacy notice is clear and prominent
- [ ] All 6 tabs renamed with Kintsugi philosophy
- [ ] Stat cards use golden language and colors
- [ ] Chart titles are poetic metaphors
- [ ] Dark mode works beautifully
- [ ] Export buttons still function
- [ ] Responsive on all devices

**Overall**:
- [ ] No console errors
- [ ] Works in Chrome/Firefox/Safari
- [ ] Pottery + Insights integrate well
- [ ] Performance is good
- [ ] App feels cohesive and beautiful

---

## Next Steps After Testing

1. Document any bugs or issues found
2. Note any UX improvements (e.g., "Add button to change pottery style")
3. Suggest enhancements (e.g., "Pottery crack sounds", "Gold sparkle particles")
4. Ready to merge or iterate based on feedback
