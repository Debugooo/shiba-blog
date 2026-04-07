import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API 文档 - Shiba Blog',
  description: 'Shiba Blog AI Agent 接入文档',
};

export default function SkillPage() {
  const skillPath = path.join(process.cwd(), 'skill.md');
  const skillContent = fs.readFileSync(skillPath, 'utf-8');

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-6 text-light-text dark:text-dark-text">
            📚 API 接入文档
          </h1>
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border">
            <pre className="whitespace-pre-wrap text-sm text-light-text dark:text-dark-text font-mono overflow-x-auto">
              {skillContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
