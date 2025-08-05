"""
Feedback processing service with standard logging
"""

import json
import uuid
from datetime import datetime
from typing import Dict, Any
import re

from ..core.logging import get_logger
from ..models.schemas import FeedbackRequest, FeedbackResponse

logger = get_logger(__name__)


class FeedbackService:
    """Service for processing user feedback with analytics"""
    
    def __init__(self):
        self.logger = logger
    
    async def process_feedback(self, feedback: FeedbackRequest) -> FeedbackResponse:
        """
        Process user feedback and log analytics data
        
        Args:
            feedback: Validated feedback request
            
        Returns:
            FeedbackResponse with success status and feedback ID
        """
        try:
            # Generate unique feedback ID
            feedback_id = str(uuid.uuid4())
            
            # Log feedback analytics (privacy-safe)
            await self._log_feedback_analytics(feedback, feedback_id)
            
            # Send notifications for critical feedback
            if feedback.rating <= 2:
                await self._notify_critical_feedback(feedback, feedback_id)
            
            return FeedbackResponse(
                success=True,
                message="Thank you for your feedback! We appreciate your input.",
                feedback_id=feedback_id
            )
            
        except Exception as e:
            self.logger.error(f"Failed to process feedback: {str(e)}")
            return FeedbackResponse(
                success=False,
                message="Sorry, we couldn't process your feedback right now. Please try again later.",
                feedback_id=""
            )
    
    async def _log_feedback_analytics(self, feedback: FeedbackRequest, feedback_id: str):
        """
        Log feedback analytics using standard logger
        
        Args:
            feedback: Feedback request data
            feedback_id: Unique feedback identifier
        """
        try:
            # Extract browser info safely
            browser_info = self._extract_browser_info(feedback.user_agent)
            
            # Create analytics log entry (contact info only in JSON)
            analytics_data = {
                "event": "feedback_submitted",
                "feedback_id": feedback_id,
                "feedback_type": feedback.type,
                "rating": feedback.rating,
                "has_message": bool(feedback.message and feedback.message.strip()),
                "message_length": len(feedback.message) if feedback.message else 0,
                "has_email": bool(feedback.email),
                "allow_contact": feedback.allow_contact,
                "contact_email": feedback.email if feedback.allow_contact and feedback.email else None,
                "extension_version": feedback.extension_version or "unknown",
                "browser": browser_info.get("browser", "unknown"),
                "browser_version": browser_info.get("version", "unknown"),
                "platform": browser_info.get("platform", "unknown"),
                "session_id": feedback.session_id or "anonymous",
                "timestamp": datetime.utcnow().isoformat(),
                "day_of_week": datetime.utcnow().strftime("%A"),
                "hour_of_day": datetime.utcnow().hour
            }
            
            # Log structured data for analytics (includes contact info)
            self.logger.info(json.dumps(analytics_data))
            
            # Log summary for easy reading (no contact info)
            self.logger.info(
                f"Feedback received: {feedback.type} rating={feedback.rating} "
                f"version={feedback.extension_version} id={feedback_id}"
            )
            
        except Exception as e:
            self.logger.error(f"Failed to log feedback analytics: {str(e)}")
    
    def _extract_browser_info(self, user_agent: str) -> Dict[str, str]:
        """
        Extract browser information from user agent string
        
        Args:
            user_agent: Browser user agent string
            
        Returns:
            Dictionary with browser, version, and platform info
        """
        if not user_agent:
            return {"browser": "unknown", "version": "unknown", "platform": "unknown"}
        
        try:
            # Extract browser name and version
            browser_patterns = {
                "Chrome": r"Chrome/(\d+\.\d+)",
                "Firefox": r"Firefox/(\d+\.\d+)",
                "Safari": r"Safari/(\d+\.\d+)",
                "Edge": r"Edg/(\d+\.\d+)",
                "Opera": r"OPR/(\d+\.\d+)"
            }
            
            browser = "unknown"
            version = "unknown"
            
            for browser_name, pattern in browser_patterns.items():
                match = re.search(pattern, user_agent)
                if match:
                    browser = browser_name
                    version = match.group(1)
                    break
            
            # Extract platform
            platform = "unknown"
            if "Windows" in user_agent:
                platform = "Windows"
            elif "Macintosh" in user_agent or "Mac OS" in user_agent:
                platform = "macOS"
            elif "Linux" in user_agent:
                platform = "Linux"
            elif "Android" in user_agent:
                platform = "Android"
            elif "iPhone" in user_agent or "iPad" in user_agent:
                platform = "iOS"
            
            return {
                "browser": browser,
                "version": version,
                "platform": platform
            }
            
        except Exception as e:
            self.logger.error(f"Failed to parse user agent: {str(e)}")
            return {"browser": "unknown", "version": "unknown", "platform": "unknown"}
    
    async def _notify_critical_feedback(self, feedback: FeedbackRequest, feedback_id: str):
        """
        Log critical feedback (low ratings)
        
        Args:
            feedback: Feedback request data
            feedback_id: Unique feedback identifier
        """
        try:
            # Log critical feedback for immediate attention (contact info in JSON only)
            critical_data = {
                "event": "critical_feedback",
                "feedback_id": feedback_id,
                "rating": feedback.rating,
                "type": feedback.type,
                "extension_version": feedback.extension_version,
                "contact_email": feedback.email if feedback.allow_contact and feedback.email else None,
                "allow_contact": feedback.allow_contact,
                "message_preview": feedback.message[:100] + "..." if feedback.message and len(feedback.message) > 100 else feedback.message,
                "timestamp": datetime.utcnow().isoformat(),
                "requires_attention": True
            }
            
            # Log critical feedback as warning (includes contact info in JSON)
            self.logger.warning(json.dumps(critical_data))
            
            # Also log a clear summary for immediate attention (no contact info)
            message_preview = f" Message: {feedback.message[:50]}..." if feedback.message else ""
            self.logger.warning(
                f"🚨 CRITICAL FEEDBACK: {feedback.type} rating={feedback.rating} "
                f"version={feedback.extension_version} id={feedback_id}{message_preview}"
            )
            
        except Exception as e:
            self.logger.error(f"Failed to log critical feedback: {str(e)}")


# Global service instance
feedback_service = FeedbackService()
