import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const { searchParams } = new URL(req.url);
      const limit = parseInt(searchParams.get('limit') || '50');
      
      const notifications = getNotifications(currentUser.id, limit);
      const unreadCount = getUnreadNotificationCount(currentUser.id);
      
      return NextResponse.json({
        success: true,
        data: { notifications, unreadCount },
      });
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { notification_id, mark_all_read } = body;
      
      if (mark_all_read) {
        const count = markAllNotificationsAsRead(currentUser.id);
        return NextResponse.json({
          success: true,
          data: { count },
          message: `已标记 ${count} 条通知为已读`,
        });
      }
      
      if (notification_id) {
        const success = markNotificationAsRead(notification_id);
        if (!success) {
          return NextResponse.json(
            { success: false, error: 'not_found', message: '通知不存在' },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          message: '已标记为已读',
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'invalid_params', message: '缺少参数' },
        { status: 400 }
      );
    });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const { searchParams } = new URL(req.url);
      const notificationId = searchParams.get('id');
      
      if (!notificationId) {
        return NextResponse.json(
          { success: false, error: 'missing_id', message: '缺少通知ID' },
          { status: 400 }
        );
      }
      
      const success = deleteNotification(notificationId);
      if (!success) {
        return NextResponse.json(
          { success: false, error: 'not_found', message: '通知不存在' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: '通知已删除',
      });
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}
