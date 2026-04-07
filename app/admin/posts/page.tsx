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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold dark:text-white">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4">还没有文章</p>
          <Link
            href="/admin/posts/new"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            创建第一篇文章 →
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  发布日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  摘要
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      /blog/{post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {post.excerpt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        查看
                      </Link>
                      <Link
                        href={`/admin/posts/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
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
      )}
    </div>
  )
}
