# 中文练习应用 (Chinese Question Practice App)

一个基于Web的中文语言学习应用，集成了语音识别、文本转语音和AI驱动的答案评估功能。用户可以通过语音回答中文问题，并获得实时的智能反馈。

## 🌟 核心功能

### 1. 问题管理系统
- **多行文本输入**: 支持批量输入中文问题
- **随机化算法**: 使用Fisher-Yates洗牌算法随机排列问题顺序
- **进度跟踪**: 可视化进度条显示当前练习进度
- **内存存储**: 基于数组的问题存储，无需后端数据库

### 2. 语音技术集成
- **文本转语音 (TTS)**:
  - 使用Web Speech API的SpeechSynthesisUtterance
  - 配置为中文语言 (zh-CN)
  - 支持Eleven Labs语音ID配置
  - 可调节语音速度 (默认0.8x)
  - 问题显示时自动播放

- **语音识别 (STT)**:
  - 使用Web Speech API的SpeechRecognition
  - 跨浏览器兼容性 (webkitSpeechRecognition备用)
  - 中文语音识别 (zh-CN)
  - 实时音频捕获与视觉反馈

### 3. 答案处理流程
- **语音捕获**: 录制用户的中文语音回答
- **文本转换**: 使用浏览器STT将语音转换为文本
- **上下文评估**: 基于规则的答案适当性分析

### 4. 评估引擎
- **AI评估**: 集成ChatGPT模型评估答案质量
- **智能反馈**: 基于问题和答案的上下文反馈
- **示例答案**: 为用户提供标准答案示例

## 🎯 评估分类

- **优秀 (✓)**: 结构正确，上下文合适
- **一般 (⚠)**: 基本正确，有改进建议
- **需改进 (✗)**: 存在明显问题，提供具体指导

## 🛠️ 技术架构

### 前端技术栈
- **HTML5**: 语义化标记，无障碍设计考虑
- **CSS3**: 现代样式，渐变、动画、响应式设计
- **Vanilla JavaScript**: ES6+特性，基于类的架构
- **Web APIs**: 语音识别、语音合成、DOM操作

### 设计模式
- **MVC架构**: 清晰的关注点分离
- **事件驱动编程**: 用户交互处理
- **状态管理**: 内存中的应用程序状态
- **响应式设计**: 移动优先的方法，断点设计

### 浏览器兼容性
- **语音识别**: Chrome、Edge、Safari (带备用方案)
- **语音合成**: 所有现代浏览器
- **CSS Grid/Flexbox**: 现代布局技术
- **ES6+特性**: 类语法、箭头函数、模板字面量

## 🚀 快速开始

### 系统要求
- 现代浏览器 (Chrome 25+, Firefox 44+, Safari 14+, Edge 79+)
- HTTPS环境 (语音API要求)
- 麦克风权限
- 网络连接

### 🚀 部署到 Netlify

要部署到 Netlify，请运行：

```bash
# 1. 设置环境变量
npm run setup

# 2. 检查部署准备状态
npm run deploy

# 3. 按照提示部署到 Netlify
```

详细部署指南请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

### 安装步骤

1. **克隆或下载项目**
   ```bash
   git clone <repository-url>
   cd chinese-practice-app
   ```

2. **配置环境变量** (推荐)
   ```bash
   # 自动创建 .env 文件 (包含当前API密钥)
   npm run setup
   
   # 或者手动创建 .env 文件
   cp env.example .env
   
   # 编辑 .env 文件，填入你的API密钥
   # ELEVENLABS_API_KEY=your_key_here
   # OPENAI_API_KEY=your_key_here
   # GOOGLE_CLOUD_API_KEY=your_key_here
   ```

3. **启动开发服务器** (推荐)
   ```bash
   # 安装依赖
   npm install
   
   # 启动开发服务器 (自动注入环境变量)
   npm start
   ```

4. **或启动静态服务器**
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 或使用Node.js
   npx serve .
   
   # 或使用PHP
   php -S localhost:8000
   ```

5. **访问应用**
   ```
   # 开发服务器 (推荐)
   http://localhost:3000
   
   # 或静态服务器
   http://localhost:8000
   ```

### 使用指南

#### 1. 设置阶段
1. 在文本区域输入中文问题，每行一个问题
2. 点击"开始练习"按钮
3. 系统将随机化问题顺序并开始练习

#### 2. 练习流程
1. **问题显示**: 系统显示当前问题并自动播放
2. **语音回答**: 点击"开始回答"按钮，用中文回答问题
3. **答案处理**: 系统将语音转换为文本并显示
4. **AI评估**: 获得智能反馈和示例答案
5. **继续练习**: 选择"再试一次"或"继续练习"

#### 3. 键盘快捷键
- **空格键**: 开始/停止录音
- **右箭头**: 下一题
- **P键**: 播放当前问题

## ⚙️ 配置选项

### 语音设置
- **语音速度**: 0.5x - 1.5x 可调节
- **语音ID**: 支持Eleven Labs语音ID配置
- **语言**: 自动检测中文语音

### 界面设置
- **响应式设计**: 自动适配桌面和移动设备
- **无障碍支持**: ARIA标签和键盘导航
- **高对比度模式**: 支持系统高对比度设置

## 🔧 高级功能

### 1. 翻译服务集成
- **Google Cloud Translation API**: 主要翻译服务，提供高质量的中文到英文翻译
- **OpenAI API**: 备用翻译服务，当Google Translation不可用时自动切换
- **本地翻译**: 内置常见问题的翻译映射作为最终备用方案
- **实时翻译**: 点击翻译按钮即可获得即时翻译结果

#### Google Cloud Translation API 设置

1. **创建Google Cloud项目**
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或选择现有项目

2. **启用Translation API**
   - 在Google Cloud Console中，导航到"API和服务" > "库"
   - 搜索"Cloud Translation API"
   - 点击"启用"

3. **创建API密钥**
   - 导航到"API和服务" > "凭据"
   - 点击"创建凭据" > "API密钥"
   - 复制生成的API密钥

4. **配置应用**
   - 在 `app.js` 文件中找到 `googleCloudApiKey` 设置
   - 将 `'YOUR_GOOGLE_CLOUD_API_KEY'` 替换为你的实际API密钥

5. **设置配额和计费** (可选)
   - Google Cloud Translation API提供免费配额
   - 每月前500,000字符免费
   - 超出免费配额后按使用量计费

#### API密钥安全
- **环境变量**: 所有API密钥现在通过环境变量管理
- **开发环境**: 使用 `.env` 文件和开发服务器自动注入
- **生产环境**: 建议使用环境变量或安全的密钥管理
- **API限制**: 可以设置API密钥限制，只允许来自特定域名的请求
- **密钥轮换**: 定期轮换API密钥以提高安全性

#### 环境变量配置

应用支持以下环境变量：

```bash
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=BrbEfHMQu0fyclQR7lfh
ELEVENLABS_STABILITY=0.5
ELEVENLABS_SIMILARITY_BOOST=0.8
USE_ELEVENLABS=true

# OpenAI API Configuration
OPENAI_API_KEY=sk-xxxx

# Google Cloud Translation API Configuration
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# Speech Settings
SPEECH_RATE=0.8
```

**开发环境设置**:
1. 复制 `env.example` 到 `.env`
2. 填入你的实际API密钥
3. 运行 `npm start` 启动开发服务器

**生产环境设置**:
- 直接在服务器环境变量中设置
- 或使用容器化部署 (Docker, Kubernetes)
- 或使用云平台的环境变量管理

### 2. 高级评估
- 基于机器学习的上下文分析
- 发音评分集成
- 语法检查功能

### 3. 进度跟踪
- 用户会话持久化
- 性能分析
- 学习曲线可视化

### 4. 内容管理
- 问题数据库集成
- 难度级别分类
- 基于主题的问题分组

## 🔒 安全考虑

### 数据隐私
- **无数据存储**: 所有处理都在客户端进行
- **麦克风访问**: 需要明确的用户权限
- **语音数据**: 不传输到外部服务器

### 浏览器安全
- **同源策略**: 符合浏览器安全模型
- **内容安全策略**: 支持CSP实现
- **HTTPS要求**: 语音API需要安全上下文

## 🌐 部署要求

### 最低浏览器要求
- **Chrome 25+**: 完整语音识别支持
- **Firefox 44+**: 基本语音合成
- **Safari 14+**: 有限语音识别
- **Edge 79+**: 完整功能支持

### 服务器要求
- **静态托管**: 可从任何Web服务器提供服务
- **HTTPS**: 语音识别API必需
- **无后端**: 纯客户端应用程序

## 🔮 未来增强机会

### 1. AI集成
- **GPT评估**: 更复杂的答案分析
- **个性化反馈**: 自适应学习建议
- **对话模拟**: 多轮对话练习

### 2. 游戏化
- **进度徽章**: 成就系统
- **连续跟踪**: 每日练习鼓励
- **排行榜**: 社交学习功能

### 3. 分析
- **学习分析**: 随时间跟踪进度
- **性能指标**: 准确性和改进率
- **使用统计**: 功能利用率分析

## 📝 开发说明

### 项目结构
```
chinese-practice-app/
├── index.html                    # 主HTML文件
├── styles.css                    # 样式文件
├── app.js                       # 主JavaScript应用
├── config.js                    # 配置管理 (环境变量)
├── openai-service.js            # OpenAI API服务 (评估和备用翻译)
├── google-translation-service.js # Google Cloud Translation API服务
├── elevenlabs-service.js        # ElevenLabs TTS服务
├── server.js                    # 开发服务器 (环境变量注入)
├── setup-env.js                 # 环境变量设置脚本
├── deploy-to-netlify.js         # Netlify部署助手
├── netlify.toml                 # Netlify配置文件
├── package.json                 # Node.js依赖和脚本
├── env.example                  # 环境变量示例文件
├── .env                         # 环境变量文件 (自动生成)
├── DEPLOYMENT.md                # 详细部署指南
└── README.md                    # 项目文档
```

### 核心类和方法

#### ChinesePracticeApp 类
- `init()`: 初始化应用
- `initializeSpeechRecognition()`: 设置语音识别
- `initializeSpeechSynthesis()`: 设置语音合成
- `shuffleQuestions()`: Fisher-Yates洗牌算法
- `evaluateAnswer()`: AI答案评估
- `handleAnswer()`: 答案处理流程

#### 关键算法
```javascript
// Fisher-Yates 洗牌实现
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}
```

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出改进建议！

### 贡献步骤
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Web Speech API 提供语音功能
- OpenAI ChatGPT 提供AI评估能力
- Google Cloud Translation API 提供高质量翻译服务
- Eleven Labs 提供高质量语音合成
- 现代浏览器对Web API的支持

---

**注意**: 此项目展示了现代Web技术的有效集成，创建了一个具有实时语音处理和智能反馈系统的引人入胜的语言学习体验。 #   c h i n e s e - p r a c t i c e - a p p - v 2  
 