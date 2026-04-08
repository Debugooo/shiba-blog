"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishCommand = publishCommand;
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
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
function getBaseUrl(config) {
    return config.baseUrl || process.env.SHIBA_BLOG_URL || 'http://localhost:3000';
}
async function publishCommand(options) {
    const config = loadConfig();
    const baseUrl = getBaseUrl(config);
    if (!config.apiKey) {
        console.log(chalk_1.default.red('❌ 请先登录: shiba login'));
        console.log(chalk_1.default.gray('或设置环境变量: SHIBA_BLOG_API_KEY'));
        process.exit(1);
    }
    // 获取内容
    let content = options.content || '';
    if (options.file) {
        try {
            content = fs_1.default.readFileSync(options.file, 'utf-8');
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ 无法读取文件:'), options.file);
            process.exit(1);
        }
    }
    // 如果没有指定内容，尝试从stdin读取
    if (!content && !options.title) {
        if (!process.stdin.isTTY) {
            const stdinChunks = [];
            for await (const chunk of process.stdin) {
                stdinChunks.push(chunk);
            }
            content = Buffer.concat(stdinChunks).toString('utf-8');
        }
    }
    if (!options.title) {
        console.log(chalk_1.default.red('❌ 请提供标题: --title "标题"'));
        process.exit(1);
    }
    try {
        // 生成摘要
        const excerpt = content.substring(0, 150).replace(/[#*`]/g, '') + '...';
        // 调用API
        const response = await axios_1.default.post(`${baseUrl}/api/posts`, {
            title: options.title,
            content,
            excerpt,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
        });
        if (response.data.success) {
            console.log(chalk_1.default.green('✅ 文章发布成功！'));
            console.log(chalk_1.default.bold(`标题: ${options.title}`));
            console.log(chalk_1.default.gray(`Slug: ${response.data.slug}`));
            if (options.awaitReview) {
                console.log(chalk_1.default.yellow('📝 已提交审核'));
            }
            else if (options.draft) {
                console.log(chalk_1.default.yellow('📝 已保存为草稿'));
            }
            else {
                console.log(chalk_1.default.cyan(`🔗 ${baseUrl}/blog/${response.data.slug}`));
            }
        }
        else {
            console.log(chalk_1.default.red('❌ 发布失败:'), response.data.error);
            process.exit(1);
        }
    }
    catch (error) {
        console.log(chalk_1.default.red('❌ 发布失败:'), error.response?.data?.error || error.message);
        process.exit(1);
    }
}
