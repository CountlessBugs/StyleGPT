# 部署到Zeabur完整指南

## 📋 前置要求

1. **GitHub 账户** - 代码仓库托管
2. **Zeabur 账户** - 访问 [https://zeabur.com](https://zeabur.com)
3. **API 密钥** - OpenAI 或其他兼容 API（DeepSeek、智谱等）

---

## 🔧 第一步：准备代码仓库

### 1.1 初始化 Git 仓库（如未初始化）

```bash
cd d:\Projects\Web\Apps\StyleGPT
git init
git add .
git commit -m "Initial commit: StyleGPT project"
```

### 1.2 创建 `.gitignore` 文件

确保以下文件被忽略：

```
node_modules/
.env
.env.local
.env.production.local
.next/
out/
build/
dist/
.DS_Store
*.log
.vercel
```

### 1.3 推送到 GitHub

```bash
git remote add origin https://github.com/your-username/style-gpt.git
git branch -M main
git push -u origin main
```

---

## 🚀 第二步：在 Zeabur 中创建项目

### 2.1 登录 Zeabur

访问 [https://zeabur.com](https://zeabur.com) 并使用 GitHub 账户登录

### 2.2 创建新项目

1. 点击 **"New Project"** 按钮
2. 选择 **"Deploy from GitHub"**
3. 授权 Zeabur 访问您的 GitHub 账户
4. 选择 `style-gpt` 仓库
5. 选择 `main` 分支（或您的主分支）

### 2.3 自动检测项目设置

Zeabur 会自动检测：
- **框架**：Next.js (自动识别)
- **构建命令**：`npm run build`
- **启动命令**：`npm start`
- **根目录**：`./` (保持默认)

---

## 🔐 第三步：配置环境变量

在 Zeabur 部署设置中添加以下环境变量：

### 3.1 必需的环境变量

**选择方案 A：使用官方 OpenAI API**

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**选择方案 B：使用 DeepSeek（推荐，更便宜）**

```
OPENAI_API_KEY=your_deepseek_api_key
OPENAI_API_BASE_URL=https://api.deepseek.com/v1
```

**选择方案 C：使用智谱 AI**

```
OPENAI_API_KEY=your_zhipu_api_key
OPENAI_API_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

**选择方案 D：使用硅基流动**

```
OPENAI_API_KEY=your_siliconflow_api_key
OPENAI_API_BASE_URL=https://api.siliconflow.cn/v1
```

### 3.2 可选的环境变量

```
# 虚拟试穿功能（可选）
NANO_BANANA_API_KEY=your_nano_banana_api_key
```

### 3.3 在 Zeabur 中添加环境变量的步骤

1. 在项目仪表板中点击 **"Settings"** (设置)
2. 找到 **"Environment Variables"** 部分
3. 点击 **"Add"** 按钮
4. 输入变量名和值
5. 点击 **"Save"** 保存

---

## 🏗️ 第四步：部署

### 4.1 部署方式

**选项 1：自动部署（推荐）**

Zeabur 会监视您的 GitHub 仓库。每当您推送更改到 `main` 分支时，会自动触发部署。

```bash
# 本地提交并推送更改
git add .
git commit -m "Update feature"
git push origin main
```

**选项 2：手动部署**

在 Zeabur 仪表板中点击 **"Deploy"** 或 **"Redeploy"** 按钮

### 4.2 监控部署进度

1. 在 Zeabur 仪表板中查看部署日志
2. 等待构建完成（通常需要 2-5 分钟）
3. 部署成功后，您会获得一个 Zeabur 分配的域名

---

## 📱 第五步：访问您的应用

部署成功后，您会获得一个自动生成的 URL，格式如下：

```
https://style-gpt-xxxxx.zeabur.app
```

### 5.1 自定义域名（可选）

1. 在 Zeabur 仪表板中找到您的项目
2. 点击 **"Domain"** 或 **"Custom Domain"**
3. 添加您自己的域名（需要 DNS 配置）
4. 按照说明配置 DNS 记录

---

## ✅ 验证部署成功

1. 访问分配的 URL
2. 应用应该能够正常加载
3. 测试 AI 功能：
   - 在 "穿搭方案生成" 选项卡中输入信息
   - 点击生成按钮
   - 应该能收到 AI 的回复

---

## 🐛 故障排除

### 问题 1：部署失败，显示构建错误

**解决方案：**

```bash
# 本地验证构建是否成功
npm install
npm run build
npm start
```

### 问题 2：应用启动后立即崩溃

**可能原因：** 环境变量未正确配置

**解决方案：**

1. 检查 Zeabur 仪表板中的环境变量是否正确
2. 确保 API 密钥有效
3. 在 Zeabur 日志中查看错误信息

### 问题 3：API 调用失败

**检查清单：**

- [ ] API 密钥已正确添加到环境变量
- [ ] API 密钥有效且有余额（如适用）
- [ ] 网络连接正常
- [ ] 若使用第三方 API，检查对应服务是否可访问

### 问题 4：构建超时

**解决方案：**

1. Zeabur 的构建超时时间较长，通常不会出现
2. 如果出现，检查依赖安装是否存在问题
3. 尝试清除缓存重新部署：删除 `.next` 文件夹并重新提交

---

## 📊 监控和维护

### 6.1 查看日志

在 Zeabur 仪表板中：

1. 点击您的项目
2. 选择 **"Logs"** 选项卡
3. 查看实时日志输出

### 6.2 性能监控

Zeabur 提供基础的性能指标：

- 响应时间
- 错误率
- 资源使用情况

### 6.3 重新部署

若需要重新部署：

1. **推送代码更新**：
   ```bash
   git push origin main
   ```

2. **或手动点击**：在 Zeabur 仪表板中点击 "Redeploy"

---

## 💡 最佳实践

1. **使用环境变量管理敏感信息** - 不要在代码中硬编码 API 密钥
2. **监控 API 使用量** - 定期检查 API 消费费用
3. **测试环境** - 在本地充分测试后再部署
4. **版本控制** - 保持有意义的提交信息
5. **备份** - 定期备份重要数据

---

## 🎉 部署完成！

现在您的 StyleGPT 应用已经在线运行！

**后续步骤：**

- 分享您的应用 URL 给朋友和用户
- 根据用户反馈进行迭代改进
- 监控应用的性能和错误
- 定期更新依赖和功能

---

## 📚 相关资源

- [Zeabur 官方文档](https://zeabur.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [DeepSeek API 文档](https://platform.deepseek.com)

---

**祝部署顺利！** 🚀
