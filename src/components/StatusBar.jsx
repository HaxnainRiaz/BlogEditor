import React from 'react';

const StatusBar = ({ wordCount = 0, charCount = 0, pageCount = 1, zoomLevel = 100 }) => {
  return (
    <div className="status-bar">
      <div className="status-section">
        <div className="status-item">Words: {wordCount}</div>
        <div className="status-item">Characters: {charCount}</div>
        <div className="status-item">Pages: {pageCount}</div>
      </div>
      <div className="status-section">
        <div className="status-item">Zoom: {zoomLevel}%</div>
      </div>
    </div>
  );
};

export default StatusBar;