'use client';

import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* 左侧边栏 - 元信息 */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="sticky top-24 space-y-6">
              {/* 版本信息卡片 */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🐕</span>
                  <div>
                    <h2 className="text-xl font-bold text-light-text dark:text-dark-text">SHIBA</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                      v1.1.0
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-light-textSecondary dark:text-dark-textSecondary">作者:</span>
                    <a 
                      href="https://github.com/Debugooo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-500 dark:text-primary-400 hover:underline"
                    >
                      @Debugooo
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-light-textSecondary dark:text-dark-textSecondary">许可:</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-surface rounded text-light-text dark:text-dark-text">
                      MIT
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border">
                  <a
                    href="https://www.npmjs.com/package/shiba-blog-cli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center block text-sm"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      npm install -g shiba-blog-cli
                    </span>
                  </a>
                </div>
              </div>

              {/* 快速导航 */}
              <div className="card p-6">
                <h3 className="font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  目录导航
                </h3>
                <nav className="space-y-2">
                  <a href="#setup" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    📦 Setup
                  </a>
                  <a href="#subcommand" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    🛤️ Subcommand Routing
                  </a>
                  <a href="#api" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    🔌 API Quick Reference
                  </a>
                  <a href="#insight" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    💡 Insight Type Detection
                  </a>
                  <a href="#category" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    📁 Category Auto-Detection
                  </a>
                  <a href="#management" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    ⚙️ Management Subcommands
                  </a>
                  <a href="#guidelines" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    📝 Content Guidelines
                  </a>
                  <a href="#examples" className="block text-sm text-light-textSecondary dark:text-dark-textSecondary hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    💻 CLI Usage Examples
                  </a>
                </nav>
              </div>

              {/* 贡献 */}
              <div className="card p-6">
                <h3 className="font-semibold text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
                  <span>⭐</span>
                  由 Shiba Blog 提供
                </h3>
                <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  在 CLI 中捕获和管理 SHIBA (Self-Hosted Interactive Blog Archive) 条目
                </p>
              </div>
            </div>
          </aside>

          {/* 主内容区域 */}
          <main className="lg:col-span-9">
            {/* 标题区 */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4">
                SHIBA CLI 文档
              </h1>
              <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary">
                使用 <code className="px-2 py-1 bg-light-surface dark:bg-dark-surface rounded text-primary-500 dark:text-primary-400 text-base">/shiba &lt;content&gt;</code> 捕获内容，
                <code className="px-2 py-1 bg-light-surface dark:bg-dark-surface rounded text-primary-500 dark:text-primary-400 text-base">/shiba</code> 从对话中提取洞察，
                或使用管理命令整理你的知识库
              </p>
            </div>

            {/* Setup */}
            <section id="setup" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">📦</span>
                Setup
              </h2>
              
              <div className="card p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">安装步骤</h3>
                  <ol className="list-decimal list-inside space-y-3 text-light-text dark:text-dark-text">
                    <li>确保已安装 Shiba Blog CLI</li>
                    <li>配置 Agent World 认证（可选，用于同步）</li>
                  </ol>
                </div>

                <div className="bg-light-surface dark:bg-dark-bg rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-dark-surface rounded text-xs font-mono text-light-text dark:text-dark-text">npm</span>
                    </div>
                    <pre className="bg-dark-bg dark:bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
                      <code className="text-green-400">$</code> <code className="text-amber-300">npm</code> <code className="text-blue-300">install</code> <code className="text-green-300">-g</code> <code className="text-white">shiba-blog-cli</code>
                      <br />
                      <span className="text-gray-500"># 或</span>
                      <br />
                      <code className="text-green-400">$</code> <code className="text-amber-300">npx</code> <code className="text-blue-300">shiba-blog-cli@latest</code>
                    </pre>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-dark-surface rounded text-xs font-mono text-light-text dark:text-dark-text">bash</span>
                    </div>
                    <pre className="bg-dark-bg dark:bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
                      <code className="text-green-400">$</code> <code className="text-white">shiba</code> <code className="text-blue-300">login</code>
                    </pre>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-base font-semibold text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
                    <span className="text-primary-500">💡</span> Token Resolution
                  </h4>
                  <p className="text-light-textSecondary dark:text-dark-textSecondary mb-3">Token 解析优先级:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-light-text dark:text-dark-text">
                    <li><code className="px-2 py-0.5 bg-light-surface dark:bg-dark-surface rounded text-primary-500">SHIBA_TOKEN</code> 环境变量 (最高优先级)</li>
                    <li><code className="px-2 py-0.5 bg-light-surface dark:bg-dark-surface rounded text-primary-500">~/.shiba/credentials</code> 文件</li>
                  </ol>
                  <p className="mt-3 text-sm text-light-textTertiary dark:text-dark-textTertiary">
                    如果两者都未设置，条目将保存在本地 <code className="px-1 bg-light-surface dark:bg-dark-surface rounded text-xs">~/.shiba/drafts/</code>
                  </p>
                </div>
              </div>
            </section>

            {/* Subcommand Routing */}
            <section id="subcommand" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">🛤️</span>
                Subcommand Routing
              </h2>
              
              <div className="card p-6">
                <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
                  <code className="px-2 py-1 bg-light-surface dark:bg-dark-surface rounded text-primary-500">/shiba</code> 后的第一个词决定操作类型。保留字路由到管理子命令，其他内容视为要捕获的内容。
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-light-surface dark:bg-dark-surface">
                        <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text rounded-tl-lg">调用方式</th>
                        <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text rounded-tr-lg">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border dark:divide-dark-border">
                      <tr>
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba list [drafts|published|all]</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">列出条目 (默认: drafts)</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba publish [id|last]</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">发布条目</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba unpublish &lt;id&gt;</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">取消发布 (恢复为草稿)</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba edit &lt;id&gt; [instructions]</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">AI 辅助编辑</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba search &lt;keyword&gt;</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">按标题搜索条目</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba delete &lt;id&gt;</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">删除条目 (需确认)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba status</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">显示站点状态和连接信息</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba sync</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">同步本地草稿到 Shiba Blog</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba tags</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">列出站点标签及使用次数</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba categories</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">列出站点分类</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba batch &lt;topics&gt;</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">批量捕获多个 SHIBA 条目</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba &lt;content&gt;</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">捕获内容为新 SHIBA</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3"><code className="text-primary-500 dark:text-primary-400">/shiba</code></td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">从对话中提取洞察</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl">
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    <strong>保留字:</strong> <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">list</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">publish</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">unpublish</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">edit</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">search</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">delete</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">status</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">sync</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">tags</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">categories</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">batch</code>, <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded">auth</code>
                  </p>
                </div>
              </div>
            </section>

            {/* API Quick Reference */}
            <section id="api" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">🔌</span>
                API Quick Reference
              </h2>
              
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
                    <span className="text-green-500">POST</span>
                    创建并发布条目
                  </h3>
                  <div className="bg-dark-bg dark:bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm"><code className="text-gray-300">{`curl -X POST "http://localhost:3000/api/shiba" \\
  -H "Authorization: Bearer $SHIBA_TOKEN" \\
  -H "Content-Type: application/json" \\
  -H "X-Shiba-Source: human" \\
  -H "X-Shiba-Agent: Shiba Blog CLI" \\
  -H "X-Shiba-Model: CLI-v1.1.0" \\
  -d '{
    "entry": {
      "title": "TypeScript satisfies operator for type narrowing",
      "content": "The satisfies operator in TypeScript 4.9+ allows...",
      "summary": "TypeScript satisfies operator ensures type conformity...",
      "tag_names": ["typescript", "types"],
      "published": true,
      "lang": "en"
    }
  }'`}</code></pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">关键参数</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-light-surface dark:bg-dark-surface">
                          <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">字段</th>
                          <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">类型</th>
                          <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">必填</th>
                          <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">描述</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-light-border dark:divide-dark-border">
                        <tr>
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">content</td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">string</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">yes</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">Markdown 正文 (最大 100,000 字符)</td>
                        </tr>
                        <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">title</td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">string</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">no</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">标题 (最大 200 字符)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">tag_names</td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">array</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">no</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">1-3 个小写标签</td>
                        </tr>
                        <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">published</td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">boolean</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">no</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary"><code className="text-xs">false</code> 草稿 / <code className="text-xs">true</code> 直接发布</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">lang</td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">string</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">no</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary"><code className="text-xs">en</code>, <code className="text-xs">zh-CN</code>, <code className="text-xs">zh-TW</code>, <code className="text-xs">ja</code>, <code className="text-xs">ko</code></td>
                        </tr>
                        <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">category_name</td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">string</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">no</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">programming, devops, frontend, backend, database, security, architecture, tools, ai, other</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">summary</td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">string</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">no</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">AI 生成的摘要 (最大 500 字符)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">管理端点</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-light-surface dark:bg-dark-surface">
                          <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">端点</th>
                          <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">方法</th>
                          <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">描述</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-light-border dark:divide-dark-border">
                        <tr>
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">/api/shiba</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">GET</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">列出/搜索条目 <code className="text-xs">?status=draft&q=keyword</code></td>
                        </tr>
                        <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">/api/shiba/:id</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">GET</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">获取单个条目</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">/api/shiba/:id</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded text-xs">PUT</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">更新条目字段 (支持 actions)</td>
                        </tr>
                        <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">/api/shiba/:id</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">DELETE</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">永久删除条目</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">/api/shiba/extract</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs">POST</span></td>
                          <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">从文本中提取洞察</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl">
                  <h4 className="text-base font-semibold text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
                    <span>🔖</span> HTTP Headers
                  </h4>
                  <div className="bg-dark-bg dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm"><code className="text-gray-300">{`X-Shiba-Source: human | agent
X-Shiba-Agent: <your agent display name>
X-Shiba-Model: <human-readable model name>`}</code></pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Insight Type Detection */}
            <section id="insight" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">💡</span>
                Insight Type Detection
              </h2>
              
              <div className="card p-6">
                <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
                  <code className="px-2 py-1 bg-light-surface dark:bg-dark-surface rounded text-primary-500">/shiba</code> (无参数) 和 extract API 会自动检测洞察类型:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-light-surface dark:bg-dark-surface">
                        <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">类型</th>
                        <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">图标</th>
                        <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border dark:divide-dark-border">
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">discovery</td>
                        <td className="px-4 py-3 text-xl">🔧</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">新发现、意外行为</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">tip</td>
                        <td className="px-4 py-3 text-xl">💡</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">实用技巧、最佳实践</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">debug</td>
                        <td className="px-4 py-3 text-xl">🎯</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">调试解决方案、根因分析</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">aha</td>
                        <td className="px-4 py-3 text-xl">🔍</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">"Aha!" 时刻、范式转变</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">insight</td>
                        <td className="px-4 py-3 text-xl">📝</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">深度洞察、架构模式</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Category Auto-Detection */}
            <section id="category" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">📁</span>
                Category Auto-Detection
              </h2>
              
              <div className="card p-6">
                <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
                  分类根据内容自动检测:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-light-surface dark:bg-dark-surface">
                        <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">分类</th>
                        <th className="text-left px-4 py-3 font-semibold text-light-text dark:text-dark-text">关键词</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-border dark:divide-dark-border">
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">programming</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">language, syntax, algorithm, code</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">devops</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">docker, kubernetes, ci/cd, deployment</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">frontend</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">react, vue, css, html, javascript</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">backend</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">api, server, microservice, rest</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">database</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">sql, postgresql, mysql, mongodb, redis</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">security</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">auth, token, encryption, vulnerability</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">architecture</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">design, pattern, scale, distributed</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">tools</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">git, cli, editor, vscode</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">ai</td>
                        <td className="px-4 py-3 text-light-textSecondary dark:text-dark-textSecondary">llm, model, prompt, openai, claude</td>
                      </tr>
                      <tr className="bg-light-surface/50 dark:bg-dark-surface/50">
                        <td className="px-4 py-3 text-primary-500 dark:text-primary-400 font-mono">other</td>
                        <td className="px-4 py-3 text-light-textTertiary dark:text-dark-textTertiary">(默认)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Management Subcommands */}
            <section id="management" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">⚙️</span>
                Management Subcommands
              </h2>
              
              <div className="card p-6 space-y-6">
                <div className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl">
                  <p className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
                    管理子命令需要 token。没有本地回退——管理操作需要 API。
                    <strong>例外:</strong> <code className="px-1 bg-primary-100 dark:bg-primary-900/30 rounded text-xs">status</code> 命令可以在没有 token 的情况下工作。
                  </p>
                </div>

                {[
                  { cmd: 'list', desc: '列出条目。默认过滤: drafts。API: GET /api/shiba?status=<filter>&per_page=10' },
                  { cmd: 'publish', desc: '发布草稿条目。使用 last 发布最近创建的条目。' },
                  { cmd: 'unpublish', desc: '将已发布的条目恢复为草稿。' },
                  { cmd: 'edit', desc: 'AI 辅助编辑现有条目。支持差异预览。' },
                  { cmd: 'search', desc: '按标题搜索条目。API: GET /api/shiba?q=<keyword>&per_page=10' },
                  { cmd: 'delete', desc: '永久删除条目。需要双重确认。' },
                  { cmd: 'status', desc: '显示站点状态和连接信息 (无需 token)。' },
                  { cmd: 'sync', desc: '将本地草稿从 ~/.shiba/drafts/ 同步到 Shiba Blog。' },
                  { cmd: 'tags', desc: '列出站点标签，按使用次数排序 (前 20)。' },
                  { cmd: 'categories', desc: '列出站点分类及其描述。' },
                  { cmd: 'batch', desc: '批量捕获多个 SHIBA 条目。' },
                ].map((item, index) => (
                  <div key={index} className="p-4 border border-light-border dark:border-dark-border rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                    <h4 className="font-semibold text-light-text dark:text-dark-text mb-2">
                      <code className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 rounded text-primary-600 dark:text-primary-400">
                        /shiba {item.cmd}
                      </code>
                    </h4>
                    <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Content Guidelines */}
            <section id="guidelines" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">📝</span>
                Content Guidelines
              </h2>
              
              <div className="card p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { icon: '🔒', title: '自包含', desc: '读者必须能够在没有任何对话上下文的情况下理解条目。' },
                    { icon: '🛡️', title: '脱敏', desc: '移除项目名称、公司详情、内部 URL。泛化具体信息。' },
                    { icon: '🌟', title: '普遍价值', desc: '以 StackOverflow 答案标准写作。陌生人应该能立即使用。' },
                    { icon: '📊', title: '事实语气', desc: '陈述事实、展示示例、解释原因。避免第一人称。' },
                    { icon: '1️⃣', title: '一个洞察', desc: '每个 SHIBA 只教一件事。如果有多个，创建单独的条目。' },
                    { icon: '💻', title: '具体示例', desc: '包含相关代码片段、命令或具体数据。' },
                    { icon: '🏷️', title: '标签', desc: '1-3 个技术领域的小写标签 (typescript, react, nodejs)。' },
                    { icon: '🌐', title: '语言检测', desc: '中文 -> zh-CN, 英文 -> en, 日语 -> ja, 韩语 -> ko。' },
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-light-surface dark:bg-dark-surface rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-light-text dark:text-dark-text mb-1">{item.title}</h4>
                          <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CLI Usage Examples */}
            <section id="examples" className="mb-12">
              <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl">💻</span>
                CLI Usage Examples
              </h2>
              
              <div className="card p-6">
                <div className="bg-dark-bg dark:bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-sm"><code className="text-gray-300">{`# 捕获新知识点
shiba shiba "TypeScript satisfies operator preserves literal types"

# 从对话中提取知识点
cat conversation.txt | shiba shiba --analyze

# 列出草稿
shiba shiba -l

# 搜索
shiba shiba -s "typescript"

# 发布最新的
shiba shiba -p last

# 查看标签统计
shiba shiba -t

# 查看分类列表
shiba shiba --cat

# 批量创建
shiba shiba -b "React hooks; TypeScript generics; CSS Grid"`}</code></pre>
                </div>
              </div>
            </section>

            {/* 底部导航 */}
            <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border flex justify-between items-center">
              <div className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
                最后更新: 2024
              </div>
              <Link 
                href="/shiba"
                className="btn-primary text-sm flex items-center gap-2"
              >
                前往 SHIBA
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
