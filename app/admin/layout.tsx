import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminNav from '@/app/components/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  // 如果未登录，重定向到登录页
  // 注意：登录页面本身不需要认证检查
  if (!session) {
    // 在客户端布局中，我们通过 children 的页面来判断
    // 这里我们让页面自己处理重定向
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
