import React, { useState } from 'react';
import { useCustomRewriteStyles, useStyleForm } from '../../hooks';
import { VALIDATION_LIMITS, SUCCESS_MESSAGES } from '../../config';
import { logError, AppError, ERROR_TYPES, getUserFriendlyMessage } from '../../utils/errorHandling';
import FormField from '../../components/common/FormField';

const StyleLibrary = () => {
  const { styles, loading, error, createStyle, updateStyle, deleteStyle } = useCustomRewriteStyles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  
  // Use the new form hook
  const {
    formData,
    validationErrors,
    isValid,
    isDirty,
    updateField,
    validateForm,
    resetForm,
    getFieldError,
    hasFieldError
  } = useStyleForm();

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
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
      resetForm();
    } catch (err) {
      const appError = new AppError(
        'Failed to save style',
        ERROR_TYPES.STORAGE,
        err
      );
      logError(appError, { formData, editingStyle: !!editingStyle });
      alert(getUserFriendlyMessage(appError));
    }
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingStyle(null);
    resetForm();
  };

  /**
   * Handle edit style
   */
  const handleEdit = (style) => {
    setEditingStyle(style);
    resetForm({
      name: style.name,
      description: style.description,
      prompt: style.prompt
    });
    setShowAddForm(true);
  };

  /**
   * Handle delete style
   */
  const handleDelete = async (styleId) => {
    if (!confirm('Are you sure you want to delete this style?')) {
      return;
    }

    try {
      await deleteStyle(styleId);
    } catch (err) {
      const appError = new AppError(
        'Failed to delete style',
        ERROR_TYPES.STORAGE,
        err
      );
      logError(appError, { styleId });
      alert(getUserFriendlyMessage(appError));
    }
  };

  if (loading) {
    return (
      <div className="settings-content">
        <div className="loading-state">
          <p>Loading custom styles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-content">
        <div className="error-state">
          <p>Error loading custom styles: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-content">
      <div className="content-header">
        <h2>Custom Writing Styles</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          + Create New Style
        </button>
      </div>

      {/* What are Custom Styles */}
      <div className="intro-section">
        <h3>🎯 What are Custom Writing Styles?</h3>
        <p>Custom styles let you transform any text with your own instructions. Think of them as personal writing assistants that follow your specific rules.</p>
        <div className="intro-examples">
          <div className="intro-example">
            <strong>Example:</strong> Turn "I completed the project" into "Successfully delivered project 2 weeks ahead of schedule, resulting in 15% cost savings"
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="usage-instructions">
        <h3>📋 How to Use Your Custom Styles</h3>
        <div className="instruction-steps">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>Highlight text</strong> in any Quip document
            </div>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>Click "🔄 Rephrase"</strong> in the popup that appears
            </div>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>Select your custom style</strong> (they have 📝 icons)
            </div>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <div className="step-content">
              <strong>Click "Apply Style"</strong> and watch your text transform!
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="add-style-form">
          <h3>{editingStyle ? 'Edit Your Style' : 'Create a New Writing Style'}</h3>
          <div className="form-intro">
            <p>💡 <strong>Quick Tip:</strong> Write simple, clear instructions. The AI will follow your directions exactly.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <FormField
              label="Style Name"
              name="name"
              value={formData.name}
              onChange={updateField}
              error={getFieldError('name')}
              placeholder="e.g., Make it Sound Professional"
              required
              maxLength={VALIDATION_LIMITS.STYLE_NAME_MAX_LENGTH}
              showCharacterCount
              helpText="Give your style a name you'll remember"
            />
            
            <FormField
              label="What does this style do?"
              name="description"
              value={formData.description}
              onChange={updateField}
              error={getFieldError('description')}
              placeholder="Makes casual text sound more professional and polished"
              required
              maxLength={VALIDATION_LIMITS.STYLE_DESCRIPTION_MAX_LENGTH}
              showCharacterCount
              helpText="Describe what transformation this style makes"
            />
            
            <FormField
              label="Instructions for the AI"
              name="prompt"
              type="textarea"
              value={formData.prompt}
              onChange={updateField}
              error={getFieldError('prompt')}
              placeholder="Rewrite {selected_text} to sound more professional. Use formal language, remove casual words, and make it suitable for business communication."
              required
              rows={4}
              maxLength={VALIDATION_LIMITS.STYLE_PROMPT_MAX_LENGTH}
              showCharacterCount
              helpText={
                <div>
                  <strong>Important:</strong> Include <code>{VALIDATION_LIMITS.REQUIRED_PLACEHOLDER}</code> where you want your selected text to appear.
                  <br />
                  <strong>Write like you're talking to a person:</strong> "Make this more friendly" or "Turn this into bullet points"
                </div>
              }
            />
            
            <div className="simple-examples">
              <h4>💬 Simple Instruction Examples:</h4>
              <div className="simple-example-list">
                <div className="simple-example">"Make {'{selected_text}'} sound more confident and professional"</div>
                <div className="simple-example">"Turn {'{selected_text}'} into a bulleted list with clear action items"</div>
                <div className="simple-example">"Rewrite {'{selected_text}'} as a friendly email to a colleague"</div>
                <div className="simple-example">"Summarize {'{selected_text}'} in one clear sentence"</div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!isValid || !isDirty}
              >
                {editingStyle ? 'Update Style' : 'Create Style'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="styles-table-container">
        {styles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✨</div>
            <h3>Ready to Create Your First Style?</h3>
            <p>Here are some popular styles that people love to use. Pick one that sounds useful to you!</p>
            
            <div className="example-styles">
              <h4>🔥 Most Popular Styles:</h4>
              <div className="example-grid">
                <div className="example-card">
                  <div className="example-header">
                    <strong>💼 Make it Professional</strong>
                    <span className="example-use-case">Perfect for work emails</span>
                  </div>
                  <p className="example-description">Transforms casual writing into polished, business-appropriate language</p>
                  <div className="example-before-after">
                    <div className="before-after-item">
                      <small><strong>Before:</strong> "Hey, can you check this out?"</small>
                    </div>
                    <div className="before-after-item">
                      <small><strong>After:</strong> "Could you please review this document at your convenience?"</small>
                    </div>
                  </div>
                </div>
                
                <div className="example-card">
                  <div className="example-header">
                    <strong>📝 Turn into Bullet Points</strong>
                    <span className="example-use-case">Great for presentations</span>
                  </div>
                  <p className="example-description">Converts paragraphs into clear, scannable bullet points</p>
                  <div className="example-before-after">
                    <div className="before-after-item">
                      <small><strong>Before:</strong> Long paragraph of text...</small>
                    </div>
                    <div className="before-after-item">
                      <small><strong>After:</strong> • Key point one • Key point two • Key point three</small>
                    </div>
                  </div>
                </div>
                
                <div className="example-card">
                  <div className="example-header">
                    <strong>📧 Friendly Email Style</strong>
                    <span className="example-use-case">For team communication</span>
                  </div>
                  <p className="example-description">Makes formal text sound warm and approachable</p>
                  <div className="example-before-after">
                    <div className="before-after-item">
                      <small><strong>Before:</strong> "The project is complete."</small>
                    </div>
                    <div className="before-after-item">
                      <small><strong>After:</strong> "Great news! We've wrapped up the project successfully. 🎉"</small>
                    </div>
                  </div>
                </div>
                
                <div className="example-card">
                  <div className="example-header">
                    <strong>📊 Add Numbers & Results</strong>
                    <span className="example-use-case">For resumes & reports</span>
                  </div>
                  <p className="example-description">Enhances accomplishments with metrics and impact</p>
                  <div className="example-before-after">
                    <div className="before-after-item">
                      <small><strong>Before:</strong> "Improved the process"</small>
                    </div>
                    <div className="before-after-item">
                      <small><strong>After:</strong> "Streamlined process, reducing completion time by 30% and saving $50K annually"</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="btn btn-primary btn-large"
              onClick={() => setShowAddForm(true)}
            >
              ✨ Create My First Style
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
                  <td className="style-date">
                    {new Date(style.createdAt).toLocaleDateString()}
                  </td>
                  <td className="style-actions">
                    <button 
                      onClick={() => handleEdit(style)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(style.id)}
                      className="btn btn-sm btn-danger"
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
