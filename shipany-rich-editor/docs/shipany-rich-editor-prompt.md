# ShipAny Two 富文本编辑器项目提示词

## 项目基本信息

**项目名：** ShipAny Two  
**Slogan：** "Create, Edit, Share - Beyond Simple Text"  
**一句话描述：** 一款现代化的富文本编辑器，支持实时协作、云同步和AI辅助创作，专为内容创作者和团队协作设计。

## 核心功能特性（3-8个）

1. **智能富文本编辑** - 支持 Markdown、所见即所得双模式，丰富的格式化工具
2. **实时协作编辑** - 多人同时编辑，实时同步，冲突自动解决
3. **AI 写作助手** - 智能补全、内容优化、语法检查、多语言翻译
4. **云端同步存储** - 自动保存，多设备同步，离线编辑支持
5. **版本历史管理** - 完整的编辑历史，版本对比，快速回滚
6. **丰富的内容格式** - 代码高亮、表格、流程图、数学公式、图片视频
7. **导出与分享** - 支持导出 PDF、Word、Markdown，多种分享方式
8. **模板库系统** - 丰富的预设模板，个性化模板创建与分享

## 目标用户

- **内容创作者**：博主、作家、自媒体从业者
- **企业用户**：团队文档协作、知识管理、项目协作
- **教育工作者**：课件制作、教学材料编写
- **技术开发者**：技术文档编写、API 文档生成

## 项目配置

**默认语言：** 中文（zh）  
**品牌主色：** #2563EB（蓝色系）  
**辅助色彩：** 
- 主蓝色：#2563EB
- 浅蓝色：#3B82F6  
- 深蓝色：#1D4ED8
- 背景色：#F8FAFC
- 文字色：#1E293B

## 技术要求

**前端框架：** React 18 + TypeScript  
**状态管理：** Zustand  
**富文本引擎：** Tiptap (基于 ProseMirror)  
**UI 组件库：** Ant Design  
**构建工具：** Vite  
**包管理器：** pnpm  
**代码规范：** ESLint + Prettier + Husky

## 项目目录结构

```
shipany-rich-editor/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .eslintrc.js
├── .prettierrc
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── Editor.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── MenuBar.tsx
│   │   │   └── extensions/
│   │   ├── AI/
│   │   │   ├── AIAssistant.tsx
│   │   │   └── AIWritingPanel.tsx
│   │   ├── Collaboration/
│   │   │   ├── CollaborationProvider.tsx
│   │   │   └── Presence.tsx
│   │   ├── Export/
│   │   │   ├── ExportModal.tsx
│   │   │   └── ShareModal.tsx
│   │   ├── Template/
│   │   │   ├── TemplateLibrary.tsx
│   │   │   └── TemplateCard.tsx
│   │   └── UI/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── hooks/
│   │   ├── useEditor.ts
│   │   ├── useCollaboration.ts
│   │   ├── useAI.ts
│   │   └── useTemplates.ts
│   ├── store/
│   │   ├── editorStore.ts
│   │   ├── userStore.ts
│   │   └── collaborationStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── collaboration.ts
│   ├── utils/
│   │   ├── export.ts
│   │   ├── import.ts
│   │   └── helpers.ts
│   ├── types/
│   │   ├── editor.ts
│   │   ├── user.ts
│   │   └── collaboration.ts
│   ├── locales/
│   │   ├── zh-CN.json
│   │   └── en-US.json
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── EditorPage.tsx
│   │   └── SettingsPage.tsx
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
├── scripts/
│   ├── build.js
│   └── deploy.js
└── .github/
    └── workflows/
        └── ci.yml
```

## 部署配置

**域名/URL：** editor.shipany.com  
**部署平台：** Vercel / Netlify  
**CDN：** Cloudflare  
**数据库：** Supabase (PostgreSQL)  
**文件存储：** Supabase Storage  
**实时通信：** Supabase Realtime  

## 品牌资源

**Logo：** ShipAny Two Logo (待设计)  
**Favicon：** 32x32px 蓝色系图标  
**品牌字体：** Inter / PingFang SC  

## 社交链接

**官网：** https://shipany.com  
**GitHub：** https://github.com/shipany/rich-editor  
**文档：** https://docs.shipany.com/editor  
**支持：** support@shipany.com  

## 特色功能模块

### 1. 智能编辑器
- 双模式编辑（Markdown + WYSIWYG）
- 实时字数统计
- 拼写检查
- 自动保存

### 2. AI 助手
- 智能写作建议
- 语法纠错
- 内容润色
- 多语言翻译

### 3. 协作功能
- 实时多人编辑
- 用户光标位置显示
- 评论和批注系统
- 权限管理

### 4. 模板系统
- 预设模板库
- 自定义模板
- 模板分享
- 分类管理

### 5. 导出分享
- 多格式导出（PDF、DOCX、HTML、Markdown）
- 分享链接生成
- 团队协作邀请
- 版权保护

## 开发要求

- **代码质量：** TypeScript 严格模式，100% 类型覆盖
- **性能优化：** 懒加载、代码分割、防抖节流
- **响应式设计：** 移动端适配，触摸友好
- **无障碍支持：** ARIA 标签，键盘导航
- **国际化：** i18n 支持，中英文切换
- **测试覆盖：** 单元测试、集成测试、E2E 测试
- **CI/CD：** 自动化构建、测试、部署

## 项目里程碑

1. **MVP 阶段**（2周）
   - 基础富文本编辑功能
   - 文件导入导出
   - 基础 UI 组件

2. **功能完善**（3周）
   - AI 助手集成
   - 模板系统
   - 协作功能

3. **优化部署**（1周）
   - 性能优化
   - 部署上线
   - 用户测试

---

**项目愿景：** 成为最易用、最强大的富文本编辑器，让每个人都能轻松创作出优质内容。
