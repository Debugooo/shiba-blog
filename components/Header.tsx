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
            <span className="text-2xl font-bold text-light-text dark:text-dark-text group-hover:text-accent-primary dark:group-hover:text-accent-secondary transition-colors">
              Shiba&apos;s Blog
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link 
              href="/" 
              className="nav-link px-4 py-2 rounded-xl hover:bg-light-card dark:hover:bg-dark-card transition-all duration-300"
            >
              首页
            </Link>
            <Link 
              href="/blog" 
              className="nav-link px-4 py-2 rounded-xl hover:bg-light-card dark:hover:bg-dark-card transition-all duration-300"
            >
              博客
            </Link>
            <a 
              href="/rss.xml" 
              className="nav-link px-4 py-2 rounded-xl hover:bg-light-card dark:hover:bg-dark-card transition-all duration-300 flex items-center space-x-1"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              <span className="hidden sm:inline">RSS</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
