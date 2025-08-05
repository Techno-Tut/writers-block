#!/usr/bin/env python3
"""
Test script for feedback API endpoint
"""

import asyncio
import json
import requests
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_feedback_endpoint():
    """Test the feedback API endpoint with various scenarios"""
    
    print("🧪 Testing Feedback API Endpoint\n")
    
    # Test cases
    test_cases = [
        {
            "name": "Valid General Feedback",
            "data": {
                "type": "general",
                "rating": 5,
                "message": "Love the extension! The custom styles feature is amazing.",
                "email": None,
                "allow_contact": False,
                "extension_version": "1.0.0",
                "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "session_id": "test_session_123"
            }
        },
        {
            "name": "Bug Report with Contact",
            "data": {
                "type": "bug",
                "rating": 2,
                "message": "The grammar fix doesn't work on Google Docs. It shows the popup but nothing happens when I click apply.",
                "email": "user@example.com",
                "allow_contact": True,
                "extension_version": "1.0.0",
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "session_id": "test_session_456"
            }
        },
        {
            "name": "Feature Request",
            "data": {
                "type": "feature",
                "rating": 4,
                "message": "Could you add support for multiple languages? I write in Spanish and English.",
                "email": "multilingual@example.com",
                "allow_contact": True,
                "extension_version": "1.0.0",
                "user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
                "session_id": "test_session_789"
            }
        },
        {
            "name": "Minimal Feedback",
            "data": {
                "type": "improvement",
                "rating": 3,
                "extension_version": "1.0.0"
            }
        }
    ]
    
    # Invalid test cases
    invalid_cases = [
        {
            "name": "Invalid Rating (too high)",
            "data": {
                "type": "general",
                "rating": 6,
                "extension_version": "1.0.0"
            }
        },
        {
            "name": "Invalid Rating (too low)",
            "data": {
                "type": "general",
                "rating": 0,
                "extension_version": "1.0.0"
            }
        },
        {
            "name": "Missing Required Fields",
            "data": {
                "message": "This should fail"
            }
        },
        {
            "name": "Contact Without Email",
            "data": {
                "type": "general",
                "rating": 5,
                "allow_contact": True,
                "extension_version": "1.0.0"
            }
        }
    ]
    
    # Test valid cases
    print("✅ Testing Valid Cases:")
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}. {test_case['name']}")
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/feedback",
                json=test_case['data'],
                headers={"Content-Type": "application/json"}
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Success: {result.get('success')}")
                print(f"   Message: {result.get('message')}")
                print(f"   Feedback ID: {result.get('feedback_id')}")
            else:
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"   Exception: {str(e)}")
    
    # Test invalid cases
    print("\n\n❌ Testing Invalid Cases:")
    for i, test_case in enumerate(invalid_cases, 1):
        print(f"\n{i}. {test_case['name']}")
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/feedback",
                json=test_case['data'],
                headers={"Content-Type": "application/json"}
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 422:
                print("   ✅ Correctly rejected with validation error")
                error_detail = response.json().get('detail', 'No detail')
                print(f"   Error: {error_detail}")
            else:
                print(f"   ⚠️  Unexpected response: {response.text}")
                
        except Exception as e:
            print(f"   Exception: {str(e)}")
    
    print("\n🎯 Test Summary:")
    print("- Valid feedback should return 200 with success=true and feedback_id")
    print("- Invalid feedback should return 422 with validation errors")
    print("- Critical feedback (rating 1-2) should trigger special logging")
    print("- All feedback should be logged to CloudWatch for analytics")


def test_health_endpoint():
    """Test the health endpoint to ensure service is running"""
    print("🏥 Testing Health Endpoint")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            health_data = response.json()
            print(f"Service: {health_data.get('message')}")
            print(f"Version: {health_data.get('version')}")
            print(f"Status: {health_data.get('status')}")
            return True
        else:
            print(f"Health check failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"Health check exception: {str(e)}")
        return False


if __name__ == "__main__":
    print("🚀 Starting API Tests\n")
    
    # Test health first
    if test_health_endpoint():
        print("\n" + "="*50 + "\n")
        test_feedback_endpoint()
    else:
        print("❌ Service is not running. Start with: uv run dev")
    
    print("\n✅ Tests completed!")
