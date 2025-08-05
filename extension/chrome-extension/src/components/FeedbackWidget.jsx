import React, { useState } from 'react';
import './FeedbackWidget.css';

const FeedbackWidget = ({ onClose }) => {
  const [feedback, setFeedback] = useState({
    type: 'general',
    rating: 5,
    message: '',
    email: '',
    allowContact: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // API endpoint - use localhost for development
  const API_BASE_URL = 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare feedback data
      const feedbackData = {
        type: feedback.type,
        rating: feedback.rating,
        message: feedback.message || null,
        email: feedback.allowContact ? feedback.email : null,
        allow_contact: feedback.allowContact,
        extension_version: chrome?.runtime?.getManifest?.()?.version || '1.0.0',
        user_agent: navigator.userAgent,
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log('Submitting feedback:', feedbackData);

      // Send to backend API
      const response = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Failed to submit feedback';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Feedback result:', result);
      
      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to submit feedback');
      }
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      
      // Provide user-friendly error messages
      let userMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        userMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message.includes('NetworkError')) {
        userMessage = 'Network error. Please try again later.';
      }
      
      setError(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="feedback-overlay">
        <div className="feedback-widget">
          <div className="feedback-success">
            <div className="success-icon">🎉</div>
            <h3>Thank you!</h3>
            <p>Your feedback helps us improve Writers Block.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-overlay">
      <div className="feedback-widget">
        <div className="feedback-header">
          <h3>Share Your Feedback</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>What type of feedback?</label>
            <select 
              value={feedback.type} 
              onChange={(e) => setFeedback({...feedback, type: e.target.value})}
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement Suggestion</option>
            </select>
          </div>

          <div className="form-group">
            <label>How would you rate your experience?</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= feedback.rating ? 'active' : ''}`}
                  onClick={() => setFeedback({...feedback, rating: star})}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tell us more (optional)</label>
            <textarea
              value={feedback.message}
              onChange={(e) => setFeedback({...feedback, message: e.target.value})}
              placeholder="What did you like? What could be improved? Any bugs or feature requests?"
              rows={4}
              maxLength={2000}
            />
            {feedback.message && (
              <div className="character-count">
                {feedback.message.length}/2000 characters
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={feedback.allowContact}
                onChange={(e) => setFeedback({...feedback, allowContact: e.target.checked})}
              />
              I'm open to follow-up questions about my feedback
            </label>
          </div>

          {feedback.allowContact && (
            <div className="form-group">
              <label>Email (required for follow-up)</label>
              <input
                type="email"
                value={feedback.email}
                onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                placeholder="your@email.com"
                required={feedback.allowContact}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackWidget;
