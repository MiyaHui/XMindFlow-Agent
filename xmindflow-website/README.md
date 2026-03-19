# XMindFlow Website

将 XMindFlow-Agent 项目封装成一个现代化的 Web 应用。

## 功能特性

- 📤 上传 Xmind Markdown 文件或直接粘贴内容
- 🔑 配置 Qwen 和 DeepSeek API 密钥
- ⚙️ 选择不同的 AI 模型处理不同步骤
- 🤖 AI 自动完成工作流：
  1. 解析脑图生成产品提案
  2. 生成高保真 HTML 原型
  3. 撰写 PRD 文档
  4. 生成交互式标注原型
- 📊 在线预览所有产出物

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS + Vite
- **后端**: Python Flask + LangGraph

## 快速开始

### 1. 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
pip install flask flask-cors langgraph langchain-openai langchain-deepseek pydantic typing-extensions
```

### 2. 启动后端服务

```bash
python server.py
```

后端服务运行在 http://localhost:5000

### 3. 启动前端开发服务器

```bash
npm run dev
```

前端服务运行在 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
xmindflow-website/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式 (Tailwind)
├── server.py           # Flask 后端服务
├── XMindFlow-Agent/    # 原始 Agent 项目
│   ├── main.ipynb      # Jupyter notebook
│   ├── config.py       # 模型配置
│   └── prd_template.md # PRD 模板
└── dist/               # 构建输出目录
```

## 使用流程

1. 打开浏览器访问 http://localhost:3000
2. 上传 Xmind 导出的 Markdown 文件或直接粘贴内容
3. 配置 API 密钥和选择模型
4. 点击"开始处理"等待 AI 完成工作流
5. 在结果页面查看和下载产出物

## 注意事项

- 需要有效的 Qwen API Key 和 DeepSeek API Key
- API 调用会产生费用，请注意控制使用量
- 处理时间取决于 Xmind 内容的复杂度和 AI 模型响应速度
