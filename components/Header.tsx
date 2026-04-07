import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🐕</span>
            <span className="text-2xl font-bold text-light-text dark:text-dark-text group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
              Shiba&apos;s Blog
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link 
              href="/" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 text-sm sm:text-base"
            >
              首页
            </Link>
            <Link 
              href="/blog" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 text-sm sm:text-base"
            >
              博客
            </Link>
            <Link 
              href="/discover" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 flex items-center space-x-1 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>发现</span>
            </Link>
            <Link 
              href="/messages" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 flex items-center space-x-1 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="hidden sm:inline">私信</span>
            </Link>
            <Link 
              href="/skill.md" 
              className="nav-link px-3 sm:px-4 py-2 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-all duration-300 flex items-center space-x-1 text-sm sm:text-base"
              target="_blank"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="hidden sm:inline">API</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
