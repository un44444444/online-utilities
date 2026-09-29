# 在线工具箱

干净、免费、纯前端的在线工具箱。技术栈：**Astro 7 + Vue 3（Islands）+ Tailwind CSS v4**，全站静态生成，托管于 Cloudflare Pages。

## 快速开始

要求 Node.js ≥ 22.12。

```bash
npm install
npm run dev      # 本地开发
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

## 架构：三层分离

```
src/
├── content.config.ts            # 内容集合定义 + Zod schema（meta 校验）
├── content/tools/               # ★ 每个工具一个目录：frontmatter 即注册信息
│   ├── json-formatter/content.md
│   └── password-generator/content.md
├── tools/                       # ★ 交互组件（Vue Islands）
│   ├── json-formatter/logic.ts      # 纯 TS 逻辑层（零框架依赖，可单测/跨框架复用）
│   ├── json-formatter/tool.vue      # 薄壳 UI（client:load 按需水合）
│   └── password-generator/...
├── pages/[tool].astro           # 一个动态路由静态生成全部工具页
├── pages/index.astro            # 首页三层网格（自动生成）
└── layouts/                     # BaseLayout（SEO/canonical/深色模式）+ ToolLayout（JSON-LD/相关推荐）
```

## 新增一个工具（三步）

以添加 `base64` 工具为例：

1. **写内容与 meta**：新建 `src/content/tools/base64/content.md`，frontmatter 填 `name / path / category / description / keywords / related / order`，正文写使用说明（markdown）。Zod 会在构建时校验，缺字段直接报错。
2. **写逻辑与界面**：新建 `src/tools/base64/logic.ts`（纯 TS）和 `src/tools/base64/tool.vue`（Vue 薄壳）。
3. **挂载组件**：在 `src/pages/[tool].astro` 加一行 `import` 和一行 `{dirName === 'base64' && <Base64Tool client:load />}`。

其余全部自动完成：路由 `/base64`、首页卡片、sitemap、相关推荐。

> 为什么第 3 步不能全自动？Astro 的 `client:` 水合指令要求组件标识符编译期可见，不能经 Record/动态变量传递。这是显式分支渲染的已知取舍。

## 部署到 Cloudflare Pages

1. 把代码推到 GitHub 仓库。
2. Cloudflare Dashboard → Pages → **Connect to Git**，选择仓库。
3. 构建配置自动识别 Astro：**构建命令 `npm run build`，输出目录 `dist`**。每次 push 自动部署，PR 自动生成预览链接。

## 上线前必改

- `astro.config.mjs` 中的 `site: 'https://example.com'` → 您的正式域名（影响 canonical、OG、sitemap）。
- `src/layouts/BaseLayout.astro` 中的 `siteName` → 品牌名。
- `public/favicon.svg` → 正式图标。

## 设计原则（对应 PRD）

- 纯前端本地处理，零 Cookie、零第三方追踪
- 内容 markdown 驱动，交互 Vue Islands 按需水合
- 每工具独立 URL + SEO meta + JSON-LD + sitemap
