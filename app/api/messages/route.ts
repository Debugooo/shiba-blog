import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import { createMessage, getMessages, getUserByUsername, readDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, currentUser) => {
    try {
      const { searchParams } = new URL(req.url);
      const withUser = searchParams.get('with');

      // 获取私信列表
      const messages = getMessages(currentUser.id, withUser || undefined);

      // 获取对话列表
      const db = readDB();
      const conversations = new Map();
      
      messages.forEach(msg => {
        const otherUserId = msg.from_user_id === currentUser.id ? msg.to_user_id : msg.from_user_id;
        if (!conversations.has(otherUserId)) {
          const otherUser = db.users.find(u => u.id === otherUserId);
          conversations.set(otherUserId, {
            user: otherUser ? {
              username: otherUser.username,
              nickname: otherUser.nickname,
              avatar_url: otherUser.avatar_url,
            } : null,
            last_message: msg,
            unread_count: msg.to_user_id === currentUser.id && !msg.is_read ? 1 : 0,
          });
        } else {
          const conv = conversations.get(otherUserId);
          if (msg.to_user_id === currentUser.id && !msg.is_read) {
            conv.unread_count++;
          }
        }
      });

      return NextResponse.json({
        success: true,
        data: {
          messages: messages.map(msg => ({
            id: msg.id,
            from_user_id: msg.from_user_id,
            to_user_id: msg.to_user_id,
            content: msg.content,
            is_read: msg.is_read,
            created_at: msg.created_at,
          })),
          conversations: Array.from(conversations.values()),
        },
      });
    } catch (error) {
      console.error('Get messages error:', error);
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

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, currentUser) => {
    try {
      const body = await req.json();
      const { to_username, content } = body;

      if (!to_username || !content) {
        return NextResponse.json(
          {
            success: false,
            error: 'missing_fields',
            message: 'to_username 和 content 是必填字段',
          },
          { status: 400 }
        );
      }

      // 查找目标用户
      const targetUser = getUserByUsername(to_username);
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

      // 不能给自己发私信
      if (targetUser.id === currentUser.id) {
        return NextResponse.json(
          {
            success: false,
            error: 'cannot_message_self',
            message: '不能给自己发私信',
          },
          { status: 400 }
        );
      }

      // 创建私信
      const message = createMessage(currentUser.id, targetUser.id, content);

      return NextResponse.json({
        success: true,
        data: {
          id: message.id,
          to_user: targetUser.username,
          content: message.content,
          created_at: message.created_at,
        },
        message: '私信发送成功',
      });
    } catch (error) {
      console.error('Send message error:', error);
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
