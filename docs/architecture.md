# 架构文档：在线工具箱

| 项目 | 内容 |
|---|---|
| 文档版本 | v1.0 |
| 日期 | 2026-09-29 |
| 关联文档 | [requirements.md](./requirements.md)（需求）、《产品需求文档（PRD）》v1.0 |
| 状态 | 已落地（M1 完成，随代码演进同步更新） |

## 1. 技术选型与决策记录

| 决策 | 结论 | 理由 |
|---|---|---|
| 框架 | **Astro 7** | 静态优先、零 JS 默认、Islands 按需水合；内容驱动站点 SEO/性能最优；2026-01 起由 Cloudflare 官方支持 |
| 交互组件 | **Vue 3 SFC（Islands）** | 团队 Vue 背景最深；Astro 对 Vue 一等支持；将来可渐进迁移或混用其他框架 |
| 样式 | **Tailwind CSS v4**（Vite 插件接入） | class 策略深色模式一行切换 |
| 内容 | **Astro Content Layer**（glob loader + Zod） | markdown 驱动 + 构建期 schema 校验 |
| 托管 | **Cloudflare Pages**（GitHub 直连） | 静态请求免费不限量；push 自动构建部署，PR 自动生成预览 |
| 被否方案 | Next.js（JS 基线负载违背性能目标）、fork it-tools（GPLv3 限制商业化、教学型 UI 需重写）、VitePress（文档站基因、整页水合） | 见 PRD 技术调研过程 |

## 2. 分层架构

核心原则：**逻辑与 UI 分离、UI 与框架解耦**——切换框架时只重写薄壳组件，核心资产（工具算法 + 测试）不动。

```
┌─────────────────────────────────────────────┐
│ 页面层（Astro 模板，构建期静态生成）           │  src/pages/[tool].astro
│  SEO meta / JSON-LD / canonical / markdown  │
├─────────────────────────────────────────────┤
│ UI 层（Vue SFC，Islands 按需水合）            │  src/tools/*/tool.vue
│  状态绑定 + 事件，只调逻辑层，不写算法         │
├─────────────────────────────────────────────┤
│ 逻辑层（纯 TypeScript，零框架依赖）            │  src/tools/*/logic.ts
│  可单测、可在任何框架/Node 中复用              │
├─────────────────────────────────────────────┤
│ 内容层（markdown + frontmatter meta）          │  src/content/tools/*/content.md
│  Zod schema 构建期校验，缺字段直接报错         │
└─────────────────────────────────────────────┘
```

## 3. 目录结构

```
app/
├── astro.config.mjs        # site 占位域名（上线前必改）、Vue/sitemap/Tailwind 集成
├── src/
│   ├── content.config.ts   # ★ tools 集合定义（src/ 目录下，Astro 7 约定）
│   ├── content/tools/      # ★ 内容层：frontmatter 即注册信息
│   ├── tools/              # ★ 逻辑层 + UI 层（每工具一个目录）
│   ├── pages/              # [tool].astro 动态路由静态生成全部工具页
│   ├── layouts/            # BaseLayout（SEO/深色模式）+ ToolLayout（JSON-LD/相关推荐）
│   ├── components/         # 通用组件（ThemeToggle/CopyButton）
│   └── styles/global.css   # Tailwind v4 + dark class 变体
├── public/favicon.svg
└── docs/                   # 本目录
```

## 4. 关键机制

### 4.1 插件化注册（新增工具的数据流）

```
content/tools/base64/content.md ──┐
                                  ├─→ content.config.ts (glob loader 扫描)
                                  │   Zod 校验 frontmatter → 构建失败于缺字段
                                  ↓
        pages/[tool].astro getStaticPaths() → /base64 路由 + sitemap 条目
                                  ↓
        index.astro 按 category 分组 → 首页三层网格卡片
                                  ↓
        [tool].astro 渲染：meta → SEO/JSON-LD + content.md → 说明长文
                      + tool.vue（client:load island）→ 交互本体
```

新增工具三步：写 md（meta）→ 写 logic.ts + tool.vue → `[tool].astro` 加一行 import + 一行分支渲染。

### 4.2 Islands 水合的编译期约束（已知取舍）

`client:` 指令要求组件标识符**编译期可见**：静态 import + 模板中显式分支渲染。经 Record 映射或动态变量传递组件会在构建期抛 `NoMatchingImport`。这是 Astro 的硬约束，代价是新增工具需改一行 `[tool].astro`；收益是水合脚本精确按需生成。

水合策略选择：`client:load`（工具页进入即激活，符合"3 秒原则"）；未来重型工具（Pyodide 沙箱、图片 wasm）改用 `client:visible` 或 `client:idle`。

### 4.3 SEO 管线

- 每工具页：frontmatter `description` → meta description + OG + canonical + `SoftwareApplication` JSON-LD（ToolLayout）。
- `@astrojs/sitemap` 构建期生成全量 sitemap。
- `site` 配置驱动所有绝对 URL —— **上线前替换占位域名**。

### 4.4 主题与状态

- 深色模式：class 策略（`@custom-variant dark`），`<head>` 内联脚本在首屏渲染前应用 localStorage/系统偏好，无闪烁。
- 偏好仅存 localStorage，零 Cookie（对应隐私承诺）。

### 4.5 构建与部署

```
GitHub push ──→ Cloudflare Pages 自动构建（npm run build → dist/）
                    ├─ main 分支：生产部署
                    └─ PR：预览链接
```

本地要求 Node ≥ 22.12（Astro 7 硬性要求）。

## 5. 扩展方向（对应需求 P1/P2）

| 方向 | 方案要点 |
|---|---|
| Python 沙箱 | island 内动态 import Pyodide，`client:visible` 触发加载，不拖累全站 |
| 图片压缩/格式转换 | Canvas + Web Worker + wasm（mozjpeg/webp），大文件异步防阻塞 |
| 全局搜索（G-02） | 构建期由 meta.keywords 生成检索索引 JSON，前端模糊匹配 |
| i18n | Astro 内置 i18n 路由，先中文后 `/en` 子目录 |
| 匿名统计 | Cloudflare Web Analytics（无 cookie），隐私页披露 |
| 全局 toast | 复制反馈从按钮内文案升级为全局通知组件 |

## 6. 已知限制与风险

| 项 | 说明 | 缓解 |
|---|---|---|
| Node 版本 | Astro 7 需 ≥ 22.12，旧环境无法构建 | README 与本文档均标明 |
| 域名/品牌未定 | site 占位、canonical 与 sitemap 暂用 20140108.xyz | 上线前统一替换 |
| 内容变更触发全量重建 | md 修改需一次 Cloudflare Pages 构建 | 免费额度 500 次/月，充足 |
| it-tools 竞品 GPL | 只参考插件化思路，不复制代码 | 已规避许可证传染 |
