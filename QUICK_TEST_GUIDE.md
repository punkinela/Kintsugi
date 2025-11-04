# Quick Test Guide - Start Here! 🚀

## Getting Started

Your app is running at: **http://localhost:3000**

The dev server is already running. Just open your browser and visit the URL above!

---

## 🎯 Top Priority Tests (5 minutes)

### 1. First Launch
- Open http://localhost:3000
- Complete the profile setup
- Watch the onboarding tour

### 2. Create a Journal Entry
- Go to Journal tab
- Click "Open Journal"
- Create an entry with accomplishment, reflection, mood, and tags
- Save it

### 3. Try Advanced Search (NEW in Phase 8!)
- In Journal tab, use the search box
- Click "Filters" button
- Try filtering by category or mood
- Create multiple entries and search through them

### 4. Change Themes (NEW in Phase 8!)
- Click your name in header → "Settings & Data"
- Click "Appearance & Accessibility" tab
- Try different color themes (6 available!)
- Toggle Dark/Light mode
- Try "Large Text" accessibility option

### 5. Test AI Features (Phase 6)
- Go to Insights tab
- Find "AI Insights Dashboard"
- Click "Analyze My Patterns"
- See detected patterns and recommended affirmations

### 6. Export Your Data (Phase 7)
- In Insights tab, find "Export Manager"
- Try exporting to PDF (opens print dialog)
- Try exporting to CSV or Markdown

---

## 🔥 Cool Features to Try

### Keyboard Shortcuts (Phase 5)
- `Ctrl+H` - Home tab
- `Ctrl+J` - Journal tab
- `Ctrl+I` - Insights tab
- `?` - Show all shortcuts

### Achievements (Phase 5)
- Create journal entries to unlock achievements
- Try morning/evening/weekend entries
- Build up your streak!
- Check localStorage: `JSON.parse(localStorage.getItem('kintsugi_engagement')).achievements`

### AI Accomplishment Enhancer (Phase 6)
- Go to Insights tab
- Find "AI Accomplishment Enhancer"
- Type something with minimizing language: "I just did a small thing"
- Click "Analyze & Enhance"
- See bias detection and enhancement suggestions

### Performance Review Generator (Phase 6)
- Create several journal entries first
- Go to Insights tab
- Find "AI Performance Review Generator"
- Select timeframe and click "Generate Review"
- Get professional summary of your accomplishments

### Saved Searches (Phase 8)
- Apply some search filters in Journal tab
- Click "Save Search"
- Name it and save
- Clear filters, then click your saved search to restore

---

## 🎨 All 6 Themes to Try

1. **✨ Kintsugi Gold** - Warm, inspiring (default)
2. **💼 Professional Blue** - Clean, focused
3. **⚡ Energetic Purple** - Vibrant, creative
4. **🌿 Calm Green** - Peaceful, balanced
5. **🔥 Bold Red** - Powerful, confident
6. **🌸 Elegant Rose** - Sophisticated, graceful

Each has light/dark mode variants!

---

## 🧪 Test for Bugs

### Things to Check:
- [ ] Does search work with special characters?
- [ ] Do themes apply to the entire app?
- [ ] Does data persist after refresh?
- [ ] Do exports download correctly?
- [ ] Are all modals closeable?
- [ ] Does dark mode look good in all themes?
- [ ] Are achievements unlocking?

### Data You Can Inspect:
```javascript
// In browser console (F12):

// View all your data
JSON.parse(localStorage.getItem('kintsugi_engagement'))

// View your achievements
JSON.parse(localStorage.getItem('kintsugi_engagement')).achievements

// View your profile
JSON.parse(localStorage.getItem('kintsugiUser'))

// View current theme
localStorage.getItem('kintsugi_theme')

// View saved searches
JSON.parse(localStorage.getItem('kintsugi_saved_searches'))

// Clear everything (start fresh)
localStorage.clear()
```

---

## 📊 What's New in Each Phase

### Phase 5: Quick Wins ✅
- 35+ achievements across 8 categories
- Keyboard shortcuts (Ctrl+H, Ctrl+J, etc.)
- Onboarding tour for new users
- Professional print stylesheet
- Affirmation categories

### Phase 6: AI-Powered Features ✅
- Bias pattern detection
- Accomplishment enhancement suggestions
- Performance review generator
- AI insights dashboard
- Smart affirmation recommendations

### Phase 7: Professional Tools ✅
- Export to 4 formats (PDF, Word/RTF, CSV, Markdown)
- Goal tracking system (not yet in UI)
- Skill tracker (not yet in UI)
- Export Manager UI

### Phase 8: Enhanced UX ✅
- 6 color themes with light/dark modes
- Advanced search with filters
- Saved search queries
- 3 accessibility modes (High Contrast, Reduced Motion, Large Text)
- System theme detection

---

## 🐛 Found a Bug?

Note it down with:
1. What you did (steps to reproduce)
2. What happened (actual result)
3. What you expected (expected result)
4. Browser and OS
5. Screenshot if visual issue

---

## ✨ Having Fun?

Try these challenges:
- [ ] Unlock 10 achievements
- [ ] Create 20 journal entries
- [ ] Try all 6 themes in both light and dark mode
- [ ] Export your data in all 4 formats
- [ ] Use saved searches to organize entries by project
- [ ] Build a 7-day streak
- [ ] Write 1000+ words across all entries

---

## 📞 Need the Full Testing Checklist?

See **TESTING_CHECKLIST.md** for the complete 42-test comprehensive testing guide.

---

## 🎉 Enjoy Testing!

The app has been in development across 8 phases with tons of features. Have fun exploring everything!
