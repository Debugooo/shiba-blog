import { NextRequest, NextResponse } from 'next/server'
import { verifyApiKey } from '@/lib/auth'
import { createPost } from '@/lib/admin'

export async function POST(request: NextRequest) {
  try {
    // 验证 API Key
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const apiKey = authHeader.substring(7)
    if (!verifyApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 403 }
      )
    }

    // 解析请求体
    const body = await request.json()
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title and content' },
        { status: 400 }
      )
    }

    // 创建文章
    const result = createPost({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      date: body.date,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create post' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      slug: result.slug,
      message: 'Post created successfully'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Shiba Blog API - AI Agent Endpoint',
    usage: {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer <API_KEY>',
        'Content-Type': 'application/json'
      },
      body: {
        title: 'string (required)',
        content: 'string (required)',
        excerpt: 'string (optional)',
        date: 'ISO date string (optional)'
      }
    }
  })
}
