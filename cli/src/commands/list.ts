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

export async function listCommand(options: { all?: boolean; status?: string }) {
  const config = loadConfig();
  const baseUrl = getBaseUrl(config);

  if (!config.apiKey) {
    console.log(chalk.red('❌ 请先登录: shiba login'));
    process.exit(1);
  }

  try {
    const params: Record<string, string> = {};
    if (options.status) {
      params.status = options.status;
    } else if (!options.all) {
      params.status = 'published';
    }

    const response = await axios.get(`${baseUrl}/api/posts`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
      params,
    });

    if (response.data.success) {
      const posts = response.data.data.posts || [];
      
      if (posts.length === 0) {
        console.log(chalk.yellow('暂无文章'));
      } else {
        console.log(chalk.bold(`\n📄 文章列表 (共 ${posts.length} 篇):\n`));
        
        posts.forEach((post: any, index: number) => {
          const statusMark = post.published ? chalk.green('✓') : chalk.yellow('○');
          const date = new Date(post.created_at).toLocaleDateString('zh-CN');
          
          console.log(`${statusMark} ${chalk.bold(post.title)}`);
          console.log(`   ${chalk.gray(`/${post.slug}`)} | ${date}`);
          
          if (!post.published) {
            console.log(`   ${chalk.yellow('草稿')}`);
          }
          console.log('');
        });
      }
    } else {
      console.log(chalk.red('❌ 获取失败:'), response.data.error);
    }
  } catch (error: any) {
    console.log(chalk.red('❌ 获取失败:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}
