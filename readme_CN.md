#  XMindFlow-Agent

**让创意落地为高保真原型图和需求文档。**
*产品经理负责构思，XMindFlow 负责构建。*

**XMindFlow-Agent** 致力于自动化解决从抽象思维到具体产出物之间的繁琐过程。只需一次配置，即可将你的 Xmind 脑暴内容瞬间转化为可交付的代码级资产。

## ⚡ 工作流的核心优势
**拒绝在多个对话窗口间来回切换与复制粘贴。**
与传统的单一 Chat 界面不同，XMindFlow 允许你**编排一支由专业 AI 智能体组成的团队**。

*   **人尽其才 (模型各司其职)**：你可以配置工作流，为每一个步骤指定最适合的模型。
    *   *例如*：使用 **Qwen3-max** 处理复杂的逻辑分析（第1步）。
    *   *例如*：使用 **DeepSeek-reasoner** 编写高保真 HTML/CSS 代码（第2步）。
*   **自动化的上下文流转**：无需手动复制 Prompt 或重复解释背景。上一个智能体的产出会自动、完美地传递给下一个智能体。

---

## 🚀 核心功能
将原始的 Xmind 笔记转化为完整的产品包：
*   ✅ **高保真原型**：使用现代设计系统（Tailwind, AntDesign 等）生成可渲染的 HTML/CSS 原型。
*   ✅ **定制化 PRD**：基于**你指定的模板**，撰写详细的产品需求文档。
*   ✅ **交互式标注工具**：自动生成带有“交付模式”的原型，开发人员可以点击元素查看具体的交互逻辑和规则。
*   ✅ **多模型支持**：在同一个流水线中混合使用不同厂商的模型（OpenAI, Qwen, DeepSeek 等）以获得最佳效果。

---

## 🛠️ 环境要求
*   **Python** (3.8 或更高版本)
*   **Jupyter Notebook**

## ⚙️ 配置指南
**1. 模型与 API 设置**
打开 `config.py` 文件。你可以在这里定义多个模型，以便稍后分配给不同的步骤。

**2. 模板设置**
自定义 `prd_template.md` 文件。Agent 在生成文档时将严格遵循此文件的结构。

---

## 📖 使用指南

### 第 1 步：导出内容
将你的 Xmind 文件导出为 **Markdown** (`.md`) 格式。

### 第 2 步：准备文件
将导出的 Markdown 文件放入本项目中的主目录下。

### 第 3 步：运行 Agent
1.  打开你的终端或 IDE（如 Cursor, VS Code）。
2.  启动 **Jupyter Notebook** 并打开 `main.ipynb`。
3.  滚动到 **Input Cell**（通常是最后一个单元格）。
4.  修改文件名变量，使其匹配你上传的文件：
    ```python
   with open('my_new_feature.md', 'r', encoding='utf-8') as file:
    ```
5.  点击 **Run All** (运行所有单元格)。

### 第 4 步：获取产出
稍作等待！🎉
Agent 将自动分析你的上下文，生成提案，编写原型代码，并撰写 PRD 文档，结果自动保存到`output/` 目录下。

---

## 🎨 高级定制

### 指定 UI 设计风格
默认情况下，Agent 会创建一个整洁通用的界面。如果你希望强制使用特定的设计系统（例如 **AntDesign**, **SAP Fiori**, **Material UI**）：

1.  打开 `main.ipynb`。
2.  搜索变量 `prototype_instructions`。
3.  找到字符串中的 **INPUTS** 部分。
4.  编辑 **Style** 这一行来描述你想要的效果。

```python
# 在 main.ipynb 中
INPUTS
Proposal: Structured requirements.
Style: Ant Design (或者 "iOS 风格", "深色模式" 等)  <-- 修改这一行
```

---

*享受你的自动化产品工作流吧！*
