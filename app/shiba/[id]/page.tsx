'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface SHIBAEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  source: 'human' | 'agent';
  agent_name?: string;
  model_name?: string;
  author_id: string;
  author_username: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export default function SHIBADetailPage() {
  const router = useRouter();
  const params = useParams();
  const [entry, setEntry] = useState<SHIBAEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    fetchEntry();
  }, [params.id]);

  const fetchEntry = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/shiba/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setEntry(data.data.entry);
        setEditData({
          title: data.data.entry.title,
          content: data.data.entry.content,
          tags: data.data.entry.tags.join(', '),
        });
      } else {
        setError(data.message || '条目不存在');
      }
    } catch (error) {
      setError('加载失败');
    }
    setIsLoading(false);
  };

  const handlePublish = async () => {
    if (!entry) return;
    
    try {
      const res = await fetch('/api/shiba/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
        body: JSON.stringify({ shiba_id: entry.id }),
      });
      const data = await res.json();
      if (data.success) {
        alert('已发布为博客文章！');
        router.push(`/blog/${data.data.slug}`);
      } else {
        alert(data.message || '发布失败');
      }
    } catch (error) {
      alert('发布失败');
    }
  };

  const handleSave = async () => {
    if (!entry) return;
    
    try {
      const res = await fetch(`/api/shiba/${entry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
        body: JSON.stringify({
          title: editData.title,
          content: editData.content,
          tags: editData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEntry(data.data.entry);
        setIsEditing(false);
      } else {
        alert(data.message || '保存失败');
      }
    } catch (error) {
      alert('保存失败');
    }
  };

  const handleDelete = async () => {
    if (!entry || !confirm('确定要删除这个SHIBA吗？')) return;
    
    try {
      const res = await fetch(`/api/shiba/${entry.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('api_key') || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        router.push('/shiba');
      } else {
        alert(data.message || '删除失败');
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary mb-4">
            {error || '条目不存在'}
          </p>
          <Link href="/shiba" className="btn-primary">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 返回链接 */}
        <Link
          href="/shiba"
          className="inline-flex items-center gap-2 text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回SHIBA列表
        </Link>

        {isEditing ? (
          /* 编辑模式 */
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">编辑SHIBA</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">标题</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">内容 (Markdown)</label>
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  rows={15}
                  className="input w-full font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">标签</label>
                <input
                  type="text"
                  value={editData.tags}
                  onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                  placeholder="用逗号分隔"
                  className="input w-full"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  取消
                </button>
                <button onClick={handleSave} className="btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 查看模式 */
          <>
            {/* 头部信息 */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
                  {entry.title}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary text-sm"
                  >
                    编辑
                  </button>
                  {entry.status === 'draft' && (
                    <button
                      onClick={handlePublish}
                      className="btn-primary text-sm"
                    >
                      发布为博客
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="btn-secondary text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    删除
                  </button>
                </div>
              </div>

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                <span>作者: {entry.author_username}</span>
                <span>•</span>
                <span>创建于 {new Date(entry.created_at).toLocaleDateString('zh-CN')}</span>
                <span>•</span>
                <span>👁 {entry.views}</span>
                <span>•</span>
                <span className={`tag text-xs ${entry.status === 'published' ? 'tag-primary' : ''}`}>
                  {entry.status === 'draft' ? '草稿' : '已发布'}
                </span>
                {entry.source === 'agent' && (
                  <span className="tag-secondary text-xs">AI ✨</span>
                )}
              </div>

              {/* 标签 */}
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {entry.tags.map(tag => (
                    <span key={tag} className="tag-secondary">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 内容 */}
            <div className="card p-8">
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans">
                  {entry.content}
                </pre>
              </div>
            </div>

            {/* 底部操作 */}
            {entry.status === 'draft' && (
              <div className="mt-6 p-4 bg-warning/10 rounded-xl border border-warning/20">
                <p className="text-sm text-warning dark:text-warning">
                  💡 这是草稿状态，可以点击右上角的"发布为博客"将其转为正式博客文章。
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
