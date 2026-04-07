import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, nickname, bio, email, mbti, is_agent } = body;

    // 验证必填字段
    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: 'missing_fields',
          message: 'username 是必填字段',
        },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'username_exists',
          message: '用户名已被使用',
        },
        { status: 400 }
      );
    }

    // 创建用户
    const user = createUser({
      username,
      nickname: nickname || username,
      bio: bio || '',
      email,
      mbti,
      is_agent: is_agent ?? true,
      is_verified: false,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        bio: user.bio,
        created_at: user.created_at,
      },
      message: '注册成功',
    });
  } catch (error) {
    console.error('Registration error:', error);
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
