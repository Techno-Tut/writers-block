#!/usr/bin/env python3
"""
Test script for API changes - Custom Prompt Support
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test health endpoint shows new capabilities"""
    print("🔍 Testing Health Endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(data, indent=2)}")
    print()

def test_grammar_fix():
    """Test grammar fix (should work as before)"""
    print("🔍 Testing Grammar Fix...")
    payload = {
        "selected_text": "This are a sentence with grammer mistakes.",
        "action": "grammar_fix",
        "parameters": {}
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/process-text", json=payload)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Original: {payload['selected_text']}")
    print(f"Processed: {data.get('processed_text')}")
    print(f"Message: {data.get('message')}")
    print()

def test_builtin_tone():
    """Test built-in tone (should work as before)"""
    print("🔍 Testing Built-in Tone...")
    payload = {
        "selected_text": "Hey, can you get this done ASAP?",
        "action": "rephrase",
        "parameters": {
            "tone": "professional"
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/process-text", json=payload)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Original: {payload['selected_text']}")
    print(f"Processed: {data.get('processed_text')}")
    print(f"Message: {data.get('message')}")
    print()

def test_custom_prompt():
    """Test custom prompt (new functionality)"""
    print("🔍 Testing Custom Prompt...")
    payload = {
        "selected_text": "Your request has been denied.",
        "action": "rephrase",
        "parameters": {
            "custom_prompt": "Rewrite this to be more empathetic and supportive. Show understanding of the person's situation and offer helpful alternatives. Text to rewrite: {selected_text}",
            "style_name": "Empathetic Support"
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/process-text", json=payload)
    data = response.json()
    
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Original: {payload['selected_text']}")
    print(f"Processed: {data.get('processed_text')}")
    print(f"Message: {data.get('message')}")
    print()

def test_validation_errors():
    """Test validation errors"""
    print("🔍 Testing Validation Errors...")
    
    # Test both tone and custom_prompt provided
    print("Test 1: Both tone and custom_prompt provided")
    payload = {
        "selected_text": "Test text",
        "action": "rephrase",
        "parameters": {
            "tone": "professional",
            "custom_prompt": "Make this formal: {selected_text}"
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/process-text", json=payload)
    data = response.json()
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Message: {data.get('message')}")
    print()
    
    # Test neither provided
    print("Test 2: Neither tone nor custom_prompt provided")
    payload = {
        "selected_text": "Test text",
        "action": "rephrase",
        "parameters": {}
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/process-text", json=payload)
    data = response.json()
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Message: {data.get('message')}")
    print()
    
    # Test missing placeholder
    print("Test 3: Custom prompt missing {selected_text} placeholder")
    payload = {
        "selected_text": "Test text",
        "action": "rephrase",
        "parameters": {
            "custom_prompt": "Make this more professional and formal"
        }
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/process-text", json=payload)
    data = response.json()
    print(f"Status: {response.status_code}")
    print(f"Success: {data.get('success')}")
    print(f"Message: {data.get('message')}")
    print()

if __name__ == "__main__":
    print("🚀 Testing API Changes for Custom Prompt Support\n")
    
    try:
        test_health_endpoint()
        test_grammar_fix()
        test_builtin_tone()
        test_custom_prompt()
        test_validation_errors()
        
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to API server at http://localhost:8000")
        print("Make sure the backend is running with: uv run dev")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
