# SHIBA

v2.0.0

Capture and manage SHIBA (Self-Hosted Interactive Blog Archive) entries on Shiba Blog. Use `/shiba <content>` to capture, `/shiba` to extract insights from conversation, or `/shiba list|publish|edit|search|delete|status|sync|tags|categories|batch` to manage entries -- all without leaving the CLI.

⭐ 由 Shiba Blog 提供

by [@Debugooo](https://github.com/Debugooo)

MIT

---

## Setup

1. 确保已安装 Shiba Blog CLI：
```bash
npm install -g shiba-blog-cli
# 或
npx shiba-blog-cli@latest
```

2. 配置 Agent World 认证（可选，用于同步）：
```bash
shiba login
```

### Token Resolution

Token resolution order:
1. `SHIBA_TOKEN` environment variable (overrides all profiles)
2. `~/.shiba/credentials` file — active profile's token (created by `/shiba auth`)

If neither is set, entries are saved locally to `~/.shiba/drafts/`.

---

## Auto-detection

SHIBA proactively suggests capturing when it detects task boundaries -- moments where the user has made a discovery, solved a problem, or encountered an insight.

### When to Suggest

Suggest when the conversation produces a genuine "aha" moment:

**Debugging breakthrough:**
```
User: Fixed! The issue was that the array wasn't sorted.
Agent: Great catch! 💡 TIL: Unsorted arrays can cause binary search to fail silently
       Tags: algorithm, debugging · 记录一下？(yes/no)
```

**Unexpected behavior:**
```
User: Interesting, this API returns 404 for HEAD requests but 200 for GET.
Agent: 💡 TIL: Some REST APIs handle HEAD and GET differently
       Tags: api, http · 记录一下？(yes/no)
```

**New discovery:**
```
User: Wow, I didn't know React 19 has built-in caching for server components.
Agent: 💡 TIL: React 19 server components have automatic caching
       Tags: react, performance · 记录一下？(yes/no)
```

### State Machine

The auto-detection follows a session-level state machine:

```
初始状态: enabled=true, sessionRejected=false, lastAcceptedTurn=0, currentTurn=0

每轮对话:
  currentTurn++
  
  if sessionRejected:
    → 整个session不再建议，直接返回
  endif
  
  if (currentTurn - lastAcceptedTurn) < cooldownTurns:
    → 还在冷却期，不触发建议
  endif
  
  if 检测到任务边界:
    → 生成建议，追加到回复末尾
    → 用户确认:
        yes → 创建SHIBA, lastAcceptedTurn = currentTurn
        no  → sessionRejected = true
  endif
```

### Detection Patterns

Task boundary patterns (append to end of response):

| Pattern | Example |
|---------|---------|
| Bug fix | "Fixed the N+1 query issue" |
| Solution | "Got it working with a mutex" |
| Discovery | "Interesting, it caches by default" |
| Insight | "The root cause was..." |
| Tip | "Useful trick: add --verbose" |

### Response Format

When suggesting, append to the END of your normal response:

```
[Normal response content here]

💡 TIL: [Concise insight title]
Tags: [tag1, tag2] · 记录一下？(yes/no)
```

- Keep the insight title under 50 characters
- Include 1-3 relevant tags
- Use Chinese for Chinese users, English otherwise
- Never suggest if user is in the middle of a task

### Important Rules

1. **Only suggest at task boundaries** -- not during active debugging
2. **Respect rejection** -- once rejected, don't suggest again this session
3. **Cooldown after acceptance** -- wait 15 turns before next suggestion
4. **Keep it brief** -- one line + tags, no explanation
5. **Language match** -- use the user's language

---

## Subcommand Routing

The first word after `/shiba` determines the action. Reserved words route to management subcommands; anything else is treated as content to capture.

| Invocation | Action |
|---|---|
| `/shiba list [drafts\|published\|all]` | List entries (default: drafts) |
| `/shiba publish [id\|last]` | Publish an entry |
| `/shiba unpublish <id>` | Unpublish (revert to draft) |
| `/shiba edit <id> [instructions]` | AI-assisted edit |
| `/shiba search <keyword>` | Search entries by title |
| `/shiba delete <id>` | Delete entry (with confirmation) |
| `/shiba status` | Show site status and connection info |
| `/shiba sync` | Sync local drafts to Shiba Blog |
| `/shiba tags` | List site tags with usage counts |
| `/shiba categories` | List site categories |
| `/shiba batch <topics>` | Batch-capture multiple SHIBA entries |
| `/shiba auth` | Connect Shiba Blog account |
| `/shiba <anything else>` | Capture content as a new SHIBA |
| `/shiba` | Extract insights from conversation |

Reserved words: `list`, `publish`, `unpublish`, `edit`, `search`, `delete`, `status`, `sync`, `tags`, `categories`, `batch`, `auth`.

---

## API Quick Reference

**Create and publish an entry:**

```bash
curl -X POST "http://localhost:3000/api/shiba" \
  -H "Authorization: Bearer $SHIBA_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Shiba-Source: human" \
  -H "X-Shiba-Agent: Shiba Blog CLI" \
  -H "X-Shiba-Model: CLI-v2.0.0" \
  -d '{
    "entry": {
      "title": "TypeScript satisfies operator for type narrowing",
      "content": "The satisfies operator in TypeScript 4.9+ allows...",
      "summary": "TypeScript satisfies operator ensures type conformity while preserving literal types.",
      "tag_names": ["typescript", "types"],
      "published": true,
      "lang": "en"
    }
  }'
```

**Key create parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | string | yes | Markdown body (max 100,000 chars) |
| `title` | string | no | Entry title (max 200 chars). Auto-generates slug. |
| `tag_names` | array | no | 1-3 lowercase tags, e.g. `["typescript", "types"]` |
| `published` | boolean | no | `false` for draft (default), `true` to publish immediately |
| `lang` | string | no | Language code: `en`, `zh-CN`, `zh-TW`, `ja`, `ko`, etc. |
| `category_name` | string | no | Category: `programming`, `devops`, `frontend`, `backend`, `database`, `security`, `architecture`, `tools`, `ai`, `other` |
| `summary` | string | no | AI-generated summary for listing pages (max 500 chars) |

**Management endpoints:**

| Endpoint | Method | Description |
|---|---|---|
| `/api/shiba?status=draft&q=keyword` | GET | List/search entries |
| `/api/shiba/:id` | GET | Get a single entry |
| `/api/shiba/:id` | PUT | Update entry fields (supports actions) |
| `/api/shiba/:id` | DELETE | Permanently delete entry |
| `/api/shiba/extract` | POST | Extract insights from text |

---

## `/shiba <content>` -- Explicit Capture

The user's input is **raw material** -- a seed, not the final entry. Generate a complete SHIBA from it:

- Short input (a sentence or phrase) -> expand into a full entry with context and examples
- Long input (a paragraph or more) -> refine and structure, but preserve the user's intent

**Steps:**

1. Treat the user's input as a seed -- craft a complete title + body from it
2. Generate a concise title (5-15 words) in the same language as the content
3. Write a self-contained Markdown body (see Content Guidelines below)
4. Generate a summary (see Summary Guidelines below)
5. Infer 1-3 lowercase tags from technical domain (e.g. `typescript`, `react`, `nodejs`)
6. Detect category based on content domain
7. Detect language -> set `lang` (`en`, `zh-CN`, `zh-TW`, `ja`, `ko`, etc.)
8. Follow Execution Flow (check token -> POST or save locally)

No confirmation needed -- the user explicitly asked to capture. Execute directly.

---

## `/shiba` -- Extract from Conversation

When `/shiba` is used without arguments, analyze the current conversation for learnable insights.

**Steps:**

1. Scan the conversation for knowledge worth preserving -- surprising facts, useful techniques, debugging breakthroughs, "aha" moments
2. Identify **all** SHIBA-worthy insights (not just one), up to 5
3. Branch based on count:

**0 insights:**
```
No clear SHIBA insights found in this conversation.
```

**1 insight:** Generate the full draft (title, body, tags), show it, ask for confirmation. On confirmation -> follow Execution Flow.

**2+ insights:** Show a numbered list (max 5), let the user choose:

```
Found 3 SHIBA-worthy insights:

  🔧 1. Go interfaces are satisfied implicitly
  💡 2. PostgreSQL JSONB arrays don't support GIN @>
  🎯 3. CSS :has() enables parent selection

Which to capture? (1/2/3/all/none)
```

Insight types:
- 🔧 **discovery** - New discovery
- 💡 **tip** - Useful tip
- 🎯 **debug** - Debugging breakthrough
- 🔍 **aha** - "Aha!" moment
- 📝 **insight** - Deep insight

---

## Insight Type Detection

The `extract` API automatically detects insight types:

| Type | Icon | Description |
|------|------|-------------|
| `discovery` | 🔧 | New findings, unexpected behavior |
| `tip` | 💡 | Useful tips, best practices |
| `debug` | 🎯 | Debugging solutions, root causes |
| `aha` | 🔍 | "Aha!" moments, paradigm shifts |
| `insight` | 📝 | Deep insights, architectural patterns |

---

## Category Auto-Detection

Categories are automatically detected based on content:

| Category | Keywords |
|----------|----------|
| `programming` | language, syntax, algorithm, code |
| `devops` | docker, kubernetes, ci/cd, deployment |
| `frontend` | react, vue, css, html, javascript |
| `backend` | api, server, microservice, rest |
| `database` | sql, postgresql, mysql, mongodb, redis |
| `security` | auth, token, encryption, vulnerability |
| `architecture` | design, pattern, scale, distributed |
| `tools` | git, cli, editor, vscode |
| `ai` | llm, model, prompt, openai, claude |
| `other` | (default) |

---

## Management Subcommands

Management subcommands require a token. There is no local fallback -- management operations need the API.

### `/shiba list [drafts|published|all]`

List entries. Default filter: `drafts`.

- API: `GET /api/shiba?status=<filter>&per_page=10`
- Display as a compact table with short IDs (last 8 chars, prefixed with `...`)
- Show pagination info at the bottom

### `/shiba publish [id | last]`

Publish a draft entry.

- `last` resolves to the most recently created entry in this session (tracked via `last_created_entry_id` set on every successful POST)
- Fetch the entry first, show title/tags, ask for confirmation
- On success, display the published URL
- If already published, show informational message (not an error)

### `/shiba unpublish <id>`

Revert a published entry to draft.

- Fetch the entry first, confirm before unpublishing
- If already a draft, show informational message

### `/shiba edit <id> [instructions]`

AI-assisted editing of an existing entry.

- Fetch the full entry via `GET /api/shiba/:id`
- Apply changes based on instructions (or ask what to change if none given)
- Show a diff preview of proposed changes
- On confirmation, `PUT /api/shiba/:id` with only the changed fields

### `/shiba search <keyword>`

Search entries by title.

- API: `GET /api/shiba?q=<keyword>&per_page=10`
- Same compact table format as `list`

### `/shiba delete <id>`

Permanently delete an entry.

- Fetch the entry, show title and status
- Double-confirm: "This cannot be undone. Type 'delete' to confirm."
- On confirmation, `DELETE /api/shiba/:id`

### `/shiba status`

Show site status and connection info. **Works without a token** (degraded display).

- With token: show username, entry breakdown (total/published/drafts), token status, local draft count
- Without token: show "not connected", local draft count, setup link

### `/shiba sync`

Explicitly sync local drafts from `~/.shiba/drafts/` to Shiba Blog. Requires token.

- List pending drafts, POST each one, delete local file on success
- Show summary with success/failure per draft

### `/shiba tags`

List site tags sorted by usage count (top 20). Requires token.

- API: `GET /api/shiba?stats=true`
- Show as compact table with tag name and entry count

### `/shiba categories`

List site categories. Requires token.

- Show as compact table with name, entry count, and description

### `/shiba batch <topics>`

Batch-capture multiple SHIBA entries in one invocation. Requires explicit topic list.

- User lists topics separated by newlines, semicolons, or markdown list items (`-` / `1.`)
- Generate a draft for each -> show all drafts for confirmation -> POST sequentially
- On partial failure, show per-entry success/failure

### ID Resolution

- In listings, show IDs in short form: `...` + last 8 characters
- Accept both short and full IDs as input
- Resolve short IDs by suffix match against the current listing
- If ambiguous (multiple matches), ask for clarification
- Special keyword: `last` resolves to the most recently created entry

### Session State

Track the following session state (not persisted across sessions):

- `last_created_entry_id` -- set on every successful `POST /api/shiba` (201). Used by `/shiba publish last`.
- `active_profile` -- the profile name resolved at first token access.

**Auto-detection State** (persisted to database):

- `enabled` -- global on/off switch
- `sessionRejected` -- if user rejected once, never ask again this session
- `lastAcceptedTurn` -- turn number when user last accepted
- `currentTurn` -- current conversation turn
- `cooldownTurns` -- turns to wait after acceptance (default: 15)

---

## HTTP Headers

Include these headers on every API call:

```
X-Shiba-Source: human | agent
X-Shiba-Agent: <your agent display name>
X-Shiba-Model: <human-readable model name>
```

- Source: `/shiba <content>` and `/shiba` -> `human`; Auto-detected -> `agent`
- Agent: use your tool's display name (e.g. `Shiba Blog CLI`, `Claude Code`, `Cursor`)
- Model: use a human-readable model name (e.g. `Claude Opus 4.6`, `GPT-4o`)

---

## Content Guidelines

Every SHIBA entry must follow these rules:

- **Self-contained**: The reader must understand the entry without any conversation context. Never write "as we discussed", "the above error", "this project's config", etc.

- **Desensitized**: Remove project names, company details, colleague names, internal URLs, and proprietary business logic. Generalize specifics: "our User model" -> "a model", "the production server" -> "a production environment".

- **Universally valuable**: Write to StackOverflow-answer standards. A stranger searching for this topic should find the entry immediately useful.

- **Factual tone**: State facts, show examples, explain why. Avoid first-person narrative.

- **One insight per entry**: Each SHIBA teaches exactly ONE thing. If there are multiple insights, create separate entries.

- **Concrete examples**: Include code snippets, commands, or specific data whenever relevant.

- **Title**: 5-15 words. Descriptive, same language as content. No "SHIBA:" prefix.

- **Content**: Use the most efficient format for the knowledge — tables for comparisons, code blocks for examples, lists for enumerations, math for formulas.

- **Tags**: 1-3 lowercase tags from the technical domain (`typescript`, `react`, `nodejs`, `linux`). No generic tags like `programming` or `shiba`.

- **Lang**: Detect from content. Chinese -> `zh-CN`, Traditional Chinese -> `zh-TW`, English -> `en`, Japanese -> `ja`, Korean -> `ko`.

- **Category**: Auto-detected based on content domain.

- **Summary**: 1-2 sentences, plain text (no markdown). Max 500 chars. Self-contained: the reader should understand the core takeaway from the summary alone.

---

## CLI Usage Examples

```bash
# 捕获新知识点
shiba shiba "TypeScript satisfies operator preserves literal types"

# 从对话中提取知识点
cat conversation.txt | shiba shiba --analyze

# 列出草稿
shiba shiba -l

# 搜索
shiba shiba -s "typescript"

# 发布最新的
shiba shiba -p last

# 查看标签统计
shiba shiba -t

# 查看分类列表
shiba shiba --cat

# 批量创建
shiba shiba -b "React hooks; TypeScript generics; CSS Grid"
```

---

## Notes

- **UI language adaptation**: All prompts, result messages, and error messages adapt to match the user's language in the current session.

- Entries are published immediately by default (`published: true`) -- use `/shiba unpublish <id>` to revert to draft

- Tags are created automatically if they don't exist

- Content is rendered to HTML server-side (GFM Markdown with syntax highlighting)

- Management subcommands (`list`, `publish`, `edit`, `search`, `delete`, `tags`, `categories`, `sync`, `batch`) require a token -- no local fallback. Exception: `status` works without a token.

- The API auto-generates a unique ID in format: `shiba_<timestamp>-<random>`

- **Auto-detection** respects user preferences: once rejected, never suggests again this session; waits 15 turns after acceptance before next suggestion.
