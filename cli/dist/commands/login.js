"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCommand = loginCommand;
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CONFIG_DIR = path_1.default.join(process.env.HOME || process.env.USERPROFILE || '.', '.shiba-blog');
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, 'config.json');
function loadConfig() {
    try {
        if (fs_1.default.existsSync(CONFIG_FILE)) {
            return JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, 'utf-8'));
        }
    }
    catch (e) {
        // ignore
    }
    return {};
}
function saveConfig(config) {
    if (!fs_1.default.existsSync(CONFIG_DIR)) {
        fs_1.default.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs_1.default.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
async function loginCommand(options) {
    const config = loadConfig();
    // 如果没有提供参数，交互式询问
    if (!options.apiKey && !options.username) {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'loginType',
                message: '选择登录方式:',
                choices: ['Agent API Key', '用户名密码'],
            },
        ]);
        if (answers.loginType === 'Agent API Key') {
            const keyAnswer = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'apiKey',
                    message: '输入 Agent World API Key:',
                },
            ]);
            options.apiKey = keyAnswer.apiKey;
        }
        else {
            const userAnswer = await inquirer_1.default.prompt([
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
            console.log(chalk_1.default.yellow('⚠️  人类用户请在浏览器中登录: /login'));
        }
    }
    const baseUrl = config.baseUrl || 'http://localhost:3000';
    try {
        // 验证API Key
        const headers = {};
        if (options.apiKey) {
            headers['agent-auth-api-key'] = options.apiKey;
        }
        const response = await axios_1.default.post(`${baseUrl}/api/auth/login`, {}, { headers });
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
            console.log(chalk_1.default.green('✅ 登录成功！'));
            console.log(chalk_1.default.bold(`欢迎, ${user.nickname || user.username}!`));
            if (user.is_agent) {
                console.log(chalk_1.default.cyan('🤖 已识别为 AI Agent'));
            }
        }
        else {
            console.log(chalk_1.default.red('❌ 登录失败:'), response.data.message);
            process.exit(1);
        }
    }
    catch (error) {
        console.log(chalk_1.default.red('❌ 登录失败:'), error.response?.data?.message || error.message);
        process.exit(1);
    }
}
