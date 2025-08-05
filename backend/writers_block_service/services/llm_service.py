"""
LLM Service for Writers Block Service
Combines LLM integration with business logic in a single, clean service
"""

import boto3
import json
import asyncio
from typing import Dict, Optional

from ..core.config import settings
from ..core.logging import get_logger, sanitize_for_log
from ..core.exceptions import LLMServiceError, ValidationError, ProcessingError


class LLMService:
    """
    LLM service that handles both business logic and LLM integration
    Simplified single service approach for maintainability
    """
    
    # Master system prompt for consistent processing
    MASTER_SYSTEM_PROMPT = """You are a writing assistant specialized in text improvement and transformation.

Based on the action requested, process the text accordingly:

GRAMMAR_FIX: Fix grammar and spelling errors while preserving the original meaning and style. Return only the corrected text.

REPHRASE: Rewrite the text according to the specified instructions while maintaining the original meaning. Return only the rephrased text.

Always return only the processed text without any additional explanations, formatting, or commentary."""
    
    def __init__(self):
        """Initialize LLM service with Bedrock client"""
        self.logger = get_logger(__name__)
        
        try:
            self.bedrock_client = boto3.client('bedrock-runtime', region_name=settings.AWS_REGION)
            self.model_id = settings.BEDROCK_MODEL_ID
            self.logger.info(f"Initialized LLM service with model: {sanitize_for_log(self.model_id)}")
        except Exception as e:
            self.logger.error(f"Failed to initialize Bedrock client: {type(e).__name__}")
            raise LLMServiceError(f"Failed to initialize LLM service: {str(e)}")
    
    async def process_text(self, text: str, action: str, parameters: Dict[str, str], 
                          session_id: str) -> str:
        """
        Main entry point for text processing
        
        Args:
            text: Text to process
            action: Action type (grammar_fix, rephrase)
            parameters: Action parameters
            session_id: Session ID for logging
            
        Returns:
            Processed text
            
        Raises:
            ValidationError: For invalid parameters
            ProcessingError: For processing failures
        """
        self.logger.info(f"Processing text - Session: {sanitize_for_log(session_id)}, Action: {action}")
        
        try:
            if action == "grammar_fix":
                return await self._fix_grammar(text, session_id)
            elif action == "rephrase":
                return await self._handle_rephrase(text, parameters, session_id)
            else:
                raise ValidationError(f"Unsupported action: {action}")
                
        except (ValidationError, ProcessingError):
            # Re-raise our custom exceptions
            raise
        except Exception as e:
            self.logger.error(f"Unexpected error in text processing - Session: {sanitize_for_log(session_id)}: {type(e).__name__}")
            raise ProcessingError(f"Text processing failed: {str(e)}")
    
    async def _fix_grammar(self, text: str, session_id: str) -> str:
        """
        Fix grammar and spelling errors in text
        
        Args:
            text: Text to fix
            session_id: Session ID for logging
            
        Returns:
            Corrected text
        """
        user_prompt = f"""Action: GRAMMAR_FIX
Text to process: "{text}" """
        
        return await self._call_bedrock(user_prompt, session_id)
    
    async def _handle_rephrase(self, text: str, parameters: Dict[str, str], 
                              session_id: str) -> str:
        """
        Handle rephrase logic with both built-in tones and custom prompts
        
        Args:
            text: Text to rephrase
            parameters: Rephrase parameters (tone or custom_prompt)
            session_id: Session ID for logging
            
        Returns:
            Rephrased text
        """
        tone = parameters.get("tone")
        custom_prompt = parameters.get("custom_prompt")
        
        # Validation: exactly one of tone or custom_prompt must be provided
        if tone and custom_prompt:
            raise ValidationError("Cannot specify both tone and custom_prompt", field="parameters")
        
        if not tone and not custom_prompt:
            raise ValidationError("Must specify either tone or custom_prompt", field="parameters")
        
        if custom_prompt:
            return await self._rephrase_with_custom_prompt(text, custom_prompt, session_id)
        else:
            return await self._rephrase_with_tone(text, tone, session_id)
    
    async def _rephrase_with_custom_prompt(self, text: str, custom_prompt: str, 
                                          session_id: str) -> str:
        """
        Rephrase text using custom prompt template
        
        Args:
            text: Text to rephrase
            custom_prompt: Custom prompt template with {selected_text} placeholder
            session_id: Session ID for logging
            
        Returns:
            Rephrased text
        """
        # Validate placeholder exists
        if '{selected_text}' not in custom_prompt:
            raise ValidationError("Custom prompt must contain {selected_text} placeholder", field="custom_prompt")
        
        # Replace placeholder with actual text
        resolved_prompt = custom_prompt.replace('{selected_text}', text)
        
        # Use resolved prompt as direct instruction
        user_prompt = f"""Process the following instruction:

{resolved_prompt}

Return only the processed text without any additional explanations or commentary."""
        
        self.logger.info(f"Processing custom prompt - Session: {sanitize_for_log(session_id)}")
        return await self._call_bedrock(user_prompt, session_id)
    
    async def _rephrase_with_tone(self, text: str, tone: str, session_id: str) -> str:
        """
        Rephrase text using built-in tone
        
        Args:
            text: Text to rephrase
            tone: Built-in tone (professional, casual, etc.)
            session_id: Session ID for logging
            
        Returns:
            Rephrased text
        """
        # Validate built-in tone
        valid_tones = {'professional', 'casual', 'academic', 'creative', 'technical'}
        if tone not in valid_tones:
            raise ValidationError(f"Invalid tone '{tone}'. Valid tones: {', '.join(valid_tones)}", field="tone")
        
        user_prompt = f"""Action: REPHRASE
Tone: {tone}
Text to process: "{text}" """
        
        self.logger.info(f"Processing built-in tone '{tone}' - Session: {sanitize_for_log(session_id)}")
        return await self._call_bedrock(user_prompt, session_id)
    
    async def _call_bedrock(self, user_prompt: str, session_id: str) -> str:
        """
        Make API call to Claude via Bedrock
        
        Args:
            user_prompt: User's request prompt
            session_id: Session ID for logging
            
        Returns:
            Claude's response text
            
        Raises:
            LLMServiceError: For Bedrock API failures
        """
        try:
            # Prepare request body
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
            
            # Make async call to Bedrock
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.bedrock_client.invoke_model(
                    modelId=self.model_id,
                    body=json.dumps(body)
                )
            )
            
            # Parse response
            response_body = json.loads(response['body'].read())
            result = response_body['content'][0]['text'].strip()
            
            self.logger.info(f"LLM call successful - Session: {sanitize_for_log(session_id)}")
            return result
            
        except Exception as e:
            self.logger.error(f"Bedrock API call failed - Session: {sanitize_for_log(session_id)}: {type(e).__name__}")
            raise LLMServiceError(f"LLM processing failed: {str(e)}")
