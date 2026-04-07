import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const posts = getAllPosts()
  const recentPosts = posts.slice(0, 5)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">总文章数</p>
              <p className="text-2xl font-bold dark:text-white">{posts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">本月文章</p>
              <p className="text-2xl font-bold dark:text-white">
                {posts.filter(p => {
                  const postDate = new Date(p.date)
                  const now = new Date()
                  return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">评论系统</p>
              <p className="text-2xl font-bold dark:text-white">Giscus</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最近文章 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold dark:text-white">最近文章</h2>
            <Link
              href="/admin/posts/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              新建文章
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentPosts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              暂无文章，点击上方按钮创建第一篇吧！
            </p>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(post.date).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                    >
                      编辑
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-gray-600 hover:text-gray-700 dark:text-gray-400 text-sm font-medium"
                    >
                      查看
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {posts.length > 5 && (
            <div className="mt-6 text-center">
              <Link
                href="/admin/posts"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
              >
                查看全部文章 →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium dark:text-white">新建文章</span>
          </Link>
          <Link
            href="/admin/posts"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium dark:text-white">管理文章</span>
          </Link>
          <Link
            href="/admin/comments"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="text-sm font-medium dark:text-white">管理评论</span>
          </Link>
          <a
            href="https://github.com/Debugooo/shiba-blog/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-600 dark:text-gray-400 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-sm font-medium dark:text-white">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  )
}
