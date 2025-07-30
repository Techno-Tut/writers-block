"""
Utility functions for Writers Block Service
"""

import uuid
from typing import Dict


def generate_session_id() -> str:
    """Generate a unique session ID"""
    return f"session_{uuid.uuid4().hex[:8]}"


def get_action_description(action: str) -> str:
    """
    Get human-readable description for each action type
    
    Args:
        action: Action type identifier
        
    Returns:
        Human-readable description of the action
    """
    action_descriptions = {
        "grammar_fix": "Fixed grammar and spelling errors",
        "rephrase": "Rephrased text in {tone} tone"
    }
    
    return action_descriptions.get(action, f"Processed text with {action} action")


def format_action_message(action: str, parameters: Dict[str, str]) -> str:
    """
    Format response message based on action and parameters
    
    Args:
        action: Action type that was performed
        parameters: Parameters used for the action
        
    Returns:
        Formatted message describing what was done
    """
    if action == "grammar_fix":
        return "Fixed grammar and spelling errors"
    elif action == "rephrase":
        tone = parameters.get("tone", "professional")
        return f"Rephrased text in {tone} tone"
    else:
        return f"Processed text with {action} action"
