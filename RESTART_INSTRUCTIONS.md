# 🔄 RESTART INSTRUCTIONS - CRITICAL

## Why Nothing Is Working

Your Next.js dev server needs to be restarted to pick up all the code changes.

## How to Restart (Choose One Method):

### Method 1: If Running in Terminal
1. Find the terminal where you ran `npm run dev`
2. Press `Ctrl+C` to stop the server
3. Wait 2 seconds
4. Run: `npm run dev`
5. Wait for "Ready in X ms" message
6. Open browser to http://localhost:3000
7. **Hard refresh**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

### Method 2: If Not Sure What's Running
```bash
# Stop any running Next.js processes
pkill -f "next dev"

# Start fresh
npm run dev
```

### Method 3: Clean Restart (Most Thorough)
```bash
# Stop server
pkill -f "next dev"

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies (if needed)
npm install

# Start server
npm run dev
```

## After Restarting:

1. **Hard refresh your browser**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache**: 
   - Chrome: F12 → Network tab → Check "Disable cache"
   - Or right-click refresh button → "Empty Cache and Hard Reload"

## What Should Work After Restart:

- ✅ QuickCapture (Ctrl+K) awards XP
- ✅ Streak calculation from entries
- ✅ Level title progression (Newcomer → Getting Started → etc.)
- ✅ Insights chart shows all dates
- ✅ Journal entries list visible
- ✅ Diagnostic tool at /diagnostic.html

## If Still Not Working After Restart:

Run this in browser console (F12 → Console):
```javascript
console.log('Code Version Check:');
console.log('Window location:', window.location.href);
console.log('LocalStorage keys:', Object.keys(localStorage));

// Check if new functions exist
const engagement = localStorage.getItem('kintsugi_engagement');
const gamification = localStorage.getItem('gamificationData');
console.log('Has engagement data:', !!engagement);
console.log('Has gamification data:', !!gamification);

if (engagement) {
    const data = JSON.parse(engagement);
    console.log('Total entries:', data.journalEntries?.length || 0);
    console.log('Current streak:', data.currentStreak);
}

if (gamification) {
    const data = JSON.parse(gamification);
    console.log('Level:', data.level);
    console.log('XP:', data.xp);
    console.log('Total XP:', data.totalXpEarned);
}
```

Then send me the output and we'll debug from there.
