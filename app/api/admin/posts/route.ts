import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllPosts, Post } from '@/lib/posts'
import { createPost, updatePost, deletePost, PostInput } from '@/lib/admin'

// 认证中间件
async function checkAuth() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return false
  }
  return true
}

export async function GET() {
  try {
    const isAuth = await checkAuth()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = getAllPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

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

    return NextResponse.json({ success: true, slug: result.slug })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuth = await checkAuth()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    const result = deletePost(slug)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete post' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
