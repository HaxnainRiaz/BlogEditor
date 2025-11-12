import React from 'react';
import { ZoomIn, ZoomOut} from 'lucide-react';

const SecondaryToolbar = ({
  editor,
  showToast,
  zoomLevel = 100,
  onZoomChange
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 10, 200);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 10, 50);
    onZoomChange(newZoom);
  };

  const handleZoomReset = () => {
    onZoomChange(100);
  };

  return (
    <div className="secondary-toolbar">
      <div className="toolbar-group">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <span className="zoom-level">{zoomLevel}%</span>
          <button className="zoom-btn" onClick={handleZoomReset} title="Reset Zoom">
            100%
          </button>
          <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryToolbar;