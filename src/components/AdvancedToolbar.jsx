import React from 'react';
import PrimaryToolbar from './PrimaryToolbar';
import SecondaryToolbar from './SecondaryToolbar';
import FormattingToolbar from './FormattingToolbar';
import LayoutToolbar from './LayoutToolbar';

const AdvancedToolbar = ({ 
  editor, 
  toolbarRef, 
  showToast,
  onFullscreenToggle,
  isFullscreen,
  fontSize,
  fontFamily,
  lineHeight,
  textColor,
  highlightColor,
  zoomLevel,
  onFontSizeChange,
  onFontFamilyChange,
  onLineHeightChange,
  onTextColorChange,
  onHighlightColorChange,
  onZoomChange
}) => {
const activeEditor = editor || (typeof window !== 'undefined' && window.__multiPageActiveEditor) || null;
  return (
    <div className="advanced-toolbar">
      {/* Core Edit Operations */}
      <PrimaryToolbar
        editor={activeEditor}
        showToast={showToast}
        onFullscreenToggle={onFullscreenToggle}
        isFullscreen={isFullscreen}
      />
      
      {/* Text Formatting */}
      <FormattingToolbar
        editor={activeEditor}
        fontSize={fontSize}
        fontFamily={fontFamily}
        lineHeight={lineHeight}
        textColor={textColor}
        highlightColor={highlightColor}
        onFontSizeChange={onFontSizeChange}
        onFontFamilyChange={onFontFamilyChange}
        onLineHeightChange={onLineHeightChange}
        onTextColorChange={onTextColorChange}
        onHighlightColorChange={onHighlightColorChange}
      />
      
      {/* Layout and Insert */}
      <LayoutToolbar editor={activeEditor} />
      
      {/* View Controls */}
      <SecondaryToolbar
        editor={activeEditor}
        zoomLevel={zoomLevel}
        onZoomChange={onZoomChange}
      />
    </div>
  );
};

export default AdvancedToolbar;