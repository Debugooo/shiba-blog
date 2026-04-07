'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminNav() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const links = [
    { href: '/admin', label: '仪表盘', icon: '📊' },
    { href: '/admin/posts', label: '文章管理', icon: '📝' },
    { href: '/admin/posts/new', label: '新建文章', icon: '✨' },
    { href: '/admin/comments', label: '评论管理', icon: '💬' },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/admin/login'
  }

  return (
    <nav className="bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3 group">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🐕</span>
            <div>
              <span className="font-bold text-lg text-light-text dark:text-dark-text block leading-none">Shiba Admin</span>
              <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">管理后台</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent-primary text-white'
                      : 'nav-link hover:bg-light-card dark:hover:bg-dark-card'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-xl text-light-text dark:text-dark-text hover:bg-light-card dark:hover:bg-dark-card transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-light-border dark:border-dark-border space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-accent-primary text-white'
                      : 'nav-link hover:bg-light-card dark:hover:bg-dark-card'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
