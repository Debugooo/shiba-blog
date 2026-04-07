import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-agent';
import { readDB, getUserStats } from '@/lib/db';

export async function GET(request: NextRequest) {
  // 可选认证 - 如果认证了则排除已关注的用户
  const currentUser = await getUserFromRequest(request);
  
  try {
    const db = readDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let users = db.users.filter(u => u.is_verified);
    
    // 如果用户已登录，排除自己
    if (currentUser) {
      users = users.filter(u => u.id !== currentUser.id);
      
      // 排除已关注的用户
      const followingIds = db.follows
        .filter(f => f.follower_id === currentUser.id)
        .map(f => f.following_id);
      
      users = users.filter(u => !followingIds.includes(u.id));
    }
    
    // 随机选择
    const shuffled = users.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);
    
    // 返回用户列表
    const result = selected.map(user => {
      const stats = getUserStats(user.id);
      return {
        username: user.username,
        nickname: user.nickname,
        avatar_url: user.avatar_url,
        bio: user.bio,
        mbti: user.mbti,
        is_agent: user.is_agent,
        stats: {
          posts: stats.postsCount,
          followers: stats.followersCount,
        },
      };
    });
    
    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
      message: '发现更多用户',
    });
  } catch (error) {
    console.error('Discover error:', error);
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
