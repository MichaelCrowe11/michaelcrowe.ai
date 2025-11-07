# Vercel Environment Variables Setup

This document lists all environment variables that should be configured in Vercel for full functionality.

## 🔐 Required Secrets (Already Set)

These should already be configured in your Vercel project:

- `ELEVENLABS_API_KEY` - Your ElevenLabs API key
- `ELEVENLABS_VOICE_ID` - Your custom voice ID

## 🤖 AI Services (Highly Recommended)

### Option 1: OpenAI GPT-4 (Recommended)
```
OPENAI_API_KEY=sk-...
```
- Get from: https://platform.openai.com/api-keys
- Provides the most intelligent conversation responses
- Falls back to sales engine if not set

### Option 2: Anthropic Claude (Alternative)
```
ANTHROPIC_API_KEY=sk-ant-...
```
- Get from: https://console.anthropic.com/
- Alternative to OpenAI
- Used if OpenAI key is not available

## 📧 Email Services (Choose One)

### Option 1: Resend (Recommended)
```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@michaelcrowe.ai
EMAIL_TO=Michael@crowelogic.com
```
- Get from: https://resend.com/api-keys
- Modern, reliable email API
- Easiest to set up

### Option 2: SendGrid (Alternative)
```
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@michaelcrowe.ai
EMAIL_TO=Michael@crowelogic.com
```
- Get from: https://app.sendgrid.com/settings/api_keys
- Popular email service
- Used as fallback if Resend fails

### Option 3: Mailgun (Alternative)
```
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=mg.yourdomain.com
EMAIL_FROM=noreply@michaelcrowe.ai
EMAIL_TO=Michael@crowelogic.com
```
- Get from: https://app.mailgun.com/
- Used as second fallback

## 📊 Analytics (Optional but Recommended)

### Google Analytics
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
- Get from: https://analytics.google.com/

### Hotjar (Heatmaps & Recordings)
```
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
```
- Get from: https://www.hotjar.com/

### PostHog (Product Analytics)
```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
```
- Get from: https://posthog.com/

## 📅 Calendar Integration (Optional)

### Cal.com
```
CAL_COM_API_KEY=cal_...
```
- Get from: https://cal.com/

### Calendly
```
CALENDLY_TOKEN=...
```
- Get from: https://calendly.com/

## 🚀 Site Configuration (Recommended)

```
NEXT_PUBLIC_SITE_URL=https://michaelcrowe.ai
NEXT_PUBLIC_CHAT_STARS_ENHANCED=true
NEXT_PUBLIC_CONTACT_EMAIL=Michael@crowelogic.com
NEXT_PUBLIC_CONTACT_PHONE=(480) 322-5761
NEXT_PUBLIC_COMPANY_NAME=Crowe Logic
```

## 🔧 How to Set in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `OPENAI_API_KEY`)
   - **Value**: Your secret value
   - **Environment**: Select "Production" (and optionally Preview/Development)
4. Click **Save**
5. Redeploy your project for changes to take effect

## ✅ Testing Configuration

After deployment, test each feature:

1. **Voice**: Chat with the AI - should use your ElevenLabs voice
2. **AI Responses**: Ask questions - should get intelligent GPT-4/Claude responses
3. **Contact Form**: Submit form - should receive email notification
4. **Analytics**: Check analytics dashboard after some traffic

## 🔍 Priority Setup Order

1. ✅ **Already Set**: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`
2. 🔥 **High Priority**: `OPENAI_API_KEY` (best AI responses)
3. 🔥 **High Priority**: `RESEND_API_KEY` (contact form emails)
4. 📊 **Medium Priority**: Analytics keys (track conversions)
5. 📅 **Low Priority**: Calendar integration (manual booking works)

## 🎯 Minimum for Production

At minimum, set these for a professional experience:
- ✅ `ELEVENLABS_API_KEY` (already set)
- ✅ `ELEVENLABS_VOICE_ID` (already set)
- 🔥 `OPENAI_API_KEY` (intelligent responses)
- 🔥 `RESEND_API_KEY` (email notifications)
- 🔥 `EMAIL_FROM` & `EMAIL_TO`

## 🆘 Fallbacks

The system has intelligent fallbacks:
- **No OpenAI/Claude**: Uses built-in sales engine
- **No ElevenLabs**: Falls back to Web Speech API
- **No Email Service**: Form still works, logs submission
- **No Analytics**: Site works normally without tracking

Everything degrades gracefully!
