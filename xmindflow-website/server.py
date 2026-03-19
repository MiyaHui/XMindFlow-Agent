import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, List
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from langgraph.graph import START, END, StateGraph
    from typing_extensions import TypedDict
    from langchain_openai import ChatOpenAI
    from langchain_deepseek import ChatDeepSeek
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False
    logger.warning("LangGraph not installed. API will be in demo mode.")


class AgentState(TypedDict):
    xmind_context: str
    expand_instructions: str
    product_proposal: str
    prototype_instructions: str
    prototype_html: str
    prd_instructions: str
    prd_template: str
    prd_document: str
    label_instructions: str
    labelled_html: str


expand_instructions = """You are a Product Analyst Agent. Your goal is to transform Xmind mind-map content (formatted as Markdown) into a structured Product Proposal.

INSTRUCTIONS
1. Context Analysis: Analyze the hierarchical structure. Treat top-level nodes as Modules and leaf nodes as Features/Logic.
2. Logic vs. UI: Distinguish between physical features (pages, buttons) and abstract business logic (processes, goals).
3. LANGUAGE FIDELITY:
Detect the primary language of the Xmind input.
Strictly use that same language for all output content (feature names, descriptions, logic).
Do NOT translate terms into English.
4. Strict Constraints:
Cover 100% of the nodes mentioned.
DO NOT hallucinate features not mentioned.

OUTPUT FORMAT
Generate a structured report in Markdown (headers in English is fine, content must be Source Language):

1. Product Scope
(Summary in Source Language)

2. Module Breakdown
Module Name: [Node Title in Source Language]
Functional Features: [UI items in Source Language]
Business Logic: [Rules in Source Language]
Data/Fields: [Data points in Source Language]

3. Non-Functional Requirements
(Optimization goals in Source Language)
"""

prototype_instructions = """
You are an Expert UI/UX Engineer. Your goal is to transform a Product Proposal into a High-Fidelity HTML/CSS Prototype.

INPUTS
Proposal: Structured requirements.
Style: Design System.

LIBRARIES
CSS: Tailwind CSS (CDN).
Icons: FontAwesome (CDN).
Images: Unsplash.

INSTRUCTIONS
UI LANGUAGE (CRITICAL):
Use the EXACT language found in the Input Proposal for all visible text.
Buttons: Use "提交" if input is Chinese, "Submit" if English.
Placeholders: Use "请输入..." if input is Chinese.
Do NOT use English defaults.
Structure: Sidebar (Nav) + Main Content Area + Cards for Features.
Design System: Apply the requested Style (colors, spacing, shadows).
Content Mapping:
Convert "Functional Features" to Buttons/Inputs.
Render "Business Logic" as Tooltips or Info Alerts.
Output: Return ONLY single, valid, self-contained HTML/CSS/JS. <!DOCTYPE html> should be in the beginning of your output.

EXECUTION
Generate the HTML prototype now.
"""

prd_instructions = """
You are a Senior Product Manager. Your task is to write a comprehensive Product Requirements Document (PRD) based on a provided Product Proposal and a specific Template in HUMAN MESSAGE.

MAPPING RULES
Functional Features: Map to "Functional Requirements" or "User Interactions."
Data/Fields: Map to "Data Requirements" or "Page Elements."
Business Logic: Map to "Backend Logic," "Algorithms," or "Flow Rules."
Non-Functional: Map optimization goals (e.g., "speed," "standardization") to "Success Metrics" or "Non-Functional Requirements."
INSTRUCTIONS
Strict Template Adherence: Output the PRD exactly in the provided template format. Do not change headers.
No Feature Creep: Do not invent new modules. Only elaborate on standard behaviors implied by the proposal (e.g., validation, error states, loading states).
Clarity: Use clear, unambiguous technical language. Use bolding for key terms.
EXECUTION
Receive the Proposal and Template, then generate the PRD.
The output should use the same language as the human message.
"""

label_instructions = """You are a Senior Interaction Designer and Frontend Architect. Your task is to transform the Static HTML Prototype from the previous step into a fully Interactive PRD/Annotation Tool.

INPUT
1. Source Code: The High-Fidelity HTML generated in Step 2.

OBJECTIVE
Output a single HTML file that renders the original UI plus an overlay layer of interactive specification annotations.

CORE WORKFLOW
1. Element Recognition & Logic Writing (The "UX Brain")
Analyze the HTML structure. Identify every interactive element (Inputs, Buttons, Cards, Navigation). For each, generate a JSON object in the script with:
Target: The CSS selector of the element.
Title: Name of the element (e.g., "Submit Button").
Description: Strict logic definition. Format: [Normal Flow] + [Edge Case/Empty State]. Example: "Click to submit. If network fails, show toast error. If field empty, disable button."

2. Layout Strategy (The "UI Layout")
Screen Split: Elements on the Left half -> Place Annotation Card on the Far Left margin. Elements on the Right half -> Place Annotation Card on the Far Right margin.
Vertical Flow: Calculate offsetTop to align cards roughly with their targets, but apply spacing to prevent overlap.

3. Tool Functionality (The "Frontend Logic")
You must inject JavaScript and CSS to achieve the following strictly:
Visuals: Draw an SVG line from the element to the Annotation Card. The line start-point (on the UI element) must be a distinct Dot. The line end-point must touch the Annotation Card perfectly (no gaps).
Interactivity (CRITICAL):
Draggable: Users must be able to drag the Annotation Cards AND the Line Start-Dots to adjust positions manually.
Editable: All text inside the Annotation Cards must be contenteditable. Clicking text allows direct modification.
Re-rendering: The connecting lines must update automatically when cards or dots are dragged.

OUTPUT REQUIREMENTS
1. Code Only: Return a single, valid HTML code block.
2. Coverage: Annotate at least 80% of visible elements.
3. Self-Check: Ensure z-index of the annotation layer is highest (9999). Ensure text color contrasts with the background. Verify the script handles "No Data" logic in the text descriptions.

EXECUTION
Take the human message HTML, inject the annotation script/styles, and output the final result.
The labels and notes should use the same language as the humanmessage.
"""


def get_llm(model_type: str, api_key: str, base_url: str, model_name: str, max_tokens: int = 4000):
    if model_type in ["qwen", "openai"]:
        return ChatOpenAI(
            model=model_name,
            api_key=api_key,
            temperature=0.7,
            base_url=base_url,
            max_tokens=max_tokens
        )
    elif model_type == "deepseek":
        return ChatDeepSeek(
            model=model_name,
            api_key=api_key,
            temperature=0.7,
            base_url=base_url,
            max_tokens=max_tokens
        )
    else:
        return ChatOpenAI(
            model=model_name,
            api_key=api_key,
            temperature=0.7,
            base_url=base_url,
            max_tokens=max_tokens
        )


def expand_mindmap(state: AgentState, config: Dict[str, Any]) -> AgentState:
    from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

    llm = get_llm(
        config["expand_provider"],
        config["expand_api_key"],
        config["expand_base_url"],
        config["expand_model"]
    )

    messages = [
        SystemMessage(content=expand_instructions),
        HumanMessage(content=f"{state['xmind_context']}")
    ]
    response = llm.invoke(messages)
    state["product_proposal"] = response.content
    return state


def draw_prototype(state: AgentState, config: Dict[str, Any]) -> AgentState:
    from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

    llm = get_llm(
        config["prototype_provider"],
        config["prototype_api_key"],
        config["prototype_base_url"],
        config["prototype_model"]
    )

    messages = [
        SystemMessage(content=prototype_instructions),
        HumanMessage(content=f"{state['product_proposal']}")
    ]
    response = llm.invoke(messages)
    state["prototype_html"] = response.content
    return state


def write_prd(state: AgentState, config: Dict[str, Any]) -> AgentState:
    from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

    prd_template_path = Path(__file__).parent / "XMindFlow-Agent" / "prd_template.md"
    if prd_template_path.exists():
        with open(prd_template_path, 'r', encoding='utf-8') as f:
            prd_template = f.read()
    else:
        prd_template = "# PRD Template"

    llm = get_llm(
        config["prd_provider"],
        config["prd_api_key"],
        config["prd_base_url"],
        config["prd_model"]
    )

    messages = [
        SystemMessage(content=prd_instructions),
        HumanMessage(content=f"""
the product proposal: {state['product_proposal']}
the prd example: {prd_template}
""")
    ]
    response = llm.invoke(messages)
    state["prd_document"] = response.content
    return state


def label_prototype(state: AgentState, config: Dict[str, Any]) -> AgentState:
    from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

    llm = get_llm(
        config["prototype_provider"],
        config["prototype_api_key"],
        config["prototype_base_url"],
        config["prototype_model"]
    )

    messages = [
        SystemMessage(content=label_instructions),
        HumanMessage(content=f"{state['prototype_html']}")
    ]
    response = llm.invoke(messages)
    state["labelled_html"] = response.content
    return state


def build_workflow():
    workflow = StateGraph(AgentState)

    def create_node(func, config):
        def wrapper(state: AgentState):
            return func(state, config)
        return wrapper

    return workflow


@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')


@app.route('/assets/<path:path>')
def assets(path):
    return send_from_directory('dist/assets', path)


@app.route('/api/models', methods=['GET'])
def get_models():
    return jsonify({
        "qwen": ["qwen3-max", "qwen3-8b"],
        "deepseek": ["deepseek-reasoner", "deepseek-chat"]
    })


@app.route('/api/process', methods=['POST'])
def process():
    if not LANGGRAPH_AVAILABLE:
        return jsonify({
            "error": "LangGraph not installed. Please run: pip install langgraph langchain-openai langchain-deepseek"
        }), 500

    data = request.json
    xmind_content = data.get('xmindContent', '')
    config_data = data.get('config', {})

    api_keys = config_data.get('apiKeys', {})
    qwen_key = api_keys.get('qwen', '')
    deepseek_key = api_keys.get('deepseek', '')

    config = {
        "expand_provider": "qwen",
        "expand_api_key": qwen_key,
        "expand_base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "expand_model": config_data.get('expandModel', 'qwen3-max'),

        "prototype_provider": "deepseek",
        "prototype_api_key": deepseek_key,
        "prototype_base_url": "https://api.deepseek.com/v1",
        "prototype_model": config_data.get('prototypeModel', 'deepseek-reasoner'),

        "prd_provider": "qwen",
        "prd_api_key": qwen_key,
        "prd_base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "prd_model": config_data.get('prdModel', 'qwen3-max'),
    }

    try:
        state: AgentState = {
            "xmind_context": xmind_content,
            "expand_instructions": "",
            "product_proposal": "",
            "prototype_instructions": "",
            "prototype_html": "",
            "prd_instructions": "",
            "prd_template": "",
            "prd_document": "",
            "label_instructions": "",
            "labelled_html": ""
        }

        logger.info("Step 1: Expanding mindmap...")
        state = expand_mindmap(state, config)

        logger.info("Step 2: Drawing prototype...")
        state = draw_prototype(state, config)

        logger.info("Step 3: Writing PRD...")
        state = write_prd(state, config)

        logger.info("Step 4: Labeling prototype...")
        state = label_prototype(state, config)

        return jsonify({
            "productProposal": state["product_proposal"],
            "prototypeHtml": state["prototype_html"],
            "prdDocument": state["prd_document"],
            "labelledHtml": state["labelled_html"]
        })

    except Exception as e:
        logger.error(f"Processing error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
