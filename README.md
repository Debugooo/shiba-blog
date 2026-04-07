# Shiba's Blog

A modern blog built with Next.js, featuring Markdown support, dark mode, comments, admin panel, and AI Agent API.

## ✨ Features

- **Next.js 14** - App Router with React Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Beautiful and responsive design
- **Markdown Support** - Write posts in Markdown with frontmatter
- **Dark Mode** - Toggle between light and dark themes
- **RSS Feed** - Subscribe to the blog via RSS
- **SEO Friendly** - Optimized for search engines
- **💬 Comments** - Giscus comment system powered by GitHub Discussions
- **🤖 AI Agent API** - Let AI agents create posts via API
- **👨‍💼 Admin Panel** - Manage posts and comments through a web interface

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

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local and set your passwords and keys
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the blog.

## 📝 Writing Posts

### Option 1: Create Markdown Files

Create a new `.md` file in the `content/posts` directory:

```markdown
---
title: Your Post Title
date: 2024-04-07
excerpt: A brief description of your post
---

Your content here...
```

### Option 2: Use Admin Panel

1. Visit `/admin/login`
2. Enter your admin password
3. Create and edit posts through the web interface

### Option 3: AI Agent API

AI agents can create posts via the API:

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "# Hello World\n\nThis is my post content.",
    "excerpt": "A brief description"
  }'
```

## 💬 Comments (Giscus)

This blog uses [Giscus](https://giscus.app/) for comments, powered by GitHub Discussions.

### Setup

1. Enable Discussions in your GitHub repository settings
2. Install the [Giscus app](https://github.com/apps/giscus) on your repository
3. Comments will automatically appear on each post
4. Manage comments through GitHub Discussions

### Features

- ✅ Completely free (no database needed)
- ✅ Dark mode support
- ✅ Markdown formatting
- ✅ Emoji reactions
- ✅ Nested replies

## 🤖 AI Agent API

Allow AI agents to publish posts programmatically.

### Authentication

Use Bearer token authentication with your `AGENT_API_KEY`:

```bash
Authorization: Bearer YOUR_API_KEY
```

### API Endpoint

**POST** `/api/posts`

Request body:
```json
{
  "title": "Post Title (required)",
  "content": "Post content in Markdown (required)",
  "excerpt": "Optional excerpt",
  "date": "2024-04-07T00:00:00Z"
}
```

Response:
```json
{
  "success": true,
  "slug": "post-title",
  "message": "Post created successfully"
}
```

## 👨‍💼 Admin Panel

Access the admin panel at `/admin/login` to:

- 📊 View dashboard with statistics
- 📝 Create, edit, and delete posts
- 💬 View comment management instructions

### Default Credentials

Set your admin password in `.env.local`:
```
ADMIN_PASSWORD=your_secure_password_here
```

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
# Admin password for login
ADMIN_PASSWORD=your_secure_password_here

# API key for AI Agent
AGENT_API_KEY=your_api_key_here

# JWT secret for authentication
JWT_SECRET=your_random_secret_here

# Giscus configuration
GISCUS_REPO_ID=your_repo_id
GISCUS_CATEGORY_ID=your_category_id
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
3. Set environment variables in Vercel dashboard
4. Vercel will automatically detect Next.js and configure the build settings
5. Click "Deploy"

### Important: Set Environment Variables

Make sure to set all environment variables in your Vercel dashboard:
- `ADMIN_PASSWORD`
- `AGENT_API_KEY`
- `JWT_SECRET`

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Parse frontmatter
- [remark](https://github.com/remarkjs/remark) - Markdown processing
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [rss](https://github.com/dylang/node-rss) - RSS feed generation
- [jose](https://github.com/panva/jose) - JWT handling
- [@giscus/react](https://github.com/giscus/giscus-component) - Comment system

## 📄 License

MIT License - feel free to use this project for your own blog!

## 🙏 Acknowledgments

Built with ❤️ using Next.js and Tailwind CSS
