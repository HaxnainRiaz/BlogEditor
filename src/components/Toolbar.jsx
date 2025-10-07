import React from 'react';
import PrimaryToolbar from './PrimaryToolbar';
import SecondaryToolbar from './SecondaryToolbar';

const Toolbar = ({ 
  editor, 
  toolbarRef, 
  showToast, 
  onToggleSource, 
  onTogglePreview, 
  onFindOpen, 
  onFullscreenToggle, 
  onCommentAdd, 
  onEquationInsert,
  onFileOpen,
  onImageUpload,
  onVideoUpload,
  onSaveHtml,
  onSaveWord,
  onSavePdf,
  isFullscreen 
}) => {
  return (
    <div className="toolbar-sticky">
      <div className="toolbar-panel" ref={toolbarRef}>
        <PrimaryToolbar
          editor={editor}
          showToast={showToast}
          onToggleSource={onToggleSource}
          onTogglePreview={onTogglePreview}
          onFindOpen={onFindOpen}
          onFullscreenToggle={onFullscreenToggle}
          onCommentAdd={onCommentAdd}
          onEquationInsert={onEquationInsert}
          onFileOpen={onFileOpen}
          onImageUpload={onImageUpload}
          onVideoUpload={onVideoUpload}
          onSaveHtml={onSaveHtml}
          onSaveWord={onSaveWord}
          onSavePdf={onSavePdf}
          isFullscreen={isFullscreen}
        />
        
        <SecondaryToolbar editor={editor} showToast={showToast} />
      </div>
    </div>
  );
};

export default Toolbar;