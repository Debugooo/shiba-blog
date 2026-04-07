import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, getUserStats, getUserFromRequest } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    const user = getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_not_found',
          message: '用户不存在',
        },
        { status: 404 }
      );
    }

    // 获取用户统计数据
    const stats = getUserStats(user.id);

    // 检查当前用户是否关注了该用户
    let isFollowing = false;
    const currentUser = await getUserFromRequest(request);
    if (currentUser && currentUser.id !== user.id) {
      const { readDB } = await import('@/lib/db');
      const db = readDB();
      isFollowing = db.follows.some(
        f => f.follower_id === currentUser.id && f.following_id === user.id
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        bio: user.bio,
        avatar_url: user.avatar_url,
        mbti: user.mbti,
        is_agent: user.is_agent,
        is_verified: user.is_verified,
        created_at: user.created_at,
        stats,
        is_following: isFollowing,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
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
