import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-agent';
import {
  getSHIBAEntries,
  searchSHIBAEntries,
  SHIBAEntry,
} from '@/lib/db';

// SHIBA API Headers
const SHIBA_RESPONSE_HEADERS = {
  'X-Shiba-Source': 'agent',
  'X-Shiba-Agent': 'Shiba Blog API',
  'X-Shiba-Model': 'API-v1.1.0',
};

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
      }, { headers: SHIBA_RESPONSE_HEADERS });
    });
  } catch (error) {
    console.error('Extract SHIBA error:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: '服务器错误' },
      { status: 500, headers: SHIBA_RESPONSE_HEADERS }
    );
  }
}

// 提取SHIBA候选的辅助函数
function extractSHIBACandidates(content: string, maxCount: number): {
  title: string;
  content: string;
  tags: string[];
  type: 'discovery' | 'tip' | 'debug' | 'aha' | 'insight';
  category?: string;
  confidence: number;
}[] {
  const candidates: {
    title: string;
    content: string;
    tags: string[];
    type: 'discovery' | 'tip' | 'debug' | 'aha' | 'insight';
    category?: string;
    confidence: number;
  }[] = [];
  
  // 分割对话为段落
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50);
  
  // 识别知识点的模式及其类型
  const patterns: { pattern: RegExp; type: 'discovery' | 'tip' | 'debug' | 'aha' | 'insight' }[] = [
    // 发现类
    { pattern: /(?:发现|found|realized|learned|注意到|notice|惊喜|aha|原来|没想到|竟然|惊讶)[：:]\s*(.+?)(?:\n|$)/gi, type: 'discovery' },
    // 技巧类
    { pattern: /(?:技巧|tip|trick|快捷键|shortcut|command|命令|高效|省时)[：:]\s*(.+?)(?:\n|$)/gi, type: 'tip' },
    // 解决方法类
    { pattern: /(?:解决方案|solution|修复|fix|解决|solved|突破|better|s更好)[：:]\s*(.+?)(?:\n|$)/gi, type: 'debug' },
    // 代码片段类
    { pattern: /(?:代码|code|```)([\s\S]+?)```/gi, type: 'tip' },
    // 有趣事实类
    { pattern: /(?:有趣|interesting|惊讶|surprising|fascinating|amazing|awesome)[：:]\s*(.+?)(?:\n|$)/gi, type: 'aha' },
  ];
  
  // 关键词及其对应的类型
  const keywordTypes: { keywords: string[]; type: 'discovery' | 'tip' | 'debug' | 'aha' | 'insight' }[] = [
    { keywords: ['发现', 'found', 'discovered', 'realized', '原来', '竟然', '没想到'], type: 'discovery' },
    { keywords: ['技巧', 'tip', 'trick', '快捷键', 'shortcut', 'command', '高效', '省时'], type: 'tip' },
    { keywords: ['解决方案', 'solution', '修复', 'fix', '解决', 'solved', '突破', 'bug'], type: 'debug' },
    { keywords: ['有趣', 'interesting', '惊讶', 'surprising', 'fascinating', 'aha'], type: 'aha' },
  ];
  
  paragraphs.forEach(para => {
    const lowerPara = para.toLowerCase();
    
    // 检查段落类型
    let detectedType: 'discovery' | 'tip' | 'debug' | 'aha' | 'insight' = 'insight';
    for (const kt of keywordTypes) {
      if (kt.keywords.some(k => lowerPara.includes(k.toLowerCase()))) {
        detectedType = kt.type;
        break;
      }
    }
    
    // 检查是否匹配模式
    let matched = false;
    patterns.forEach(({ pattern, type }) => {
      const matches = para.match(pattern);
      if (matches) {
        matched = true;
        matches.forEach(match => {
          const extractedContent = match.replace(/^[^：:]+[：:]\s*/, '').trim();
          if (extractedContent.length > 20) {
            candidates.push({
              title: generateTitle(extractedContent),
              content: extractedContent,
              tags: extractTags(extractedContent),
              type: type,
              category: detectCategory(extractedContent),
              confidence: 0.9,
            });
          }
        });
      }
    });
    
    // 如果段落足够长且包含关键词，添加为候选
    if (!matched && paragraphs.length <= maxCount * 2 && para.length > 100) {
      const hasKeyword = keywordTypes.some(kt => kt.keywords.some(k => lowerPara.includes(k.toLowerCase())));
      if (hasKeyword || para.length > 200) {
        candidates.push({
          title: generateTitle(para),
          content: para.trim(),
          tags: extractTags(para),
          type: detectedType,
          category: detectCategory(para),
          confidence: hasKeyword ? 0.7 : 0.5,
        });
      }
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
  type: 'discovery' | 'tip' | 'debug' | 'aha' | 'insight';
  category?: string;
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

// 自动检测内容分类
function detectCategory(content: string): string | undefined {
  const lowerContent = content.toLowerCase();
  
  const categoryPatterns: { category: string; keywords: string[] }[] = [
    { category: '编程开发', keywords: ['code', 'function', 'class', 'api', '函数', '代码', '编程', '开发', 'algorithm'] },
    { category: 'DevOps', keywords: ['docker', 'kubernetes', 'ci/cd', 'deploy', 'git', 'pipeline', '服务器', '部署'] },
    { category: '数据库', keywords: ['sql', 'database', 'mysql', 'mongodb', 'redis', '查询', '数据库', '表', '索引'] },
    { category: 'AI与机器学习', keywords: ['ai', 'machine learning', 'neural', 'gpt', 'llm', 'model', '训练', '模型', '深度学习'] },
    { category: '前端开发', keywords: ['react', 'vue', 'angular', 'css', 'html', 'javascript', 'typescript', '前端', '组件'] },
    { category: '后端开发', keywords: ['server', 'backend', 'node', 'python', 'java', 'golang', '后端', '接口', '微服务'] },
    { category: '云计算', keywords: ['aws', 'azure', 'gcp', 'cloud', 'serverless', 'lambda', '云', '存储', '计算'] },
    { category: '安全', keywords: ['security', 'auth', 'encryption', 'password', 'vulnerability', '安全', '认证', '加密'] },
    { category: '性能优化', keywords: ['performance', 'optimize', 'cache', 'speed', 'benchmark', '性能', '优化', '缓存', '并发'] },
    { category: '工具使用', keywords: ['tool', 'editor', 'ide', 'vim', 'terminal', 'shell', '工具', '编辑器', '命令行'] },
  ];
  
  for (const { category, keywords } of categoryPatterns) {
    if (keywords.some(k => lowerContent.includes(k))) {
      return category;
    }
  }
  
  return undefined;
}
