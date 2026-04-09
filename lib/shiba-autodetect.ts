/**
 * SHIBA Auto-detection - 自动检测知识边界状态机
 * 
 * 核心设计来自 OpenTIL，当检测到用户完成调试、发现技巧、
 * 解决问题或产生"aha moment"时，自动建议记录知识碎片。
 */

import { readDB, writeDB, generateId } from './db';

// ==================== 类型定义 ====================

/**
 * Auto-detection 状态
 * 整个 session 共享，持久化到数据库
 */
export interface AutoDetectState {
  enabled: boolean;           // 是否启用自动检测
  sessionRejected: boolean;   // 本次 session 是否已拒绝
  lastAcceptedTurn: number;   // 上次接受时的对话轮次
  currentTurn: number;        // 当前对话轮次
  cooldownTurns: number;      // 冷却轮次数（默认15）
  lastSuggestionAt: string | null; // 上次建议时间
  totalSuggestions: number;   // 累计建议次数
  totalAccepted: number;      // 累计接受次数
}

/**
 * 初始状态
 */
export const DEFAULT_AUTO_DETECT_STATE: AutoDetectState = {
  enabled: true,
  sessionRejected: false,
  lastAcceptedTurn: 0,
  currentTurn: 0,
  cooldownTurns: 15,
  lastSuggestionAt: null,
  totalSuggestions: 0,
  totalAccepted: 0,
};

/**
 * 建议结果
 */
export interface SuggestionResult {
  shouldSuggest: boolean;
  insight?: string;
  title?: string;
  tags?: string[];
  reason?: string;
}

/**
 * 知识边界检测结果
 */
export interface InsightCandidate {
  title: string;
  content: string;
  tags: string[];
  insightType: 'discovery' | 'tip' | 'debug' | 'aha' | 'insight';
  confidence: number;
}

// ==================== 任务边界检测模式 ====================

/**
 * 任务边界检测正则表达式
 * 匹配表示"完成"、"解决"、"发现"的关键词组合
 */
const TASK_BOUNDARY_PATTERNS: RegExp[] = [
  // 调试完成
  /fix(ed)?\s+(the\s+)?(bug|issue|error|problem)/i,
  /solved|resolved|fixed/i,
  /got it working/i,
  /finally (works|working|running)/i,
  /that was (the\s+)?(problem|issue|tricky|annoying)/i,
  
  // 意外发现
  /interesting(ly)?\s+(finding|discovery|behavior|thing|fact)/i,
  /surprising(ly)?\s+/i,
  /unexpected(ly)?\s+/i,
  /wow!?,?\s+(didn'?t|never)\s+(know|expect|think)/i,
  
  // Aha时刻
  /aha!?|eureka!|lightbulb/i,
  /oh\s+(my\s+)?god!?,?\s+(that'?s?)?\s*(the\s+)?(it|it'?s|this)/i,
  /(so|that)?\s*(that'?s?)?\s*why/i,
  
  // 技巧/Tip
  /note to self/i,
  /remember this/i,
  /useful tip|handy trick|life[_-]?hack/i,
  /good to know/i,
  
  // 恍然大悟
  /oh\s+i\s+(see|get|understand)/i,
  /makes (sense|perfect) now/i,
  /it'?s\s+(because|since|due\s+to)/i,
  /(root\s+)?cause\s+(was|turned\s+out\s+to\s+be|ended\s+up\s+being)/i,
  
  // 完成确认
  /that works/i,
  /that'?s? (it|all|done|perfect)/i,
  /worked!|success!|nailed it/i,
  /all (good|set|working|fixed|done)/i,
];

/**
 * 负面模式 - 不应该建议的场景
 * 活跃调试中、提问中、未解决问题
 */
const NEGATIVE_PATTERNS: RegExp[] = [
  // 还在问问题
  /how (do|can|to|would|should)/i,
  /what (is|are|was|were|should)/i,
  /why (does|do|is|are|was|not)/i,
  /can (you|i|we) (help|explain|tell|show|give)/i,
  /could (you|i|we)/i,
  /could you/i,
  /please (help|explain|tell|show|give)/i,
  /i'?m\s+(trying|looking|searching|trying\s+to)/i,
  
  // 还没解决
  /still\s+(not|working|working|fixed|done)/i,
  /doesn'?t\s+work/i,
  /failing|failed/i,
  /error|exception/i,
  
  // 不确定状态
  /maybe|perhaps|possibly/i,
  /i think|i guess|i suppose/i,
  /not sure|i'?m not sure/i,
  /let me try/i,
  
  // 重复问题
  /(same|another)\s+(issue|problem|error|question)/i,
  /also\s+(have|get|find|experiencing)/i,
];

/**
 * 标签提取关键词映射
 */
const TAG_KEYWORDS: Record<string, string[]> = {
  typescript: ['typescript', 'ts', 'type', 'interface', 'type inference'],
  javascript: ['javascript', 'js', 'ecmascript'],
  react: ['react', 'jsx', 'tsx', 'hook', 'component', 'redux'],
  nextjs: ['next.js', 'nextjs', 'ssr', 'server component'],
  nodejs: ['node', 'node.js', 'express', 'npm', 'yarn'],
  python: ['python', 'pip', 'django', 'flask'],
  go: ['golang', 'go ', ' goroutine'],
  rust: ['rust', 'borrow checker', 'ownership'],
  docker: ['docker', 'container', 'dockerfile', 'docker-compose'],
  kubernetes: ['kubernetes', 'k8s', 'pod', 'deployment'],
  git: ['git', 'commit', 'branch', 'merge', 'rebase'],
  linux: ['linux', 'unix', 'bash', 'shell', 'terminal'],
  database: ['sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'database', 'db'],
  api: ['api', 'rest', 'graphql', 'endpoint', 'http'],
  security: ['security', 'auth', 'oauth', 'jwt', 'token', 'encryption'],
  performance: ['performance', 'optimize', 'cache', 'benchmark'],
  testing: ['test', 'jest', 'cypress', 'unit test', 'e2e'],
  ai: ['ai', 'llm', 'openai', 'claude', 'gpt', 'model', 'prompt'],
  devops: ['devops', 'ci/cd', 'pipeline', 'deployment'],
  architecture: ['architecture', 'design pattern', 'microservice'],
};

// ==================== 核心检测函数 ====================

/**
 * 检测文本是否为任务边界
 */
export function isTaskBoundary(text: string): boolean {
  // 检查负面模式
  for (const pattern of NEGATIVE_PATTERNS) {
    if (pattern.test(text)) {
      return false;
    }
  }
  
  // 检查正面模式
  for (const pattern of TASK_BOUNDARY_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 提取知识标题和标签
 */
export function extractInsight(text: string): InsightCandidate | null {
  const lowerText = text.toLowerCase();
  
  // 调试突破
  if (/fix|bug|issue|error|problem|solved|resolved/i.test(lowerText)) {
    return {
      title: extractTitle(text, ['fixed', 'solved', 'debug']),
      content: text,
      tags: extractTags(text),
      insightType: 'debug',
      confidence: 0.9,
    };
  }
  
  // 意外发现
  if (/interesting|surprising|unexpected|wow/i.test(lowerText)) {
    return {
      title: extractTitle(text, ['interesting', 'surprising', 'discovery']),
      content: text,
      tags: extractTags(text),
      insightType: 'discovery',
      confidence: 0.8,
    };
  }
  
  // Aha时刻
  if (/aha|eureka|oh i see|oh i get|makes sense|that'?s why/i.test(lowerText)) {
    return {
      title: extractTitle(text, ['aha', 'oh', 'because', 'cause']),
      content: text,
      tags: extractTags(text),
      insightType: 'aha',
      confidence: 0.85,
    };
  }
  
  // 技巧/Tip
  if (/tip|trick|note to self|remember|useful|handy/i.test(lowerText)) {
    return {
      title: extractTitle(text, ['tip', 'trick', 'useful', 'handy']),
      content: text,
      tags: extractTags(text),
      insightType: 'tip',
      confidence: 0.75,
    };
  }
  
  // 深度洞察
  if (/insight|pattern|architecture|design|approach/i.test(lowerText)) {
    return {
      title: extractTitle(text, ['insight', 'pattern', 'architecture']),
      content: text,
      tags: extractTags(text),
      insightType: 'insight',
      confidence: 0.7,
    };
  }
  
  return null;
}

/**
 * 从文本中提取标题
 */
function extractTitle(text: string, keywords: string[]): string {
  // 尝试从句子中提取核心内容
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  for (const keyword of keywords) {
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(keyword)) {
        const trimmed = sentence.trim();
        // 限制标题长度
        if (trimmed.length <= 60) {
          return capitalizeFirst(trimmed);
        }
        // 截取前60个字符
        return capitalizeFirst(trimmed.substring(0, 57) + '...');
      }
    }
  }
  
  // 默认：取第一句的前60字符
  const first = sentences[0]?.trim() || text.substring(0, 60);
  return capitalizeFirst(first.substring(0, 57) + (first.length > 57 ? '...' : ''));
}

/**
 * 从文本中提取标签
 */
function extractTags(text: string): string[] {
  const tags: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
        break;
      }
    }
  }
  
  // 最多返回3个标签
  return tags.slice(0, 3);
}

/**
 * 首字母大写
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== 状态管理 ====================

/**
 * 获取用户的 Auto-detection 状态
 */
export function getAutoDetectState(userId: string): AutoDetectState {
  const db = readDB();
  const autoDetectData = db.shiba_session_states.find(
    s => s.user_id === userId
  );
  
  if (!autoDetectData || !(autoDetectData as any).autoDetectState) {
    return { ...DEFAULT_AUTO_DETECT_STATE };
  }
  
  return {
    ...DEFAULT_AUTO_DETECT_STATE,
    ...(autoDetectData as any).autoDetectState,
  };
}

/**
 * 更新用户的 Auto-detection 状态
 */
export function updateAutoDetectState(
  userId: string,
  updates: Partial<AutoDetectState>
): AutoDetectState {
  const db = readDB();
  const index = db.shiba_session_states.findIndex(s => s.user_id === userId);
  
  if (index === -1) {
    // 创建新状态
    const newState: AutoDetectState = {
      ...DEFAULT_AUTO_DETECT_STATE,
      ...updates,
    };
    
    db.shiba_session_states.push({
      user_id: userId,
      last_created_entry_id: null,
      last_viewed_entry_id: null,
      updated_at: new Date().toISOString(),
      autoDetectState: newState,
    } as any);
  } else {
    // 更新现有状态
    const currentState = (db.shiba_session_states[index] as any).autoDetectState || {};
    const newState = {
      ...DEFAULT_AUTO_DETECT_STATE,
      ...currentState,
      ...updates,
    };
    
    (db.shiba_session_states[index] as any).autoDetectState = newState;
    db.shiba_session_states[index].updated_at = new Date().toISOString();
  }
  
  writeDB(db);
  
  return getAutoDetectState(userId);
}

/**
 * 增加对话轮次
 */
export function incrementTurn(userId: string): number {
  const state = getAutoDetectState(userId);
  const newTurn = state.currentTurn + 1;
  
  updateAutoDetectState(userId, { currentTurn: newTurn });
  
  return newTurn;
}

/**
 * 接受建议
 */
export function acceptSuggestion(userId: string): AutoDetectState {
  const state = getAutoDetectState(userId);
  
  return updateAutoDetectState(userId, {
    lastAcceptedTurn: state.currentTurn,
    totalAccepted: state.totalAccepted + 1,
    lastSuggestionAt: new Date().toISOString(),
  });
}

/**
 * 拒绝建议（整个session不再打扰）
 */
export function rejectSuggestion(userId: string): AutoDetectState {
  return updateAutoDetectState(userId, {
    sessionRejected: true,
  });
}

/**
 * 重置 session 状态
 */
export function resetSession(userId: string): AutoDetectState {
  return updateAutoDetectState(userId, {
    sessionRejected: false,
    currentTurn: 0,
  });
}

/**
 * 启用/禁用自动检测
 */
export function toggleAutoDetect(
  userId: string,
  enabled: boolean
): AutoDetectState {
  return updateAutoDetectState(userId, { enabled });
}

// ==================== 建议判断 ====================

/**
 * 判断是否应该建议记录
 * 
 * 状态机逻辑:
 * 1. 如果 session 已拒绝 → 不建议
 * 2. 如果还在冷却期 → 不建议
 * 3. 如果检测到任务边界 → 生成建议
 */
export function shouldSuggest(
  userId: string,
  lastMessage: string
): SuggestionResult {
  const state = getAutoDetectState(userId);
  
  // 检查是否启用
  if (!state.enabled) {
    return { shouldSuggest: false, reason: 'disabled' };
  }
  
  // 检查是否整个 session 已拒绝
  if (state.sessionRejected) {
    return { shouldSuggest: false, reason: 'session_rejected' };
  }
  
  // 检查是否在冷却期
  const turnsSinceLastAccept = state.currentTurn - state.lastAcceptedTurn;
  if (turnsSinceLastAccept < state.cooldownTurns) {
    return {
      shouldSuggest: false,
      reason: `cooldown (${state.cooldownTurns - turnsSinceLastAccept} turns remaining)`,
    };
  }
  
  // 检测任务边界
  if (!isTaskBoundary(lastMessage)) {
    return { shouldSuggest: false, reason: 'no_boundary_detected' };
  }
  
  // 提取洞察
  const candidate = extractInsight(lastMessage);
  if (!candidate) {
    return { shouldSuggest: false, reason: 'no_insight_extracted' };
  }
  
  return {
    shouldSuggest: true,
    insight: candidate.content,
    title: candidate.title,
    tags: candidate.tags,
    reason: `insight_type: ${candidate.insightType}`,
  };
}

/**
 * 生成建议文本
 */
export function generateSuggestionText(
  result: SuggestionResult,
  lang: 'zh-CN' | 'en' = 'zh-CN'
): string {
  const title = result.title || 'New insight';
  const tags = result.tags?.join(', ') || 'insight';
  
  if (lang === 'zh-CN') {
    return `💡 TIL: ${title}\nTags: ${tags} · 记录一下？(yes/no)`;
  }
  
  return `💡 TIL: ${title}\nTags: ${tags} · Save it? (yes/no)`;
}

/**
 * 解析用户响应
 */
export function parseSuggestionResponse(
  response: string
): 'accept' | 'reject' | 'ignore' {
  const lower = response.toLowerCase().trim();
  
  // 接受的关键词
  const acceptKeywords = ['yes', 'y', 'save', 'ok', '好', '是的', '记录', 'yep', 'yeah', 'sure', 'please'];
  
  // 拒绝的关键词
  const rejectKeywords = ['no', 'n', 'nope', 'nah', 'skip', '不用', '不了', '否'];
  
  for (const keyword of acceptKeywords) {
    if (lower === keyword || lower.startsWith(keyword + ' ')) {
      return 'accept';
    }
  }
  
  for (const keyword of rejectKeywords) {
    if (lower === keyword || lower.startsWith(keyword + ' ')) {
      return 'reject';
    }
  }
  
  return 'ignore';
}

// ==================== 统计工具 ====================

/**
 * 获取 Auto-detection 统计信息
 */
export function getAutoDetectStats(userId: string) {
  const state = getAutoDetectState(userId);
  
  return {
    enabled: state.enabled,
    sessionRejected: state.sessionRejected,
    currentTurn: state.currentTurn,
    cooldownRemaining: Math.max(
      0,
      state.cooldownTurns - (state.currentTurn - state.lastAcceptedTurn)
    ),
    totalSuggestions: state.totalSuggestions,
    totalAccepted: state.totalAccepted,
    acceptanceRate:
      state.totalSuggestions > 0
        ? (state.totalAccepted / state.totalSuggestions) * 100
        : 0,
    lastSuggestionAt: state.lastSuggestionAt,
  };
}
