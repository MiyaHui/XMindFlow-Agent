# Agent System Configuration

import os
from typing import Dict, Any, List

class Config:
    #xmind understanding and generate product proposal
    EXPAND_MODEL_CONFIG = {
        "provider": "qwen",
        "model": "qwen3-max",
        "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "api_key": "sk-...",
        "temperature": 0.7,
        "max_tokens": 4000
    }
    #generate prototype
    PROTOTYPE_MODEL_CONFIG = {
        "provider": "deepseek",
        "model": "deepseek-reasoner",
        "base_url": "https://api.deepseek.com/v1",
        "api_key": "sk-...",
        "temperature": 0.7,
        "max_tokens": 4000
    }
    #PRD document
    PRD_MODEL_CONFIG = {
        "provider": "qwen",
        "model": "qwen3-max",
        "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "api_key": "sk-...",
        "temperature": 0.7,
        "max_tokens": 4000
    }



# Example configurations for different providers:

f"""
# OpenAI
{
    "provider": "openai",
    "model": "gpt-4-turbo",
    "api_key": "sk-...",
    "temperature": 0.7,
    "base_url": "https://api.openai.com/v1",
    "max_tokens": 4096,
}

# Google Gemini is not supported

# DeepSeek
{
    "provider": "deepseek",
    "model": "deepseek-chat",
    "api_key": "sk-...",
    "temperature": 0.7,
    "base_url": "https://api.deepseek.com/v1",
    "max_tokens": 8192,
}

#Qwen
{
    "provider": "qwen",
    "model": "qwen3-max",
    "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "api_key": "sk-...",
    "temperature": 0.7,
    "max_tokens": 4000
}

# Anthropic Claude
{
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "api_key": "sk-ant-...",
    "temperature": 0.7,
    "max_tokens": 8192,
}

# Azure OpenAI
{
    "provider": "azure",
    "model": "gpt-4",
    "api_key": "your-azure-key",
    "temperature": 0.7,
    "base_url": "https://your-resource.openai.azure.com/",
    "api_version": "2024-02-15-preview",
    "deployment_name": "gpt-4",
    "max_tokens": 4096,
}

# Custom OpenAI-compatible API (like Ollama, LM Studio, etc.)
{
    "provider": "openai",
    "model": "llama3",
    "api_key": "not-needed",
    "temperature": 0.7,
    "base_url": "http://localhost:11434/v1",
    "max_tokens": 4096,
}
"""