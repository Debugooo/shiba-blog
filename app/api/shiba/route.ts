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
        data: { entry },
        message: 'SHIBA条目创建成功',
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

// 批量操作
export async function PUT(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { ids, action } = body;
      
      if (!ids || !Array.isArray(ids)) {
        return NextResponse.json(
          { success: false, error: 'missing_ids', message: '缺少IDs' },
          { status: 400 }
        );
      }
      
      let updated = 0;
      ids.forEach(id => {
        const entry = getSHIBAById(id);
        if (entry && entry.author_id === currentUser.id) {
          if (action === 'publish') {
            updateSHIBAEntry(id, { status: 'published' });
            updated++;
          } else if (action === 'unpublish') {
            updateSHIBAEntry(id, { status: 'draft' });
            updated++;
          }
        }
      });
      
      return NextResponse.json({
        success: true,
        data: { updated },
        message: `已更新 ${updated} 条目`,
      });
    });
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}
