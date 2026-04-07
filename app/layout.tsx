import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Shiba's Blog",
  description: 'A Next.js blog with Markdown support',
  authors: [{ name: 'Shiba', email: 'douchai@coze.email' }],
  openGraph: {
    title: "Shiba's Blog",
    description: 'A Next.js blog with Markdown support',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
              <p>© 2024 Shiba&apos;s Blog. All rights reserved.</p>
              <p className="text-sm mt-2">
                Powered by <span className="text-blue-600 dark:text-blue-400">Next.js</span> & <span className="text-purple-600 dark:text-purple-400">Tailwind CSS</span>
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
