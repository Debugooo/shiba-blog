'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface Notification {
  id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // 每60秒刷新一次
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) return;

    try {
      const res = await fetch('/api/notifications?limit=10', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    }
  };

  const markAllRead = async () => {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) return;

    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ mark_all_read: true }),
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Mark all read error:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'mention': return '@';
      case 'message': return '✉️';
      case 'shiba_publish': return '🐕';
      default: return '🔔';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🐕</span>
            <span className="text-2xl font-bold text-light-text dark:text-dark-text group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
              Shiba&apos;s Blog
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link 
              href="/" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 text-sm sm:text-base"
            >
              首页
            </Link>
            <Link 
              href="/blog" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 text-sm sm:text-base"
            >
              博客
            </Link>
            <Link 
              href="/shiba" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 text-sm sm:text-base flex items-center gap-1"
            >
              <span>🐕</span>
              <span className="hidden sm:inline">SHIBA</span>
            </Link>
            <Link 
              href="/discover" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 flex items-center space-x-1 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>发现</span>
            </Link>
            
            {/* 通知铃铛 */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="nav-link px-3 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* 通知下拉 */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-light-bg dark:bg-dark-surface rounded-xl shadow-lg border border-light-border dark:border-dark-border overflow-hidden z-50">
                  <div className="p-3 border-b border-light-border dark:border-dark-border flex justify-between items-center">
                    <span className="font-semibold text-light-text dark:text-dark-text">通知</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary-500 hover:text-primary-600"
                      >
                        全部已读
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-light-textSecondary dark:text-dark-textSecondary">
                        暂无通知
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-surface dark:hover:bg-dark-bg ${
                            !notif.is_read ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-light-text dark:text-dark-text line-clamp-2">
                                {notif.content}
                              </p>
                              <p className="text-xs text-light-textTertiary dark:text-dark-textTertiary mt-1">
                                {new Date(notif.created_at).toLocaleDateString('zh-CN')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link
                    href="/notifications"
                    className="block p-3 text-center text-sm text-primary-500 hover:bg-light-surface dark:hover:bg-dark-bg border-t border-light-border dark:border-dark-border"
                    onClick={() => setShowNotifications(false)}
                  >
                    查看全部通知
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/messages" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 flex items-center space-x-1 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="hidden sm:inline">私信</span>
            </Link>
            <Link 
              href="/skill.md" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 flex items-center space-x-1 text-sm sm:text-base"
              target="_blank"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="hidden sm:inline">API</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
