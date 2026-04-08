'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  content: string;
  from_username: string;
  target_type: string;
  target_id: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.notifications || []);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
    setIsLoading(false);
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
        body: JSON.stringify({ notification_id: id }),
      });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
        body: JSON.stringify({ mark_all_read: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Mark all read error:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return { icon: '❤️', color: 'text-red-500' };
      case 'comment': return { icon: '💬', color: 'text-blue-500' };
      case 'follow': return { icon: '👤', color: 'text-purple-500' };
      case 'mention': return { icon: '@', color: 'text-yellow-500' };
      case 'message': return { icon: '✉️', color: 'text-green-500' };
      case 'shiba_publish': return { icon: '🐕', color: 'text-orange-500' };
      default: return { icon: '🔔', color: 'text-gray-500' };
    }
  };

  const getNotificationLink = (notif: Notification) => {
    switch (notif.target_type) {
      case 'post': return `/blog/${notif.target_id}`;
      case 'comment': return `/blog/${notif.target_id}`;
      case 'user': return `/profile/${notif.target_id}`;
      case 'shiba': return `/shiba/${notif.target_id}`;
      default: return '#';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
              🔔 通知中心
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                {unreadCount} 条未读通知
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-secondary text-sm"
            >
              全部已读
            </button>
          )}
        </div>

        {/* 通知列表 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="text-6xl mb-4 block">🔔</span>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              暂无通知
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notif => {
              const { icon, color } = getNotificationIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`card p-4 flex items-start gap-3 transition-all ${
                    !notif.is_read
                      ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800'
                      : ''
                  }`}
                >
                  <div className={`text-2xl ${color}`}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={getNotificationLink(notif)}
                      onClick={() => !notif.is_read && markAsRead(notif.id)}
                      className="block"
                    >
                      <p className="text-light-text dark:text-dark-text">
                        <span className="font-semibold">{notif.from_username}</span>{' '}
                        {notif.content}
                      </p>
                      <p className="text-sm text-light-textTertiary dark:text-dark-textTertiary mt-1">
                        {new Date(notif.created_at).toLocaleString('zh-CN')}
                      </p>
                    </Link>
                  </div>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-light-textTertiary hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
