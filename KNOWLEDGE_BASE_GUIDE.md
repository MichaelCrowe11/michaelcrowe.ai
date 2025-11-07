# Knowledge Base Training Guide

MichaelCrowe.ai now uses a centralized knowledge base system to train your AI assistant with your expertise, experience, and communication style.

## Overview

Your AI assistant is now powered primarily by **Anthropic's Claude Sonnet 4.5** (the latest and most capable model) with the following setup:

- **Primary AI**: Claude Sonnet 4.5 (Anthropic)
- **Fallback**: GPT-4 (OpenAI)
- **Knowledge Source**: `lib/knowledge-base.ts`

## Quick Start

### 1. Add Your Anthropic API Key

Get your API key from [console.anthropic.com](https://console.anthropic.com/)

Edit `.env.local` and add:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### 2. Customize Your Knowledge Base

Edit `lib/knowledge-base.ts` to train the AI with your specific knowledge:

#### Background & Experience
Update your professional identity, achievements, and expertise areas:

```typescript
background: {
  core_identity: "Your professional identity here",
  expertise_areas: ["Area 1", "Area 2", ...],
  key_achievements: ["Achievement 1", "Achievement 2", ...]
}
```

#### Technical Skills
Add or modify your technical capabilities:

```typescript
technical_skills: {
  ai_ml: ["Your AI/ML skills"],
  development: ["Your development skills"],
  automation: ["Your automation expertise"]
}
```

#### Services & Pricing
Update your service offerings and pricing:

```typescript
services: {
  consulting: {
    description: "What you offer",
    pricing: "$X,XXX - $X,XXX",
    ideal_for: "Who it's for",
    deliverables: ["What they get"]
  }
  // ... add more services
}
```

#### Case Studies
Add your proven results and social proof:

```typescript
case_studies: {
  project_name: {
    project: "Project Name",
    challenge: "What problem you solved",
    solution: "How you solved it",
    results: ["Specific measurable results"]
  }
}
```

#### Sales Approach
Customize your sales psychology and communication style:

```typescript
sales_approach: {
  principles: ["Your sales principles"],
  qualification_questions: ["Questions you ask"],
  objection_handling: {
    "objection_type": "Your response"
  }
}
```

### 3. Restart Your Dev Server

After updating the knowledge base:

```bash
npm run dev
```

## Advanced Configuration

### Multiple AI Personalities

You can create different AI behaviors for different contexts:

```typescript
// In your API route or component
import { generateSystemPrompt } from '@/lib/knowledge-base'

// Sales-focused (default)
const salesPrompt = generateSystemPrompt('sales')

// Technical support
const techPrompt = generateSystemPrompt('technical')

// General purpose
const generalPrompt = generateSystemPrompt('general')
```

### Adding New Sections

To add new knowledge areas, edit `lib/knowledge-base.ts`:

```typescript
export const knowledgeBase = {
  // ... existing sections

  // Add your new section
  your_new_section: {
    field1: "value",
    field2: ["list", "of", "items"]
  }
}
```

Then update the `generateSystemPrompt` function to include your new knowledge.

## File Structure

```
lib/
├── knowledge-base.ts      # Your AI training data (edit this!)
├── config.ts             # App configuration
└── sales-engine.ts       # Fallback sales engine

app/api/chat/
└── route.ts              # AI chat endpoint (uses knowledge base)
```

## Best Practices

### 1. Be Specific
Use concrete numbers and examples:
- ❌ "Helped many clients"
- ✅ "Increased client revenue by $470K/year"

### 2. Update Regularly
Keep your knowledge base current:
- Add new case studies as you complete projects
- Update pricing as your offerings evolve
- Refine your sales approach based on what works

### 3. Test Your Changes
After updating the knowledge base:
1. Restart your dev server
2. Test conversations in the chat interface
3. Verify the AI uses your updated information

### 4. Version Control
Your knowledge base is code - treat it like any other critical file:
- Commit changes with clear messages
- Review AI responses after major updates
- Keep a changelog of significant changes

## Deployment

### Vercel (Recommended)

Add your API key to Vercel environment variables:

```bash
vercel env add ANTHROPIC_API_KEY production
```

Or via the Vercel dashboard:
1. Project Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY`
3. Paste your key
4. Select "Production" environment
5. Save and redeploy

### Other Platforms

Ensure `ANTHROPIC_API_KEY` is available as an environment variable in your deployment environment.

## Monitoring

Check which AI provider is being used in responses:

```typescript
// Response includes provider info
{
  message: "AI response text",
  provider: "anthropic-claude-4.5" | "openai-fallback" | "sales-engine-fallback"
}
```

## Troubleshooting

### AI Not Using Updated Knowledge

1. Restart your dev server: `npm run dev`
2. Clear browser cache
3. Check for TypeScript errors: `npm run lint`

### Anthropic API Errors

Common issues:
- **401 Unauthorized**: Check your API key
- **429 Rate Limit**: You've hit usage limits
- **500 Server Error**: Try again or check Anthropic status

### Falls Back to OpenAI

This happens when:
- `ANTHROPIC_API_KEY` is not set
- Anthropic API returns an error
- Your account has insufficient credits

Check console logs for error details.

## Cost Optimization

Claude Sonnet 4.5 pricing (as of latest):
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

To reduce costs:
1. Reduce `max_tokens` in `app/api/chat/route.ts`
2. Limit conversation history (currently 8 messages)
3. Use caching for repeated system prompts (advanced)

## Next Steps

1. **Customize Your Knowledge**: Edit `lib/knowledge-base.ts` with your specific expertise
2. **Add Your API Key**: Get Claude API access at [console.anthropic.com](https://console.anthropic.com/)
3. **Test Conversations**: Try your chat interface and see how Claude represents you
4. **Iterate**: Refine based on the quality of conversations

## Questions?

- Anthropic Documentation: [docs.anthropic.com](https://docs.anthropic.com/)
- Claude Models: [Anthropic Model Docs](https://docs.anthropic.com/claude/docs/models-overview)
- API Reference: [API Docs](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

---

**Your AI assistant is now trained with your knowledge and powered by Claude Sonnet 4.5!**
