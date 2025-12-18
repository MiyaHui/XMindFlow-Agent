#  XMindFlow-Agent

**Where ideas become specifications.**
*PMs visualize, XMindFlow builds.*

**XMindFlow-Agent** automates the tedious transition from abstract thoughts to concrete product deliverables. Configure it once, and transform your Xmind brain dumps into ready-to-code assets instantly.

## ⚡ The Workflow Advantage
**Stop chatting context-switching between tabs.**
Unlike a standard chat interface where you are stuck with one model for everything, XMindFlow allows you to **orchestrate a team of specialized AI agents**.

*   **Assign the Right Brain to the Right Task**: Configure your workflow to use the best model for each step.
    *   *Example*: Use **GPT-4o** for complex logic analysis (Step 1).
    *   *Example*: Use **Claude 3.5 Sonnet** for high-fidelity HTML/CSS coding (Step 2).
*   **Automated Context Passing**: No need to copy-paste prompts or explain context repeatedly. The output of one agent flows perfectly into the next.

---

## 🚀 Key Features
Turn your raw Xmind notes into a full product package:
*   ✅ **High-Fidelity Prototypes**: Generates renderable HTML/CSS prototypes using modern design systems.
*   ✅ **Custom PRDs**: Writes detailed Product Requirements Documents based on **your** specific templates.
*   ✅ **Interactive Specs**: Automatically generates an annotated "Hand-off" mode where developers can click elements to see logic and rules.
*   ✅ **Multi-LLM Support**: Mix and match models (OpenAI, Qwen, DeepSeek, etc.) within the same pipeline for optimal results.

---

## 🛠️ Prerequisites
*   **Python** (3.8 or higher)
*   **Jupyter Notebook**

## ⚙️ Configuration
**1. Model & API Setup**
Open `config.py`. You can define multiple models here to assign them to different steps later.

**2. Template Setup**
Customize the `prd_template.md` file. The agent will strictly follow this structure when generating your documentation.

---

## 📖 How to Use

### Step 1: Export Content
Export your Xmind file as **Markdown** (`.md`).

### Step 2: Prepare Directory
Move your exported markdown file into the `xminds/` directory in this project.

### Step 3: Run the Agent
1.  Open your terminal or IDE (e.g., Cursor, VS Code).
2.  Launch **Jupyter Notebook** and open `main.ipynb`.
3.  Navigate to the **Input Cell** (usually the last cell).
4.  Update the filename variable to match your uploaded file:
    ```python
    with open('xminds/my_new_feature.md', 'r', encoding='utf-8') as file:
    ```
5.  Click **Run All**.

### Step 4: Output
Sit back and wait! 🎉
The agent will analyze your context, generate the proposal, code the prototype, and write the PRD.

---

## 🎨 Advanced Customization

### Specify UI Design Style
By default, the agent creates a clean, generic interface. If you want to enforce a specific Design System (e.g., **AntDesign**, **SAP Fiori**, **Material UI**):

1.  Open `main.ipynb`.
2.  Search for the variable `prototype_instructions`.
3.  Locate the **INPUTS** section within the string.
4.  Edit the **Style** line to describe your desired look.

```python
# Inside main.ipynb
INPUTS
Proposal: Structured requirements.
Style: Ant Design (or "iOS Style", "Dark Mode", etc.)  <-- EDIT THIS LINE
```

---

*Enjoy your new automated product workflow!*
