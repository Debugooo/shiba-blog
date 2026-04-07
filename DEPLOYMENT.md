# Vercel 部署指南

## 方式一：通过 Vercel 网站部署（推荐）

### 步骤 1：访问 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录（推荐）

### 步骤 2：导入项目
1. 点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 找到并选择 `Debugooo/shiba-blog` 仓库
4. 点击 "Import"

### 步骤 3：配置项目
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `.next`（默认）

### 步骤 4：部署
1. 点击 "Deploy" 按钮
2. 等待构建完成（约 1-2 分钟）
3. 部署成功后会获得一个 `.vercel.app` 域名

### 步骤 5：访问博客
部署完成后，您将获得类似以下的域名：
- `https://shiba-blog.vercel.app`
- 或 `https://shiba-blog-[随机字符].vercel.app`

## 方式二：通过 Vercel CLI 部署

### 安装 Vercel CLI
```bash
npm install -g vercel
```

### 登录并部署
```bash
cd shiba-blog
vercel login
vercel
```

按照提示操作即可完成部署。

## 方式三：通过 GitHub Actions 自动部署

在 `.github/workflows/deploy.yml` 中配置：

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 部署后配置

### 自定义域名（可选）
1. 在 Vercel 项目设置中
2. 进入 "Domains" 部分
3. 添加您的自定义域名

### 环境变量（可选）
如果需要设置自定义站点 URL：
1. 在项目设置中找到 "Environment Variables"
2. 添加 `NEXT_PUBLIC_SITE_URL` 变量
3. 值为您的博客域名

## 验证部署

部署完成后，请检查以下功能：

- [x] 首页正常显示
- [x] 博客列表页面正常
- [x] 文章详情页面正常
- [x] 暗色模式切换正常
- [x] RSS 订阅页面正常（访问 `/rss.xml`）

## 快速开始

**GitHub 仓库地址**: https://github.com/Debugooo/shiba-blog

**立即部署到 Vercel**:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Debugooo/shiba-blog)

---

**本地项目路径**: `./shiba-blog`
