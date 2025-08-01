import React, { useState } from 'react';
import { useCustomRewriteStyles } from '../hooks';

/**
 * Test component for validating custom rewrite styles functionality
 * This component will be removed after Phase 1 validation
 */
const CustomStylesTester = () => {
  const {
    styles,
    loading,
    error,
    initialized,
    createStyle,
    updateStyle,
    deleteStyle,
    clearAllStyles,
    getStorageInfo,
    clearError,
    styleCount,
    hasStyles
  } = useCustomRewriteStyles();

  const [storageInfo, setStorageInfo] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleCreateTestStyle = async () => {
    try {
      const testStyle = {
        name: `Test Style ${Date.now()}`,
        description: "Test description for validation",
        prompt: "Transform this text for testing purposes:\n\n{selected_text}\n\nRequirements:\n- Test formatting\n- Validate functionality"
      };

      const created = await createStyle(testStyle);
      addTestResult('Create Style', true, `Created: ${created.name}`);
    } catch (err) {
      addTestResult('Create Style', false, err.message);
    }
  };

  const handleCreateInvalidStyle = async () => {
    try {
      const invalidStyle = {
        name: "", // Invalid: empty name
        prompt: "Missing placeholder" // Invalid: no {selected_text}
      };

      await createStyle(invalidStyle);
      addTestResult('Create Invalid Style', false, 'Should have failed but succeeded');
    } catch (err) {
      addTestResult('Create Invalid Style', true, `Correctly rejected: ${err.message}`);
    }
  };

  const handleUpdateFirstStyle = async () => {
    if (styles.length === 0) {
      addTestResult('Update Style', false, 'No styles to update');
      return;
    }

    try {
      const firstStyle = styles[0];
      const updated = await updateStyle(firstStyle.id, {
        name: `Updated ${firstStyle.name}`,
        description: "Updated description"
      });
      addTestResult('Update Style', true, `Updated: ${updated.name}`);
    } catch (err) {
      addTestResult('Update Style', false, err.message);
    }
  };

  const handleDeleteLastStyle = async () => {
    if (styles.length === 0) {
      addTestResult('Delete Style', false, 'No styles to delete');
      return;
    }

    try {
      const lastStyle = styles[styles.length - 1];
      await deleteStyle(lastStyle.id);
      addTestResult('Delete Style', true, `Deleted: ${lastStyle.name}`);
    } catch (err) {
      addTestResult('Delete Style', false, err.message);
    }
  };

  const handleGetStorageInfo = async () => {
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
      addTestResult('Storage Info', true, `Retrieved storage information`);
    } catch (err) {
      addTestResult('Storage Info', false, err.message);
    }
  };

  const handleClearAllStyles = async () => {
    try {
      await clearAllStyles();
      addTestResult('Clear All Styles', true, 'All styles cleared');
    } catch (err) {
      addTestResult('Clear All Styles', false, err.message);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #ff6b6b', 
      borderRadius: '8px',
      margin: '10px',
      backgroundColor: '#fff5f5',
      fontFamily: 'monospace',
      color: '#2d3748' // Dark text
    }}>
      <h2 style={{ color: '#d63031', marginTop: 0 }}>
        🧪 Custom Rewrite Styles Tester (Phase 1)
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2d3748' }}>Hook State:</h3>
        <p style={{ color: '#2d3748' }}><strong>Initialized:</strong> {initialized ? '✅ Yes' : '❌ No'}</p>
        <p style={{ color: '#2d3748' }}><strong>Loading:</strong> {loading ? '⏳ Yes' : '✅ No'}</p>
        <p style={{ color: '#2d3748' }}><strong>Error:</strong> {error ? `❌ ${error}` : '✅ None'}</p>
        <p style={{ color: '#2d3748' }}><strong>Style Count:</strong> {styleCount}</p>
        <p style={{ color: '#2d3748' }}><strong>Has Styles:</strong> {hasStyles ? '✅ Yes' : '❌ No'}</p>
        
        {error && (
          <button onClick={clearError} style={{ marginLeft: '10px', color: '#2d3748' }}>
            Clear Error
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2d3748' }}>Test Operations:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleCreateTestStyle} disabled={loading} style={{ color: '#2d3748' }}>
            Create Test Style
          </button>
          <button onClick={handleCreateInvalidStyle} disabled={loading} style={{ color: '#2d3748' }}>
            Create Invalid Style
          </button>
          <button onClick={handleUpdateFirstStyle} disabled={loading || !hasStyles} style={{ color: '#2d3748' }}>
            Update First Style
          </button>
          <button onClick={handleDeleteLastStyle} disabled={loading || !hasStyles} style={{ color: '#2d3748' }}>
            Delete Last Style
          </button>
          <button onClick={handleGetStorageInfo} disabled={loading} style={{ color: '#2d3748' }}>
            Get Storage Info
          </button>
          <button onClick={handleClearAllStyles} disabled={loading} style={{ color: '#2d3748' }}>
            Clear All Styles
          </button>
        </div>
      </div>

      {storageInfo && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#2d3748' }}>Storage Information:</h3>
          <p style={{ color: '#2d3748' }}><strong>Style Count:</strong> {storageInfo.styleCount}</p>
          <p style={{ color: '#2d3748' }}><strong>Total Storage Keys:</strong> {storageInfo.totalStorageKeys}</p>
          <p style={{ color: '#2d3748' }}><strong>Estimated Size:</strong> {storageInfo.estimatedSize} characters</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#2d3748' }}>Current Styles ({styles.length}):</h3>
        {styles.length === 0 ? (
          <p style={{ color: '#666' }}>No custom styles created yet</p>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {styles.map((style, index) => (
              <div key={style.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '5px 0',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                color: '#2d3748'
              }}>
                <p style={{ color: '#2d3748' }}><strong>#{index + 1}: {style.name}</strong></p>
                <p style={{ color: '#2d3748' }}><strong>ID:</strong> {style.id}</p>
                <p style={{ color: '#2d3748' }}><strong>Description:</strong> {style.description || 'None'}</p>
                <p style={{ color: '#2d3748' }}><strong>Prompt:</strong> {style.prompt.substring(0, 100)}...</p>
                <p style={{ color: '#2d3748' }}><strong>Created:</strong> {new Date(style.createdAt).toLocaleString()}</p>
                <p style={{ color: '#2d3748' }}><strong>Modified:</strong> {new Date(style.lastModified).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#2d3748' }}>Test Results ({testResults.length}):</h3>
          <button onClick={clearTestResults} style={{ color: '#2d3748' }}>Clear Results</button>
        </div>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {testResults.length === 0 ? (
            <p style={{ color: '#666' }}>No tests run yet</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{
                padding: '8px',
                margin: '2px 0',
                borderRadius: '4px',
                backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                color: '#2d3748'
              }}>
                <strong style={{ color: result.success ? '#22543d' : '#742a2a' }}>
                  {result.success ? '✅' : '❌'} {result.test}
                </strong> 
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                  {result.timestamp}
                </span>
                <br />
                <span style={{ fontSize: '14px', color: '#2d3748' }}>{result.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <p style={{ color: '#2d3748' }}><strong>💡 Phase 1 Validation Instructions:</strong></p>
        <ol style={{ color: '#2d3748' }}>
          <li>Click "Create Test Style" - should succeed</li>
          <li>Click "Create Invalid Style" - should fail with validation error</li>
          <li>Click "Update First Style" - should succeed if styles exist</li>
          <li>Click "Delete Last Style" - should succeed if styles exist</li>
          <li>Click "Get Storage Info" - should show storage statistics</li>
          <li>Refresh browser and verify styles persist</li>
          <li>Click "Clear All Styles" to clean up</li>
        </ol>
      </div>
    </div>
  );
};

export default CustomStylesTester;
