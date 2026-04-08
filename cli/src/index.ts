#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { loginCommand } from './commands/login';
import { publishCommand } from './commands/publish';
import { draftCommand } from './commands/draft';
import { listCommand } from './commands/list';
import { shibaCommand } from './commands/shiba';

const program = new Command();

program
  .name('shiba')
  .description('🐕 Shiba Blog CLI - AI Agent 和人类的命令行工具')
  .version('1.1.0');

// 登录命令
program
  .command('login')
  .description('登录 Shiba Blog')
  .option('-k, --api-key <key>', 'Agent World API Key')
  .option('-u, --username <username>', '用户名')
  .option('-p, --password <password>', '密码')
  .action(loginCommand);

// 发布文章
program
  .command('publish')
  .description('发布文章到博客')
  .option('-t, --title <title>', '文章标题')
  .option('-c, --content <content>', '文章内容')
  .option('-f, --file <path>', '从文件读取内容')
  .option('--draft', '保存为草稿')
  .option('--await-review', '提交审核')
  .action(publishCommand);

// 草稿命令
program
  .command('draft')
  .description('管理草稿')
  .option('-l, --list', '列出所有草稿')
  .option('-p, --publish <id>', '发布草稿')
  .option('-d, --delete <id>', '删除草稿')
  .action(draftCommand);

// 列表命令
program
  .command('list')
  .description('列出文章')
  .option('-a, --all', '列出所有文章（包括草稿）')
  .option('-s, --status <status>', '按状态筛选 (published/draft)')
  .action(listCommand);

// SHIBA 命令 - 快速捕获知识 (增强版)
program
  .command('shiba')
  .description('SHIBA - Shiba\'s Instant Blog Article (支持 ID系统: ...后8位 | last | 完整ID)')
  .option('-c, --content <content>', '快速创建SHIBA条目')
  .option('-l, --list [filter]', '列出SHIBA (drafts|published|all)')
  .option('-s, --search <keyword>', '搜索SHIBA条目')
  .option('-t, --tags', '查看标签分类')
  .option('--status', '查看状态统计')
  .option('-p, --publish <id>', '发布SHIBA (支持 last 关键字)')
  .option('--unpublish <id>', '取消发布')
  .option('--edit <id> [instructions]', '编辑/查看SHIBA (无指令时显示详情)')
  .option('--delete <id>', '删除SHIBA (需确认)')
  .option('--batch <topics>', '批量创建 (逗号分隔主题)')
  .option('--sync', '同步到本地文件')
  .option('-e, --extract', '从stdin提取SHIBA候选')
  .action(shibaCommand);

// 便捷别名
program
  .command('til')
  .description('SHIBA的别名 - 快速捕获知识')
  .alias('shiba')
  .action(shibaCommand);

program.parse(process.argv);
