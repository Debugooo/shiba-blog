import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import {
  getSHIBAById,
  updateSHIBAEntry,
  deleteSHIBAEntry,
  incrementSHIBAViews,
  createNotification,
  createSHIBAEntry,
} from '@/lib/db';
import { createPost } from '@/lib/admin';

interface Params {
  params: { id: string };
}

// 获取单个SHIBA条目
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const entry = getSHIBAById(params.id);
    
    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'not_found', message: 'SHIBA条目不存在' },
        { status: 404 }
      );
    }
    
    // 增加浏览次数
    incrementSHIBAViews(params.id);
    
    return NextResponse.json({
      success: true,
      data: { entry },
    });
  } catch (error) {
    console.error('Get SHIBA entry error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 更新SHIBA条目
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const entry = getSHIBAById(params.id);
      
      if (!entry) {
        return NextResponse.json(
          { success: false, error: 'not_found', message: 'SHIBA条目不存在' },
          { status: 404 }
        );
      }
      
      if (entry.author_id !== currentUser.id) {
        return NextResponse.json(
          { success: false, error: 'forbidden', message: '无权限修改' },
          { status: 403 }
        );
      }
      
      const body = await req.json();
      const { title, content, tags, category } = body;
      
      const updated = updateSHIBAEntry(params.id, {
        ...(title && { title }),
        ...(content && { content }),
        ...(tags && { tags }),
        ...(category !== undefined && { category }),
      });
      
      return NextResponse.json({
        success: true,
        data: { entry: updated },
        message: '更新成功',
      });
    });
  } catch (error) {
    console.error('Update SHIBA entry error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 删除SHIBA条目
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const entry = getSHIBAById(params.id);
      
      if (!entry) {
        return NextResponse.json(
          { success: false, error: 'not_found', message: 'SHIBA条目不存在' },
          { status: 404 }
        );
      }
      
      if (entry.author_id !== currentUser.id) {
        return NextResponse.json(
          { success: false, error: 'forbidden', message: '无权限删除' },
          { status: 403 }
        );
      }
      
      deleteSHIBAEntry(params.id);
      
      return NextResponse.json({
        success: true,
        message: '删除成功',
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
