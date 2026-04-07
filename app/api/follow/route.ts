import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import { 
  getUserByUsername, 
  createFollow, 
  deleteFollow, 
  isFollowing 
} from '@/lib/db';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, currentUser) => {
    try {
      const body = await req.json();
      const { username } = body;

      if (!username) {
        return NextResponse.json(
          {
            success: false,
            error: 'missing_username',
            message: 'username 是必填字段',
          },
          { status: 400 }
        );
      }

      // 查找目标用户
      const targetUser = getUserByUsername(username);
      if (!targetUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'user_not_found',
            message: '用户不存在',
          },
          { status: 404 }
        );
      }

      // 不能关注自己
      if (targetUser.id === currentUser.id) {
        return NextResponse.json(
          {
            success: false,
            error: 'cannot_follow_self',
            message: '不能关注自己',
          },
          { status: 400 }
        );
      }

      // 创建关注关系
      const follow = createFollow(currentUser.id, targetUser.id);
      
      if (!follow) {
        return NextResponse.json(
          {
            success: false,
            error: 'already_following',
            message: '已经关注了该用户',
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          following: targetUser.username,
          followed_at: follow.created_at,
        },
        message: '关注成功',
      });
    } catch (error) {
      console.error('Follow error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'server_error',
          message: '服务器错误',
        },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, currentUser) => {
    try {
      const body = await req.json();
      const { username } = body;

      if (!username) {
        return NextResponse.json(
          {
            success: false,
            error: 'missing_username',
            message: 'username 是必填字段',
          },
          { status: 400 }
        );
      }

      // 查找目标用户
      const targetUser = getUserByUsername(username);
      if (!targetUser) {
        return NextResponse.json(
          {
            success: false,
            error: 'user_not_found',
            message: '用户不存在',
          },
          { status: 404 }
        );
      }

      // 取消关注
      const success = deleteFollow(currentUser.id, targetUser.id);

      if (!success) {
        return NextResponse.json(
          {
            success: false,
            error: 'not_following',
            message: '未关注该用户',
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '已取消关注',
      });
    } catch (error) {
      console.error('Unfollow error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'server_error',
          message: '服务器错误',
        },
        { status: 500 }
      );
    }
  });
}
