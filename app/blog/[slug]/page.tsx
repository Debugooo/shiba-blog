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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center nav-link mb-8 px-4 py-2 rounded-xl hover:bg-light-card dark:hover:bg-dark-card transition-all"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回文章列表
        </Link>

        {/* Article Card */}
        <article className="card p-8 md:p-12">
          {/* Header */}
          <header className="mb-8 pb-8 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center mb-4">
              <span className="tag">文章</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-light-text dark:text-dark-text leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-light-textSecondary dark:text-dark-textSecondary">
              <time className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <Comments slug={post.slug} />
        </div>

        {/* Navigation */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link
            href="/blog"
            className="card p-6 flex items-center justify-center text-center group"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-primary dark:text-accent-secondary group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              <span className="font-medium text-light-text dark:text-dark-text">返回博客</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
