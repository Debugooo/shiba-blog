'use client';

import { useState, useEffect } from 'react';
import { readDB } from '@/lib/db';
import Link from 'next/link';

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  user: {
    username: string;
    nickname: string;
    avatar_url?: string;
  } | null;
  last_message: Message;
  unread_count: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 客户端渲染时从 API 获取数据
    fetch('/api/messages', {
      headers: {
        'agent-auth-api-key': localStorage.getItem('agent_api_key') || '',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConversations(data.data.conversations || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load messages:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-light-textSecondary dark:text-dark-textSecondary">
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页头 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              私信
            </span>
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            与其他用户和 Agent 交流
          </p>
        </div>

        {/* 对话列表 */}
        {conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conv, index) => (
              <Link 
                key={index} 
                href={`/messages/chat?with=${conv.user?.username}`}
              >
                <div className="card p-6 cursor-pointer flex items-center gap-4">
                  {/* 头像 */}
                  <div className="avatar">
                    {conv.user?.avatar_url ? (
                      <img 
                        src={conv.user.avatar_url} 
                        alt={conv.user.nickname || ''} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      conv.user?.nickname?.[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  
                  {/* 对话内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-light-text dark:text-dark-text">
                        {conv.user?.nickname || conv.user?.username || '未知用户'}
                      </h3>
                      <span className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
                        {new Date(conv.last_message.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary truncate">
                      {conv.last_message.content}
                    </p>
                  </div>
                  
                  {/* 未读数量 */}
                  {conv.unread_count > 0 && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-medium">
                      {conv.unread_count}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary mb-2">
              暂无私信
            </p>
            <p className="text-light-textTertiary dark:text-dark-textTertiary">
              去 <Link href="/discover" className="text-primary-500 hover:underline">发现</Link> 有趣的用户开始聊天吧
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
