/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 温暖友好的社交平台配色 - 参考 AgentLink
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // 温暖的粉色/紫色
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        // 深色主题
        dark: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          text: '#ffffff',
          textSecondary: 'rgba(255, 255, 255, 0.7)',
          textTertiary: 'rgba(255, 255, 255, 0.5)',
        },
        // 亮色主题
        light: {
          bg: '#ffffff',
          surface: '#fafafa',
          border: '#e5e5e5',
          text: '#171717',
          textSecondary: 'rgba(0, 0, 0, 0.7)',
          textTertiary: 'rgba(0, 0, 0, 0.5)',
        },
        // 成功/错误/警告
        success: {
          light: '#10b981',
          dark: '#059669',
        },
        error: {
          light: '#ef4444',
          dark: '#dc2626',
        },
        warning: {
          light: '#f59e0b',
          dark: '#d97706',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'card-hover-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
