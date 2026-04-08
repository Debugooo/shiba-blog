import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import {
  createSHIBAEntry,
  getSHIBAEntries,
  getSHIBAById,
  updateSHIBAEntry,
  deleteSHIBAEntry,
  searchSHIBAEntries,
  getAllSHIBATags,
  getAllSHIBACategories,
  createNotification,
  getUserById,
  resolveSHIBAId,
  getLastCreatedSHIBAId,
  getSHIBASessionState,
  getSHIBAStats,
  toShortId,
} from '@/lib/db';

// 获取SHIBA条目列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'published' | null;
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // 搜索模式
    if (search) {
      const results = searchSHIBAEntries(search);
      return NextResponse.json({
        success: true,
        data: {
          entries: results.slice(0, limit),
          total: results.length,
        },
      });
    }
    
    // 获取所有标签
    if (searchParams.get('tags') === 'true') {
      const tags = getAllSHIBATags();
      return NextResponse.json({
        success: true,
        data: { tags },
      });
    }
    
    // 获取所有分类
    if (searchParams.get('categories') === 'true') {
      const categories = getAllSHIBACategories();
      return NextResponse.json({
        success: true,
        data: { categories },
      });
    }
    
    // 获取状态统计
    if (searchParams.get('stats') === 'true') {
      const authHeader = request.headers.get('Authorization');
      let authorId: string | undefined;
      
      if (authHeader) {
        const user = await withAuth(request, async (_, currentUser) => currentUser);
        if (user) authorId = user.id;
      }
      
      const stats = getSHIBAStats(authorId);
      return NextResponse.json({
        success: true,
        data: { stats },
      });
    }
    
    // 获取条目列表
    const entries = getSHIBAEntries({
      status: status || undefined,
      tag: tag || undefined,
      category: category || undefined,
      limit,
    });
    
    return NextResponse.json({
      success: true,
      data: { entries },
    });
  } catch (error) {
    console.error('Get SHIBA entries error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 创建SHIBA条目
export async function POST(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { title, content, tags, category, status } = body;
      
      if (!title || !content) {
        return NextResponse.json(
          { success: false, error: 'missing_fields', message: 'title和content是必填字段' },
          { status: 400 }
        );
      }
      
      const entry = createSHIBAEntry({
        title,
        content,
        tags: tags || [],
        category,
        source: currentUser.is_agent ? 'agent' : 'human',
        agent_name: currentUser.agent_name,
        model_name: currentUser.model_name,
        author_id: currentUser.id,
        author_username: currentUser.username,
        status: status || 'draft',
      });
      
      return NextResponse.json({
        success: true,
        data: { 
          entry,
          shortId: toShortId(entry.id),
        },
        message: 'SHIBA条目创建成功',
        last_created_entry_id: entry.id,
      });
    });
  } catch (error) {
    console.error('Create SHIBA entry error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 批量操作 / 单条操作
export async function PUT(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { id, ids, action, instructions } = body;
      
      // 单条操作
      if (id) {
        let targetId = id;
        
        // 处理 last 关键字
        if (id === 'last') {
          const lastId = getLastCreatedSHIBAId(currentUser.id);
          if (!lastId) {
            return NextResponse.json(
              { success: false, error: 'no_last_entry', message: '没有最近创建的条目' },
              { status: 400 }
            );
          }
          targetId = lastId;
        } else {
          // 解析短ID
          const resolved = resolveSHIBAId(id, currentUser.id);
          if (resolved) {
            targetId = resolved;
          }
        }
        
        const entry = getSHIBAById(targetId);
        
        if (!entry) {
          return NextResponse.json(
            { success: false, error: 'not_found', message: 'SHIBA条目不存在' },
            { status: 404 }
          );
        }
        
        if (entry.author_id !== currentUser.id) {
          return NextResponse.json(
            { success: false, error: 'forbidden', message: '无权限' },
            { status: 403 }
          );
        }
        
        switch (action) {
          case 'publish':
            updateSHIBAEntry(targetId, { status: 'published' });
            return NextResponse.json({
              success: true,
              data: { 
                id: targetId,
                shortId: toShortId(targetId),
                status: 'published',
              },
              message: '已发布',
            });
            
          case 'unpublish':
            updateSHIBAEntry(targetId, { status: 'draft' });
            return NextResponse.json({
              success: true,
              data: { 
                id: targetId,
                shortId: toShortId(targetId),
                status: 'draft',
              },
              message: '已取消发布',
            });
            
          case 'edit':
            if (!instructions) {
              return NextResponse.json(
                { success: false, error: 'missing_instructions', message: '缺少编辑指令' },
                { status: 400 }
              );
            }
            // AI辅助编辑 - 简单实现：支持标题和标签修改
            const updates: Partial<typeof entry> = {};
            
            // 解析指令
            const titleMatch = instructions.match(/标题.*?[:：]\s*(.+)/i) || 
                               instructions.match(/title.*?[:：]\s*(.+)/i);
            const tagsMatch = instructions.match(/标签.*?[:：]\s*(.+)/i) || 
                              instructions.match(/tags.*?[:：]\s*(.+)/i);
            
            if (titleMatch) {
              updates.title = titleMatch[1].trim();
            }
            if (tagsMatch) {
              updates.tags = tagsMatch[1].split(/[,，]/).map(t => t.trim()).filter(Boolean);
            }
            
            if (Object.keys(updates).length === 0) {
              return NextResponse.json(
                { success: false, error: 'invalid_instructions', message: '无法解析编辑指令' },
                { status: 400 }
              );
            }
            
            const updated = updateSHIBAEntry(targetId, updates);
            return NextResponse.json({
              success: true,
              data: { 
                entry: updated,
                shortId: toShortId(targetId),
                changes: updates,
              },
              message: '已更新',
            });
            
          case 'view':
            // 标记为最近查看
            const session = getSHIBASessionState(currentUser.id);
            return NextResponse.json({
              success: true,
              data: { 
                entry,
                shortId: toShortId(targetId),
                last_created_entry_id: session?.last_created_entry_id,
              },
            });
            
          default:
            return NextResponse.json(
              { success: false, error: 'unknown_action', message: '未知操作' },
              { status: 400 }
            );
        }
      }
      
      // 批量操作
      if (ids && Array.isArray(ids)) {
        let updated = 0;
        const results: { id: string; success: boolean }[] = [];
        
        for (const idItem of ids) {
          let targetId = idItem;
          
          // 处理 last 关键字
          if (idItem === 'last') {
            const lastId = getLastCreatedSHIBAId(currentUser.id);
            if (lastId) {
              targetId = lastId;
            } else {
              results.push({ id: idItem, success: false });
              continue;
            }
          } else {
            const resolved = resolveSHIBAId(idItem, currentUser.id);
            if (resolved) {
              targetId = resolved;
            }
          }
          
          const entry = getSHIBAById(targetId);
          if (entry && entry.author_id === currentUser.id) {
            if (action === 'publish') {
              updateSHIBAEntry(targetId, { status: 'published' });
              updated++;
              results.push({ id: targetId, success: true });
            } else if (action === 'unpublish') {
              updateSHIBAEntry(targetId, { status: 'draft' });
              updated++;
              results.push({ id: targetId, success: true });
            } else {
              results.push({ id: targetId, success: false });
            }
          } else {
            results.push({ id: targetId || idItem, success: false });
          }
        }
        
        return NextResponse.json({
          success: true,
          data: { updated, results },
          message: `已更新 ${updated} 条目`,
        });
      }
      
      return NextResponse.json(
        { success: false, error: 'missing_params', message: '缺少ID参数' },
        { status: 400 }
      );
    });
  } catch (error) {
    console.error('SHIBA update error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 删除SHIBA条目
export async function DELETE(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      
      if (!id) {
        return NextResponse.json(
          { success: false, error: 'missing_id', message: '缺少ID参数' },
          { status: 400 }
        );
      }
      
      let targetId = id;
      
      // 处理 last 关键字
      if (id === 'last') {
        const lastId = getLastCreatedSHIBAId(currentUser.id);
        if (!lastId) {
          return NextResponse.json(
            { success: false, error: 'no_last_entry', message: '没有最近创建的条目' },
            { status: 400 }
          );
        }
        targetId = lastId;
      } else {
        // 解析短ID
        const resolved = resolveSHIBAId(id, currentUser.id);
        if (resolved) {
          targetId = resolved;
        }
      }
      
      const entry = getSHIBAById(targetId);
      
      if (!entry) {
        return NextResponse.json(
          { success: false, error: 'not_found', message: 'SHIBA条目不存在' },
          { status: 404 }
        );
      }
      
      if (entry.author_id !== currentUser.id) {
        return NextResponse.json(
          { success: false, error: 'forbidden', message: '无权限' },
          { status: 403 }
        );
      }
      
      deleteSHIBAEntry(targetId);
      
      return NextResponse.json({
        success: true,
        data: { 
          id: targetId,
          shortId: toShortId(targetId),
          deleted: true,
        },
        message: '已删除',
      });
    });
  } catch (error) {
    console.error('Delete SHIBA entry error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}
