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
  const thisMonthPosts = posts.filter(p => {
    const postDate = new Date(p.date)
    const now = new Date()
    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">仪表盘</h1>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mt-2">欢迎回来！这里是您的博客管理中心</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">总文章数</p>
              <p className="text-3xl font-bold text-light-text dark:text-dark-text">{posts.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 dark:bg-accent-primary/20 flex items-center justify-center text-accent-primary dark:text-accent-secondary text-2xl">
              📝
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">本月文章</p>
              <p className="text-3xl font-bold text-light-text dark:text-dark-text">{thisMonthPosts}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 text-2xl">
              📈
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-1">评论系统</p>
              <p className="text-xl font-bold text-light-text dark:text-dark-text">Giscus</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl">
              💬
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text">最近文章</h2>
          <Link
            href="/admin/posts/new"
            className="btn-primary inline-flex items-center text-sm px-4 py-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新建文章
          </Link>
        </div>
        
        {recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-light-textSecondary dark:text-dark-textSecondary mb-4">暂无文章，点击上方按钮创建第一篇吧！</p>
            <Link href="/admin/posts/new" className="text-accent-primary dark:text-accent-secondary font-medium">
              创建第一篇文章 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between p-4 bg-light-card dark:bg-dark-cardHover rounded-2xl hover:shadow-card dark:hover:shadow-card-dark transition-all"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-light-text dark:text-dark-text truncate">{post.title}</h3>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    href={`/admin/posts/${post.slug}`}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium text-accent-primary dark:text-accent-secondary hover:bg-accent-primary/10 dark:hover:bg-accent-primary/20 transition-all"
                  >
                    编辑
                  </Link>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-card dark:hover:bg-dark-card transition-all"
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
              className="text-accent-primary dark:text-accent-secondary text-sm font-medium inline-flex items-center"
            >
              查看全部文章
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex flex-col items-center justify-center p-4 bg-light-card dark:bg-dark-cardHover rounded-2xl hover:bg-accent-primary hover:text-white dark:hover:bg-accent-primary transition-all group"
          >
            <svg className="w-8 h-8 mb-2 text-accent-primary dark:text-accent-secondary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">新建文章</span>
          </Link>
          <Link
            href="/admin/posts"
            className="flex flex-col items-center justify-center p-4 bg-light-card dark:bg-dark-cardHover rounded-2xl hover:bg-accent-primary hover:text-white dark:hover:bg-accent-primary transition-all group"
          >
            <svg className="w-8 h-8 mb-2 text-accent-primary dark:text-accent-secondary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium">管理文章</span>
          </Link>
          <Link
            href="/admin/comments"
            className="flex flex-col items-center justify-center p-4 bg-light-card dark:bg-dark-cardHover rounded-2xl hover:bg-accent-primary hover:text-white dark:hover:bg-accent-primary transition-all group"
          >
            <svg className="w-8 h-8 mb-2 text-accent-primary dark:text-accent-secondary group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="text-sm font-medium">管理评论</span>
          </Link>
          <a
            href="https://github.com/Debugooo/shiba-blog/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 bg-light-card dark:bg-dark-cardHover rounded-2xl hover:bg-accent-primary hover:text-white dark:hover:bg-accent-primary transition-all group"
          >
            <svg className="w-8 h-8 mb-2 text-accent-primary dark:text-accent-secondary group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-sm font-medium">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  )
}
