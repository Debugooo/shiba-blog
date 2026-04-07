import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts().slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          欢迎来到 Shiba&apos;s Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          一个基于 Next.js 构建的现代化博客系统
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/blog"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            查看所有文章
          </Link>
          <a
            href="/rss.xml"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors font-medium"
          >
            订阅 RSS
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Markdown 支持</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            使用 Markdown 轻松编写文章，支持代码高亮和富文本格式
          </p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl mb-3">🌙</div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">暗色模式</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            支持亮色/暗色主题切换，保护您的眼睛
          </p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl mb-3">📡</div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">RSS 订阅</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            通过 RSS 订阅，第一时间获取最新文章
          </p>
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">最新文章</h2>
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            查看全部 →
          </Link>
        </div>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{post.title}</h3>
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </time>
                <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无文章
          </div>
        )}
      </section>
    </div>
  )
}
