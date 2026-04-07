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
      // 注意：简化版更新，实际需要添加 PUT/PATCH API
      // 这里先删除再创建（简化实现）
      const deleteResponse = await fetch(`/api/admin/posts?slug=${post.slug}`, {
        method: 'DELETE',
      })

      if (!deleteResponse.ok) {
        setError('更新失败')
        setLoading(false)
        return
      }

      const createResponse = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || content.trim().substring(0, 150),
          date: post.date, // 保持原日期
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
      <h1 className="text-3xl font-bold mb-8 dark:text-white">编辑文章</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章标题 *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="输入文章标题"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章摘要
          </label>
          <input
            type="text"
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="简短描述"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            文章内容（Markdown格式）*
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="使用 Markdown 格式编写文章内容..."
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            发布日期
          </label>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : '保存修改'}
          </button>
        </div>
      </form>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 dark:text-white">内容预览</h2>
        <div className="prose dark:prose-invert max-w-none">
          <h1>{title || '文章标题'}</h1>
          <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded">
            {content || '文章内容将在这里显示...'}
          </div>
        </div>
      </div>
    </div>
  )
}
