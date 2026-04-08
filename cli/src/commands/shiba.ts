import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.shiba-blog');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

interface Config {
  apiKey?: string;
  username?: string;
  baseUrl?: string;
}

interface SHIBAEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  created_at: string;
  shortId?: string;
  source?: 'human' | 'agent';
}

// SHIBA HTTP Headers
const SHIBA_HEADERS = {
  'X-Shiba-Source': 'agent',
  'X-Shiba-Agent': 'Shiba Blog CLI',
  'X-Shiba-Model': 'CLI-v1.1.0',
};

function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch (e) {
    // ignore
  }
  return {};
}

function getBaseUrl(config: Config): string {
  return config.baseUrl || process.env.SHIBA_BLOG_URL || 'http://localhost:3000';
}

/**
 * 从完整ID提取短ID显示
 */
function toShortId(id: string): string {
  const parts = id.split('_');
  if (parts.length > 1) {
    return `...${parts[parts.length - 1].slice(-8)}`;
  }
  return `...${id.slice(-8)}`;
}

/**
 * 格式化日期
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN');
}

/**
 * 显示条目详情
 */
function displayEntry(entry: SHIBAEntry, index: number, showFull: boolean = false): void {
  const statusIcon = entry.status === 'published' ? '📖' : '📝';
  const shortId = toShortId(entry.id);
  
  console.log(`${index}. ${chalk.bold(statusIcon)} ${entry.title} ${chalk.gray(`[${shortId}]`)}`);
  console.log(`   ${chalk.cyan('#' + entry.tags.join(' #')) || chalk.gray('无标签')}`);
  console.log(`   👁 ${entry.views}  ❤️ ${entry.likes}  ${formatDate(entry.created_at)}`);
  
  if (showFull) {
    console.log(`   ${entry.content.substring(0, 150)}${entry.content.length > 150 ? '...' : ''}`);
  }
  console.log('');
}

export async function shibaCommand(options: {
  content?: string;
  list?: string | boolean;
  search?: string;
  tags?: boolean;
  categories?: boolean;
  publish?: string;
  unpublish?: string;
  edit?: string;
  delete?: string;
  batch?: string;
  sync?: boolean;
  status?: boolean;
  extract?: boolean;
  analyze?: boolean;
}) {
  const config = loadConfig();
  const baseUrl = getBaseUrl(config);

  if (!config.apiKey) {
    console.log(chalk.red('❌ 请先登录: shiba login'));
    console.log(chalk.gray('或设置环境变量: SHIBA_BLOG_API_KEY'));
    process.exit(1);
  }

  const headers = {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
    ...SHIBA_HEADERS,
  };

  try {
    // /shiba - 快速创建
    if (options.content) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: '标题:',
          default: options.content.substring(0, 50),
        },
        {
          type: 'input',
          name: 'tags',
          message: '标签 (逗号分隔):',
        },
      ]);

      const response = await axios.post(
        `${baseUrl}/api/shiba`,
        {
          title: answers.title,
          content: options.content,
          tags: answers.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          status: 'draft',
        },
        { headers }
      );

      if (response.data.success) {
        const entry = response.data.data.entry;
        console.log(chalk.green('✅ SHIBA 创建成功！'));
        console.log(chalk.gray(`ID: ${toShortId(entry.id)}`));
        console.log(chalk.cyan(`${baseUrl}/shiba/${entry.id}`));
      }
      return;
    }

    // /shiba list [drafts|published|all]
    if (options.list !== undefined) {
      let status: string | undefined;
      
      if (options.list === 'drafts' || options.list === 'draft') {
        status = 'draft';
      } else if (options.list === 'published' || options.list === 'published') {
        status = 'published';
      }
      
      const url = status 
        ? `${baseUrl}/api/shiba?status=${status}&limit=50`
        : `${baseUrl}/api/shiba?limit=100`;
        
      const response = await axios.get(url, { headers });
      
      if (response.data.success) {
        const entries: SHIBAEntry[] = response.data.data.entries || [];
        
        if (entries.length === 0) {
          const statusText = status ? ` (${status === 'draft' ? '草稿' : '已发布'})` : '';
          console.log(chalk.yellow(`📝 暂无SHIBA条目${statusText}`));
        } else {
          const statusText = status 
            ? (status === 'draft' ? '草稿' : '已发布') 
            : '全部';
          const drafts = entries.filter(e => e.status === 'draft').length;
          const published = entries.filter(e => e.status === 'published').length;
          
          console.log(chalk.bold(`\n🐕 SHIBA 列表 - ${statusText}\n`));
          console.log(chalk.gray(`总计: ${entries.length} 条 | 草稿: ${drafts} | 已发布: ${published}`));
          console.log(chalk.gray('─'.repeat(50)));
          
          entries.forEach((entry, index) => {
            displayEntry(entry, index + 1);
          });
        }
      }
      return;
    }

    // /shiba status
    if (options.status) {
      const response = await axios.get(`${baseUrl}/api/shiba?stats=true`, { headers });
      
      if (response.data.success) {
        const stats = response.data.data.stats;
        
        console.log(chalk.bold('\n📊 SHIBA 状态统计\n'));
        console.log(`  ${chalk.cyan('总条目:')} ${chalk.bold(stats.total)}`);
        console.log(`  ${chalk.yellow('草稿:')}   ${stats.drafts}`);
        console.log(`  ${chalk.green('已发布:')} ${stats.published}`);
        console.log('');
        console.log(`  ${chalk.cyan('总浏览:')} ${stats.totalViews}`);
        console.log(`  ${chalk.red('总点赞:')} ${stats.totalLikes}`);
        console.log(`  ${chalk.gray('标签:')}   ${stats.tagsCount} 个`);
        console.log(`  ${chalk.gray('分类:')}   ${stats.categoriesCount} 个`);
        console.log('');
      }
      return;
    }

    // /shiba search
    if (options.search) {
      const response = await axios.get(
        `${baseUrl}/api/shiba?search=${encodeURIComponent(options.search)}`,
        { headers }
      );
      
      if (response.data.success) {
        const entries: SHIBAEntry[] = response.data.data.entries || [];
        
        console.log(chalk.bold(`\n🔍 搜索 "${options.search}" 的结果:\n`));
        
        if (entries.length === 0) {
          console.log(chalk.yellow('未找到相关SHIBA'));
        } else {
          console.log(chalk.gray(`找到 ${entries.length} 条结果\n`));
          entries.forEach((entry, index) => {
            displayEntry(entry, index + 1, true);
          });
        }
      }
      return;
    }

    // /shiba tags
    if (options.tags) {
      const response = await axios.get(`${baseUrl}/api/shiba?tags=true`, { headers });
      
      if (response.data.success) {
        const tags = response.data.data.tags || [];
        
        console.log(chalk.bold('\n🏷️  SHIBA 标签分类:\n'));
        
        if (tags.length === 0) {
          console.log(chalk.yellow('暂无标签'));
        } else {
          tags.slice(0, 20).forEach(({ tag, count }: { tag: string; count: number }) => {
            console.log(`  ${chalk.cyan('#' + tag)} ${chalk.gray(`(${count})`)}`);
          });
        }
        console.log('');
      }
      return;
    }

    // /shiba categories
    if (options.categories) {
      const response = await axios.get(`${baseUrl}/api/shiba?categories=true`, { headers });
      
      if (response.data.success) {
        const categories = response.data.data.categories || [];
        
        console.log(chalk.bold('\n📂 SHIBA 分类列表:\n'));
        
        if (categories.length === 0) {
          console.log(chalk.yellow('暂无分类'));
        } else {
          console.log(chalk.gray('─'.repeat(60)));
          categories.forEach(({ category, count, description }: { 
            category: string; 
            count: number;
            description?: string;
          }) => {
            console.log(`  ${chalk.green('●')} ${chalk.bold(category)} ${chalk.gray(`[${count}条]`)}`);
            if (description) {
              console.log(`    ${chalk.gray(description)}`);
            }
          });
          console.log(chalk.gray('─'.repeat(60)));
          console.log(chalk.gray(`共 ${categories.length} 个分类`));
        }
        console.log('');
      }
      return;
    }

    // /shiba publish [id | last]
    if (options.publish !== undefined) {
      const response = await axios.put(
        `${baseUrl}/api/shiba`,
        { 
          id: options.publish,
          action: 'publish' 
        },
        { headers }
      );

      if (response.data.success) {
        console.log(chalk.green('✅ 已发布为博客文章！'));
        if (response.data.data.id) {
          console.log(chalk.gray(`ID: ${response.data.data.shortId}`));
        }
      } else {
        console.log(chalk.red('❌ 发布失败:'), response.data.message);
      }
      return;
    }

    // /shiba unpublish <id>
    if (options.unpublish !== undefined) {
      const response = await axios.put(
        `${baseUrl}/api/shiba`,
        { 
          id: options.unpublish,
          action: 'unpublish' 
        },
        { headers }
      );

      if (response.data.success) {
        console.log(chalk.green('✅ 已取消发布！'));
        console.log(chalk.gray(`ID: ${response.data.data?.shortId || options.unpublish}`));
      } else {
        console.log(chalk.red('❌ 操作失败:'), response.data.message);
      }
      return;
    }

    // /shiba edit <id> [instructions]
    if (options.edit !== undefined) {
      const parts = options.edit.split(/\s+/);
      const id = parts[0];
      const instructions = parts.slice(1).join(' ');
      
      if (!instructions) {
        // 显示当前条目信息
        const viewResponse = await axios.put(
          `${baseUrl}/api/shiba`,
          { id, action: 'view' },
          { headers }
        );
        
        if (viewResponse.data.success) {
          const entry = viewResponse.data.data.entry;
          console.log(chalk.bold(`\n📝 SHIBA 条目信息:\n`));
          console.log(`  ${chalk.cyan('ID:')}     ${toShortId(entry.id)}`);
          console.log(`  ${chalk.cyan('标题:')}   ${entry.title}`);
          console.log(`  ${chalk.cyan('标签:')}   ${entry.tags.join(', ') || '无'}`);
          console.log(`  ${chalk.cyan('状态:')}   ${entry.status === 'published' ? '已发布' : '草稿'}`);
          console.log(`  ${chalk.cyan('浏览:')}   ${entry.views}`);
          console.log(`  ${chalk.cyan('点赞:')}   ${entry.likes}`);
          console.log('');
          console.log(chalk.gray('内容预览:'));
          console.log(`  ${entry.content.substring(0, 200)}...`);
          console.log('');
          console.log(chalk.yellow('请提供编辑指令，如:'));
          console.log(chalk.gray('  shiba shiba --edit <id> 标题: 新标题'));
          console.log(chalk.gray('  shiba shiba --edit <id> 标签: tag1, tag2'));
        }
        return;
      }
      
      const response = await axios.put(
        `${baseUrl}/api/shiba`,
        { 
          id,
          action: 'edit',
          instructions 
        },
        { headers }
      );

      if (response.data.success) {
        console.log(chalk.green('✅ 编辑成功！'));
        if (response.data.data.changes) {
          console.log(chalk.gray('修改内容:'));
          Object.entries(response.data.data.changes).forEach(([key, value]) => {
            console.log(`  ${key}: ${JSON.stringify(value)}`);
          });
        }
      } else {
        console.log(chalk.red('❌ 编辑失败:'), response.data.message);
      }
      return;
    }

    // /shiba delete <id>
    if (options.delete !== undefined) {
      const id = options.delete;
      
      // 确认删除
      const { confirmed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: `确定要删除 SHIBA 条目 ${id === 'last' ? '(最近创建)' : id} 吗？`,
          default: false,
        },
      ]);
      
      if (!confirmed) {
        console.log(chalk.yellow('已取消删除'));
        return;
      }
      
      const response = await axios.delete(`${baseUrl}/api/shiba?id=${id}`, { headers });

      if (response.data.success) {
        console.log(chalk.green('✅ 删除成功！'));
      } else {
        console.log(chalk.red('❌ 删除失败:'), response.data.message);
      }
      return;
    }

    // /shiba batch <topics>
    if (options.batch !== undefined) {
      const topics = options.batch.split(',').map(t => t.trim()).filter(Boolean);
      
      if (topics.length === 0) {
        console.log(chalk.red('❌ 请提供至少一个主题'));
        return;
      }
      
      console.log(chalk.bold(`\n📦 批量创建 ${topics.length} 个 SHIBA 条目\n`));
      
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseContent',
          message: '基础内容模板 (使用 {topic} 占位):',
          default: '关于 {topic} 的知识点整理',
        },
        {
          type: 'input',
          name: 'tags',
          message: '标签 (逗号分隔):',
        },
      ]);
      
      let created = 0;
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        const content = answers.baseContent.replace('{topic}', topic);
        
        process.stdout.write(`创建 "${topic}"... `);
        
        try {
          const response = await axios.post(
            `${baseUrl}/api/shiba`,
            {
              title: topic,
              content,
              tags: answers.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
              status: 'draft',
            },
            { headers }
          );
          
          if (response.data.success) {
            created++;
            console.log(chalk.green('✓'));
          } else {
            console.log(chalk.red('✗'));
          }
        } catch (e) {
          console.log(chalk.red('✗'));
        }
      }
      
      console.log(chalk.green(`\n✅ 批量创建完成: ${created}/${topics.length} 成功`));
      return;
    }

    // /shiba sync
    if (options.sync) {
      console.log(chalk.bold('\n🔄 同步本地文件...\n'));
      
      const syncDir = path.join(CONFIG_DIR, 'shiba');
      if (!fs.existsSync(syncDir)) {
        fs.mkdirSync(syncDir, { recursive: true });
      }
      
      // 获取所有条目
      const response = await axios.get(`${baseUrl}/api/shiba?limit=100`, { headers });
      
      if (response.data.success) {
        const entries: SHIBAEntry[] = response.data.data.entries || [];
        let synced = 0;
        
        for (const entry of entries) {
          const fileName = `${toShortId(entry.id).replace(/[^a-zA-Z0-9]/g, '_')}.md`;
          const filePath = path.join(syncDir, fileName);
          
          const content = [
            `---`,
            `id: ${entry.id}`,
            `title: ${entry.title}`,
            `tags: ${entry.tags.join(', ')}`,
            `status: ${entry.status}`,
            `created_at: ${entry.created_at}`,
            `---`,
            '',
            entry.content,
          ].join('\n');
          
          fs.writeFileSync(filePath, content);
          synced++;
        }
        
        console.log(chalk.green(`✅ 已同步 ${synced} 个条目到 ${syncDir}`));
      }
      return;
    }

    // /shiba extract - 从stdin提取
    if (options.extract) {
      const stdinChunks: Buffer[] = [];
      for await (const chunk of process.stdin) {
        stdinChunks.push(chunk);
      }
      const content = Buffer.concat(stdinChunks).toString('utf-8');

      if (!content.trim()) {
        console.log(chalk.yellow('⚠️  请通过管道传入对话内容'));
        console.log(chalk.gray('例如: cat conversation.txt | shiba shiba --extract'));
        return;
      }

      const response = await axios.post(
        `${baseUrl}/api/shiba/extract`,
        { content, max_candidates: 5 },
        { headers }
      );

      if (response.data.success) {
        const candidates = response.data.data.candidates || [];
        
        console.log(chalk.bold(`\n✨ 发现 ${candidates.length} 个SHIBA候选:\n`));
        
        if (candidates.length === 0) {
          console.log(chalk.yellow('未能从内容中提取到知识点'));
        } else {
          for (let i = 0; i < candidates.length; i++) {
            const c = candidates[i];
            console.log(`${i + 1}. ${chalk.bold(c.title)}`);
            console.log(`   ${chalk.gray(c.content.substring(0, 80).concat('...'))}`);
            console.log(`   标签: ${c.tags.join(', ') || '无'}`);
            console.log(`   置信度: ${(c.confidence * 100).toFixed(0)}%`);
            console.log('');
          }
        }
      }
      return;
    }

    // /shiba analyze - 无参数自动分析
    if (options.analyze || (!options.content && !options.list && !options.search && 
        !options.tags && !options.categories && !options.publish && !options.unpublish && 
        !options.edit && !options.delete && !options.batch && !options.sync && 
        !options.status && !options.extract)) {
      
      // 如果没有任何参数，检查 stdin 是否有内容
      const stdinChunks: Buffer[] = [];
      if (!process.stdin.isTTY) {
        for await (const chunk of process.stdin) {
          stdinChunks.push(chunk);
        }
      }
      
      const content = Buffer.concat(stdinChunks).toString('utf-8').trim();
      
      if (!content) {
        // 无内容时显示帮助并提示
        console.log(chalk.bold(`
🐕 SHIBA - Shiba Instant Blog Article

用法:
  shiba shiba -c "<content>"              快速创建SHIBA
  shiba shiba -l [drafts|published|all]   列出SHIBA (默认: 全部)
  shiba shiba -s "<keyword>"              搜索SHIBA
  shiba shiba -t                           查看标签统计
  shiba shiba --cat                        查看分类列表
  shiba shiba --analyze                    自动分析对话提取SHIBA
  shiba shiba -p <id|last>                发布SHIBA (支持last关键字)
  shiba shiba --unpublish <id>            取消发布
  shiba shiba --edit <id> [instructions]  编辑/查看SHIBA
  shiba shiba --delete <id>               删除SHIBA (需确认)
  shiba shiba --batch <topics>            批量创建 (逗号分隔主题)
  shiba shiba --sync                      同步到本地文件
  shiba shiba -e                          从stdin提取SHIBA
  shiba shiba --status                    查看状态统计

ID系统:
  • 完整ID: shiba_xxx-yyy
  • 短ID:   ...yyy (后8位)
  • last:   最近创建的条目

分析模式 - 使用管道传入对话内容:
  cat conversation.txt | shiba shiba --analyze
  git log --oneline | shiba shiba --analyze

示例:
  shiba shiba --list published             # 查看已发布的条目
  shiba shiba --publish last             # 发布最近创建的条目
  shiba shiba --edit abc123 title: 新标题 # 修改标题
  shiba shiba --batch AI,区块链,量子计算  # 批量创建
  echo "内容..." | shiba shiba --analyze  # 分析并提取知识点
`));
        return;
      }
      
      // 分析内容
      console.log(chalk.bold('\n🔍 正在分析对话内容...\n'));
      
      try {
        const response = await axios.post(
          `${baseUrl}/api/shiba/extract`,
          { content, max_candidates: 5 },
          { headers }
        );

        if (response.data.success) {
          const candidates = response.data.data.candidates || [];
          
          if (candidates.length === 0) {
            console.log(chalk.yellow('⚠️  未从内容中发现值得记录的知识点'));
            console.log(chalk.gray('尝试提供更多对话内容或包含具体的技术细节'));
            return;
          }
          
          console.log(chalk.green(`✨ 发现 ${candidates.length} 个值得记录的知识点:\n`));
          console.log(chalk.gray('─'.repeat(50)));
          
          // 显示发现的知识点
          for (let i = 0; i < candidates.length; i++) {
            const c = candidates[i];
            const insightType = c.type || 'insight';
            const icon = insightType === 'debug' ? '🔧' : 
                         insightType === 'tip' ? '💡' : 
                         insightType === 'aha' ? '🎯' : 
                         insightType === 'discovery' ? '🔍' : '📝';
            
            console.log(`\n${icon} ${chalk.bold(`${i + 1}. ${c.title}`)}`);
            console.log(`   ${chalk.cyan(c.content.substring(0, 100))}${c.content.length > 100 ? '...' : ''}`);
            console.log(`   ${chalk.gray('标签:')} ${c.tags.map((t: string) => chalk.yellow('#' + t)).join(' ')}`);
            console.log(`   ${chalk.gray('置信度:')} ${chalk.green((c.confidence * 100).toFixed(0) + '%')}`);
          }
          
          console.log(chalk.gray('\n─'.repeat(50)));
          
          // 询问是否创建
          const { create } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'create',
              message: `是否创建这 ${candidates.length} 个 SHIBA 条目?`,
              default: true,
            },
          ]);
          
          if (create) {
            const { status } = await inquirer.prompt([
              {
                type: 'list',
                name: 'status',
                message: '保存为:',
                choices: ['草稿 (draft)', '直接发布 (published)'],
                default: 0,
              },
            ]);
            
            const isPublished = status.includes('发布');
            let created = 0;
            
            console.log(chalk.bold('\n📝 正在创建 SHIBA 条目...\n'));
            
            for (let i = 0; i < candidates.length; i++) {
              const c = candidates[i];
              process.stdout.write(`创建 "${c.title}"... `);
              
              try {
                const createResponse = await axios.post(
                  `${baseUrl}/api/shiba`,
                  {
                    title: c.title,
                    content: c.content,
                    tags: c.tags || [],
                    category: c.category,
                    status: isPublished ? 'published' : 'draft',
                  },
                  { headers }
                );
                
                if (createResponse.data.success) {
                  created++;
                  console.log(chalk.green('✓'));
                } else {
                  console.log(chalk.red('✗'));
                }
              } catch (e) {
                console.log(chalk.red('✗'));
              }
            }
            
            console.log(chalk.green(`\n✅ 完成: 成功创建 ${created}/${candidates.length} 个 SHIBA 条目`));
          }
        }
      } catch (error: any) {
        // 如果 API 不存在，使用本地分析
        console.log(chalk.yellow('⚠️  分析 API 暂不可用，请通过管道传入对话内容'));
        console.log(chalk.gray('使用 cat conversation.txt | shiba shiba --analyze'));
      }
      return;
    }
  } catch (error: any) {
    console.log(chalk.red('❌ 操作失败:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}
