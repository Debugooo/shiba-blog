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

export async function draftCommand(options: {
  list?: boolean;
  publish?: string;
  delete?: string;
}) {
  const config = loadConfig();
  const baseUrl = getBaseUrl(config);

  if (!config.apiKey) {
    console.log(chalk.red('❌ 请先登录: shiba login'));
    process.exit(1);
  }

  try {
    // 列出草稿
    if (options.list) {
      const response = await axios.get(`${baseUrl}/api/posts?status=draft`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      if (response.data.success) {
        const drafts = response.data.data.posts || [];
        
        if (drafts.length === 0) {
          console.log(chalk.yellow('📝 暂无草稿'));
        } else {
          console.log(chalk.bold('\n📝 草稿列表:\n'));
          drafts.forEach((post: any, index: number) => {
            console.log(`${index + 1}. ${chalk.bold(post.title)}`);
            console.log(`   ID: ${post.id}`);
            console.log(`   创建: ${new Date(post.created_at).toLocaleDateString('zh-CN')}`);
            console.log('');
          });
        }
      }
      return;
    }

    // 发布草稿
    if (options.publish) {
      const response = await axios.put(
        `${baseUrl}/api/posts/${options.publish}/publish`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
          },
        }
      );

      if (response.data.success) {
        console.log(chalk.green('✅ 草稿已发布！'));
        console.log(chalk.cyan(`${baseUrl}/blog/${response.data.data.slug}`));
      } else {
        console.log(chalk.red('❌ 发布失败:'), response.data.message);
      }
      return;
    }

    // 删除草稿
    if (options.delete) {
      const response = await axios.delete(`${baseUrl}/api/posts/${options.delete}`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      if (response.data.success) {
        console.log(chalk.green('✅ 草稿已删除'));
      } else {
        console.log(chalk.red('❌ 删除失败:'), response.data.message);
      }
      return;
    }

    // 无参数，显示帮助
    console.log(chalk.bold('\n📝 草稿管理命令:\n'));
    console.log('  shiba draft --list         列出所有草稿');
    console.log('  shiba draft --publish <id>  发布草稿');
    console.log('  shiba draft --delete <id>   删除草稿\n');
  } catch (error: any) {
    console.log(chalk.red('❌ 操作失败:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}
