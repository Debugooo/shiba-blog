# SHIBA 功能增强说明

## 概述

基于 OpenTIL 设计，对 Shiba Blog 的 SHIBA (Shiba Instant Blog Article) 功能进行了全面增强。

## 新增功能

### 1. ID 系统优化

- **短ID显示**: `shiba_xxx-yyy` → `...yyy` (后8位)
- **支持多种ID格式**:
  - 完整ID: `shiba_1234567890-abcdef`
  - 短ID: `...abcdef` 或 `abcdef`
  - `last` 关键字: 指向最近创建的条目

### 2. 会话状态跟踪

- 自动记录 `last_created_entry_id`
- 支持快速引用最近创建的条目
- 状态存储在 `shiba_session_states` 表中

### 3. 新增 CLI 命令

| 命令 | 说明 |
|------|------|
| `shiba shiba -l drafts` | 只显示草稿 |
| `shiba shiba -l published` | 只显示已发布 |
| `shiba shiba -l all` | 显示全部 |
| `shiba shiba -p last` | 发布最近创建的 |
| `shiba shiba --unpublish <id>` | 取消发布 |
| `shiba shiba --edit <id>` | 查看条目详情 |
| `shiba shiba --edit <id> title: 新标题` | AI辅助编辑 |
| `shiba shiba --delete <id>` | 删除 (需确认) |
| `shiba shiba --batch AI,区块链` | 批量创建 |
| `shiba shiba --sync` | 同步到本地文件 |
| `shiba shiba --status` | 状态统计 |

### 4. API 增强

#### GET /api/shiba
- 新增 `stats=true` 参数获取统计信息
- 新增状态筛选: `drafts`, `published`, `all`

#### PUT /api/shiba
- 支持单条操作 (`id`) 和批量操作 (`ids`)
- Actions: `publish`, `unpublish`, `edit`, `view`
- 支持 `last` 关键字
- 自动解析短ID

#### DELETE /api/shiba
- 支持 `last` 关键字
- 需提供正确的 author_id 验证

### 5. 数据库增强

新增数据模型:

```typescript
// 会话状态
interface SHIBASessionState {
  user_id: string;
  last_created_entry_id: string | null;
  last_viewed_entry_id: string | null;
  updated_at: string;
}

// 数据库扩展
interface Database {
  // ...原有字段
  shiba_session_states: SHIBASessionState[];
}
```

新增工具函数:

```typescript
// ID 工具
toShortId(id: string): string           // 转换为短ID
resolveSHIBAId(shortId: string, authorId?: string): string | null

// 会话状态
getSHIBASessionState(userId: string): SHIBASessionState | null
updateSHIBASessionState(userId: string, updates: Partial<SHIBASessionState>): void
getLastCreatedSHIBAId(userId: string): string | null

// 统计
getSHIBAStats(authorId?: string): {
  total: number;
  drafts: number;
  published: number;
  totalViews: number;
  totalLikes: number;
  tagsCount: number;
  categoriesCount: number;
}
```

## 使用示例

### 快速创建并发布

```bash
# 创建条目
shiba shiba -c "TypeScript 类型推断的工作原理"

# 查看最近创建
shiba shiba --edit last

# 发布
shiba shiba -p last

# 或直接发布
shiba shiba -p ...zyxwvu
```

### 批量创建

```bash
# 批量创建多个知识点
shiba shiba --batch "闭包,原型链,事件循环,Promise"

# 指定模板
# 会提示输入基础内容模板
```

### AI辅助编辑

```bash
# 查看条目详情
shiba shiba --edit abc123

# 修改标题
shiba shiba --edit abc123 title: 新的标题

# 修改标签
shiba shiba --edit abc123 标签: TypeScript, JavaScript

# 同时修改多项
shiba shiba --edit abc123 title: 新标题 标签: tag1, tag2
```

### 分类查看

```bash
shiba shiba -l          # 查看所有
shiba shiba -l drafts   # 只看草稿
shiba shiba -l published # 只看已发布
```

### 本地同步

```bash
# 同步到本地文件
shiba shiba --sync

# 文件保存到 ~/.shiba-blog/shiba/
```

## 向后兼容

- 所有原有命令保持可用
- 新增选项有合理的默认值
- 短ID解析支持模糊匹配

## 错误处理

- ID 不存在: 友好的错误提示
- 权限不足: 明确的权限错误
- 网络错误: 重试提示
- 参数缺失: 使用帮助提示
