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
          className="text-red-600 hover:text-red-700 dark:text-red-400 disabled:opacity-50"
        >
          {deleting ? '删除中...' : '确认'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={deleting}
          className="text-gray-600 hover:text-gray-700 dark:text-gray-400 disabled:opacity-50"
        >
          取消
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 dark:text-red-400"
    >
      删除
    </button>
  )
}
