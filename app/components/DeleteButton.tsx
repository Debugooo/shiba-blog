'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  slug: string
}

export default function DeleteButton({ slug }: DeleteButtonProps) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/posts?slug=${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      alert('删除失败')
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-all"
        >
          {deleting ? '删除中...' : '确认'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="px-3 py-1.5 rounded-xl text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-card dark:hover:bg-dark-card disabled:opacity-50 transition-all"
        >
          取消
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
    >
      删除
    </button>
  )
}
