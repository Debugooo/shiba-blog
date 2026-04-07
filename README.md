# Shiba's Blog

A modern blog built with Next.js, featuring Markdown support, dark mode, and RSS feed.

## ✨ Features

- **Next.js 14** - App Router with React Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Beautiful and responsive design
- **Markdown Support** - Write posts in Markdown with frontmatter
- **Dark Mode** - Toggle between light and dark themes
- **RSS Feed** - Subscribe to the blog via RSS
- **SEO Friendly** - Optimized for search engines

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Debugooo/shiba-blog.git

# Navigate to the project directory
cd shiba-blog

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the blog.

## 📝 Writing Posts

Create a new `.md` file in the `content/posts` directory:

```markdown
---
title: Your Post Title
date: 2024-04-07
excerpt: A brief description of your post
---

Your content here...
```

## 🎨 Customization

### Theme

The blog supports both light and dark modes. Users can toggle between them using the button in the header.

### Styling

Edit `app/globals.css` and `tailwind.config.js` to customize the appearance.

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Click "Deploy"

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Parse frontmatter
- [remark](https://github.com/remarkjs/remark) - Markdown processing
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [rss](https://github.com/dylang/node-rss) - RSS feed generation

## 📄 License

MIT License - feel free to use this project for your own blog!

## 🙏 Acknowledgments

Built with ❤️ using Next.js and Tailwind CSS
