import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content?: string
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'))
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const dateValue = data.date instanceof Date ? data.date.toISOString().split('T')[0] : (data.date || new Date().toISOString().split('T')[0])
  
  return {
    slug: realSlug,
    title: data.title || 'Untitled',
    date: dateValue,
    excerpt: data.excerpt || content.substring(0, 200),
    content,
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))

  return posts
}

export async function getPostHtml(slug: string): Promise<Post | null> {
  const post = getPostBySlug(slug)
  if (!post || !post.content) {
    return null
  }

  const processedContent = await remark()
    .use(html)
    .process(post.content)
  const contentHtml = processedContent.toString()

  return {
    ...post,
    content: contentHtml,
  }
}
