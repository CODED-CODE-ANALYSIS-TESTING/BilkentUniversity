// Bubble.js
import React from 'react';
import './Bubble.css';
import './CodeAnalysis.css';

const Bubble = ({ id, title, content, issue, onClose, isSelected, onClick, isDarkMode, effort, severity, type, cleanCodeAttribute}) => {
  
  const bubbleClasses = `bubble ${isSelected ? 'edge-highlight' : 'moving'} ${isDarkMode ? 'dark-mode' : ''}`;

  return (
    <div className={bubbleClasses} onClick={() => onClick(id)}>
      <h4>{title}</h4>
      <p>{content}</p>
      <div className="bubble-details">
        <p><strong>Effort:</strong> {effort}</p>
        <p><strong>Severity:</strong> {severity}</p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Clean Code Attribute:</strong> {cleanCodeAttribute}</p>
      </div>
    </div>
  );
};

export default Bubble;
