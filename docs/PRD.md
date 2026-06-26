# AI Story Generator Web App — 分析 PRD

版本：v1.0  
日期：2026-06-26  
目标关键词：AI Story Generator  
产品类型：SEO 驱动型免费 Web 工具 + Freemium 写作工作台

---

## 1. 结论摘要

“AI Story Generator”值得做，但不能按普通博客词或泛 AI 工具词来做。你提供的数据里，Volume 80,000/月、KD=0、KGR=0.0045、SERP 100% 工具页，说明用户意图非常明确：用户不是来读文章，而是来立刻生成故事。

推荐策略：

1. 用 `/ai-story-generator` 做主工具页，首屏必须直接可用，不登录即可生成第一版。
2. 不要只做“一个输入框 + 一段输出”。当前竞品多数已经覆盖这个基础体验。需要做“结构化故事生成”：故事简介、标题、logline、角色、冲突、五段式大纲、正文、继续写、改写、换结局。
3. SEO 不是靠大量泛化文章，而是靠工具页质量、长尾子工具矩阵、示例 prompt、FAQ、结构化数据、速度和真实使用信号。
4. 商业化先用轻量广告和免费使用限制，之后转向项目保存、长篇续写、导出、图片故事书、儿童安全模式、创作者工作台等高级功能。

---

## 2. 市场与 SERP 判断

### 2.1 关键词质量

你提供的数据：

| 指标 | 数值 | 判断 |
|---|---:|---|
| 搜索量 | 80,000/月 | 高流量工具词 |
| KD | 0 | 异常低竞争 |
| CPC | $0.40 | 有广告主价值 |
| KGR | 0.0045 | 极度蓝海 |
| SERP 类型 | 100% 工具页 | 产品页优先，不适合纯博客打法 |

核心判断：这个关键词不是“信息查询”，而是“任务完成”。主页面必须是一个可以直接完成任务的工具页。

### 2.2 竞品观察

公开竞品页面呈现出几个共性：

- QuillBot 将 Story Generator 定位为生成 plot、characters、dialogue 的工具。
- Canva 将故事生成嵌入 Canva Docs，强调 prompt 和短故事写作。
- Perchance 强调 free、unlimited、no sign-up。
- ToolBaz 强调 free、no signup、beginning-middle-end 结构。
- Squibler 强调可自定义 story elements、genre、tone、style、voice。
- Type.ai 提供 genre 选择，并生成 outline 与 opening preview。
- EaseMate 强调 no sign-up、free、prompt + parameters。

这说明基础功能已经商品化。新产品要进入第一页，需要在“工具完成度”和“页面体验”上压过当前弱页面，而不是只复制一个 prompt box。

---

## 3. 产品定位

### 3.1 产品一句话

A free AI story generator that turns any idea into a structured story with characters, plot beats, and an editable first draft.

中文定位：

一个免费 AI 故事生成器，把一句故事想法变成标题、角色、冲突、大纲和可继续编辑的故事正文。

### 3.2 目标用户

| 用户 | 需求 | 关键触发 |
|---|---|---|
| 创意写作者 | 快速获得灵感、大纲、开头、续写 | writer’s block |
| 学生 | 完成 creative writing 作业或练习 | classroom assignment |
| 内容创作者 | 快速生成短故事、脚本、社媒内容 | content calendar |
| 家长/老师 | 生成 bedtime story、kids story | age-appropriate story |
| RPG/游戏玩家 | 生成世界观、角色背景、冒险剧情 | campaign prep |

### 3.3 核心价值主张

1. Fast：输入一句想法即可生成。
2. Structured：不仅给正文，还给标题、logline、角色、大纲。
3. Controllable：支持 genre、tone、POV、audience、length、ending style。
4. Editable：生成后能继续写、加对话、改结局、扩写、简化。
5. Frictionless：首轮免费、无需登录。

---

## 4. MVP 范围

### 4.1 P0：必须上线

| 模块 | 功能 | 验收标准 |
|---|---|---|
| 主工具页 | `/ai-story-generator` | 首屏出现输入框和生成按钮 |
| 输入控制 | story idea、genre、length、tone、POV、audience、ending | 移动端可完整操作 |
| 生成结果 | title、logline、characters、conflict、outline、story draft | 结果结构稳定，支持复制 |
| 后续操作 | continue、rewrite、change ending、add dialogue | 至少 3 个一键操作 |
| 示例 prompt | 3–8 个 sample prompt | 点击可自动填充输入框 |
| SEO 文案 | how-to、features、examples、FAQ、related tools | 不影响首屏工具体验 |
| Schema | SoftwareApplication JSON-LD | 可通过 Rich Results Test 基础校验 |
| Analytics | 关键事件埋点 | 可追踪从访问到生成到复制的漏斗 |
| Safety | 基础内容安全过滤 | 儿童受众模式下更严格 |
| Rate limit | 防滥用 | 游客按 IP / device 限制频率 |

### 4.2 P1：上线后 2–4 周

- 用户本地 history。
- 登录后保存项目。
- 导出 TXT / Markdown / PDF / DOCX。
- 长篇 story continuation。
- 角色卡、世界观卡、场景卡。
- 多语言输出。
- 10 个长尾子工具页。
- 广告位 A/B 测试。

### 4.3 P2：增长阶段

- AI story with pictures。
- Read aloud / TTS bedtime mode。
- Novel project workspace。
- Story critique / editor feedback。
- Prompt library。
- 教师课堂 worksheet。
- Community examples，但要谨慎处理 UGC 审核。

---

## 5. 核心用户流程

### 5.1 首次用户

1. 从 Google 搜索 “AI Story Generator”。
2. 进入主页面，首屏看到工具。
3. 输入一句 idea，或点击 sample prompt。
4. 选择 genre / tone / length。
5. 点击 Generate。
6. 获得 title、logline、outline、story draft。
7. 点击 Copy / Continue / Rewrite。
8. 当用户尝试保存、长篇续写或多次生成时，引导注册。

### 5.2 高频用户

1. 打开历史项目。
2. 查看角色卡和故事大纲。
3. 继续生成下一场景。
4. 使用 rewrite 改语气或节奏。
5. 导出成文档。

---

## 6. 功能需求详表

### 6.1 输入区

字段建议：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| Story idea | textarea | 示例 prompt | 必填 |
| Genre | select | Fantasy | fantasy, romance, mystery, sci-fi, horror, kids, adventure 等 |
| Output type | select | Short Story | short story、outline、opening scene、chapter draft、bedtime story |
| Tone | select | Wonder-filled | funny、dark、heartwarming、suspenseful、epic、cozy |
| POV | select | Third person limited | first person、third person、second person |
| Audience | select | General readers | kids、middle grade、YA、adult、classroom |
| Ending style | select | Hopeful | happy、twist、bittersweet、open-ended |
| Optional details | input | 空 | 角色名、地点、主题、限制等 |

### 6.2 输出区

P0 输出结构：

```json
{
  "title": "string",
  "logline": "string",
  "characters": ["string"],
  "conflict": "string",
  "outline": ["hook", "inciting incident", "rising action", "climax", "resolution"],
  "story": "string",
  "continue_prompts": ["string"]
}
```

### 6.3 后续编辑动作

P0：

- Continue the story
- Rewrite with more vivid detail
- Add dialogue
- Change ending
- Make it shorter
- Make it suitable for kids

P1：

- Expand into chapter outline
- Create character backstories
- Generate plot twists
- Turn into screenplay
- Turn into bedtime story
- Translate story

---

## 7. AI 生成策略

### 7.1 推荐 pipeline

不要直接 “prompt -> story”。建议使用两步生成：

1. Planning step：生成 story brief，包括 genre conventions、characters、conflict、outline。
2. Drafting step：根据 brief 写正文，确保结构一致。

长文本使用分段续写：

1. 先生成 full outline。
2. 再逐 scene 或逐 chapter 生成。
3. 每次续写只传 compressed memory：角色、目标、已发生事件、未解决冲突。

### 7.2 质量约束

系统 prompt 要包含：

- 输出必须原创，不直接模仿在世作者的具体风格。
- 不生成明显侵犯第三方 IP 的内容。
- 儿童受众模式下避免成人、血腥、露骨、恐怖过度内容。
- 结构要有 beginning、middle、end。
- 角色要有目标、阻碍、选择和变化。
- 避免空泛形容词堆叠。

### 7.3 质量评分

可在后台加轻量 self-check：

| 评分项 | 说明 |
|---|---|
| Prompt adherence | 是否遵守 genre、tone、POV、audience |
| Coherence | 情节是否连贯 |
| Specificity | 是否有具体意象、动作、冲突 |
| Originality risk | 是否过度接近知名作品 |
| Safety | 是否符合年龄与政策限制 |

---

## 8. SEO 页面结构

### 8.1 主页面信息架构

推荐 URL：

`/ai-story-generator`

推荐 Title：

`AI Story Generator – Free Story Writer Online`

推荐 Meta Description：

`Generate original short stories, plots, characters, scenes, and story outlines from a simple prompt. Free AI story generator with genre, tone, POV, and length controls.`

页面顺序：

1. Hero + tool input，必须首屏可用。
2. Output preview。
3. How to use the AI story generator。
4. Prompt examples。
5. Feature blocks。
6. Use cases。
7. Related tools。
8. FAQ。
9. Footer links + privacy + terms。

### 8.2 长尾页面矩阵

第一批建议：

| URL | 目标词 | 页面类型 |
|---|---|---|
| `/ai-short-story-generator` | AI short story generator | 子工具 |
| `/ai-plot-generator` | AI plot generator | 子工具 |
| `/story-outline-generator` | story outline generator | 子工具 |
| `/ai-fantasy-story-generator` | AI fantasy story generator | 子工具 |
| `/ai-romance-story-generator` | AI romance story generator | 子工具 |
| `/ai-mystery-story-generator` | AI mystery story generator | 子工具 |
| `/bedtime-story-generator` | bedtime story generator | 子工具 |
| `/kids-story-generator` | kids story generator | 子工具 |
| `/character-backstory-generator` | character backstory generator | 子工具 |
| `/plot-twist-generator` | plot twist generator | 子工具 |

注意：不要批量生成低差异页面。每个子工具页必须有不同输入字段、示例、FAQ 和输出结构。

### 8.3 内链策略

主页面链接到子工具页。子工具页统一回链主页面，并互链到相邻工具：

- Story Generator → Plot Generator → Story Outline Generator
- Fantasy Story Generator → Character Backstory Generator → Worldbuilding Generator
- Kids Story Generator → Bedtime Story Generator → Moral Story Generator

---

## 9. 数据指标

### 9.1 北极星指标

每月成功生成故事数。

定义：用户点击 Generate 且服务端成功返回有效 story draft。

### 9.2 漏斗指标

| 阶段 | 指标 | 目标 |
|---|---|---:|
| SEO 获取 | organic sessions | 按周增长 |
| 首屏激活 | generate_click / landing_session | ≥ 35% |
| 成功生成 | success / generate_click | ≥ 90% |
| 结果价值 | copy_or_download / success | ≥ 15% |
| 深度使用 | continue_or_rewrite / success | ≥ 20% |
| 注册转化 | signup / engaged_user | 3–8% |
| 留存 | 7-day return | ≥ 8% |

### 9.3 成本指标

| 指标 | 目标 |
|---|---:|
| cost per successful generation | ≤ $0.02–$0.05，取决于模型和长度 |
| p95 generation latency | ≤ 12s，使用 streaming 降低感知等待 |
| abuse blocked rate | 可监控，不设固定目标 |

---

## 10. 商业化设计

### 10.1 免费层

- 不登录可生成短故事。
- 每天有限次数。
- 可复制结果。
- 有轻量广告。

### 10.2 注册层

- 保存历史。
- 更多每日次数。
- 下载 TXT / Markdown。
- 本地项目管理。

### 10.3 付费层

- 长篇故事/章节续写。
- 角色与世界观记忆。
- 导出 PDF / DOCX。
- 图片故事书。
- 高级模型/更长上下文。
- 无广告。

### 10.4 广告策略

广告不要压首屏生成体验。建议位置：

1. 输出结果右侧或下方。
2. FAQ 前。
3. Related tools 区域附近。

不要在生成按钮附近插入干扰广告，否则会降低 generate rate。

---

## 11. 技术架构建议

### 11.1 前端

- Next.js / Astro / SvelteKit 均可。
- 主页面静态化，工具区域客户端交互。
- 生成结果 streaming。
- 移动端优先。
- 输入区不要依赖大型前端库。

### 11.2 后端

- `/api/generate-story`
- `/api/continue-story`
- `/api/rewrite-story`
- `/api/export`
- `/api/feedback`

### 11.3 数据存储

游客：

- localStorage 保存最近 3–5 次结果。

注册用户：

- users
- story_projects
- story_generations
- story_feedback
- usage_limits

### 11.4 安全与滥用控制

- IP / session / user rate limit。
- Prompt moderation。
- 输出 moderation。
- Kids mode 更严格。
- CAPTCHA 只在异常行为后出现。
- 不默认公开用户生成内容。

---

## 12. 风险与应对

| 风险 | 表现 | 应对 |
|---|---|---|
| 高 DR 竞品压制 | QuillBot、Canva 等强域名占位 | 用更强工具体验、长尾矩阵、速度和真实使用信号竞争 |
| 同质化 | 只是另一个 prompt box | 做结构化输出 + 续写编辑工作流 |
| 生成质量不稳定 | 空泛、重复、跑题 | 两步生成、输出 schema、质量检查 |
| 成本失控 | 免费用户大量生成 | 限额、缓存、模型分层、短输出默认 |
| SEO 风险 | 批量低价值页面 | 每个长尾页必须有真实差异化工具体验 |
| IP 风险 | 用户要求模仿名人/知名 IP | 加提示与过滤，避免直接复刻受保护作品 |
| 儿童内容安全 | bedtime/kids 场景敏感 | Kids mode + 更严格安全策略 |

---

## 13. 发布计划

### 第 1 周：MVP 原型

- 主页面 UI。
- 工具输入区。
- mock 输出。
- SEO 文案草稿。
- 埋点设计。

### 第 2 周：真实生成

- 接入 LLM 后端。
- 两步 prompt pipeline。
- streaming 输出。
- 基础安全过滤。
- 复制/下载 TXT。

### 第 3 周：SEO 上线

- Title/meta/canonical/schema。
- FAQ 和 example prompt。
- Search Console / analytics。
- Core Web Vitals 优化。
- 提交 sitemap。

### 第 4–6 周：增长

- 10 个长尾工具页。
- 历史记录。
- 续写/改写。
- 广告实验。
- 注册保存。

---

## 14. Demo 说明

随附 HTML demo 是一个静态可打开页面，包含：

- SEO landing page 结构。
- 首屏 AI Story Generator 工具。
- genre、length、tone、POV、audience、ending 控件。
- 浏览器内 mock generation。
- copy、continue、rewrite、download 操作。
- examples、features、FAQ、related tools。
- SoftwareApplication JSON-LD。

生产环境需要替换：

1. `generateFromInputs()` 改成请求后端 API。
2. 加入真实模型生成、rate limit、moderation、analytics。
3. 绑定登录、保存、导出和支付。

