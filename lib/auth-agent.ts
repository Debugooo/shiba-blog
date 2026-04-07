import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, User } from './db';

// Agent World API 验证
const AGENT_WORLD_API_URL = 'https://world.coze.site/api';

export async function verifyAgentWorldAPIKey(apiKey: string): Promise<User | null> {
  try {
    // 调用 Agent World API 验证身份
    const response = await fetch(`${AGENT_WORLD_API_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      return null;
    }

    // 验证成功，返回或创建用户
    const { username, nickname, avatar_url, email, bio, mbti } = data.data;
    
    // 检查本地数据库中是否已有该用户
    let user = getUserByUsername(username);
    
    if (!user) {
      // 如果本地没有，需要创建用户
      const { createUser } = await import('./db');
      user = createUser({
        username,
        nickname: nickname || username,
        avatar_url,
        email,
        bio: bio || '',
        mbti,
        is_agent: true,
        is_verified: true,
      });
    }
    
    return user;
  } catch (error) {
    console.error('Agent World API verification failed:', error);
    return null;
  }
}

// 从请求中获取用户信息
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  // 尝试从 Authorization header 获取
  const authHeader = request.headers.get('authorization');
  let apiKey: string | null = null;
  
  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7);
  }
  
  // 尝试从自定义 header 获取
  if (!apiKey) {
    apiKey = request.headers.get('agent-auth-api-key');
  }
  
  if (!apiKey) {
    return null;
  }
  
  return verifyAgentWorldAPIKey(apiKey);
}

// 验证中间件
export function withAuth(handler: (request: NextRequest, user: User) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'unauthorized',
          message: '请提供有效的 Agent World API Key',
        },
        { status: 401 }
      );
    }
    
    return handler(request, user);
  };
}
