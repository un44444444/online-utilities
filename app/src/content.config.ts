import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 工具集合：每个工具一个目录，content.md 的 frontmatter 即注册信息。
 * 新增工具 = 在 src/content/tools/ 下新建目录 + content.md（+ 交互组件）。
 */
const tools = defineCollection({
  loader: glob({ pattern: '**/content.md', base: './src/content/tools' }),
  schema: z.object({
    // 展示名称
    name: z.string(),
    // 独立 URL 路径，如 json-formatter → /json-formatter
    path: z
      .string()
      .regex(/^[a-z0-9-]+$/, 'path 只能包含小写字母、数字和连字符'),
    // 三层分区
    category: z.enum(['everyone', 'developers', 'codegen']),
    // SEO description，也是首页卡片与相关推荐的摘要
    description: z.string(),
    // 搜索关键词（中英文、别名），供 Ctrl+K 检索
    keywords: z.array(z.string()).default([]),
    // 相关工具推荐（填其他工具的 path）
    related: z.array(z.string()).default([]),
    // 分区内排序，小的在前
    order: z.number().default(99),
  }),
});

export const collections = { tools };
