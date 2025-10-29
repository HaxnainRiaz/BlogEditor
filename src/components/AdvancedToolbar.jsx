import React from 'react';
import PrimaryToolbar from './PrimaryToolbar';
import SecondaryToolbar from './SecondaryToolbar';
import FormattingToolbar from './FormattingToolbar';
import LayoutToolbar from './LayoutToolbar';

const AdvancedToolbar = ({ 
  editor, 
  toolbarRef, 
  showToast,
  onToggleSource,
  onTogglePreview,
  onFindOpen,
  onFullscreenToggle,
  onCommentAdd,
  onEquationInsert,
  onToggleSidebar,
  onTrackChangesToggle,
  isFullscreen,
  sidebarOpen,
  trackChanges,
  onFileOpen,
  onImageUpload,
  onVideoUpload,
  onSaveHtml,
  onSaveWord,
  onSavePdf,
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
      {/* File and Edit Operations */}
      <PrimaryToolbar
        editor={activeEditor}
        showToast={showToast}
        onToggleSource={onToggleSource}
        onTogglePreview={onTogglePreview}
        onFindOpen={onFindOpen}
        onFullscreenToggle={onFullscreenToggle}
        onToggleSidebar={onToggleSidebar}
        onTrackChangesToggle={onTrackChangesToggle}
        isFullscreen={isFullscreen}
        sidebarOpen={sidebarOpen}
        trackChanges={trackChanges}
        onFileOpen={onFileOpen}
        onImageUpload={onImageUpload}
        onVideoUpload={onVideoUpload}
        onSaveHtml={onSaveHtml}
        onSaveWord={onSaveWord}
        onSavePdf={onSavePdf}
        
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
      <LayoutToolbar
        editor={activeEditor}
        onCommentAdd={onCommentAdd}
        onEquationInsert={onEquationInsert}
        onImageUpload={onImageUpload}
        onVideoUpload={onVideoUpload}
      />
      
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