#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you add all required environment variables to Vercel

echo "🚀 Vercel Environment Variables Setup"
echo "======================================"
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel"
    echo "Please run: vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""

# Check if project is linked
if [ ! -d ".vercel" ]; then
    echo "❌ Project not linked to Vercel"
    echo "Please run: vercel link"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Function to add environment variable
add_env() {
    local var_name=$1
    local var_description=$2
    local environments=$3

    echo "📝 Adding: $var_name"
    echo "   Description: $var_description"
    echo "   Environments: $environments"
    echo ""
    echo "Please enter the value for $var_name:"
    read -r var_value

    if [ -z "$var_value" ]; then
        echo "⚠️  Skipping $var_name (empty value)"
        echo ""
        return
    fi

    echo "$var_value" | vercel env add "$var_name" "$environments"
    echo "✅ Added $var_name"
    echo ""
}

echo "Let's add your environment variables!"
echo "You can skip any optional variables by pressing Enter without a value."
echo ""
echo "=================================================="
echo ""

# Required Variables
echo "🔴 REQUIRED VARIABLES"
echo "=================================================="
echo ""

echo "1️⃣  ANTHROPIC API KEY"
echo "   Get it from: https://console.anthropic.com/"
echo "   Should start with: sk-ant-"
add_env "ANTHROPIC_API_KEY" "Claude AI API Key" "production preview development"

echo "2️⃣  SUPABASE PROJECT URL"
echo "   Get it from: Supabase Dashboard → Settings → API"
echo "   Format: https://xxxxx.supabase.co"
add_env "NEXT_PUBLIC_SUPABASE_URL" "Supabase Project URL" "production preview development"

echo "3️⃣  SUPABASE ANON KEY"
echo "   Get it from: Supabase Dashboard → Settings → API → anon/public"
add_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase Anon Key" "production preview development"

echo "4️⃣  SUPABASE SERVICE ROLE KEY"
echo "   Get it from: Supabase Dashboard → Settings → API → service_role"
echo "   ⚠️  This is a SECRET key - only added to Production"
add_env "SUPABASE_SERVICE_ROLE_KEY" "Supabase Service Role Key" "production"

echo ""
echo "🟡 RECOMMENDED VARIABLES"
echo "=================================================="
echo ""

echo "5️⃣  RESEND API KEY (for email notifications)"
echo "   Get it from: https://resend.com/"
echo "   Should start with: re_"
echo "   Press Enter to skip if you don't have it yet"
add_env "RESEND_API_KEY" "Resend Email API Key" "production preview"

echo "6️⃣  EMAIL FROM ADDRESS"
echo "   Example: noreply@michaelcrowe.ai"
echo "   Press Enter to use default"
read -p "Email from [noreply@michaelcrowe.ai]: " email_from
email_from=${email_from:-noreply@michaelcrowe.ai}
echo "$email_from" | vercel env add "EMAIL_FROM" "production preview development"

echo "7️⃣  YOUR EMAIL (for lead notifications)"
echo "   Example: hello@michaelcrowe.ai"
read -p "Your email [hello@michaelcrowe.ai]: " email_to
email_to=${email_to:-hello@michaelcrowe.ai}
echo "$email_to" | vercel env add "EMAIL_TO" "production preview development"

echo ""
echo "🔧 CONFIGURATION VARIABLES"
echo "=================================================="
echo ""

echo "8️⃣  SITE URL"
read -p "Your site URL [https://michaelcrowe.ai]: " site_url
site_url=${site_url:-https://michaelcrowe.ai}
echo "$site_url" | vercel env add "NEXT_PUBLIC_SITE_URL" "production"

echo "9️⃣  CONTACT EMAIL"
read -p "Contact email [hello@michaelcrowe.ai]: " contact_email
contact_email=${contact_email:-hello@michaelcrowe.ai}
echo "$contact_email" | vercel env add "NEXT_PUBLIC_CONTACT_EMAIL" "production preview development"

echo "🔟 DISABLE DEV MODE (Important!)"
echo "   Setting NEXT_PUBLIC_DEV_MODE=false to enable real AI"
echo "false" | vercel env add "NEXT_PUBLIC_DEV_MODE" "production preview"
echo "✅ Dev mode disabled for production"

echo ""
echo "=================================================="
echo "✅ Environment Variables Setup Complete!"
echo "=================================================="
echo ""

# Ask if they want to pull variables locally
echo "Would you like to pull these variables to .env.local for local development?"
read -p "Pull to .env.local? (y/n): " pull_local

if [[ $pull_local == "y" || $pull_local == "Y" ]]; then
    echo ""
    echo "Pulling environment variables to .env.local..."
    vercel env pull .env.local
    echo "✅ Environment variables saved to .env.local"
fi

echo ""
echo "📋 Summary"
echo "=================================================="
echo "✅ Environment variables added to Vercel"
echo "✅ AI assistant ready to deploy"
echo ""
echo "Next steps:"
echo "1. Deploy to production: vercel --prod"
echo "2. Visit your site and test the AI chat"
echo "3. Check admin dashboard: /admin/dashboard"
echo ""
echo "To view all variables: vercel env ls"
echo "To redeploy: vercel --prod"
echo ""
echo "🚀 Ready to launch! Run: vercel --prod"
