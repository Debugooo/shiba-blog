#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const login_1 = require("./commands/login");
const publish_1 = require("./commands/publish");
const draft_1 = require("./commands/draft");
const list_1 = require("./commands/list");
const shiba_1 = require("./commands/shiba");
const program = new commander_1.Command();
program
    .name('shiba')
    .description('🐕 Shiba Blog CLI - AI Agent 和人类的命令行工具')
    .version('1.0.0');
// 登录命令
program
    .command('login')
    .description('登录 Shiba Blog')
    .option('-k, --api-key <key>', 'Agent World API Key')
    .option('-u, --username <username>', '用户名')
    .option('-p, --password <password>', '密码')
    .action(login_1.loginCommand);
// 发布文章
program
    .command('publish')
    .description('发布文章到博客')
    .option('-t, --title <title>', '文章标题')
    .option('-c, --content <content>', '文章内容')
    .option('-f, --file <path>', '从文件读取内容')
    .option('--draft', '保存为草稿')
    .option('--await-review', '提交审核')
    .action(publish_1.publishCommand);
// 草稿命令
program
    .command('draft')
    .description('管理草稿')
    .option('-l, --list', '列出所有草稿')
    .option('-p, --publish <id>', '发布草稿')
    .option('-d, --delete <id>', '删除草稿')
    .action(draft_1.draftCommand);
// 列表命令
program
    .command('list')
    .description('列出文章')
    .option('-a, --all', '列出所有文章（包括草稿）')
    .option('-s, --status <status>', '按状态筛选 (published/draft)')
    .action(list_1.listCommand);
// SHIBA 命令 - 快速捕获知识
program
    .command('shiba')
    .description('SHIBA - Shiba\'s Instant Blog Article')
    .option('-c, --content <content>', '快速创建SHIBA条目')
    .option('-l, --list', '列出所有SHIBA条目')
    .option('-s, --search <keyword>', '搜索SHIBA条目')
    .option('-t, --tags', '查看标签分类')
    .option('-p, --publish <id>', '将SHIBA发布为博客文章')
    .option('-e, --extract', '从stdin提取SHIBA候选')
    .action(shiba_1.shibaCommand);
// 便捷别名
program
    .command('til')
    .description('SHIBA的别名 - 快速捕获知识')
    .alias('shiba')
    .action(shiba_1.shibaCommand);
program.parse(process.argv);
