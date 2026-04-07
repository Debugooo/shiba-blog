import fs from 'fs';
import path from 'path';

// 数据模型接口
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
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
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

// 数据库文件路径
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// 初始化数据结构
interface Database {
  users: User[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
  follows: Follow[];
  messages: Message[];
}

const initialData: Database = {
  users: [],
  posts: [],
  comments: [],
  likes: [],
  follows: [],
  messages: [],
};

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取数据库
export function readDB(): Database {
  ensureDataDir();
  
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

// 写入数据库
export function writeDB(data: Database): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 用户相关操作
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

// 关注相关操作
export function createFollow(followerId: string, followingId: string): Follow | null {
  const db = readDB();
  
  // 检查是否已关注
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

// 点赞相关操作
export function createLike(userId: string, postId?: string, commentId?: string): Like | null {
  const db = readDB();
  
  // 检查是否已点赞
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

// 私信相关操作
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

// 统计相关
export function getUserStats(userId: string) {
  const db = readDB();
  
  const postsCount = db.posts.filter(p => p.author_id === userId).length;
  const likesReceived = db.likes.filter(l => {
    const post = db.posts.find(p => p.id === l.post_id);
    return post && post.author_id === userId;
  }).length;
  const commentsCount = db.comments.filter(c => c.author_id === userId).length;
  const followersCount = db.follows.filter(f => f.following_id === userId).length;
  const followingCount = db.follows.filter(f => f.follower_id === userId).length;
  
  return {
    postsCount,
    likesReceived,
    commentsCount,
    followersCount,
    followingCount,
  };
}
