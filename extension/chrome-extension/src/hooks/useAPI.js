import { useState, useCallback } from 'react';
import { API } from '../utils/constants';

/**
 * Custom hook for API communication with the backend
 */
export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processText = useCallback(async (selectedText, action, parameters = {}, sessionId = null) => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        selected_text: selectedText,
        action: action,
        parameters: parameters,
        ...(sessionId && { session_id: sessionId })
      };

      console.log('API Request:', requestBody);

      const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.PROCESS_TEXT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (!result.success) {
        throw new Error(result.message || 'API request failed');
      }

      return result;

    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.message || 'Failed to process text. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    processText,
    loading,
    error,
    clearError
  };
};
