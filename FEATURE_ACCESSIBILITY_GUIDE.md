# Feature Accessibility Guide 🗺️

## Overview
Complete guide showing where to find all 10 core Kintsugi features in the application UI.

---

## Quick Navigation

| Feature | Location | Tab/Section |
|---------|----------|-------------|
| 1. Interactive Kintsugi Vessel | Main App | Home → Welcome Banner |
| 2. Golden Seam Timeline | Personal Insights | Your Golden Seams tab |
| 3. Mushin Reflection Mode | Main App | Golden Seams → Create Entry |
| 4. Strength Archaeology | Personal Insights | Patterns of Repair tab |
| 5. Transformation Heatmap | Personal Insights | Your Golden Seams tab |
| 6. Before/After Reframing | Main App | Golden Seams → Entry Details |
| 7. Kintsugi Prompts | Main App | Golden Seams tab (top section) |
| 8. Kintsugi Portfolio Generator | Personal Insights | Golden Gallery → Export |
| 9. Imperfection Gratitude | Main App | Golden Seams → Kintsugi Prompts |
| 10. Wabi-Sabi Progress Charts | Personal Insights | Golden Gallery tab |

---

## Feature 1: Interactive Kintsugi Vessel 🏺

**What it is**: Your personal pottery visual that shows cracks (challenges) being filled with gold (growth)

**Where to find it**:
1. Go to **Main App** (localhost:3000)
2. Look at the **Welcome Banner** (top of home page)
3. Pottery visual appears on the **left side** (desktop only)

**Features**:
- Shows your selected pottery style (Tea Bowl, Vase, Plate, or Jar)
- Displays cracks from challenging experiences
- Shows gold fill percentage as you reflect and grow
- Real-time stats: cracks, golden seams, % healed
- Info icon (ℹ️) next to pottery name with unlock details
- "Export as Image" button to save as PNG

**First-time setup**:
- Modal appears automatically to select pottery style
- Tea Bowl available immediately
- Other styles unlock at 5, 12, and 25 entries

**Related**:
- Change pottery style in: **Personal Insights → Workshop Tools**

---

## Feature 2: Golden Seam Timeline 📅

**What it is**: Chronological timeline connecting your challenges to growth moments

**Where to find it**:
1. Go to **Personal Insights** (/admin)
2. Click **"Your Golden Seams"** tab
3. Scroll to **"Golden Seam Timeline"** section

**Features**:
- Visual timeline of entries over time
- Color-coded by mood (challenging = red/orange, positive = green)
- Shows connection between difficult entries and reflections
- Hover to see entry details
- Click to view full entry

**What it shows**:
- When cracks appeared (challenging entries)
- When gold was added (reflections)
- Healing journey over time

---

## Feature 3: Mushin Reflection Mode 🧘

**What it is**: AI-powered detection of self-critical language with gentle redirection

**Where to find it**:
1. Go to **Main App** → **Golden Seams** tab
2. Click **"+ New Entry"** button
3. Start typing your accomplishment or challenge
4. If self-critical language detected, Mushin prompt appears

**How it works**:
- Detects phrases like "just", "only", "should have", "not good enough"
- Gently highlights the self-criticism
- Suggests reframing: "What if you described this accomplishment without minimizing?"
- Helps you write with self-compassion

**Example**:
- You write: "I only finished 3 tasks today..."
- Mushin detects: "only"
- Suggests: "I finished 3 tasks today" (without minimizing word)

**Philosophy**:
- Based on Mushin (無心) - observing without harsh judgment
- Encourages neutral, compassionate self-talk

---

## Feature 4: Strength Archaeology 💎

**What it is**: Extracts hidden strengths from your documented challenges

**Where to find it**:
1. Go to **Personal Insights** (/admin)
2. Click **"Patterns of Repair"** tab
3. Look for **"Strength Archaeology"** section

**Features**:
- Analyzes all your entries for recurring strengths
- Extracts skills demonstrated during challenges
- Shows frequency of each strength
- Visualizes top strengths with charts
- Links strengths back to specific entries

**What it reveals**:
- Skills you used to overcome challenges
- Patterns in how you solve problems
- Strengths you didn't know you had
- Evidence of growth over time

**Philosophy**:
- Challenges are not just problems - they're evidence of capability
- Every difficulty you overcame required specific strengths
- Your struggles are proof of your skills

---

## Feature 5: Transformation Heatmap 📊

**What it is**: Calendar visualization showing your engagement and growth patterns

**Where to find it**:
1. Go to **Personal Insights** (/admin)
2. Click **"Your Golden Seams"** tab
3. Look for **"Transformation Heatmap"** section

**Features**:
- Calendar grid showing all logged days
- Color intensity = amount of reflection/activity
- Hover to see entry count and details
- Shows streaks and patterns
- Identifies your most active periods

**What it shows**:
- Days you logged accomplishments/challenges
- Frequency of reflection over time
- Engagement patterns (daily, weekly, sporadic)
- Healing streaks

**Insights**:
- When you're most likely to reflect
- How consistency affects your journey
- Gaps where you might benefit from more reflection

---

## Feature 6: Before/After Reframing ↔️

**What it is**: Side-by-side view of how you've reframed challenges into growth

**Where to find it**:
1. Go to **Main App** → **Golden Seams** tab
2. Click on any entry that has a **reflection** added
3. View the **"Before/After Reframing"** section

**Features**:
- Left side: Original challenge/struggle
- Right side: Reframed perspective after reflection
- Visual split-screen comparison
- Shows transformation in thinking
- Highlights growth over time

**How to create**:
1. Log a challenging experience (the "before")
2. Later, add a reflection (the "after")
3. See the transformation visualized

**Example**:
- **Before**: "My presentation bombed - I'm not cut out for public speaking"
- **After**: "I'm grateful my presentation bombed because it taught me to prepare better and be more authentic. Now I'm more confident."

**Philosophy**:
- Demonstrates Kintsukuroi - breaking creates opportunity for golden repair
- Shows how perspective shifts over time

---

## Feature 7: Kintsugi Prompts 💫

**What it is**: Philosophy-guided reflection prompts organized by day and principle

**Where to find it**:
1. Go to **Main App** → **Golden Seams** tab
2. Look at the **top section** with the carousel
3. Component: **"Kintsugi Reflection Prompts"**

**Features**:
- Daily prompts based on day of week and Japanese philosophy
- "Today's Prompt" button shows prompt for current day
- "Browse All" button shows all available prompts
- Navigate with arrows through carousel
- Click "Start Reflection with This Prompt" to use it

**Weekly Schedule**:
- **Monday**: Mushin (無心) - Observe without judgment
- **Tuesday**: Mottainai (もったいない) - Nothing is wasted
- **Wednesday**: Wabi-Sabi (侘寂) - Beauty in imperfection
- **Thursday**: Mono no Aware (物の哀れ) - Awareness of impermanence
- **Friday**: Kintsukuroi (金継ぎ) - Golden repair
- **Saturday**: Gratitude - Integration and appreciation
- **Sunday**: Rest & Reflection - Step back and observe

**Anytime Prompts**:
- **When Facing Challenges**: Transform current struggles
- **Celebrating Wins**: Savor accomplishments
- **Imperfection Gratitude**: Find gratitude in what went wrong (NEW!)

**Each prompt includes**:
- Main reflection question
- 4 sub-prompts to guide thinking
- Cultural context and philosophy explanation

---

## Feature 8: Kintsugi Portfolio Generator 📥

**What it is**: Export your transformation journey as shareable reports and data

**Where to find it**:
1. Go to **Personal Insights** (/admin)
2. Click **"Golden Gallery"** tab
3. Scroll to **export buttons** at bottom of stats section

**Available Exports**:
1. **JSON Export**
   - Click **"JSON"** button
   - Downloads: `kintsugi-analytics-{date}.json`
   - Contains: All analytics, stats, and aggregated data

2. **Feedback CSV Export**
   - Click **"Feedback CSV"** button
   - Downloads: `kintsugi-feedback-{date}.csv`
   - Contains: User feedback and survey responses

3. **Complete Data Export**
   - Click **"Complete Data"** button
   - Downloads: `kintsugi-complete-data-{date}.csv`
   - Contains: All entries, reflections, metadata

4. **Pottery Image Export**
   - Go to Main App pottery visual
   - Click **"Export as Image"** button
   - Downloads: `kintsugi-pottery-{style}-{date}.png`
   - High-resolution PNG (1200x1200px)

**Use Cases**:
- Create personal portfolio of growth
- Share transformation journey with mentors
- Backup your data
- Analyze patterns in spreadsheet
- Social media sharing (pottery images)

---

## Feature 9: Imperfection Gratitude 🙏

**What it is**: Specialized prompt to reframe failures/imperfections as gifts

**Where to find it**:
1. Go to **Main App** → **Golden Seams** tab
2. Look at **Kintsugi Reflection Prompts** carousel
3. Click **"Browse All"** button
4. Navigate to **"Imperfection Gratitude"** prompt

**Prompt Format**:
- Main question: "Find gratitude in what went wrong"
- Key sub-prompt: **"Complete this sentence: 'I'm grateful my [thing that went wrong] happened because...'"**

**Reflection Questions**:
1. Complete: "I'm grateful my _______ happened because..."
2. What unexpected gift came from this imperfection or failure?
3. What would I have missed learning if this had gone perfectly?
4. How has this "failure" actually redirected me toward something better?

**Philosophy**:
- Based on Wabi-Sabi (侘寂) - finding beauty in imperfection
- Transforms "failures" into learning opportunities
- Practices gratitude for what went wrong

**Example Completions**:
- "I'm grateful my presentation bombed because it taught me to prepare better and be more authentic"
- "I'm grateful my startup failed because it led me to my true passion"
- "I'm grateful I got rejected because it pushed me to improve my skills"

**When to use**:
- After a setback or failure
- When feeling frustrated about imperfection
- To reframe disappointment into learning
- Anytime you need perspective shift

---

## Feature 10: Wabi-Sabi Progress Charts 📈

**What it is**: Non-traditional progress visualization celebrating imperfect growth

**Where to find it**:
1. Go to **Personal Insights** (/admin)
2. Click **"Golden Gallery"** tab
3. View charts throughout the page

**Available Charts**:

### Chart 1: "The Golden Wave" 🌊
- **Location**: Golden Gallery, top section
- **Shows**: Engagement trend over time
- **Style**: Area chart with gold gradient
- **Philosophy**: Progress isn't linear - it waves like water
- **What to look for**: Overall trend, not daily perfection

### Chart 2: "Tools for Repair" 🛠️
- **Location**: Golden Gallery, middle section
- **Shows**: Which features you use most
- **Style**: Bar chart
- **Philosophy**: Different tools for different needs
- **What to look for**: Your preferred reflection methods

### Chart 3: Mood Distribution
- **Location**: Patterns of Repair tab
- **Shows**: Balance of challenging vs. positive entries
- **Philosophy**: Both struggles and wins are valuable data
- **What to look for**: Honest range of experiences

### Chart 4: Growth Metrics
- **Location**: Golden Gallery stat cards
- **Shows**:
  - "Your Journey" (status)
  - "Golden Moments" (accomplishments)
  - "Healing Resonance" (reflections)
  - "Transformation Energy" (mood sentiment)
- **Style**: Gradient cards with icons
- **Philosophy**: Multiple dimensions of progress

**Wabi-Sabi Approach**:
- Charts celebrate imperfect patterns
- No "perfect streak" pressure
- Values authenticity over consistency
- Shows rough edges as part of the beauty

---

## Navigation Quick Reference

### Main App (localhost:3000)
```
Home Page
├── Welcome Banner
│   └── [1] Interactive Kintsugi Vessel 🏺
│
└── Golden Seams Tab
    ├── [7] Kintsugi Prompts (carousel)
    │   └── [9] Imperfection Gratitude (anytime prompt)
    ├── [3] Mushin Reflection Mode (when creating entry)
    ├── Entry List
    └── Entry Details
        └── [6] Before/After Reframing
```

### Personal Insights (/admin)
```
Personal Insights Page
├── Golden Gallery Tab
│   ├── [10] Wabi-Sabi Progress Charts
│   └── [8] Kintsugi Portfolio Generator (export buttons)
│
├── Your Golden Seams Tab
│   ├── [2] Golden Seam Timeline
│   └── [5] Transformation Heatmap
│
├── Patterns of Repair Tab
│   └── [4] Strength Archaeology
│
└── Workshop Tools Tab
    └── Change Pottery Style
```

---

## Feature Availability by Entry Count

### 0 Entries (New User)
- ✅ Pottery Visual (Tea Bowl only)
- ✅ Kintsugi Prompts (all)
- ✅ Mushin Reflection Mode
- ✅ Before/After Reframing (when entries exist)
- ✅ Imperfection Gratitude prompt

### 5+ Entries (~1 week)
- ✅ All above features
- ✅ Unlock: Tall Vase pottery
- ✅ Golden Seam Timeline (more meaningful)
- ✅ Transformation Heatmap (shows patterns)

### 12+ Entries (~2-3 weeks)
- ✅ All above features
- ✅ Unlock: Serving Plate pottery
- ✅ Strength Archaeology (better pattern detection)
- ✅ Wabi-Sabi Progress Charts (clearer trends)

### 25+ Entries (~1 month)
- ✅ All features fully unlocked
- ✅ Unlock: Storage Jar pottery (4/4 vessels)
- ✅ Rich data for all visualizations
- ✅ Portfolio Generator most valuable

---

## Tips for Discovering Features

### For New Users
1. **Start with**: Kintsugi Prompts (easy guided entry)
2. **Then try**: Mushin Reflection Mode (helps with self-talk)
3. **Check daily**: Pottery visual (see your progress)
4. **Explore**: Personal Insights after 5+ entries

### For Active Users
1. **Weekly**: Review Golden Seam Timeline
2. **Monthly**: Check Strength Archaeology for insights
3. **Quarterly**: Export portfolio data
4. **Anytime**: Use Imperfection Gratitude after setbacks

### Feature Combinations
- **Challenge Processing**: Imperfection Gratitude prompt → Before/After Reframing → Strength Archaeology
- **Progress Review**: Transformation Heatmap → Golden Seam Timeline → Wabi-Sabi Charts
- **Sharing Journey**: Export Pottery Image + Portfolio Generator
- **Daily Practice**: Today's Kintsugi Prompt → Mushin Mode → Pottery Visual

---

## Accessibility Notes

### Desktop (>768px)
- All features fully accessible
- Pottery visual visible in banner
- Pronunciation badge visible
- Charts and visualizations optimized

### Tablet (768px)
- Most features accessible
- Some layout adjustments
- Pottery may hide at certain breakpoints

### Mobile (<768px)
- All features accessible
- Pottery visual hidden (save space)
- Pronunciation badge hidden
- Modals and charts responsive

### Dark Mode
- All features support dark mode
- Toggle in Personal Insights header
- Maintains readability across all color themes

---

## Feature Philosophy Summary

Each feature embodies a Kintsugi principle:

1. **Interactive Vessel** → Kintsukuroi (金継ぎ) - Cracks become gold
2. **Golden Seam Timeline** → Mottainai (もったいない) - Nothing wasted
3. **Mushin Mode** → Mushin (無心) - Observe without judgment
4. **Strength Archaeology** → Kintsukuroi - Finding gold in cracks
5. **Transformation Heatmap** → Mono no Aware (物の哀れ) - Patterns over time
6. **Before/After Reframing** → Kintsukuroi - Transformation visible
7. **Kintsugi Prompts** → All 5 principles - Daily practice
8. **Portfolio Generator** → Mottainai - Preserve and share value
9. **Imperfection Gratitude** → Wabi-Sabi (侘寂) - Beauty in imperfection
10. **Progress Charts** → Wabi-Sabi - Imperfect growth is beautiful

---

## Need Help?

### Can't find a feature?
- Check if you have enough entries (some features unlock progressively)
- Try navigating to Personal Insights (/admin) if not on main app
- Switch between tabs (Golden Gallery, Your Golden Seams, etc.)

### Feature not working as expected?
- Refresh the page (data updates on reload)
- Check browser console for errors
- Ensure localStorage is enabled

### Want to suggest improvements?
- Report issues at: https://github.com/anthropics/claude-code/issues
- Document what you expected vs. what you see

---

✅ **All 10 core Kintsugi features are accessible and ready to support your transformation journey!**
