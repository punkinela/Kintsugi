# DATA RECOVERY INSTRUCTIONS

## If Your Entries Appear Lost

Your entries may still be in your browser's localStorage. Follow these steps to check and recover:

### Step 1: Check localStorage in Browser Console

1. Open your browser's Developer Console (F12 or Right-click → Inspect → Console tab)
2. Paste this command and press Enter:

```javascript
JSON.parse(localStorage.getItem('kintsugi_engagement'))
```

3. Look for the `journalEntries` array. If it exists and has entries, your data is safe!

### Step 2: Export Your Data (Backup)

If you see your entries in Step 1, export them immediately:

```javascript
// Copy this entire object
const backup = {
  engagement: JSON.parse(localStorage.getItem('kintsugi_engagement')),
  user: JSON.parse(localStorage.getItem('kintsugiUser')),
  gamification: JSON.parse(localStorage.getItem('gamificationData'))
};
console.log(JSON.stringify(backup, null, 2));
```

Copy the output and save it to a text file as backup.

### Step 3: Check for Data Corruption

If journalEntries is empty but you know you added entries:

```javascript
// Check all localStorage keys
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.includes('kintsugi') || key.includes('journal')) {
    console.log(key + ':', localStorage.getItem(key));
  }
}
```

### Step 4: Restore Data (if needed)

If you have a backup from Step 2, you can restore it:

```javascript
// WARNING: This will overwrite current data
const backup = /* paste your backup object here */;
localStorage.setItem('kintsugi_engagement', JSON.stringify(backup.engagement));
localStorage.setItem('kintsugiUser', JSON.stringify(backup.user));
localStorage.setItem('gamificationData', JSON.stringify(backup.gamification));
location.reload();
```

### Step 5: Use the Diagnostic Tool

Go to the app and click on your profile → "Settings & Data" → "Diagnostic" tab to see a visual representation of your data.

## Common Issues

### Issue 1: Entries Not Showing Up
- **Cause**: Component not refreshing after adding entries
- **Fix**: This has been fixed in the latest update. Refresh the page.

### Issue 2: Wrong Date/Time on Entries
- **Cause**: Timezone or date format issues
- **Fix**: Entries are saved with ISO timestamps. Check browser timezone settings.

### Issue 3: "Newcomer" Title Not Updating
- **Cause**: XP system wasn't connected to journal entries
- **Fix**: This has been fixed. Add new entries to earn XP and level up.

## Prevention

To prevent data loss in the future:

1. **Regular Exports**: Use the Export feature in Settings & Data
2. **Browser Backups**: Don't clear browser data without exporting first
3. **Multiple Devices**: Data is stored per-browser, not synced across devices

## Need Help?

If you still can't find your entries, please provide:
1. The output from Step 1 above
2. How many entries you had
3. Approximately when you added them
4. Any error messages you see in the console

We can help recover your data!
