#!/bin/bash

# Quick Deploy Script for Vercel
# This script guides you through the entire deployment process

echo "🚀 AI Sales Assistant - Quick Deploy"
echo "======================================"
echo ""

# Step 1: Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
    echo ""
fi

# Step 2: Login
echo "📝 Step 1: Login to Vercel"
echo "======================================"
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel..."
    vercel login
    echo "✅ Logged in"
else
    echo "✅ Already logged in as: $(vercel whoami)"
fi
echo ""

# Step 3: Link Project
echo "🔗 Step 2: Link Project"
echo "======================================"
if [ ! -d ".vercel" ]; then
    echo "Linking project to Vercel..."
    vercel link
    echo "✅ Project linked"
else
    echo "✅ Project already linked"
fi
echo ""

# Step 4: Setup Environment Variables
echo "⚙️  Step 3: Setup Environment Variables"
echo "======================================"
echo ""
echo "You have two options:"
echo ""
echo "Option A: Automated setup (recommended)"
echo "   Run: ./setup-vercel-env.sh"
echo ""
echo "Option B: Manual setup via Vercel dashboard"
echo "   Visit: https://vercel.com/dashboard"
echo ""
echo "Option C: Add variables using CLI commands"
echo "   Example: vercel env add ANTHROPIC_API_KEY"
echo ""

read -p "Have you added your environment variables? (y/n): " vars_added

if [[ $vars_added != "y" && $vars_added != "Y" ]]; then
    echo ""
    echo "⚠️  You need to add environment variables before deploying"
    echo ""
    echo "Quick commands to add required variables:"
    echo "  vercel env add ANTHROPIC_API_KEY"
    echo "  vercel env add NEXT_PUBLIC_SUPABASE_URL"
    echo "  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  vercel env add SUPABASE_SERVICE_ROLE_KEY"
    echo "  vercel env add NEXT_PUBLIC_DEV_MODE  # Set to 'false'"
    echo ""
    echo "Or run the automated setup:"
    echo "  ./setup-vercel-env.sh"
    echo ""
    read -p "Press Enter when ready to continue..."
fi

echo ""
echo "🚀 Step 4: Deploy to Production"
echo "======================================"
echo ""
echo "This will:"
echo "  • Build your application"
echo "  • Deploy to Vercel"
echo "  • Make your AI assistant live"
echo ""

read -p "Ready to deploy? (y/n): " ready_deploy

if [[ $ready_deploy == "y" || $ready_deploy == "Y" ]]; then
    echo ""
    echo "Deploying to production..."
    echo ""
    vercel --prod
    echo ""
    echo "======================================"
    echo "✅ Deployment Complete!"
    echo "======================================"
    echo ""
    echo "Your AI Sales Assistant is now live! 🎉"
    echo ""
    echo "Next steps:"
    echo "  1. Visit your site and test the chat"
    echo "  2. Check admin dashboard at /admin/dashboard"
    echo "  3. Monitor conversations and leads"
    echo ""
    echo "To redeploy after changes:"
    echo "  vercel --prod"
    echo ""
else
    echo ""
    echo "⏸️  Deployment cancelled"
    echo ""
    echo "When you're ready, run:"
    echo "  vercel --prod"
    echo ""
fi

echo "📚 Documentation:"
echo "  • Setup guide: VERCEL_SETUP.md"
echo "  • AI assistant docs: AI_SALES_ASSISTANT_README.md"
echo ""
