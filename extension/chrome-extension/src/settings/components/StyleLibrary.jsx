import React, { useState } from 'react';
import { useCustomRewriteStyles } from '../../hooks/useCustomRewriteStyles';

const StyleLibrary = () => {
  const { styles, loading, error, createStyle, updateStyle, deleteStyle } = useCustomRewriteStyles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Style name is required';
    } else if (data.name.length > 50) {
      errors.name = 'Style name must be 50 characters or less';
    }
    
    if (!data.description.trim()) {
      errors.description = 'Description is required';
    } else if (data.description.length > 200) {
      errors.description = 'Description must be 200 characters or less';
    }
    
    if (!data.prompt.trim()) {
      errors.prompt = 'Custom prompt is required';
    } else if (!data.prompt.includes('{selected_text}')) {
      errors.prompt = 'Prompt must contain {selected_text} placeholder';
    } else if (data.prompt.length > 1000) {
      errors.prompt = 'Prompt must be 1000 characters or less';
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Real-time validation for prompt placeholder
    if (name === 'prompt' && value && !value.includes('{selected_text}')) {
      setValidationErrors(prev => ({
        ...prev,
        prompt: 'Prompt must contain {selected_text} placeholder'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return; // Don't submit if there are validation errors
    }

    try {
      if (editingStyle) {
        await updateStyle(editingStyle.id, formData);
        setEditingStyle(null);
      } else {
        await createStyle(formData);
        setShowAddForm(false);
      }
      
      // Reset form
      setFormData({ name: '', description: '', prompt: '' });
      setValidationErrors({});
    } catch (err) {
      console.error('Error saving style:', err);
      alert('Error saving style. Please try again.');
    }
  };

  const handleEdit = (style) => {
    setEditingStyle(style);
    setFormData({
      name: style.name,
      description: style.description,
      prompt: style.prompt
    });
    setShowAddForm(true);
  };

  const handleDelete = async (styleId) => {
    if (window.confirm('Are you sure you want to delete this custom style?')) {
      try {
        await deleteStyle(styleId);
      } catch (err) {
        console.error('Error deleting style:', err);
        alert('Error deleting style. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingStyle(null);
    setFormData({ name: '', description: '', prompt: '' });
    setValidationErrors({});
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="settings-content">
        <div className="loading">Loading custom styles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-content">
        <div className="error">Error loading styles: {error}</div>
      </div>
    );
  }

  return (
    <div className="settings-content">
      <div className="content-header">
        <h2>Custom Rewrite Styles</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          + Add New Style
        </button>
      </div>

      {showAddForm && (
        <div className="add-style-form">
          <h3>{editingStyle ? 'Edit Style' : 'Add New Style'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Style Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Resume Enhancer"
                className={validationErrors.name ? 'error' : ''}
              />
              {validationErrors.name && (
                <div className="field-error">{validationErrors.name}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Brief description of what this style does"
                className={validationErrors.description ? 'error' : ''}
              />
              {validationErrors.description && (
                <div className="field-error">{validationErrors.description}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="prompt">Custom Prompt</label>
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Enter your custom prompt. Must include {selected_text} placeholder."
                className={validationErrors.prompt ? 'error' : ''}
              />
              {validationErrors.prompt && (
                <div className="field-error">{validationErrors.prompt}</div>
              )}
              <small className="form-help">
                Your prompt must include {'{selected_text}'} where you want the selected text to be inserted.
              </small>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingStyle ? 'Update Style' : 'Create Style'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="styles-table-container">
        {styles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No custom styles yet</h3>
            <p>Create your first custom rewrite style to get started!</p>
            
            <div className="example-styles">
              <h4>💡 Example Ideas:</h4>
              <div className="example-grid">
                <div className="example-card">
                  <strong>Resume Enhancer</strong>
                  <p>Transform bullet points into achievement-focused resume bullets with metrics and impact</p>
                </div>
                <div className="example-card">
                  <strong>Meeting → Action Items</strong>
                  <p>Convert meeting notes into clear, actionable items with owners and deadlines</p>
                </div>
                <div className="example-card">
                  <strong>Technical → Executive</strong>
                  <p>Translate technical content into executive-friendly language focusing on business impact</p>
                </div>
              </div>
            </div>
            
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setShowAddForm(true)}
            >
              🚀 Create Your First Style
            </button>
          </div>
        ) : (
          <table className="styles-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {styles.map((style) => (
                <tr key={style.id}>
                  <td className="style-name">{style.name}</td>
                  <td className="style-description">{style.description}</td>
                  <td className="style-date">{formatDate(style.createdAt)}</td>
                  <td className="style-actions">
                    <button 
                      className="btn btn-small btn-secondary"
                      onClick={() => handleEdit(style)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(style.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StyleLibrary;
