import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts().slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-light-bg to-light-card dark:from-dark-bg dark:to-dark-card py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="text-7xl md:text-8xl animate-bounce-slow">🐕</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-light-text dark:text-dark-text">
            欢迎来到{' '}
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Shiba&apos;s Blog
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-light-textSecondary dark:text-dark-textSecondary mb-10 max-w-3xl mx-auto">
            一个基于 Next.js 构建的现代化博客系统<br />
            记录技术、分享生活
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/blog" className="btn-primary inline-flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              查看所有文章
            </Link>
            <a href="/rss.xml" className="btn-secondary inline-flex items-center justify-center" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              订阅 RSS
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-light-card/50 dark:bg-dark-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-light-text dark:text-dark-text">
            特色功能
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 dark:bg-accent-primary/20 text-accent-primary dark:text-accent-secondary text-3xl mb-4">
                📝
              </div>
              <h3 className="text-xl font-semibold mb-3 text-light-text dark:text-dark-text">Markdown 支持</h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                使用 Markdown 轻松编写文章，支持代码高亮和富文本格式
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 dark:bg-accent-primary/20 text-accent-primary dark:text-accent-secondary text-3xl mb-4">
                🌙
              </div>
              <h3 className="text-xl font-semibold mb-3 text-light-text dark:text-dark-text">暗色模式</h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                支持亮色/暗色主题切换，保护您的眼睛
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-primary/10 dark:bg-accent-primary/20 text-accent-primary dark:text-accent-secondary text-3xl mb-4">
                💬
              </div>
              <h3 className="text-xl font-semibold mb-3 text-light-text dark:text-dark-text">评论系统</h3>
              <p className="text-light-textSecondary dark:text-dark-textSecondary">
                基于 GitHub Discussions 的评论系统，支持 Markdown
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">最新文章</h2>
            <Link href="/blog" className="nav-link inline-flex items-center text-lg">
              查看全部
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card group overflow-hidden"
                >
                  {/* Post Number Badge */}
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-primary text-white font-bold text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    {/* Gradient Header */}
                    <div className="h-32 bg-gradient-to-br from-accent-primary to-accent-secondary"></div>
                  </div>
                  
                  <div className="p-6">
                    <time className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-3 block">
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text group-hover:text-accent-primary dark:group-hover:text-accent-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-light-textSecondary dark:text-dark-textSecondary line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-accent-primary dark:text-accent-secondary font-medium">
                      <span>阅读文章</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary mb-6">
                还没有文章
              </p>
              <Link href="/admin/posts/new" className="btn-primary inline-flex items-center">
                创建第一篇文章
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-primary to-accent-secondary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            开始您的创作之旅
          </h2>
          <p className="text-xl mb-8 opacity-90">
            使用现代化工具，专注于内容创作
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/admin/login" className="bg-white text-accent-primary font-bold px-8 py-4 rounded-2xl hover:bg-opacity-90 transition-all inline-flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              进入管理后台
            </Link>
            <a href="https://github.com/Debugooo/shiba-blog" target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all inline-flex items-center justify-center border border-white/30">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-light-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto text-center text-light-textSecondary dark:text-dark-textSecondary">
          <p className="mb-2">
            Built with ❤️ using Next.js & Tailwind CSS
          </p>
          <p className="text-sm">
            © {new Date().getFullYear()} Shiba&apos;s Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
