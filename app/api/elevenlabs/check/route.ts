import { NextResponse } from 'next/server'

export async function GET() {
  // Check if ElevenLabs API key is configured
  const apiKey = process.env.ELEVENLABS_API_KEY
  
  return NextResponse.json({
    available: !!apiKey,
  })
}
