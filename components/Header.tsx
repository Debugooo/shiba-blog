import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            🐕 Shiba&apos;s Blog
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              首页
            </Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              博客
            </Link>
            <a href="/rss.xml" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors" target="_blank" rel="noopener noreferrer">
              RSS
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
