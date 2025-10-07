// components/DocumentToolbar.jsx
import React from 'react';
import {
  Save, Printer, ZoomIn, ZoomOut, 
  Maximize, Minimize, SidebarOpen, SidebarClose,
  Search, Eye, Code, GitCompare
} from 'lucide-react';

const DocumentToolbar = ({
  editor,
  onToggleSource,
  onTogglePreview,
  onFindOpen,
  onFullscreenToggle,
  onToggleSidebar,
  onTrackChangesToggle,
  isFullscreen,
  sidebarOpen,
  trackChanges,
  zoomLevel,
  onZoomChange
}) => {
  return (
    <div className="document-toolbar">
      <div className="toolbar-group">
        <button className="toolbar-btn" title="Save (Ctrl+S)">
          <Save size={16} />
        </button>
        <button className="toolbar-btn" title="Print (Ctrl+P)">
          <Printer size={16} />
        </button>
        <button 
          className={`toolbar-btn ${trackChanges ? 'toolbar-btn-active' : ''}`}
          onClick={onTrackChangesToggle}
          title="Track Changes"
        >
          <GitCompare size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={onFindOpen} title="Find (Ctrl+F)">
          <Search size={16} />
        </button>
        <button className="toolbar-btn" onClick={onTogglePreview} title="Preview">
          <Eye size={16} />
        </button>
        <button className="toolbar-btn" onClick={onToggleSource} title="Source Code">
          <Code size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          {sidebarOpen ? <SidebarClose size={16} /> : <SidebarOpen size={16} />}
        </button>
        <button 
          className="toolbar-btn" 
          onClick={onFullscreenToggle}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>

      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="zoom-level">{zoomLevel}%</span>
        <button 
          className="toolbar-btn" 
          onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div className="toolbar-group">
        <button 
          className="toolbar-btn"
          onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="zoom-text">{zoomLevel}%</span>
        <button 
          className="toolbar-btn"
          onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>
    </div>
  );
};

export default DocumentToolbar;