import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getPostBySlug } from '@/lib/posts'
import EditPostForm from '@/app/components/EditPostForm'

interface Props {
  params: { slug: string }
}

export default async function EditPostPage({ params }: Props) {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const post = getPostBySlug(params.slug)
  
  if (!post) {
    redirect('/admin/posts')
  }

  return <EditPostForm post={post} />
}
