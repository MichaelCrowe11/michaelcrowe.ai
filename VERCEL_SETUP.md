# 🚀 Vercel CLI Setup Guide

## Step 1: Login to Vercel

Run this command and follow the prompts:

```bash
vercel login
```

You'll be asked to choose a login method:
- Email (recommended)
- GitHub
- GitLab
- Bitbucket

Choose your preferred method and complete the authentication.

---

## Step 2: Link Your Project

```bash
vercel link
```

Answer the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your Vercel account
- **Link to existing project?** → Yes (if you already created it) or No (to create new)
- **What's your project's name?** → michaelcrowe-ai (or whatever you prefer)

This will create a `.vercel` directory with your project settings.

---

## Step 3: Add Environment Variables

Now add your API keys using the Vercel CLI:

### Required: Anthropic API Key

```bash
vercel env add ANTHROPIC_API_KEY
```

When prompted:
- **What's the value?** → Paste your Anthropic API key (starts with `sk-ant-`)
- **Add to which environment(s)?** → Select all (Production, Preview, Development)

### Required: Supabase URLs and Keys

```bash
# Supabase Project URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Value: https://your-project.supabase.co
# Environments: All

# Supabase Anon Key (public)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Value: Your anon key from Supabase
# Environments: All

# Supabase Service Role Key (private)
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Value: Your service_role key from Supabase
# Environments: Production only (for security)
```

### Optional: Resend Email API

```bash
vercel env add RESEND_API_KEY
# Value: Your Resend API key (starts with `re_`)
# Environments: Production, Preview

vercel env add EMAIL_FROM
# Value: noreply@michaelcrowe.ai
# Environments: All

vercel env add EMAIL_TO
# Value: hello@michaelcrowe.ai
# Environments: All
```

### Site Configuration

```bash
vercel env add NEXT_PUBLIC_SITE_URL
# Value: https://michaelcrowe.ai
# Environments: Production

vercel env add NEXT_PUBLIC_CONTACT_EMAIL
# Value: hello@michaelcrowe.ai
# Environments: All
```

### Disable Dev Mode (Important!)

```bash
vercel env add NEXT_PUBLIC_DEV_MODE
# Value: false
# Environments: Production, Preview
```

---

## Step 4: Pull Environment Variables Locally (Optional)

If you want to use these same variables in local development:

```bash
vercel env pull .env.local
```

This will create/update your `.env.local` file with all the environment variables from Vercel.

---

## Step 5: Deploy

```bash
vercel --prod
```

This will:
1. Build your application
2. Deploy to production
3. Use all the environment variables you just added

---

## Quick Reference Commands

```bash
# View all environment variables
vercel env ls

# Add a new variable
vercel env add VARIABLE_NAME

# Remove a variable
vercel env rm VARIABLE_NAME

# Pull remote env vars to local
vercel env pull

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

---

## Environment Variable Checklist

Before deploying, make sure you've added:

**Required for AI to work:**
- [ ] `ANTHROPIC_API_KEY` - Claude AI
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Database URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Database admin key
- [ ] `NEXT_PUBLIC_DEV_MODE=false` - Disable demo mode

**Recommended:**
- [ ] `RESEND_API_KEY` - Email notifications
- [ ] `EMAIL_FROM` - Sender email
- [ ] `EMAIL_TO` - Your email for leads
- [ ] `NEXT_PUBLIC_SITE_URL` - Your domain
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` - Contact email

**Optional (Future):**
- [ ] `CALCOM_API_KEY` - Calendar booking
- [ ] `NEXT_PUBLIC_CALCOM_USERNAME` - Your Cal.com username
- [ ] `STRIPE_SECRET_KEY` - Payment processing
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

---

## Troubleshooting

### "No credentials found"
Run `vercel login` first

### "Project not linked"
Run `vercel link` in your project directory

### "Environment variable not found"
Run `vercel env ls` to see all variables
Make sure you selected the right environments when adding

### Variables not updating
After adding/changing variables, redeploy:
```bash
vercel --prod
```

### Local development not working
Pull environment variables locally:
```bash
vercel env pull .env.local
```

---

## What Happens Next

After running `vercel --prod`:

1. ✅ Your code is deployed to Vercel
2. ✅ All environment variables are loaded
3. ✅ AI assistant is live with real Claude API
4. ✅ Database connections work
5. ✅ Email notifications enabled
6. ✅ Admin dashboard accessible at `/admin/dashboard`

Your AI sales assistant will be fully operational! 🎉

---

## Security Notes

- ✅ Never commit `.env.local` to git (already in .gitignore)
- ✅ Use "Production only" for sensitive keys like `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Rotate API keys regularly
- ✅ Monitor usage in respective dashboards (Anthropic, Supabase, Resend)
- ✅ Set up billing alerts to avoid surprises

---

## Cost Monitoring

After deployment, monitor usage:

**Anthropic (Claude AI):**
- Dashboard: https://console.anthropic.com/
- Check API usage and costs

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Monitor database size and API requests

**Resend:**
- Dashboard: https://resend.com/
- Track email sends

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Monitor bandwidth and function executions

---

## Next Steps After Deployment

1. **Test the AI assistant** on your live site
2. **Check admin dashboard** at `yourdomain.com/admin/dashboard`
3. **Have a test conversation** to verify everything works
4. **Monitor email notifications** when leads come in
5. **Review Supabase database** to see conversations being stored

---

Ready to deploy? Start with Step 1: `vercel login` 🚀
