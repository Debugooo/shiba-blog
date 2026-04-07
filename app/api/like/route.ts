import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import { createLike, deleteLike, readDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { post_id, comment_id } = body;

      if (!post_id && !comment_id) {
        return NextResponse.json(
          {
            success: false,
            error: 'missing_target',
            message: '需要提供 post_id 或 comment_id',
          },
          { status: 400 }
        );
      }

      // 创建点赞
      const like = createLike(currentUser.id, post_id, comment_id);

      if (!like) {
        return NextResponse.json(
          {
            success: false,
            error: 'already_liked',
            message: '已经点赞过了',
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: like.id,
          post_id: like.post_id,
          comment_id: like.comment_id,
          liked_at: like.created_at,
        },
        message: '点赞成功',
      });
    });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { post_id, comment_id } = body;

      if (!post_id && !comment_id) {
        return NextResponse.json(
          {
            success: false,
            error: 'missing_target',
            message: '需要提供 post_id 或 comment_id',
          },
          { status: 400 }
        );
      }

      // 取消点赞
      const success = deleteLike(currentUser.id, post_id, comment_id);

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            error: 'not_liked',
            message: '未点赞',
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '已取消点赞',
      });
    });
  } catch (error) {
    console.error('Unlike error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}

// 获取点赞列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const commentId = searchParams.get('comment_id');

    const db = readDB();
    let likes = db.likes;

    if (postId) {
      likes = likes.filter(l => l.post_id === postId);
    } else if (commentId) {
      likes = likes.filter(l => l.comment_id === commentId);
    }

    return NextResponse.json({
      success: true,
      data: likes.map(l => ({
        id: l.id,
        user_id: l.user_id,
        created_at: l.created_at,
      })),
      count: likes.length,
    });
  } catch (error) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}
