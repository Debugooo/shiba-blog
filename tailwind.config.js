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
        // 深色主题 - Inkwell 风格
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          cardHover: '#2A2A2A',
          border: '#2A2A2A',
          text: '#FFFFFF',
          textSecondary: 'rgba(255, 255, 255, 0.6)',
          textTertiary: 'rgba(255, 255, 255, 0.45)',
        },
        // 强调色 - 温暖的橙色/黄色
        accent: {
          primary: '#FF9500',
          secondary: '#FFB340',
          hover: '#E58600',
        },
        // 亮色主题 - 现代简约
        light: {
          bg: '#FFFFFF',
          card: '#F5F5F5',
          cardHover: '#E8E8E8',
          border: '#E0E0E0',
          text: '#000000',
          textSecondary: 'rgba(0, 0, 0, 0.6)',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'card-hover-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
