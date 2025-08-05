#!/usr/bin/env python3
"""
Test script for text processing API endpoint
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_text_processing_endpoint():
    """Test the text processing API endpoint with various scenarios"""
    
    print("🧪 Testing Text Processing API Endpoint\n")
    
    # Test cases
    test_cases = [
        {
            "name": "Grammar Fix - Simple",
            "data": {
                "selected_text": "This are a test sentence with grammer errors.",
                "action": "grammar_fix",
                "session_id": "test_grammar_1"
            }
        },
        {
            "name": "Grammar Fix - Complex",
            "data": {
                "selected_text": "Me and him was going to the store yesterday but we didnt have no money.",
                "action": "grammar_fix",
                "session_id": "test_grammar_2"
            }
        },
        {
            "name": "Rephrase - Professional Tone",
            "data": {
                "selected_text": "Hey, can you help me with this thing?",
                "action": "rephrase",
                "parameters": {"tone": "professional"},
                "session_id": "test_rephrase_professional"
            }
        },
        {
            "name": "Rephrase - Casual Tone",
            "data": {
                "selected_text": "I would like to request your assistance with this matter.",
                "action": "rephrase",
                "parameters": {"tone": "casual"},
                "session_id": "test_rephrase_casual"
            }
        },
        {
            "name": "Rephrase - Custom Prompt",
            "data": {
                "selected_text": "The project is complete.",
                "action": "rephrase",
                "parameters": {
                    "custom_prompt": "Make this sound more exciting and celebratory: {selected_text}",
                    "style_name": "Celebration Style"
                },
                "session_id": "test_custom_prompt"
            }
        }
    ]
    
    # Invalid test cases
    invalid_cases = [
        {
            "name": "Missing Selected Text",
            "data": {
                "action": "grammar_fix",
                "session_id": "test_missing_text"
            }
        },
        {
            "name": "Invalid Action",
            "data": {
                "selected_text": "Test text",
                "action": "invalid_action",
                "session_id": "test_invalid_action"
            }
        },
        {
            "name": "Both Tone and Custom Prompt",
            "data": {
                "selected_text": "Test text",
                "action": "rephrase",
                "parameters": {
                    "tone": "professional",
                    "custom_prompt": "Make this better: {selected_text}"
                },
                "session_id": "test_both_params"
            }
        },
        {
            "name": "Rephrase Without Parameters",
            "data": {
                "selected_text": "Test text",
                "action": "rephrase",
                "session_id": "test_no_params"
            }
        },
        {
            "name": "Invalid Tone",
            "data": {
                "selected_text": "Test text",
                "action": "rephrase",
                "parameters": {"tone": "invalid_tone"},
                "session_id": "test_invalid_tone"
            }
        }
    ]
    
    # Test valid cases
    print("✅ Testing Valid Cases:")
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}. {test_case['name']}")
        try:
            response = requests.post(
                f"{BASE_URL}/api/v1/process-text",
                json=test_case['data'],
                headers={"Content-Type": "application/json"}
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"   Success: {result.get('success')}")
                print(f"   Message: {result.get('message')}")
                print(f"   Original: {test_case['data']['selected_text']}")
                print(f"   Processed: {result.get('processed_text')}")
                print(f"   Session ID: {result.get('session_id')}")
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
                f"{BASE_URL}/api/v1/process-text",
                json=test_case['data'],
                headers={"Content-Type": "application/json"}
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 422:
                print("   ✅ Correctly rejected with validation error")
                error_detail = response.json().get('detail', 'No detail')
                if isinstance(error_detail, list) and len(error_detail) > 0:
                    print(f"   Error: {error_detail[0].get('msg', 'Unknown error')}")
                else:
                    print(f"   Error: {error_detail}")
            else:
                print(f"   ⚠️  Unexpected response: {response.text}")
                
        except Exception as e:
            print(f"   Exception: {str(e)}")
    
    print("\n🎯 Test Summary:")
    print("- Valid text processing should return 200 with processed text")
    print("- Invalid requests should return 422 with validation errors")
    print("- All requests should be logged with session IDs for tracking")
    print("- Grammar fixes should correct errors")
    print("- Rephrasing should change tone/style as requested")


if __name__ == "__main__":
    print("🚀 Starting Text Processing API Tests\n")
    test_text_processing_endpoint()
    print("\n✅ Tests completed!")
