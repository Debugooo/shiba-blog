import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-light-text dark:text-dark-text">
            博客文章
          </h1>
          <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary">
            探索技术、分享思考、记录成长
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group overflow-hidden"
              >
                {/* Gradient Header with Number */}
                <div className="relative">
                  <div className="h-32 bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary bg-gradient-to-r"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 dark:bg-dark-card/90 text-accent-primary font-bold text-xl shadow-lg">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <time className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 text-light-text dark:text-dark-text group-hover:text-accent-primary dark:group-hover:text-accent-secondary transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-light-textSecondary dark:text-dark-textSecondary mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-accent-primary dark:text-accent-secondary font-medium inline-flex items-center">
                      阅读全文
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <span className="tag">文章</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2 text-light-text dark:text-dark-text">还没有文章</h2>
            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
              文章将在这里显示
            </p>
            <Link href="/admin/posts/new" className="btn-primary inline-flex items-center">
              创建第一篇文章
            </Link>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link href="/" className="btn-secondary inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
