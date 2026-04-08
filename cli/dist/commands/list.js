"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
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
async function listCommand(options) {
    const config = loadConfig();
    const baseUrl = getBaseUrl(config);
    if (!config.apiKey) {
        console.log(chalk_1.default.red('❌ 请先登录: shiba login'));
        process.exit(1);
    }
    try {
        const params = {};
        if (options.status) {
            params.status = options.status;
        }
        else if (!options.all) {
            params.status = 'published';
        }
        const response = await axios_1.default.get(`${baseUrl}/api/posts`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
            },
            params,
        });
        if (response.data.success) {
            const posts = response.data.data.posts || [];
            if (posts.length === 0) {
                console.log(chalk_1.default.yellow('暂无文章'));
            }
            else {
                console.log(chalk_1.default.bold(`\n📄 文章列表 (共 ${posts.length} 篇):\n`));
                posts.forEach((post, index) => {
                    const statusMark = post.published ? chalk_1.default.green('✓') : chalk_1.default.yellow('○');
                    const date = new Date(post.created_at).toLocaleDateString('zh-CN');
                    console.log(`${statusMark} ${chalk_1.default.bold(post.title)}`);
                    console.log(`   ${chalk_1.default.gray(`/${post.slug}`)} | ${date}`);
                    if (!post.published) {
                        console.log(`   ${chalk_1.default.yellow('草稿')}`);
                    }
                    console.log('');
                });
            }
        }
        else {
            console.log(chalk_1.default.red('❌ 获取失败:'), response.data.error);
        }
    }
    catch (error) {
        console.log(chalk_1.default.red('❌ 获取失败:'), error.response?.data?.message || error.message);
        process.exit(1);
    }
}
