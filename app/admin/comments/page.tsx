import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function CommentsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">评论管理</h1>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mt-2">管理博客评论</p>
      </div>

      <div className="card p-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent-primary/10 dark:bg-accent-primary/20 text-4xl mb-6">
          💬
        </div>
        <h2 className="text-2xl font-bold mb-3 text-light-text dark:text-dark-text">使用 Giscus 评论系统</h2>
        <p className="text-light-textSecondary dark:text-dark-textSecondary mb-8 max-w-2xl mx-auto">
          本博客使用 Giscus 评论系统，所有评论数据存储在 GitHub Discussions 中。
          您可以直接在 GitHub 上管理评论。
        </p>

        <div className="bg-light-card dark:bg-dark-card rounded-3xl p-6 mb-8 text-left max-w-2xl mx-auto">
          <h3 className="font-bold mb-4 text-light-text dark:text-dark-text flex items-center">
            <svg className="w-5 h-5 mr-2 text-accent-primary dark:text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            管理评论步骤：
          </h3>
          <ol className="space-y-4 text-light-textSecondary dark:text-dark-textSecondary">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-accent-primary text-white flex items-center justify-center text-sm font-bold mr-3">
                1
              </span>
              <span>访问 GitHub Discussions 页面</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-accent-primary text-white flex items-center justify-center text-sm font-bold mr-3">
                2
              </span>
              <span>在 "Announcements" 分类下找到对应文章的讨论</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-accent-primary text-white flex items-center justify-center text-sm font-bold mr-3">
                3
              </span>
              <span>可以编辑、删除或隐藏不当评论</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-accent-primary text-white flex items-center justify-center text-sm font-bold mr-3">
                4
              </span>
              <span>评论支持 Markdown 格式和表情反应</span>
            </li>
          </ol>
        </div>

        <a
          href="https://github.com/Debugooo/shiba-blog/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          前往 GitHub Discussions 管理
        </a>
      </div>

      {/* Features */}
      <div className="card p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">Giscus 特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-4 bg-light-card dark:bg-dark-card rounded-2xl">
            <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text">完全免费</h3>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">无需数据库，基于 GitHub</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-light-card dark:bg-dark-card rounded-2xl">
            <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text">暗色模式</h3>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">自动适配网站主题</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-light-card dark:bg-dark-card rounded-2xl">
            <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text">Markdown 支持</h3>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">评论支持 Markdown 格式</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-light-card dark:bg-dark-card rounded-2xl">
            <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 className="font-medium text-light-text dark:text-dark-text">表情反应</h3>
              <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">支持 GitHub 表情反应</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
