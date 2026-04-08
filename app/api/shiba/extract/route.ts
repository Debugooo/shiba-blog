import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import {
  getSHIBAEntries,
  searchSHIBAEntries,
  SHIBAEntry,
} from '@/lib/db';

// 从对话内容中提取SHIBA条目候选
export async function POST(request: NextRequest) {
  try {
    return await withAuth(request, async (req, currentUser) => {
      const body = await req.json();
      const { content, max_candidates = 5 } = body;
      
      if (!content) {
        return NextResponse.json(
          { success: false, error: 'missing_content', message: '缺少对话内容' },
          { status: 400 }
        );
      }
      
      // 智能提取逻辑 - 识别"aha moments"和知识点
      const candidates = extractSHIBACandidates(content, max_candidates);
      
      return NextResponse.json({
        success: true,
        data: { candidates },
        message: `找到 ${candidates.length} 个SHIBA候选`,
      });
    });
  } catch (error) {
    console.error('Extract SHIBA error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500 }
    );
  }
}

// 提取SHIBA候选的辅助函数
function extractSHIBACandidates(content: string, maxCount: number): {
  title: string;
  content: string;
  tags: string[];
  confidence: number;
}[] {
  const candidates: {
    title: string;
    content: string;
    tags: string[];
    confidence: number;
  }[] = [];
  
  // 分割对话为段落
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  // 识别知识点的模式
  const patterns = [
    // 发现类
    /(?:发现|found|realized|learned|注意到|notice|惊喜|aha)[：:]\s*(.+?)(?:\n|$)/gi,
    // 技巧类
    /(?:技巧|tip|trick|快捷键|shortcut|command|命令)[：:]\s*(.+?)(?:\n|$)/gi,
    // 解决方法类
    /(?:解决方案|solution|修复|fix|解决|solved|突破)[：:]\s*(.+?)(?:\n|$)/gi,
    // 代码片段类
    /(?:代码|code|```)([\s\S]+?)```/gi,
    // 有趣事实类
    /(?:有趣|interesting|惊讶|surprising|fascinating|没想到|didn't know)[：:]\s*(.+?)(?:\n|$)/gi,
  ];
  
  const keywords = [
    'learned', 'found', 'discovered', 'realized', '注意', '发现',
    '技巧', 'tip', 'trick', '快捷键', 'shortcut', 'command',
    '解决方案', 'solution', '修复', 'fix', '解决',
    '原来', '竟然', '没想到', '惊讶', '有趣'
  ];
  
  paragraphs.forEach(para => {
    const lowerPara = para.toLowerCase();
    
    // 检查是否包含知识点关键词
    const hasKeyword = keywords.some(k => lowerPara.includes(k.toLowerCase()));
    
    // 检查是否匹配模式
    let matched = false;
    patterns.forEach(pattern => {
      const matches = para.match(pattern);
      if (matches) {
        matched = true;
        matches.forEach(match => {
          const content = match.replace(/^[^：:]+[：:]\s*/, '').trim();
          if (content.length > 20) {
            candidates.push({
              title: generateTitle(content),
              content: content,
              tags: extractTags(content),
              confidence: 0.9,
            });
          }
        });
      }
    });
    
    // 如果段落足够长且包含关键词，添加为候选
    if (!matched && hasKeyword && para.length > 100) {
      candidates.push({
        title: generateTitle(para),
        content: para.trim(),
        tags: extractTags(para),
        confidence: 0.6,
      });
    }
  });
  
  // 去重并限制数量
  const unique = deduplicateCandidates(candidates);
  return unique.slice(0, maxCount);
}

function generateTitle(content: string): string {
  // 从内容中提取第一个有意义的句子作为标题
  const firstSentence = content.split(/[.。!?]/)[0];
  const title = firstSentence.trim().substring(0, 50);
  return title.length < firstSentence.length ? title + '...' : title;
}

function extractTags(content: string): string[] {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // 自动识别技术标签
  const techKeywords: Record<string, string> = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'react': 'react',
    'next.js': 'nextjs',
    'nextjs': 'nextjs',
    'linux': 'linux',
    'terminal': 'terminal',
    'git': 'git',
    'docker': 'docker',
    'api': 'api',
    'http': 'http',
    'json': 'json',
    'markdown': 'markdown',
    'ai': 'ai',
    'agent': 'agent',
  };
  
  Object.entries(techKeywords).forEach(([keyword, tag]) => {
    if (lowerContent.includes(keyword)) {
      tags.push(tag);
    }
  });
  
  return Array.from(new Set(tags)).slice(0, 5);
}

function deduplicateCandidates(candidates: {
  title: string;
  content: string;
  tags: string[];
  confidence: number;
}[]): typeof candidates {
  const seen = new Set<string>();
  return candidates.filter(c => {
    const key = c.title.substring(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
