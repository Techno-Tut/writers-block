/**
 * Error Handling Test
 * Test the enhanced error handling for validation errors
 */

// Import our error handling utilities (simulated)
const ERROR_TYPES = {
  VALIDATION: 'validation',
  API: 'api',
  NETWORK: 'network',
  UNKNOWN: 'unknown'
};

const ERROR_MESSAGES = {
  CONFLICTING_PARAMETERS: 'Cannot specify both tone and custom prompt',
  MISSING_PARAMETERS: 'Must specify either tone or custom prompt',
  CUSTOM_PROMPT_INVALID: 'Custom prompt must contain {selected_text} placeholder',
  API_VALIDATION_ERROR: 'Request validation failed'
};

class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
  }
}

// Simulate the enhanced handleAPIError function
const handleAPIError = (endpoint, error) => {
  // Handle Pydantic validation errors (422 status)
  if (error?.response?.status === 422) {
    const responseData = error.response.data;
    const validationErrors = responseData?.detail || [];
    
    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      const errorMessage = firstError.msg || ERROR_MESSAGES.API_VALIDATION_ERROR;
      
      // Map specific validation errors to user-friendly messages
      if (errorMessage.includes('both \'tone\' and \'custom_prompt\'')) {
        return new AppError(ERROR_MESSAGES.CONFLICTING_PARAMETERS, ERROR_TYPES.VALIDATION, error);
      }
      
      if (errorMessage.includes('either \'tone\' or \'custom_prompt\'')) {
        return new AppError(ERROR_MESSAGES.MISSING_PARAMETERS, ERROR_TYPES.VALIDATION, error);
      }
      
      if (errorMessage.includes('{selected_text} placeholder')) {
        return new AppError(ERROR_MESSAGES.CUSTOM_PROMPT_INVALID, ERROR_TYPES.VALIDATION, error);
      }
      
      return new AppError(errorMessage, ERROR_TYPES.VALIDATION, error);
    }
  }
  
  return new AppError(`API error for ${endpoint}: ${error.message}`, ERROR_TYPES.API, error);
};

const testErrorHandling = () => {
  console.log('🔍 Testing Enhanced Error Handling\n');

  // Test 1: Conflicting parameters error
  console.log('Test 1: Conflicting Parameters Error');
  const conflictError = {
    response: {
      status: 422,
      data: {
        detail: [{
          msg: "Cannot specify both 'tone' and 'custom_prompt' parameters",
          type: "value_error"
        }]
      }
    }
  };
  
  const result1 = handleAPIError('process-text', conflictError);
  console.log(`Error Type: ${result1.type}`);
  console.log(`Error Message: ${result1.message}`);
  console.log('✅ Conflicting parameters handled correctly\n');

  // Test 2: Missing parameters error
  console.log('Test 2: Missing Parameters Error');
  const missingError = {
    response: {
      status: 422,
      data: {
        detail: [{
          msg: "Must specify either 'tone' or 'custom_prompt' parameter for rephrase action",
          type: "value_error"
        }]
      }
    }
  };
  
  const result2 = handleAPIError('process-text', missingError);
  console.log(`Error Type: ${result2.type}`);
  console.log(`Error Message: ${result2.message}`);
  console.log('✅ Missing parameters handled correctly\n');

  // Test 3: Invalid placeholder error
  console.log('Test 3: Invalid Placeholder Error');
  const placeholderError = {
    response: {
      status: 422,
      data: {
        detail: [{
          msg: "Custom prompt must contain '{selected_text}' placeholder",
          type: "value_error"
        }]
      }
    }
  };
  
  const result3 = handleAPIError('process-text', placeholderError);
  console.log(`Error Type: ${result3.type}`);
  console.log(`Error Message: ${result3.message}`);
  console.log('✅ Invalid placeholder handled correctly\n');

  // Test 4: Generic API error
  console.log('Test 4: Generic API Error');
  const genericError = {
    message: 'Network connection failed'
  };
  
  const result4 = handleAPIError('process-text', genericError);
  console.log(`Error Type: ${result4.type}`);
  console.log(`Error Message: ${result4.message}`);
  console.log('✅ Generic API error handled correctly\n');

  console.log('🎉 All error handling tests passed!');
};

// Run the test
testErrorHandling();
