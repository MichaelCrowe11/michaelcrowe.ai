# Vercel Environment Variables Setup

This guide shows you how to configure all secrets in Vercel for optimal performance.

## Required Environment Variables

### 🎤 ElevenLabs Voice (Required for Voice AI)
```bash
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
```
**Get yours:** https://elevenlabs.io/app/settings/api-keys

### 🤖 AI Chat (Choose One - Recommended: Anthropic via Vercel Gateway)

**Option 1: Vercel AI Gateway (Recommended - better rate limits & caching)**
```bash
VERCEL_AI_GATEWAY_KEY=your_vercel_ai_gateway_key
```
Set this up in Vercel dashboard under "AI Gateway" settings. Provides automatic caching, rate limiting, and better performance.

**Option 2: Direct Anthropic API**
```bash
ANTHROPIC_API_KEY=your_anthropic_key
```
**Get Anthropic:** https://console.anthropic.com/settings/keys

**Option 3: OpenAI (fallback)**
```bash
OPENAI_API_KEY=your_openai_key
```
**Get OpenAI:** https://platform.openai.com/api-keys

### 📧 Email Service (Choose One - Recommended: Resend)
```bash
RESEND_API_KEY=your_resend_key
# OR
SENDGRID_API_KEY=your_sendgrid_key
# OR
POSTMARK_API_KEY=your_postmark_key
```
**Get Resend:** https://resend.com/api-keys (Best for developers)
**Get SendGrid:** https://app.sendgrid.com/settings/api_keys
**Get Postmark:** https://account.postmarkapp.com/api_tokens

### 📊 Analytics (Optional but Recommended)
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

### ⚙️ Feature Flags
```bash
NEXT_PUBLIC_CHAT_STARS_ENHANCED=true
```

## How to Set in Vercel

### Option 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/[your-username]/michaelcrowe-ai/settings/environment-variables
2. Add each variable one by one
3. Select environments: Production, Preview, Development
4. Click "Save"

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set variables
vercel env add ELEVENLABS_API_KEY
vercel env add ELEVENLABS_VOICE_ID
vercel env add OPENAI_API_KEY
vercel env add RESEND_API_KEY
# ... etc
```

### Option 3: Import from .env file
```bash
# Create .env.production
cat > .env.production << EOF
ELEVENLABS_API_KEY=your_key
ELEVENLABS_VOICE_ID=your_id
OPENAI_API_KEY=your_key
RESEND_API_KEY=your_key
EOF

# Import to Vercel
vercel env pull
```

## Verify Configuration

After deployment, test each feature:

### ✅ Voice AI
Visit the chat and enable voice - should use ElevenLabs

### ✅ AI Responses
Chat should provide intelligent, contextual responses

### ✅ Contact Form
Submit contact form - should send email

### ✅ Analytics
Page views should be tracked

## Priority Setup (Start Here)

If you're setting up for the first time, do these in order:

1. **ELEVENLABS_API_KEY** + **ELEVENLABS_VOICE_ID** - Your premium voice
2. **OPENAI_API_KEY** - Intelligent chat responses
3. **RESEND_API_KEY** - Contact form emails
4. **NEXT_PUBLIC_CHAT_STARS_ENHANCED=true** - Enable starfield

Everything else is optional and can be added later.

## Troubleshooting

**Voice not working?**
- Check ELEVENLABS_API_KEY is set correctly
- Verify ELEVENLABS_VOICE_ID matches your ElevenLabs dashboard
- Check API usage limits at https://elevenlabs.io/usage

**Chat not intelligent?**
- Ensure OPENAI_API_KEY or ANTHROPIC_API_KEY is set
- Check API key has credits
- View logs: `vercel logs [deployment-url]`

**Emails not sending?**
- Verify email API key is correct
- Check provider dashboard for errors
- Test with a simple send first

**Changes not appearing?**
- Redeploy: `vercel --prod`
- Clear cache: In Vercel dashboard → Settings → Clear Cache
- Wait 30 seconds after setting new env vars

## Security Notes

⚠️ **Never commit `.env.local` or `.env.production` to Git**
⚠️ **Use server-side variables (no NEXT_PUBLIC_) for API keys**
⚠️ **Rotate keys if accidentally exposed**

## Cost Optimization

- **ElevenLabs**: ~$0.30 per 1,000 characters (~$3-10/month for typical use)
- **OpenAI**: ~$0.002 per chat message (~$5-20/month)
- **Resend**: Free tier = 3,000 emails/month
- **Total**: ~$10-30/month for full functionality
