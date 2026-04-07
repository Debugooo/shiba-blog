'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">评论</h2>
      <Giscus
        repo="Debugooo/shiba-blog"
        repoId="R_kgDONj8vYg"
        category="Announcements"
        categoryId="DIC_kwDONj8vYs4Cl8PZ"
        mapping="pathname"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
