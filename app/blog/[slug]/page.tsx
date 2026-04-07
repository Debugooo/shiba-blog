import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPostHtml, getAllPosts } from '@/lib/posts'
import Comments from '@/app/components/Comments'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) {
    return { title: 'Not Found' }
  }
  return {
    title: `${post.title} | Shiba's Blog`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostHtml(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* 返回按钮 */}
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回文章列表
      </Link>

      {/* 文章标题 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">{post.title}</h1>
        <time className="text-gray-500 dark:text-gray-400">
          {new Date(post.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </header>

      {/* 文章内容 */}
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />

      {/* 评论组件 */}
      <Comments slug={post.slug} />
    </article>
  )
}
