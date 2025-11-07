#!/bin/bash
# Deployment Verification Script
# Run this after deploying to verify all features work

echo "🚀 Michael Crowe AI - Deployment Verification"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get deployment URL
read -p "Enter your Vercel deployment URL (e.g., https://michaelcrowe.vercel.app): " DEPLOY_URL

if [ -z "$DEPLOY_URL" ]; then
    echo "${RED}❌ URL is required${NC}"
    exit 1
fi

echo ""
echo "Testing deployment: $DEPLOY_URL"
echo ""

# Test 1: Homepage loads
echo -n "1. Testing homepage... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "${GREEN}✅ PASS${NC} (HTTP $HTTP_CODE)"
else
    echo "${RED}❌ FAIL${NC} (HTTP $HTTP_CODE)"
fi

# Test 2: ElevenLabs check endpoint
echo -n "2. Testing ElevenLabs API... "
ELEVENLABS_RESPONSE=$(curl -s "$DEPLOY_URL/api/elevenlabs/check")
if echo "$ELEVENLABS_RESPONSE" | grep -q '"available":true'; then
    echo "${GREEN}✅ PASS${NC} (API key configured)"
elif echo "$ELEVENLABS_RESPONSE" | grep -q '"available":false'; then
    echo "${YELLOW}⚠️  WARN${NC} (API key not set - voice will use fallback)"
else
    echo "${RED}❌ FAIL${NC} (Endpoint error)"
fi

# Test 3: Chat API (requires OpenAI/Anthropic or falls back)
echo -n "3. Testing AI chat API... "
CHAT_RESPONSE=$(curl -s -X POST "$DEPLOY_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}')
if echo "$CHAT_RESPONSE" | grep -q '"message"'; then
    PROVIDER=$(echo "$CHAT_RESPONSE" | grep -o '"provider":"[^"]*"' | cut -d'"' -f4)
    echo "${GREEN}✅ PASS${NC} (Using: $PROVIDER)"
else
    echo "${RED}❌ FAIL${NC}"
    echo "$CHAT_RESPONSE"
fi

# Test 4: Contact form validation
echo -n "4. Testing contact form validation... "
CONTACT_RESPONSE=$(curl -s -X POST "$DEPLOY_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}')
if echo "$CONTACT_RESPONSE" | grep -q '"error"'; then
    echo "${GREEN}✅ PASS${NC} (Validation working)"
else
    echo "${YELLOW}⚠️  WARN${NC} (Unexpected response)"
fi

# Test 5: Starfield feature flag
echo -n "5. Testing starfield feature... "
if curl -s "$DEPLOY_URL" | grep -q "NEXT_PUBLIC_CHAT_STARS_ENHANCED"; then
    echo "${GREEN}✅ PASS${NC} (Feature flag detected)"
else
    echo "${YELLOW}⚠️  INFO${NC} (Check if flag is set to 'true')"
fi

echo ""
echo "=============================================="
echo "Deployment Verification Complete!"
echo ""
echo "Next Steps:"
echo "1. Visit $DEPLOY_URL and test the chat"
echo "2. Enable voice and verify ElevenLabs audio quality"
echo "3. Submit a test contact form"
echo "4. Check your email for form submission"
echo ""
echo "Missing features? Check:"
echo "• VERCEL_ENV_SETUP.md for environment variables"
echo "• Vercel dashboard → Settings → Environment Variables"
echo "• Redeploy after adding env vars"
echo ""
