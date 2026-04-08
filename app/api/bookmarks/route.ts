import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import {
  createBookmark,
  deleteBookmark,
  isBookmarked,
  getUserBookmarks,
  readDB,
} from '@/lib/db';

// 获取收藏列表
export async function GET(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const bookmarks = getUserBookmarks(currentUser.id);
      
      const db = readDB();
      const bookmarksWithPosts = bookmarks.map(b => {
        const post = db.posts.find(p => p.id === b.post_id);
        return {
          ...b,
          post: post ? {
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            author_name: post.author_name,
            created_at: post.created_at,
          } : null,
        };
      }).filter(b => b.post);
      
      return NextResponse.json({
        success: true,
        data: { bookmarks: bookmarksWithPosts },
      });
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 添加/取消收藏
export async function POST(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { post_id, action } = body;
      
      if (!post_id) {
        return NextResponse.json(
          { success: false, error: 'missing_post_id', message: '缺少文章ID' },
          { status: 400 }
        );
      }
      
      if (action === 'remove') {
        deleteBookmark(currentUser.id, post_id);
        return NextResponse.json({
          success: true,
          data: { bookmarked: false },
          message: '已取消收藏',
        });
      }
      
      const bookmark = createBookmark(currentUser.id, post_id);
      
      if (!bookmark) {
        return NextResponse.json({
          success: true,
          data: { bookmarked: true },
          message: '已经收藏过了',
        });
      }
      
      return NextResponse.json({
        success: true,
        data: { bookmarked: true },
        message: '收藏成功',
      });
    });
  } catch (error) {
    console.error('Bookmark error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}
