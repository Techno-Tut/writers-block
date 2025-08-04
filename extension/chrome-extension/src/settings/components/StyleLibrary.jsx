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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that prompt contains {selected_text}
    if (!formData.prompt.includes('{selected_text}')) {
      alert('Custom prompt must contain {selected_text} placeholder');
      return;
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
              />
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
              />
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
              />
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
            <p>No custom styles created yet.</p>
            <p>Click "Add New Style" to create your first custom rewrite style.</p>
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
