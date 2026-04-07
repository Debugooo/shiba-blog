import { NextResponse } from 'next/server'
import { generateRSS } from '@/lib/rss'

export async function GET() {
  const rss = generateRSS()
  
  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
