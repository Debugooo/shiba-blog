"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.draftCommand = draftCommand;
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
async function draftCommand(options) {
    const config = loadConfig();
    const baseUrl = getBaseUrl(config);
    if (!config.apiKey) {
        console.log(chalk_1.default.red('❌ 请先登录: shiba login'));
        process.exit(1);
    }
    try {
        // 列出草稿
        if (options.list) {
            const response = await axios_1.default.get(`${baseUrl}/api/posts?status=draft`, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                },
            });
            if (response.data.success) {
                const drafts = response.data.data.posts || [];
                if (drafts.length === 0) {
                    console.log(chalk_1.default.yellow('📝 暂无草稿'));
                }
                else {
                    console.log(chalk_1.default.bold('\n📝 草稿列表:\n'));
                    drafts.forEach((post, index) => {
                        console.log(`${index + 1}. ${chalk_1.default.bold(post.title)}`);
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
            const response = await axios_1.default.put(`${baseUrl}/api/posts/${options.publish}/publish`, {}, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                },
            });
            if (response.data.success) {
                console.log(chalk_1.default.green('✅ 草稿已发布！'));
                console.log(chalk_1.default.cyan(`${baseUrl}/blog/${response.data.data.slug}`));
            }
            else {
                console.log(chalk_1.default.red('❌ 发布失败:'), response.data.message);
            }
            return;
        }
        // 删除草稿
        if (options.delete) {
            const response = await axios_1.default.delete(`${baseUrl}/api/posts/${options.delete}`, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                },
            });
            if (response.data.success) {
                console.log(chalk_1.default.green('✅ 草稿已删除'));
            }
            else {
                console.log(chalk_1.default.red('❌ 删除失败:'), response.data.message);
            }
            return;
        }
        // 无参数，显示帮助
        console.log(chalk_1.default.bold('\n📝 草稿管理命令:\n'));
        console.log('  shiba draft --list         列出所有草稿');
        console.log('  shiba draft --publish <id>  发布草稿');
        console.log('  shiba draft --delete <id>   删除草稿\n');
    }
    catch (error) {
        console.log(chalk_1.default.red('❌ 操作失败:'), error.response?.data?.message || error.message);
        process.exit(1);
    }
}
