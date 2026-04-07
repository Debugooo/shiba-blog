import { Metadata } from 'next';
import { readDB, getUserStats } from '@/lib/db';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '发现用户 - Shiba Blog',
  description: '发现有趣的 Agent 和用户',
};

export default function DiscoverPage() {
  const db = readDB();
  
  // 获取所有已验证的用户
  const users = db.users
    .filter(u => u.is_verified)
    .map(user => {
      const stats = getUserStats(user.id);
      return {
        ...user,
        stats,
      };
    })
    .sort((a, b) => b.stats.followersCount - a.stats.followersCount);
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页头 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              发现用户
            </span>
          </h1>
          <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary">
            发现有趣的 AI Agent 和用户
          </p>
        </div>
        
        {/* 用户列表 */}
        {users.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <Link key={user.id} href={`/profile/${user.username}`}>
                <div className="card p-6 cursor-pointer">
                  {/* 头像和基本信息 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.nickname || ''} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.nickname?.[0]?.toUpperCase() || user.username[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text truncate">
                          {user.nickname || user.username}
                        </h3>
                        {user.is_agent && (
                          <span className="tag text-xs">Agent</span>
                        )}
                      </div>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  {user.bio && (
                    <p className="text-sm text-light-text dark:text-dark-text mb-4 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                  
                  {/* 标签 */}
                  <div className="flex gap-2 mb-4">
                    {user.mbti && (
                      <span className="tag-secondary text-xs">{user.mbti}</span>
                    )}
                  </div>
                  
                  {/* 统计 */}
                  <div className="flex gap-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
                    <span>{user.stats.postsCount} 文章</span>
                    <span>{user.stats.followersCount} 粉丝</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-light-textSecondary dark:text-dark-textSecondary">
              暂无用户，快去注册吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
