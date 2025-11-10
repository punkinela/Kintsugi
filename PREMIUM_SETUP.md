# Premium Feature Setup Guide

This guide explains how to set up and test the premium AI features in Kintsugi.

## Overview

The app now has a premium feature infrastructure that allows you to:
- Test AI features during development
- Show premium badges on AI features
- Toggle dev mode for testing
- Prepare for future payment integration

## Quick Setup (For Testing)

### 1. Get an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### 2. Set Up Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

### 3. Enable Dev Mode

1. Run the app and click the gear icon (⚙️) in the top right
2. Go to the **Diagnostic** tab
3. Toggle **Dev Mode** to ON
4. You'll see a golden crown (👑) indicating premium is active

## Features

### Premium AI Features

These features now show a "Premium" badge:

1. **Skills Growth Roadmap** - AI-powered career gap analysis
2. **Performance Review Generator** - Transform wins into review narratives
3. **Portfolio Generator** - Create professional portfolio pieces

### Dev Mode Toggle

Located in: **Settings → Diagnostic Tab**

When enabled:
- ✅ All premium features unlocked for testing
- ✅ Golden crown indicator shows premium status
- ✅ API key status displayed
- ✅ Bypass premium checks

### Premium Upgrade Modal

When users (without dev mode) click premium features, they see:
- Feature benefits and descriptions
- Pricing preview ($8/month coming soon)
- Privacy guarantee message

## Testing Checklist

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Add your OpenAI API key
- [ ] Restart dev server
- [ ] Enable dev mode in Settings → Diagnostic
- [ ] Test Skills Growth Roadmap feature
- [ ] Test Performance Review Generator
- [ ] Test Portfolio Generator
- [ ] Disable dev mode to see premium upgrade modal
- [ ] Check premium badges appear in "Your Edge" dropdown

## Cost Estimates

During development/testing:
- **Light testing**: ~$2-5/month
- **Heavy testing**: ~$10-20/month
- Production costs depend on user volume

## Architecture

### Current Setup (Development)
```
User → Frontend → OpenAI API (via environment variable)
         ↓
    localStorage (all data stays local)
```

### Future Setup (Production)
```
User → Frontend → Netlify Functions → OpenAI API
         ↓              ↓
    localStorage    Process & Delete
                    (no data storage)
```

## Privacy-First Design

✅ **Current**: All user data in localStorage (browser only)
✅ **Future**: AI requests processed and immediately deleted
✅ **Never**: We never store journal entries or personal information

## Next Steps (Future)

1. **Payment Integration**
   - Add Stripe for subscriptions
   - Implement $8/month premium tier
   - Free trial for new users

2. **Backend Setup**
   - Create Netlify Functions for AI features
   - Process-and-delete architecture
   - Remove API keys from frontend

3. **User Management**
   - Add authentication (Auth0, Clerk, or Supabase)
   - Track premium subscriptions
   - Manage user tiers

## Files Added/Modified

### New Files
- `contexts/PremiumContext.tsx` - Premium state management
- `components/PremiumBadge.tsx` - Premium feature badge
- `components/PremiumUpgradeModal.tsx` - Upgrade prompt
- `components/DevModeToggle.tsx` - Developer mode controls
- `.env.local.example` - Environment variable template
- `PREMIUM_SETUP.md` - This guide

### Modified Files
- `app/page.tsx` - Wrapped in PremiumProvider, added badges
- Various AI components - Ready for premium checks (future)

## Troubleshooting

**AI features not working?**
1. Check API key is set in `.env.local`
2. Restart dev server after adding key
3. Enable dev mode in Settings → Diagnostic
4. Check browser console for errors

**Premium badges not showing?**
1. Clear browser cache
2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
3. Check dropdown menus under "Your Edge" tab

**Dev mode toggle not appearing?**
1. Go to Settings (gear icon)
2. Click "Diagnostic" tab
3. Look for "Developer Mode" section

## Support

For questions or issues:
1. Check browser console for errors
2. Verify `.env.local` is set up correctly
3. Test with dev mode enabled first
4. Review this guide's troubleshooting section
