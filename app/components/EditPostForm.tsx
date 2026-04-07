'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/lib/posts'

interface EditPostFormProps {
  post: Post
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content || '')
  const [excerpt, setExcerpt] = useState(post.excerpt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空')
      return
    }

    setLoading(true)

    try {
      // 删除旧文章
      const deleteResponse = await fetch(`/api/admin/posts?slug=${post.slug}`, {
        method: 'DELETE',
      })

      if (!deleteResponse.ok) {
        setError('更新失败')
        setLoading(false)
        return
      }

      // 创建新文章（保持原日期）
      const createResponse = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || content.trim().substring(0, 150),
          date: post.date,
        }),
      })

      const data = await createResponse.json()

      if (createResponse.ok) {
        router.push('/admin/posts')
      } else {
        setError(data.error || '更新失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">编辑文章</h1>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mt-2">修改文章内容</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              文章标题 *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full"
              placeholder="输入文章标题"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              文章摘要
            </label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="input w-full"
              placeholder="简短描述"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              文章内容（Markdown格式）*
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="input w-full font-mono text-sm"
              placeholder="使用 Markdown 格式编写文章内容..."
              required
            />
          </div>

          {/* Date */}
          <div className="p-4 bg-light-card dark:bg-dark-card rounded-2xl">
            <div className="flex items-center text-sm text-light-textSecondary dark:text-dark-textSecondary">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              发布日期：{new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-light-border dark:border-dark-border">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  保存修改
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preview */}
      <div className="card p-8 mt-6">
        <h2 className="text-lg font-bold mb-4 text-light-text dark:text-dark-text flex items-center">
          <svg className="w-5 h-5 mr-2 text-accent-primary dark:text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          内容预览
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <h1>{title || '文章标题'}</h1>
          <div className="whitespace-pre-wrap font-mono text-sm bg-light-card dark:bg-dark-card p-4 rounded-2xl text-light-textSecondary dark:text-dark-textSecondary">
            {content || '文章内容将在这里显示...'}
          </div>
        </div>
      </div>
    </div>
  )
}
