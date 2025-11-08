# Kintsugi Data Backup Guide

## What Gets Backed Up Automatically:
✅ All code changes (when you commit to git)
✅ All components and features (stored on GitHub)

## What YOU Need to Backup Manually:
⚠️ User data in browser localStorage:
- Journal entries
- XP/Level progress
- Achievements unlocked
- AI feature usage stats
- User profile settings

## How to Backup Your User Data:

### Option 1: Use the Built-in Export Feature
1. Go to http://localhost:3000
2. Look for the "Export Data" button in the app
3. Download your data as JSON/CSV

### Option 2: Manual Browser Backup
1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage" → "http://localhost:3000"
4. Right-click → "Clear" to see all keys
5. Copy values and save to a file

### Option 3: Automated Backup (Coming Soon)
We can add a feature to auto-backup to GitHub or download files.

## How to Restore Your Data:
1. Open browser DevTools (F12)
2. Go to "Application" → "Local Storage"
3. Paste your saved keys/values back in
4. Refresh the page

## To Prevent Data Loss:
1. Export your data regularly (weekly recommended)
2. Don't clear browser cache/cookies
3. Use the same browser consistently
4. Consider adding cloud sync (future feature)

## Your Code is Always Safe:
- Stored in git: /home/user/Kintsugi/.git/
- Pushed to GitHub: punkinela/Kintsugi
- Nothing to worry about! ✅
