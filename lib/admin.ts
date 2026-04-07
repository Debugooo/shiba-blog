import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostInput {
  title: string
  content: string
  excerpt?: string
  date?: string
}

export function createPost(input: PostInput): { success: boolean; slug: string; error?: string } {
  try {
    // 生成 slug
    const slug = input.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // 检查是否已存在
    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (fs.existsSync(filePath)) {
      return { success: false, slug: '', error: 'Post already exists' }
    }

    // 确保 content/posts 目录存在
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    // 准备 frontmatter
    const frontmatter = {
      title: input.title,
      date: input.date || new Date().toISOString(),
      excerpt: input.excerpt || input.content.substring(0, 150),
    }

    // 创建文件内容
    const fileContent = matter.stringify(input.content, frontmatter)

    // 写入文件
    fs.writeFileSync(filePath, fileContent, 'utf8')

    return { success: true, slug }
  } catch (error) {
    console.error('Create post error:', error)
    return { success: false, slug: '', error: 'Failed to create post' }
  }
}

export function updatePost(slug: string, input: Partial<PostInput>): { success: boolean; error?: string } {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Post not found' }
    }

    // 读取现有文件
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // 合并更新
    const updatedFrontmatter = {
      ...data,
      ...(input.title && { title: input.title }),
      ...(input.date && { date: input.date }),
      ...(input.excerpt && { excerpt: input.excerpt }),
    }

    // 如果标题改变，需要重命名文件
    let newSlug = slug
    if (input.title && input.title !== data.title) {
      newSlug = input.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      
      const newFilePath = path.join(postsDirectory, `${newSlug}.md`)
      if (fs.existsSync(newFilePath) && newSlug !== slug) {
        return { success: false, error: 'A post with this title already exists' }
      }
      
      // 删除旧文件
      fs.unlinkSync(filePath)
      // 更新文件路径
      const finalPath = newFilePath
      const fileContent = matter.stringify(input.content || content, updatedFrontmatter)
      fs.writeFileSync(finalPath, fileContent, 'utf8')
    } else {
      // 只更新内容
      const fileContent = matter.stringify(input.content || content, updatedFrontmatter)
      fs.writeFileSync(filePath, fileContent, 'utf8')
    }

    return { success: true }
  } catch (error) {
    console.error('Update post error:', error)
    return { success: false, error: 'Failed to update post' }
  }
}

export function deletePost(slug: string): { success: boolean; error?: string } {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Post not found' }
    }

    fs.unlinkSync(filePath)
    return { success: true }
  } catch (error) {
    console.error('Delete post error:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}
