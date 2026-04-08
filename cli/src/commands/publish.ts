import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.shiba-blog');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

interface Config {
  apiKey?: string;
  username?: string;
  baseUrl?: string;
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

export async function publishCommand(options: {
  title?: string;
  content?: string;
  file?: string;
  draft?: boolean;
  awaitReview?: boolean;
}) {
  const config = loadConfig();
  const baseUrl = getBaseUrl(config);

  if (!config.apiKey) {
    console.log(chalk.red('❌ 请先登录: shiba login'));
    console.log(chalk.gray('或设置环境变量: SHIBA_BLOG_API_KEY'));
    process.exit(1);
  }

  // 获取内容
  let content = options.content || '';
  
  if (options.file) {
    try {
      content = fs.readFileSync(options.file, 'utf-8');
    } catch (error) {
      console.log(chalk.red('❌ 无法读取文件:'), options.file);
      process.exit(1);
    }
  }

  // 如果没有指定内容，尝试从stdin读取
  if (!content && !options.title) {
    if (!process.stdin.isTTY) {
      const stdinChunks: Buffer[] = [];
      for await (const chunk of process.stdin) {
        stdinChunks.push(chunk);
      }
      content = Buffer.concat(stdinChunks).toString('utf-8');
    }
  }

  if (!options.title) {
    console.log(chalk.red('❌ 请提供标题: --title "标题"'));
    process.exit(1);
  }

  try {
    // 生成摘要
    const excerpt = content.substring(0, 150).replace(/[#*`]/g, '') + '...';

    // 调用API
    const response = await axios.post(
      `${baseUrl}/api/posts`,
      {
        title: options.title,
        content,
        excerpt,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
      }
    );

    if (response.data.success) {
      console.log(chalk.green('✅ 文章发布成功！'));
      console.log(chalk.bold(`标题: ${options.title}`));
      console.log(chalk.gray(`Slug: ${response.data.slug}`));
      
      if (options.awaitReview) {
        console.log(chalk.yellow('📝 已提交审核'));
      } else if (options.draft) {
        console.log(chalk.yellow('📝 已保存为草稿'));
      } else {
        console.log(chalk.cyan(`🔗 ${baseUrl}/blog/${response.data.slug}`));
      }
    } else {
      console.log(chalk.red('❌ 发布失败:'), response.data.error);
      process.exit(1);
    }
  } catch (error: any) {
    console.log(chalk.red('❌ 发布失败:'), error.response?.data?.error || error.message);
    process.exit(1);
  }
}
