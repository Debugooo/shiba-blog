import fs from 'fs';
import path from 'path';

// ==================== 数据模型接口 ====================

export interface User {
  id: string;
  username: string;
  nickname: string;
  bio: string;
  avatar_url?: string;
  email?: string;
  mbti?: string;
  is_agent: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  source?: 'human' | 'agent';  // 内容来源标识
  agent_name?: string;         // Agent名称
  model_name?: string;          // 模型名称
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  is_ai_generated?: boolean;    // AI生成标识
  source?: 'human' | 'agent';  // 内容来源
  agent_name?: string;          // Agent名称
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  parent_id?: string;          // 嵌套评论父ID
  mentions: string[];          // @提及的用户名列表
  is_ai_generated: boolean;    // AI生成标识
  is_deleted?: boolean;         // 软删除
}

export interface Like {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// ==================== 新增数据模型 ====================

// 通知
export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'shiba_publish';
  from_user_id: string;
  from_username: string;
  target_type: 'post' | 'comment' | 'user' | 'shiba';
  target_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// 收藏
export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

// Personal Access Token
export interface PAT {
  id: string;
  user_id: string;
  name: string;
  token_hash: string;
  permissions: string[];
  expires_at: string | null;
  created_at: string;
  last_used_at: string | null;
}

// SHIBA Entry (Shiba's Instant Blog Article)
export interface SHIBAEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  source: 'human' | 'agent';
  agent_name?: string;
  model_name?: string;
  author_id: string;
  author_username: string;
  status: 'draft' | 'published';
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// SHIBA 会话状态
export interface SHIBASessionState {
  user_id: string;
  last_created_entry_id: string | null;
  last_viewed_entry_id: string | null;
  updated_at: string;
  autoDetectState?: AutoDetectState;
}

// Auto-detection 状态
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

// Auto-detection 默认状态
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

// ==================== 数据库结构 ====================

interface Database {
  users: User[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
  follows: Follow[];
  messages: Message[];
  notifications: Notification[];
  bookmarks: Bookmark[];
  pats: PAT[];
  shiba_entries: SHIBAEntry[];
  shiba_session_states: SHIBASessionState[];
}

const initialData: Database = {
  users: [],
  posts: [],
  comments: [],
  likes: [],
  follows: [],
  messages: [],
  notifications: [],
  bookmarks: [],
  pats: [],
  shiba_entries: [],
  shiba_session_states: [],
};

// ==================== 数据库操作 ====================

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readDB(): Database {
  ensureDataDir();
  
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  const parsed = JSON.parse(data);
  
  // 兼容旧数据：初始化新字段
  if (!parsed.shiba_entries) {
    parsed.shiba_entries = [];
  }
  if (!parsed.pats) {
    parsed.pats = [];
  }
  if (!parsed.shiba_session_states) {
    parsed.shiba_session_states = [];
  }
  
  return parsed;
}

export function writeDB(data: Database): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== SHIBA ID 工具函数 ====================

/**
 * 将完整ID转换为短ID显示格式: shiba_xxx-yyy -> ...yyy
 */
export function toShortId(id: string): string {
  const parts = id.split('_');
  if (parts.length > 1) {
    return `...${parts[parts.length - 1].slice(-8)}`;
  }
  return `...${id.slice(-8)}`;
}

/**
 * 根据短ID查找完整ID
 * 支持: shiba_xxx-yyy, ...yyy, xxx-yyy, yyy (后8位匹配)
 */
export function resolveSHIBAId(shortId: string, authorId?: string): string | null {
  const db = readDB();
  
  // 精确匹配
  const exactMatch = db.shiba_entries.find(s => s.id === shortId);
  if (exactMatch) return exactMatch.id;
  
  // 完整ID后8位匹配
  const entries = authorId 
    ? db.shiba_entries.filter(s => s.author_id === authorId)
    : db.shiba_entries;
  
  const last8 = shortId.startsWith('...') ? shortId.slice(3) : shortId;
  
  const match = entries.find(s => {
    const idLast8 = s.id.slice(-8);
    const partsLast8 = s.id.split('_').pop()?.slice(-8);
    return idLast8 === last8 || partsLast8 === last8;
  });
  
  return match ? match.id : null;
}

// ==================== SHIBA 会话状态管理 ====================

export function getSHIBASessionState(userId: string): SHIBASessionState | null {
  const db = readDB();
  return db.shiba_session_states.find(s => s.user_id === userId) || null;
}

export function updateSHIBASessionState(userId: string, updates: Partial<SHIBASessionState>): void {
  const db = readDB();
  const index = db.shiba_session_states.findIndex(s => s.user_id === userId);
  
  if (index === -1) {
    // 创建新状态
    db.shiba_session_states.push({
      user_id: userId,
      last_created_entry_id: updates.last_created_entry_id || null,
      last_viewed_entry_id: updates.last_viewed_entry_id || null,
      updated_at: new Date().toISOString(),
    });
  } else {
    // 更新现有状态
    db.shiba_session_states[index] = {
      ...db.shiba_session_states[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
  }
  
  writeDB(db);
}

export function getLastCreatedSHIBAId(userId: string): string | null {
  const state = getSHIBASessionState(userId);
  return state?.last_created_entry_id || null;
}

// ==================== SHIBA Auto-detection 状态管理 ====================

/**
 * 获取用户的 Auto-detection 状态
 */
export function getAutoDetectState(userId: string): AutoDetectState {
  const state = getSHIBASessionState(userId);
  return state?.autoDetectState || { ...DEFAULT_AUTO_DETECT_STATE };
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
    });
  } else {
    // 更新现有状态
    const currentState = db.shiba_session_states[index].autoDetectState || {};
    const newState = {
      ...DEFAULT_AUTO_DETECT_STATE,
      ...currentState,
      ...updates,
    };
    
    db.shiba_session_states[index] = {
      ...db.shiba_session_states[index],
      autoDetectState: newState,
      updated_at: new Date().toISOString(),
    };
  }
  
  writeDB(db);
  
  return getAutoDetectState(userId);
}

/**
 * 增加对话轮次
 */
export function incrementAutoDetectTurn(userId: string): number {
  const state = getAutoDetectState(userId);
  const newTurn = state.currentTurn + 1;
  
  updateAutoDetectState(userId, { currentTurn: newTurn });
  
  return newTurn;
}

/**
 * 接受建议
 */
export function acceptAutoDetectSuggestion(userId: string): AutoDetectState {
  const state = getAutoDetectState(userId);
  
  return updateAutoDetectState(userId, {
    lastAcceptedTurn: state.currentTurn,
    totalAccepted: state.totalAccepted + 1,
    totalSuggestions: state.totalSuggestions + 1,
    lastSuggestionAt: new Date().toISOString(),
  });
}

/**
 * 拒绝建议（整个session不再打扰）
 */
export function rejectAutoDetectSuggestion(userId: string): AutoDetectState {
  return updateAutoDetectState(userId, {
    sessionRejected: true,
    totalSuggestions: getAutoDetectState(userId).totalSuggestions + 1,
  });
}

/**
 * 重置 session 状态
 */
export function resetAutoDetectSession(userId: string): AutoDetectState {
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

// ==================== 用户操作 ====================

export function createUser(userData: Partial<User>): User {
  const db = readDB();
  const user: User = {
    id: generateId(),
    username: userData.username || '',
    nickname: userData.nickname || userData.username || '',
    bio: userData.bio || '',
    avatar_url: userData.avatar_url,
    email: userData.email,
    mbti: userData.mbti,
    is_agent: userData.is_agent ?? true,
    is_verified: userData.is_verified ?? false,
    source: userData.source || (userData.is_agent ? 'agent' : 'human'),
    agent_name: userData.agent_name,
    model_name: userData.model_name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  db.users.push(user);
  writeDB(db);
  return user;
}

export function getUserByUsername(username: string): User | undefined {
  const db = readDB();
  return db.users.find(u => u.username === username);
}

export function getUserById(id: string): User | undefined {
  const db = readDB();
  return db.users.find(u => u.id === id);
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const db = readDB();
  const index = db.users.findIndex(u => u.id === id);
  
  if (index === -1) return null;
  
  db.users[index] = {
    ...db.users[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  writeDB(db);
  return db.users[index];
}

// ==================== 关注操作 ====================

export function createFollow(followerId: string, followingId: string): Follow | null {
  const db = readDB();
  
  const existing = db.follows.find(
    f => f.follower_id === followerId && f.following_id === followingId
  );
  
  if (existing) return null;
  
  const follow: Follow = {
    id: generateId(),
    follower_id: followerId,
    following_id: followingId,
    created_at: new Date().toISOString(),
  };
  
  db.follows.push(follow);
  writeDB(db);
  return follow;
}

export function deleteFollow(followerId: string, followingId: string): boolean {
  const db = readDB();
  const index = db.follows.findIndex(
    f => f.follower_id === followerId && f.following_id === followingId
  );
  
  if (index === -1) return false;
  
  db.follows.splice(index, 1);
  writeDB(db);
  return true;
}

export function isFollowing(followerId: string, followingId: string): boolean {
  const db = readDB();
  return db.follows.some(
    f => f.follower_id === followerId && f.following_id === followingId
  );
}

// ==================== 点赞操作 ====================

export function createLike(userId: string, postId?: string, commentId?: string): Like | null {
  const db = readDB();
  
  const existing = db.likes.find(
    l => l.user_id === userId && 
    ((postId && l.post_id === postId) || (commentId && l.comment_id === commentId))
  );
  
  if (existing) return null;
  
  const like: Like = {
    id: generateId(),
    user_id: userId,
    post_id: postId,
    comment_id: commentId,
    created_at: new Date().toISOString(),
  };
  
  db.likes.push(like);
  writeDB(db);
  return like;
}

export function deleteLike(userId: string, postId?: string, commentId?: string): boolean {
  const db = readDB();
  const index = db.likes.findIndex(
    l => l.user_id === userId && 
    ((postId && l.post_id === postId) || (commentId && l.comment_id === commentId))
  );
  
  if (index === -1) return false;
  
  db.likes.splice(index, 1);
  writeDB(db);
  return true;
}

// ==================== 私信操作 ====================

export function createMessage(fromUserId: string, toUserId: string, content: string): Message {
  const db = readDB();
  const message: Message = {
    id: generateId(),
    from_user_id: fromUserId,
    to_user_id: toUserId,
    content,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  
  db.messages.push(message);
  writeDB(db);
  return message;
}

export function getMessages(userId: string, otherUserId?: string): Message[] {
  const db = readDB();
  
  if (otherUserId) {
    return db.messages.filter(
      m => (m.from_user_id === userId && m.to_user_id === otherUserId) ||
           (m.from_user_id === otherUserId && m.to_user_id === userId)
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  return db.messages.filter(
    m => m.from_user_id === userId || m.to_user_id === userId
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ==================== 统计相关 ====================

export function getUserStats(userId: string) {
  const db = readDB();
  
  const postsCount = db.posts.filter(p => p.author_id === userId).length;
  const likesReceived = db.likes.filter(l => {
    const post = db.posts.find(p => p.id === l.post_id);
    return post && post.author_id === userId;
  }).length;
  const commentsCount = db.comments.filter(c => c.author_id === userId && !c.is_deleted).length;
  const followersCount = db.follows.filter(f => f.following_id === userId).length;
  const followingCount = db.follows.filter(f => f.follower_id === userId).length;
  const bookmarksCount = db.bookmarks.filter(b => b.user_id === userId).length;
  const shibaCount = db.shiba_entries.filter(s => s.author_id === userId).length;
  
  return {
    postsCount,
    likesReceived,
    commentsCount,
    followersCount,
    followingCount,
    bookmarksCount,
    shibaCount,
  };
}

// ==================== 评论操作 ====================

export function createComment(data: {
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  parent_id?: string;
  mentions?: string[];
  is_ai_generated?: boolean;
}): Comment {
  const db = readDB();
  const comment: Comment = {
    id: generateId(),
    post_id: data.post_id,
    author_id: data.author_id,
    author_name: data.author_name,
    content: data.content,
    parent_id: data.parent_id,
    mentions: data.mentions || [],
    is_ai_generated: data.is_ai_generated || false,
    created_at: new Date().toISOString(),
  };
  
  db.comments.push(comment);
  writeDB(db);
  return comment;
}

export function getCommentsByPostId(postId: string): Comment[] {
  const db = readDB();
  return db.comments
    .filter(c => c.post_id === postId && !c.is_deleted)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function getCommentReplies(commentId: string): Comment[] {
  const db = readDB();
  return db.comments
    .filter(c => c.parent_id === commentId && !c.is_deleted)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function deleteComment(commentId: string): boolean {
  const db = readDB();
  const comment = db.comments.find(c => c.id === commentId);
  
  if (!comment) return false;
  
  comment.is_deleted = true;
  writeDB(db);
  return true;
}

// ==================== 通知操作 ====================

export function createNotification(data: {
  user_id: string;
  type: Notification['type'];
  from_user_id: string;
  from_username: string;
  target_type: 'post' | 'comment' | 'user' | 'shiba';
  target_id: string;
  content: string;
}): Notification {
  const db = readDB();
  const notification: Notification = {
    id: generateId(),
    user_id: data.user_id,
    type: data.type,
    from_user_id: data.from_user_id,
    from_username: data.from_username,
    target_type: data.target_type,
    target_id: data.target_id,
    content: data.content,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  
  db.notifications.push(notification);
  writeDB(db);
  return notification;
}

export function getNotifications(userId: string, limit = 50): Notification[] {
  const db = readDB();
  return db.notifications
    .filter(n => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export function getUnreadNotificationCount(userId: string): number {
  const db = readDB();
  return db.notifications.filter(n => n.user_id === userId && !n.is_read).length;
}

export function markNotificationAsRead(notificationId: string): boolean {
  const db = readDB();
  const notification = db.notifications.find(n => n.id === notificationId);
  
  if (!notification) return false;
  
  notification.is_read = true;
  writeDB(db);
  return true;
}

export function markAllNotificationsAsRead(userId: string): number {
  const db = readDB();
  let count = 0;
  
  db.notifications.forEach(n => {
    if (n.user_id === userId && !n.is_read) {
      n.is_read = true;
      count++;
    }
  });
  
  if (count > 0) {
    writeDB(db);
  }
  
  return count;
}

export function deleteNotification(notificationId: string): boolean {
  const db = readDB();
  const index = db.notifications.findIndex(n => n.id === notificationId);
  
  if (index === -1) return false;
  
  db.notifications.splice(index, 1);
  writeDB(db);
  return true;
}

// ==================== 收藏操作 ====================

export function createBookmark(userId: string, postId: string): Bookmark | null {
  const db = readDB();
  
  const existing = db.bookmarks.find(
    b => b.user_id === userId && b.post_id === postId
  );
  
  if (existing) return null;
  
  const bookmark: Bookmark = {
    id: generateId(),
    user_id: userId,
    post_id: postId,
    created_at: new Date().toISOString(),
  };
  
  db.bookmarks.push(bookmark);
  writeDB(db);
  return bookmark;
}

export function deleteBookmark(userId: string, postId: string): boolean {
  const db = readDB();
  const index = db.bookmarks.findIndex(
    b => b.user_id === userId && b.post_id === postId
  );
  
  if (index === -1) return false;
  
  db.bookmarks.splice(index, 1);
  writeDB(db);
  return true;
}

export function isBookmarked(userId: string, postId: string): boolean {
  const db = readDB();
  return db.bookmarks.some(b => b.user_id === userId && b.post_id === postId);
}

export function getUserBookmarks(userId: string): Bookmark[] {
  const db = readDB();
  return db.bookmarks
    .filter(b => b.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ==================== SHIBA Entry 操作 ====================

export function createSHIBAEntry(data: {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  source?: 'human' | 'agent';
  agent_name?: string;
  model_name?: string;
  author_id: string;
  author_username: string;
  status?: 'draft' | 'published';
}): SHIBAEntry {
  const db = readDB();
  const shiba: SHIBAEntry = {
    id: `shiba_${generateId()}`,
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    category: data.category,
    source: data.source || 'human',
    agent_name: data.agent_name,
    model_name: data.model_name,
    author_id: data.author_id,
    author_username: data.author_username,
    status: data.status || 'draft',
    views: 0,
    likes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  db.shiba_entries.push(shiba);
  
  // 更新会话状态 - 记录最后创建的条目ID
  const sessionIndex = db.shiba_session_states.findIndex(s => s.user_id === data.author_id);
  if (sessionIndex === -1) {
    db.shiba_session_states.push({
      user_id: data.author_id,
      last_created_entry_id: shiba.id,
      last_viewed_entry_id: null,
      updated_at: new Date().toISOString(),
    });
  } else {
    db.shiba_session_states[sessionIndex].last_created_entry_id = shiba.id;
    db.shiba_session_states[sessionIndex].updated_at = new Date().toISOString();
  }
  
  writeDB(db);
  return shiba;
}

export function getSHIBAById(id: string): SHIBAEntry | undefined {
  const db = readDB();
  return db.shiba_entries.find(s => s.id === id);
}

export function getSHIBAEntries(options?: {
  author_id?: string;
  status?: 'draft' | 'published';
  tag?: string;
  category?: string;
  limit?: number;
}): SHIBAEntry[] {
  const db = readDB();
  let results = db.shiba_entries;
  
  if (options?.author_id) {
    results = results.filter(s => s.author_id === options.author_id);
  }
  
  if (options?.status) {
    results = results.filter(s => s.status === options.status);
  }
  
  if (options?.tag) {
    results = results.filter(s => s.tags.includes(options.tag!));
  }
  
  if (options?.category) {
    results = results.filter(s => s.category === options.category);
  }
  
  results = results
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
}

export function updateSHIBAEntry(id: string, updates: Partial<SHIBAEntry>): SHIBAEntry | null {
  const db = readDB();
  const index = db.shiba_entries.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  db.shiba_entries[index] = {
    ...db.shiba_entries[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  if (updates.status === 'published' && !db.shiba_entries[index].published_at) {
    db.shiba_entries[index].published_at = new Date().toISOString();
  }
  
  writeDB(db);
  return db.shiba_entries[index];
}

export function deleteSHIBAEntry(id: string): boolean {
  const db = readDB();
  const index = db.shiba_entries.findIndex(s => s.id === id);
  
  if (index === -1) return false;
  
  db.shiba_entries.splice(index, 1);
  writeDB(db);
  return true;
}

export function incrementSHIBAViews(id: string): void {
  const db = readDB();
  const shiba = db.shiba_entries.find(s => s.id === id);
  
  if (shiba) {
    shiba.views++;
    writeDB(db);
  }
}

export function searchSHIBAEntries(keyword: string): SHIBAEntry[] {
  const db = readDB();
  const lowerKeyword = keyword.toLowerCase();
  
  return db.shiba_entries.filter(s => 
    s.status === 'published' && (
      s.title.toLowerCase().includes(lowerKeyword) ||
      s.content.toLowerCase().includes(lowerKeyword) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    )
  );
}

export function getAllSHIBATags(): { tag: string; count: number }[] {
  const db = readDB();
  const tagCounts = new Map<string, number>();
  
  db.shiba_entries.forEach(s => {
    s.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllSHIBACategories(): { category: string; count: number; description?: string }[] {
  const db = readDB();
  const categoryCounts = new Map<string, number>();
  
  db.shiba_entries.forEach(s => {
    if (s.category) {
      categoryCounts.set(s.category, (categoryCounts.get(s.category) || 0) + 1);
    }
  });
  
  // 预设分类描述
  const categoryDescriptions: Record<string, string> = {
    '编程开发': '代码、算法、技术实现等开发相关知识',
    'DevOps': '部署、CI/CD、服务器运维等',
    '数据库': 'SQL、NoSQL、查询优化等数据库相关',
    'AI与机器学习': '人工智能、深度学习、模型训练等',
    '前端开发': 'React、Vue、JavaScript等前端技术',
    '后端开发': 'Node、Python、Java等后端服务',
    '云计算': 'AWS、Azure、云原生等',
    '安全': '认证、加密、安全防护等',
    '性能优化': '缓存、并发、性能调优等',
    '工具使用': '编辑器、命令行、开发工具等',
  };
  
  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ 
      category, 
      count,
      description: categoryDescriptions[category],
    }))
    .sort((a, b) => b.count - a.count);
}

// SHIBA 状态统计
export function getSHIBAStats(authorId?: string): {
  total: number;
  drafts: number;
  published: number;
  totalViews: number;
  totalLikes: number;
  tagsCount: number;
  categoriesCount: number;
} {
  const db = readDB();
  let entries = db.shiba_entries;
  
  if (authorId) {
    entries = entries.filter(s => s.author_id === authorId);
  }
  
  const drafts = entries.filter(s => s.status === 'draft').length;
  const published = entries.filter(s => s.status === 'published').length;
  const totalViews = entries.reduce((sum, s) => sum + s.views, 0);
  const totalLikes = entries.reduce((sum, s) => sum + s.likes, 0);
  
  // 统计标签和分类
  const tagsSet = new Set<string>();
  const categoriesSet = new Set<string>();
  entries.forEach(s => {
    s.tags.forEach(tag => tagsSet.add(tag));
    if (s.category) categoriesSet.add(s.category);
  });
  
  return {
    total: entries.length,
    drafts,
    published,
    totalViews,
    totalLikes,
    tagsCount: tagsSet.size,
    categoriesCount: categoriesSet.size,
  };
}

// ==================== 导出用户数据 ====================

export interface UserExportData {
  user: User;
  posts: Post[];
  comments: Comment[];
  bookmarks: Bookmark[];
  shiba_entries: SHIBAEntry[];
  follows: {
    followers: User[];
    following: User[];
  };
  exportDate: string;
}

export function exportUserData(userId: string): UserExportData | null {
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  
  if (!user) return null;
  
  const posts = db.posts.filter(p => p.author_id === userId);
  const comments = db.comments.filter(c => c.author_id === userId);
  const bookmarks = db.bookmarks.filter(b => b.user_id === userId);
  const shiba_entries = db.shiba_entries.filter(s => s.author_id === userId);
  
  const followerIds = db.follows.filter(f => f.following_id === userId).map(f => f.follower_id);
  const followingIds = db.follows.filter(f => f.follower_id === userId).map(f => f.following_id);
  
  return {
    user,
    posts,
    comments,
    bookmarks,
    shiba_entries,
    follows: {
      followers: db.users.filter(u => followerIds.includes(u.id)),
      following: db.users.filter(u => followingIds.includes(u.id)),
    },
    exportDate: new Date().toISOString(),
  };
}
