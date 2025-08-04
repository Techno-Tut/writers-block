/**
 * Reusable FormField component with validation support
 */

import React from 'react';
import { getCharacterCountStatus } from '../../utils/formValidation';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  maxLength,
  rows,
  helpText,
  showCharacterCount = false,
  className = ''
}) => {
  const isTextarea = type === 'textarea';
  const hasError = Boolean(error);
  
  // Character count status
  const characterStatus = maxLength ? getCharacterCountStatus(value, maxLength) : null;
  
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  const inputProps = {
    id: name,
    name,
    value: value || '',
    onChange: handleChange,
    placeholder,
    required,
    maxLength,
    className: `form-input ${hasError ? 'error' : ''} ${className}`.trim()
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      
      {isTextarea ? (
        <textarea {...inputProps} rows={rows || 4} />
      ) : (
        <input {...inputProps} type={type} />
      )}
      
      {/* Error message */}
      {hasError && (
        <div className="field-error" role="alert">
          {error}
        </div>
      )}
      
      {/* Character count */}
      {showCharacterCount && characterStatus && (
        <div className={`character-count ${characterStatus.isNearLimit ? 'near-limit' : ''} ${characterStatus.isOverLimit ? 'over-limit' : ''}`}>
          {characterStatus.count}/{maxLength}
          {characterStatus.remaining < 0 && (
            <span className="over-limit-text"> ({Math.abs(characterStatus.remaining)} over limit)</span>
          )}
        </div>
      )}
      
      {/* Help text */}
      {helpText && (
        <small className="form-help">
          {helpText}
        </small>
      )}
    </div>
  );
};

export default FormField;
