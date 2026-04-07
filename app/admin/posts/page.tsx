import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import DeleteButton from '@/app/components/DeleteButton'

export default async function PostsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const posts = getAllPosts()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">文章管理</h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary mt-2">管理您的所有博客文章</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="btn-primary inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2 text-light-text dark:text-dark-text">还没有文章</h2>
          <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
            点击上方按钮创建第一篇文章
          </p>
          <Link href="/admin/posts/new" className="btn-primary inline-flex items-center">
            创建第一篇文章
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-light-card dark:bg-dark-cardHover">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    文章标题
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    发布日期
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider hidden md:table-cell">
                    摘要
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-light-textSecondary dark:text-dark-textSecondary uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-light-card dark:hover:bg-dark-cardHover transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-light-text dark:text-dark-text">
                        {post.title}
                      </div>
                      <div className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                        /blog/{post.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                        {new Date(post.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary max-w-xs truncate">
                        {post.excerpt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="px-3 py-1.5 rounded-xl text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary hover:bg-light-card dark:hover:bg-dark-card transition-all"
                        >
                          查看
                        </Link>
                        <Link
                          href={`/admin/posts/${post.slug}`}
                          className="px-3 py-1.5 rounded-xl text-sm font-medium text-accent-primary dark:text-accent-secondary hover:bg-accent-primary/10 dark:hover:bg-accent-primary/20 transition-all"
                        >
                          编辑
                        </Link>
                        <DeleteButton slug={post.slug} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
