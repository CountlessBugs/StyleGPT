# 穿搭GPT - AI智能穿搭助手

一款基于AI的智能穿搭方案生成器，提供个性化穿搭建议、购买指南和虚拟试穿功能。

## 功能特性

- 👔 **我的衣柜**：持久化保存和管理你的所有衣物，支持分类、搜索和筛选
- 📋 **穿搭方案生成**：根据用户的穿搭风格、已有服装和场合，生成个性化的穿搭组合建议
- 🛍️ **购买建议**：基于用户喜好的穿搭风格和计划购买的衣物，提供专业的购买建议
- 👗 **虚拟试穿**：使用 Nano Banana AI 生成虚拟试穿效果图

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: React 18
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **AI 服务**: OpenAI GPT-3.5
- **图像生成**: Nano Banana API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`：

```bash
cp .env.example .env
```

然后在 `.env` 文件中填入你的 API 密钥：

```env
# OpenAI API Key（必需）
OPENAI_API_KEY=your_openai_api_key_here

# OpenAI API Base URL（可选，用于第三方兼容 OpenAI 的 API）
# 留空则使用官方 OpenAI API
OPENAI_API_BASE_URL=

# Nano Banana API（可选，用于虚拟试穿功能）
NANO_BANANA_API_KEY=your_nano_banana_api_key_here
NANO_BANANA_API_URL=https://api.nanobanana.ai/v1
```

**Nano Banana API Key:**
1. 访问 [Nano Banana](https://nanobanana.ai/)（注意：这是示例，请根据实际服务调整）
2. 注册账号并获取 API 密钥
3. 将密钥添加到 `.env` 文件中

> **注意**: 如果没有配置 Nano Banana API，虚拟试穿功能将显示示例图像。穿搭方案和购买建议功能仍可正常使用。

### 3. 运行开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

### 我的衣柜

1. 点击"我的衣柜"标签页
2. 点击"添加衣物"按钮
3. 填写衣物信息：
   - 衣物名称（必填）
   - 分类：上衣、裤装、裙装、外套、鞋履、配饰等
   - 颜色（可选）
   - 描述（可选）：材质、风格等详细信息
4. 点击"添加"保存
5. 使用筛选和搜索功能快速找到衣物
6. 点击"导入到穿搭方案"一键导入所有或筛选后的衣物
7. 数据自动保存在浏览器本地，无需登录

> **提示**：衣柜数据保存在浏览器 localStorage 中，清除浏览器数据会导致数据丢失。建议定期备份重要数据。

### 穿搭方案生成

1. 点击"穿搭方案"标签页
2. 输入你的穿搭风格（如：韩系、日系、欧美街头等）
3. 描述你已有的服装（如：白色T恤、蓝色牛仔裤等）
   - 💡 提示：可以从"我的衣柜"一键导入
4. 可选：输入穿搭场合（如：约会、上班、聚会等）
5. 点击"生成穿搭方案"按钮
6. AI 将为你生成 3-5 套个性化的穿搭组合建议

### 购买建议

1. 点击"购买建议"标签页
2. 输入你喜爱的穿搭风格
3. 描述你计划购买的衣物类型和需求
4. 可选：输入预算范围
5. 点击"获取购买建议"按钮
6. AI 将提供详细的购买建议和搭配分析

### 虚拟试穿

1. 点击"虚拟试穿"标签页
2. 上传你的照片（正面、全身照效果最佳）
3. 详细描述想试穿的服装
4. 点击"生成试穿效果"按钮
5. 等待 1-2 分钟，AI 将生成虚拟试穿效果图

## 项目结构

```
StyleGPT/
├── app/
│   ├── api/
│   │   ├── generate-outfit/    # 穿搭方案生成 API
│   │   ├── purchase-advice/    # 购买建议 API
│   │   └── virtual-tryon/      # 虚拟试穿 API
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 首页
├── components/
│   ├── Wardrobe.tsx            # 衣柜管理组件
│   ├── OutfitGenerator.tsx     # 穿搭方案生成组件
│   ├── PurchaseAdvisor.tsx     # 购买建议组件
│   └── VirtualTryOn.tsx        # 虚拟试穿组件
├── public/                     # 静态资源
├── .env.example               # 环境变量示例
├── next.config.mjs            # Next.js 配置
├── tailwind.config.ts         # Tailwind CSS 配置
└── tsconfig.json              # TypeScript 配置
```

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 上导入项目
3. 配置环境变量（OPENAI_API_KEY 等）
4. 部署完成

### 其他平台

支持部署到任何支持 Next.js 的平台，如：
- Netlify
- Railway
- AWS
- Google Cloud

## 注意事项

1. **API 成本**: 使用 OpenAI API 会产生费用，请注意控制使用量
2. **API 速率限制**: 请遵守 API 提供商的速率限制
3. **隐私安全**: 上传的照片仅用于生成试穿效果，不会被存储或分享
4. **图像质量**: 虚拟试穿效果取决于上传照片的质量和服装描述的详细程度

## 常见问题

**Q: 为什么穿搭方案生成失败？**

A: 请检查：
- `.env` 文件中的 `OPENAI_API_KEY` 是否正确配置
- OpenAI 账户是否有足够的额度
- 网络连接是否正常

**Q: 虚拟试穿功能不可用怎么办？**

A: 虚拟试穿需要配置 Nano Banana API。如果暂时无法配置，该功能会显示提示信息。穿搭方案和购买建议功能不受影响。

**Q: 如何获得更好的建议？**

A: 
- 尽可能详细地描述你的服装和风格偏好
- 提供具体的场合和需求
- 使用清晰、准确的语言

## 开发计划

- [x] 衣柜管理功能（本地存储）
- [ ] 云端同步（需要用户账户系统）
- [ ] 添加用户账户系统
- [ ] 保存历史记录和收藏功能
- [ ] 支持更多 AI 模型选择
- [ ] 添加社区分享功能
- [ ] 移动端 App 开发
- [ ] 衣物图片上传和识别

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。

---

**Enjoy your styling journey! 💃🕺**
