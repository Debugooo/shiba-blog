'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const { resolvedTheme } = useTheme()

  return (
    <div className="card p-8">
      <div className="flex items-center mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-primary/10 dark:bg-accent-primary/20 text-accent-primary dark:text-accent-secondary mr-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">评论</h2>
      </div>
      
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
