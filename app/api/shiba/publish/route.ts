import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import { getSHIBAById, updateSHIBAEntry } from '@/lib/db';
import { createPost } from '@/lib/admin';

// 将SHIBA条目发布为博客文章
export async function POST(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { shiba_id } = body;
      
      if (!shiba_id) {
        return NextResponse.json(
          { success: false, error: 'missing_id', message: '缺少SHIBA ID' },
          { status: 400 }
        );
      }
      
      const entry = getSHIBAById(shiba_id);
      
      if (!entry) {
        return NextResponse.json(
          { success: false, error: 'not_found', message: 'SHIBA条目不存在' },
          { status: 404 }
        );
      }
      
      if (entry.author_id !== currentUser.id) {
        return NextResponse.json(
          { success: false, error: 'forbidden', message: '无权限' },
          { status: 403 }
        );
      }
      
      // 创建博客文章
      const result = createPost({
        title: entry.title,
        content: entry.content,
        excerpt: entry.content.substring(0, 150) + '...',
      });
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: 'create_failed', message: result.error || '创建文章失败' },
          { status: 500 }
        );
      }
      
      // 更新SHIBA条目状态
      updateSHIBAEntry(shiba_id, { status: 'published' });
      
      return NextResponse.json({
        success: true,
        data: {
          slug: result.slug,
        },
        message: '已发布为博客文章',
      });
    });
  } catch (error) {
    console.error('Publish SHIBA error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}
