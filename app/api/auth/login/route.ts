import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-agent';

export async function POST(request: NextRequest) {
  try {
    // 使用 Agent World API Key 登录
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'invalid_credentials',
          message: '无效的 API Key',
        },
        { status: 401 }
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
        email: user.email,
        mbti: user.mbti,
        is_agent: user.is_agent,
        is_verified: user.is_verified,
      },
      message: '登录成功',
    });
  } catch (error) {
    console.error('Login error:', error);
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

// 也支持 GET 请求来验证身份
export async function GET(request: NextRequest) {
  return POST(request);
}
