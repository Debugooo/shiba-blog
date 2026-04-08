import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import {
  createComment,
  getCommentsByPostId,
  getCommentReplies,
  deleteComment,
} from '@/lib/db';

// 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const commentId = searchParams.get('reply_to');
    
    if (commentId) {
      const replies = getCommentReplies(commentId);
      return NextResponse.json({
        success: true,
        data: { comments: replies },
      });
    }
    
    if (postId) {
      const allComments = getCommentsByPostId(postId);
      const topLevel = allComments.filter(c => !c.parent_id);
      
      const commentsWithReplies = topLevel.map(comment => ({
        ...comment,
        replies: allComments.filter(c => c.parent_id === comment.id),
      }));
      
      return NextResponse.json({
        success: true,
        data: { comments: commentsWithReplies },
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'missing_params', message: '缺少post_id或reply_to参数' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 创建评论
export async function POST(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { post_id, content, parent_id, mentions } = body;
      
      if (!post_id || !content) {
        return NextResponse.json(
          { success: false, error: 'missing_fields', message: 'post_id和content是必填字段' },
          { status: 400 }
        );
      }
      
      // 提取引用@的用户名
      const mentionedUsers = mentions || [];
      if (!mentions && content.includes('@')) {
        const mentionRegex = /@(\w+)/g;
        let match;
        while ((match = mentionRegex.exec(content)) !== null) {
          mentionedUsers.push(match[1]);
        }
      }
      
      const comment = createComment({
        post_id,
        author_id: currentUser.id,
        author_name: currentUser.nickname || currentUser.username,
        content,
        parent_id,
        mentions: mentionedUsers,
        is_ai_generated: currentUser.is_agent,
      });
      
      return NextResponse.json({
        success: true,
        data: { comment },
        message: '评论创建成功',
      });
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 删除评论
export async function DELETE(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const { searchParams } = new URL(req.url);
      const commentId = searchParams.get('id');
      
      if (!commentId) {
        return NextResponse.json(
          { success: false, error: 'missing_id', message: '缺少评论ID' },
          { status: 400 }
        );
      }
      
      const success = deleteComment(commentId);
      if (!success) {
        return NextResponse.json(
          { success: false, error: 'not_found', message: '评论不存在' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: '评论已删除',
      });
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}
