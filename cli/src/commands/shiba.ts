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
  status: 'draft' | 'published';
  views: number;
  likes: number;
  created_at: string;
}

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

export async function shibaCommand(options: {
  content?: string;
  list?: boolean;
  search?: string;
  tags?: boolean;
  publish?: string;
  extract?: boolean;
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
        console.log(chalk.green('✅ SHIBA 创建成功！'));
        console.log(chalk.gray(`ID: ${response.data.data.entry.id}`));
      }
      return;
    }

    // /shiba list
    if (options.list) {
      const response = await axios.get(`${baseUrl}/api/shiba?status=published`, { headers });
      
      if (response.data.success) {
        const entries: SHIBAEntry[] = response.data.data.entries || [];
        
        if (entries.length === 0) {
          console.log(chalk.yellow('📝 暂无SHIBA条目'));
        } else {
          console.log(chalk.bold(`\n🐕 SHIBA 列表 (共 ${entries.length} 条):\n`));
          
          entries.forEach((entry, index) => {
            console.log(`${index + 1}. ${chalk.bold(entry.title)}`);
            console.log(`   ${chalk.gray(entry.tags.join(', ') || '无标签')}`);
            console.log(`   👁 ${entry.views} ❤️ ${entry.likes}`);
            console.log('');
          });
        }
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
          entries.forEach((entry, index) => {
            console.log(`${index + 1}. ${chalk.bold(entry.title)}`);
            console.log(`   ${entry.content.substring(0, 100)}...`);
            console.log('');
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
          tags.forEach(({ tag, count }: { tag: string; count: number }) => {
            console.log(`  ${chalk.cyan('#' + tag)} (${count})`);
          });
        }
        console.log('');
      }
      return;
    }

    // /shiba publish <id>
    if (options.publish) {
      const response = await axios.post(
        `${baseUrl}/api/shiba/publish`,
        { shiba_id: options.publish },
        { headers }
      );

      if (response.data.success) {
        console.log(chalk.green('✅ 已发布为博客文章！'));
        console.log(chalk.cyan(`${baseUrl}/blog/${response.data.data.slug}`));
      } else {
        console.log(chalk.red('❌ 发布失败:'), response.data.message);
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

    // 无参数，显示帮助
    console.log(chalk.bold(`
🐕 SHIBA - Shiba Instant Blog Article

用法:
  shiba shiba -c "<content>"     快速创建SHIBA
  shiba shiba -l                  列出所有SHIBA
  shiba shiba -s "<keyword>"      搜索SHIBA
  shiba shiba -t                  查看标签
  shiba shiba -p <id>             发布为博客文章
  shiba shiba -e                  从stdin提取SHIBA

示例:
  echo "今天发现Linux的tilde快捷键..." | shiba shiba --extract
  shiba shiba --list
  shiba shiba --search "javascript"
`));
  } catch (error: any) {
    console.log(chalk.red('❌ 操作失败:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}
