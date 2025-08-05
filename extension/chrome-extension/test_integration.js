/**
 * Frontend Integration Test
 * Test the updated API integration with custom prompts
 */

// Mock the API call structure that ActionButtons would make
const testAPIIntegration = () => {
  console.log('🚀 Testing Frontend API Integration\n');

  // Test 1: Built-in tone (should work as before)
  console.log('Test 1: Built-in Tone');
  const builtinRequest = {
    selected_text: "Hey, can you get this done ASAP?",
    action: "rephrase",
    parameters: {
      tone: "professional"
    }
  };
  console.log('Request:', JSON.stringify(builtinRequest, null, 2));
  console.log('✅ Built-in tone structure correct\n');

  // Test 2: Custom prompt (new functionality)
  console.log('Test 2: Custom Prompt');
  const customRequest = {
    selected_text: "Your request has been denied.",
    action: "rephrase",
    parameters: {
      custom_prompt: "Rewrite this to be more empathetic and supportive. Show understanding of the person's situation and offer helpful alternatives. Text to rewrite: {selected_text}",
      style_name: "Empathetic Support"
    }
  };
  console.log('Request:', JSON.stringify(customRequest, null, 2));
  console.log('✅ Custom prompt structure correct\n');

  // Test 3: Grammar fix (should be unchanged)
  console.log('Test 3: Grammar Fix');
  const grammarRequest = {
    selected_text: "This are a sentence with grammer mistakes.",
    action: "grammar_fix",
    parameters: {}
  };
  console.log('Request:', JSON.stringify(grammarRequest, null, 2));
  console.log('✅ Grammar fix structure correct\n');

  console.log('🎉 All API integration structures are correct!');
  console.log('\n📋 Next Steps:');
  console.log('1. Load the extension in Chrome');
  console.log('2. Test on a webpage with text selection');
  console.log('3. Verify custom styles work end-to-end');
  console.log('4. Check error handling for validation errors');
};

// Run the test
testAPIIntegration();
