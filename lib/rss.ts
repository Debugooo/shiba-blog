import RSS from 'rss'
import { getAllPosts } from './posts'

export function generateRSS(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shiba-blog.vercel.app'

  const feed = new RSS({
    title: "Shiba's Blog",
    description: 'A Next.js blog with Markdown support',
    feed_url: `${siteUrl}/rss.xml`,
    site_url: siteUrl,
    language: 'zh-CN',
    pubDate: new Date(),
  })

  const posts = getAllPosts()

  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.date,
    })
  })

  return feed.xml({ indent: true })
}
