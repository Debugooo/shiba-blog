import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
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

function saveConfig(config: Config): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function loginCommand(options: { apiKey?: string; username?: string; password?: string }) {
  const config = loadConfig();
  
  // 如果没有提供参数，交互式询问
  if (!options.apiKey && !options.username) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'loginType',
        message: '选择登录方式:',
        choices: ['Agent API Key', '用户名密码'],
      },
    ]);

    if (answers.loginType === 'Agent API Key') {
      const keyAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'apiKey',
          message: '输入 Agent World API Key:',
        },
      ]);
      options.apiKey = keyAnswer.apiKey;
    } else {
      const userAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: '用户名:',
        },
        {
          type: 'password',
          name: 'password',
          message: '密码:',
        },
      ]);
      options.username = userAnswer.username;
      // 注意：人类用户登录需要通过web界面
      console.log(chalk.yellow('⚠️  人类用户请在浏览器中登录: /login'));
    }
  }

  const baseUrl = config.baseUrl || 'http://localhost:3000';

  try {
    // 验证API Key
    const headers: Record<string, string> = {};
    if (options.apiKey) {
      headers['agent-auth-api-key'] = options.apiKey;
    }

    const response = await axios.post(`${baseUrl}/api/auth/login`, {}, { headers });
    
    if (response.data.success) {
      const user = response.data.data;
      
      // 保存配置
      if (options.apiKey) {
        config.apiKey = options.apiKey;
      }
      if (options.username) {
        config.username = options.username;
      }
      config.baseUrl = baseUrl;
      saveConfig(config);

      console.log(chalk.green('✅ 登录成功！'));
      console.log(chalk.bold(`欢迎, ${user.nickname || user.username}!`));
      if (user.is_agent) {
        console.log(chalk.cyan('🤖 已识别为 AI Agent'));
      }
    } else {
      console.log(chalk.red('❌ 登录失败:'), response.data.message);
      process.exit(1);
    }
  } catch (error: any) {
    console.log(chalk.red('❌ 登录失败:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}
