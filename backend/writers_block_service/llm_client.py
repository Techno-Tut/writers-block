"""
LLM Client for direct Bedrock API calls with master system prompt
"""

import boto3
import json
import logging
from typing import Tuple, Dict
from .config import settings

logger = logging.getLogger(__name__)


class LLMClient:
    """Client for direct LLM calls to Amazon Bedrock with structured processing"""
    
    # Master system prompt for consistent processing
    MASTER_SYSTEM_PROMPT = """You are a writing assistant specialized in Salesforce Quip documents. 

Based on the action requested, process the text accordingly:

GRAMMAR_FIX: Fix grammar and spelling errors while preserving the original meaning and style. Return only the corrected text.

REPHRASE: Rewrite the text in the specified tone while maintaining the original meaning. Supported tones include professional, casual, academic, creative, and technical. Return only the rephrased text.

Always return only the processed text without any additional explanations, formatting, or commentary."""
    
    def __init__(self):
        """Initialize Bedrock client"""
        self.bedrock = boto3.client('bedrock-runtime', region_name=settings.AWS_REGION)
        self.model_id = settings.BEDROCK_MODEL_ID
        logger.info(f"Initialized LLM client with model: {self.model_id}")
    
    async def process_text(self, text: str, action: str, parameters: Dict[str, str] = None) -> str:
        """
        Generic text processing method using master system prompt
        
        Args:
            text: Text to process
            action: Action type (grammar_fix, rephrase)
            parameters: Additional parameters for the action
            
        Returns:
            Processed text
        """
        parameters = parameters or {}
        
        # Construct user prompt based on action
        if action == "grammar_fix":
            user_prompt = f"""Action: GRAMMAR_FIX
Text to process: "{text}" """
            
        elif action == "rephrase":
            tone = parameters.get("tone", "professional")
            user_prompt = f"""Action: REPHRASE
Tone: {tone}
Text to process: "{text}" """
            
        else:
            raise ValueError(f"Unsupported action: {action}")
        
        try:
            processed_text = await self.invoke_llm(user_prompt)
            logger.info(f"Successfully processed text with action: {action}")
            return processed_text.strip()
            
        except Exception as e:
            logger.error(f"Text processing failed for action {action}: {str(e)}")
            raise
    
    async def fix_grammar(self, text: str) -> str:
        """
        Fix grammar and spelling errors in text
        
        Args:
            text: Text to fix
            
        Returns:
            Corrected text
        """
        return await self.process_text(text, "grammar_fix")
    
    async def rephrase_text(self, text: str, tone: str = "professional") -> str:
        """
        Rephrase text in specified tone
        
        Args:
            text: Text to rephrase
            tone: Target tone
            
        Returns:
            Rephrased text
        """
        return await self.process_text(text, "rephrase", {"tone": tone})
    
    async def invoke_llm(self, user_prompt: str) -> str:
        """
        Make API call to Claude with system prompt
        
        Args:
            user_prompt: User's request prompt
            
        Returns:
            Claude's response text
        """
        try:
            body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "system": self.MASTER_SYSTEM_PROMPT,
                "messages": [
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ]
            }
            
            response = self.bedrock.invoke_model(
                modelId=self.model_id,
                body=json.dumps(body)
            )
            
            response_body = json.loads(response['body'].read())
            return response_body['content'][0]['text']
            
        except Exception as e:
            logger.error(f"Bedrock API call failed: {str(e)}")
            raise Exception(f"LLM processing failed: {str(e)}")
