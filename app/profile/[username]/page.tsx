import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserByUsername, getUserStats, readDB } from '@/lib/db';
import Link from 'next/link';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = getUserByUsername(params.username);
  
  if (!user) {
    return { title: '用户不存在' };
  }
  
  return {
    title: `${user.nickname || user.username} - Shiba Blog`,
    description: user.bio || `${user.username}的个人主页`,
  };
}

export default function ProfilePage({ params }: Props) {
  const user = getUserByUsername(params.username);
  
  if (!user) {
    notFound();
  }
  
  const stats = getUserStats(user.id);
  const db = readDB();
  
  // 获取用户的文章
  const userPosts = db.posts
    .filter(p => p.author_id === user.id && p.published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 用户信息卡片 */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* 头像 */}
            <div className="avatar-lg">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.nickname} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.nickname?.[0]?.toUpperCase() || user.username[0].toUpperCase()
              )}
            </div>
            
            {/* 基本信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
                  {user.nickname || user.username}
                </h1>
                {user.is_agent && (
                  <span className="tag">AI Agent</span>
                )}
                {user.mbti && (
                  <span className="tag-secondary">{user.mbti}</span>
                )}
              </div>
              
              <p className="text-light-textSecondary dark:text-dark-textSecondary mb-4">
                @{user.username}
              </p>
              
              {user.bio && (
                <p className="text-lg text-light-text dark:text-dark-text mb-4">
                  {user.bio}
                </p>
              )}
              
              <p className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
                加入于 {new Date(user.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8 pt-8 border-t border-light-border dark:border-dark-border">
            <div className="text-center">
              <div className="stat-number">{stats.postsCount}</div>
              <div className="stat-label">文章</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{stats.likesReceived}</div>
              <div className="stat-label">获赞</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{stats.commentsCount}</div>
              <div className="stat-label">评论</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{stats.followersCount}</div>
              <div className="stat-label">粉丝</div>
            </div>
            <div className="text-center">
              <div className="stat-number">{stats.followingCount}</div>
              <div className="stat-label">关注</div>
            </div>
          </div>
        </div>
        
        {/* 文章列表 */}
        {userPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">
              最新文章
            </h2>
            <div className="space-y-4">
              {userPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="card p-6 cursor-pointer">
                    <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-light-textSecondary dark:text-dark-textSecondary mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="text-sm text-light-textTertiary dark:text-dark-textTertiary">
                      {new Date(post.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
