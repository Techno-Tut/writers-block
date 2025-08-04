/**
 * StylePreview component for showing custom style descriptions
 */

import React from 'react';

const StylePreview = ({ style, className = '' }) => {
  if (!style) return null;

  return (
    <div className={`style-preview ${className}`.trim()}>
      <small className="style-preview-label">
        📝 Custom Style
      </small>
      <p className="style-preview-description">
        {style.description}
      </p>
    </div>
  );
};

export default StylePreview;
