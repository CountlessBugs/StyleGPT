# 第三方 OpenAI 兼容 API 配置指南

本应用已支持任何兼容 OpenAI API 格式的第三方服务，您可以根据需求选择合适的服务商。

## 🌟 为什么使用第三方 API？

- **💰 价格更低**：通常为官方 OpenAI 价格的 1/10 甚至更低
- **🚀 访问更快**：国内服务商访问速度更快、更稳定
- **🔓 无需翻墙**：直接在国内使用，无需 VPN
- **💳 支付便捷**：支持支付宝、微信等国内支付方式

## 📋 推荐的第三方 API 服务商

### 1. DeepSeek（最推荐 ⭐⭐⭐⭐⭐）

**优势**：
- 性价比最高，价格约为 OpenAI 的 1/10
- 模型效果优秀，尤其擅长中文理解
- 国内访问快速稳定
- 支持支付宝充值

**配置步骤**：
1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册并登录账号
3. 进入"API Keys"页面，创建新的 API 密钥
4. 复制 API Key
5. 在 `.env` 文件中配置：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_BASE_URL=https://api.deepseek.com/v1
```

**定价**：
- 输入：约 ¥0.001 / 1K tokens
- 输出：约 ¥0.002 / 1K tokens

---

### 2. 智谱 AI（GLM）⭐⭐⭐⭐

**优势**：
- 清华系 AI 公司，技术实力强
- GLM 模型对中文支持优秀
- 新用户有免费额度
- 国内访问稳定

**配置步骤**：
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并实名认证
3. 创建 API Key
4. 在 `.env` 文件中配置：

```env
OPENAI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxx
OPENAI_API_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

**定价**：
- 新用户赠送免费额度
- GLM-4：约 ¥0.01 / 1K tokens

---

### 3. 硅基流动 ⭐⭐⭐⭐

**优势**：
- 支持多种开源模型
- 价格极低，部分模型免费
- API 响应速度快

**配置步骤**：
1. 访问 [硅基流动](https://siliconflow.cn/)
2. 注册并获取 API Key
3. 在 `.env` 文件中配置：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_BASE_URL=https://api.siliconflow.cn/v1
```

**定价**：
- 部分开源模型免费使用
- 商业模型价格也很低

---

### 4. 通义千问（阿里云）⭐⭐⭐

**优势**：
- 阿里云背书，稳定可靠
- 支持阿里云账户支付
- 企业级支持

**配置步骤**：
1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 开通服务并获取 API Key
3. 使用兼容 OpenAI 的接口（需要查看最新文档）

---

### 5. Moonshot AI（月之暗面）⭐⭐⭐

**优势**：
- Kimi 背后的技术团队
- 支持超长上下文
- 模型质量高

**配置步骤**：
1. 访问 [Moonshot AI 开放平台](https://platform.moonshot.cn/)
2. 注册并获取 API Key
3. 在 `.env` 文件中配置：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_BASE_URL=https://api.moonshot.cn/v1
```

---

## 🔧 通用配置方法

无论选择哪个服务商，配置方法都是一样的：

1. **获取 API Key**：在对应平台注册并获取 API 密钥
2. **配置环境变量**：在 `.env` 文件中设置两个变量
   ```env
   OPENAI_API_KEY=你的API密钥
   OPENAI_API_BASE_URL=服务商的API地址
   ```
3. **重启服务器**：保存后重启开发服务器
4. **开始使用**：所有功能正常使用，无需修改代码

## 💡 使用建议

### 选择建议

| 场景 | 推荐服务商 | 原因 |
|------|-----------|------|
| 个人开发/学习 | DeepSeek | 性价比最高，质量好 |
| 企业应用 | 智谱 AI / 阿里云 | 稳定性好，有企业支持 |
| 预算有限 | 硅基流动 | 部分模型免费 |
| 需要长上下文 | Moonshot AI | 支持超长对话 |

### 成本对比

以生成一次穿搭建议为例（约 1000 tokens）：

| 服务商 | 单次成本 | 100次成本 |
|--------|----------|-----------|
| OpenAI GPT-3.5 | ¥0.02 | ¥2.00 |
| DeepSeek | ¥0.003 | ¥0.30 |
| 智谱 GLM-4 | ¥0.01 | ¥1.00 |
| 硅基流动 | ¥0.002 | ¥0.20 |

## ⚠️ 注意事项

1. **API 兼容性**：确保选择的服务商支持 OpenAI API 格式
2. **模型选择**：有些服务商可能需要在代码中指定具体模型名称
3. **速率限制**：不同服务商的 API 调用频率限制不同
4. **余额充值**：及时充值，避免服务中断
5. **安全性**：不要将 API Key 提交到公开代码仓库

## 🔄 切换服务商

切换服务商非常简单：

1. 修改 `.env` 文件中的两个变量
2. 重启服务器
3. 无需修改任何代码

示例：从 OpenAI 切换到 DeepSeek

```diff
- OPENAI_API_KEY=sk-openai-key-xxx
+ OPENAI_API_KEY=sk-deepseek-key-xxx
+ OPENAI_API_BASE_URL=https://api.deepseek.com/v1
```

## 🆘 故障排除

### 问题：API 调用失败

**解决方案**：
1. 检查 API Key 是否正确
2. 验证 Base URL 是否准确
3. 确认账户余额充足
4. 查看服务商官方文档确认最新接口地址

### 问题：响应速度慢

**解决方案**：
1. 尝试切换到国内服务商
2. 检查网络连接
3. 选择响应速度更快的服务商

### 问题：返回结果质量不佳

**解决方案**：
1. 尝试不同的模型
2. 调整 prompt 描述更详细
3. 切换到效果更好的服务商

## 📚 更多资源

- [DeepSeek 文档](https://platform.deepseek.com/docs)
- [智谱AI 文档](https://open.bigmodel.cn/dev/api)
- [硅基流动 文档](https://docs.siliconflow.cn/)
- [OpenAI API 规范](https://platform.openai.com/docs/api-reference)

## 🎉 总结

使用第三方 OpenAI 兼容 API 可以：
- ✅ 大幅降低成本
- ✅ 提升访问速度和稳定性
- ✅ 支持国内支付方式
- ✅ 无需修改代码即可切换

推荐首选 **DeepSeek**，性价比最优！

---

如有问题，欢迎查看各服务商的官方文档或提交 Issue。
