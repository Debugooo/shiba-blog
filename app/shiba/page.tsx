'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SHIBAEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  source: 'human' | 'agent';
  agent_name?: string;
  author_username: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  created_at: string;
}

interface Tag {
  tag: string;
  count: number;
}

export default function SHIBAPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<SHIBAEntry[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    fetchEntries();
    fetchTags();
  }, [selectedTag]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTag) params.set('tag', selectedTag);
      params.set('status', 'published');
      
      const res = await fetch(`/api/shiba?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setEntries(data.data.entries || []);
      }
    } catch (error) {
      console.error('Fetch entries error:', error);
    }
    setIsLoading(false);
  };

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/shiba?tags=true');
      const data = await res.json();
      if (data.success) {
        setTags(data.data.tags || []);
      }
    } catch (error) {
      console.error('Fetch tags error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEntries();
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/shiba?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setEntries(data.data.entries || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newEntry.title || !newEntry.content) return;
    
    try {
      const res = await fetch('/api/shiba', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
        body: JSON.stringify({
          title: newEntry.title,
          content: newEntry.content,
          tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowNewForm(false);
        setNewEntry({ title: '', content: '', tags: '' });
        fetchEntries();
      } else {
        alert(data.message || '创建失败');
      }
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🐕</span>
              <div>
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
                  SHIBA
                </h1>
                <p className="text-light-textSecondary dark:text-dark-textSecondary text-sm">
                  Shiba&apos;s Instant Blog Article · 快速捕获知识碎片
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建SHIBA
            </button>
          </div>
          
          {/* 搜索栏 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="搜索SHIBA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input flex-1"
            />
            <button onClick={handleSearch} className="btn-secondary">
              搜索
            </button>
          </div>
        </div>

        {/* 新建表单 */}
        {showNewForm && (
          <div className="card p-6 mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
              创建新SHIBA
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-light-textSecondary dark:text-dark-textSecondary">
                  标题
                </label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="今天学到了什么..."
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-light-textSecondary dark:text-dark-textSecondary">
                  内容 (Markdown)
                </label>
                <textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="详细记录你的发现..."
                  rows={8}
                  className="input w-full font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-light-textSecondary dark:text-dark-textSecondary">
                  标签 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  placeholder="javascript, react, tips"
                  className="input w-full"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowNewForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  className="btn-primary"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 标签筛选 */}
        {tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`tag ${!selectedTag ? 'tag-primary' : ''}`}
            >
              全部
            </button>
            {tags.slice(0, 10).map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`tag ${selectedTag === tag ? 'tag-primary' : ''}`}
              >
                {tag} ({count})
              </button>
            ))}
          </div>
        )}

        {/* SHIBA列表 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🐕</span>
            <p className="text-light-textSecondary dark:text-dark-textSecondary">
              还没有SHIBA条目，创建一个开始吧！
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/shiba/${entry.id}`}
                className="card p-6 block hover:shadow-card-hover dark:hover:shadow-card-hover-dark transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-light-textSecondary dark:text-dark-textSecondary text-sm line-clamp-2 mb-3">
                      {entry.content.replace(/[#*`]/g, '').substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map(tag => (
                        <span key={tag} className="tag-secondary text-xs">
                          {tag}
                        </span>
                      ))}
                      {entry.source === 'agent' && (
                        <span className="tag text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                          AI ✨
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-light-textTertiary dark:text-dark-textTertiary">
                    <div className="flex items-center gap-3">
                      <span>👁 {entry.views}</span>
                      <span>❤️ {entry.likes}</span>
                    </div>
                    <p className="mt-1">
                      {new Date(entry.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
