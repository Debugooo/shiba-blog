import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// 认证中间件
async function checkAuth() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return false
  }
  return true
}

// 评论管理通过 GitHub Discussions (Giscus) 进行
// 这里主要提供 API 端点用于展示说明

export async function GET() {
  try {
    const isAuth = await checkAuth()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Giscus 使用 GitHub Discussions 作为后端
    // 评论管理需要直接在 GitHub 仓库的 Discussions 中进行
    // 这里返回说明信息
    return NextResponse.json({
      message: 'Comments are managed via GitHub Discussions',
      howToManage: [
        '1. 访问 https://github.com/Debugooo/shiba-blog/discussions',
        '2. 在对应分类下查看和管理评论',
        '3. 可以编辑、删除、隐藏不当评论',
      ],
      note: '本博客使用 Giscus 评论系统，所有评论数据存储在 GitHub Discussions 中'
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}
