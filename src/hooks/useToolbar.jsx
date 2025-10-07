import { useMemo } from 'react';
import { toolbarConfig, iconMap } from '../config/toolbarConfig';

export const useToolbar = (
  editor, 
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
) => {
  const primaryItems = useMemo(() => {
    return toolbarConfig
      .filter(item => item.category === 'primary')
      .map(item => ({
        ...item,
        onClick: () => item.onClick(editor, showToast, {
          onToggleSource,
          onTogglePreview,
          onFindOpen,
          onFullscreenToggle,
          onCommentAdd,
          onEquationInsert,
          onFileOpen: onFileOpen || (() => document.getElementById('file-open-input')?.click()),
          onImageUpload: onImageUpload || (() => document.getElementById('file-image-input')?.click()),
          onVideoUpload: onVideoUpload || (() => document.getElementById('file-video-input')?.click()),
          onSaveHtml: onSaveHtml || (() => document.dispatchEvent(new CustomEvent('save-html'))),
          onSaveWord: onSaveWord || (() => document.dispatchEvent(new CustomEvent('save-word'))),
          onSavePdf: onSavePdf || (() => document.dispatchEvent(new CustomEvent('save-pdf'))),
          onEmojiOpen: () => document.dispatchEvent(new CustomEvent('open-emoji-picker')),
          onTrackChanges: () => document.dispatchEvent(new CustomEvent('toggle-track-changes')),
        })
      }));
  }, [
    editor, showToast, onToggleSource, onTogglePreview, onFindOpen, 
    onFullscreenToggle, onCommentAdd, onEquationInsert, onFileOpen,
    onImageUpload, onVideoUpload, onSaveHtml, onSaveWord, onSavePdf, isFullscreen
  ]);

  const isActive = (key) => {
    if (!editor) return false;

    try {
      switch (key) {
        case "bold":
          return editor.isActive("bold");
        case "italic":
          return editor.isActive("italic");
        case "underline":
          return editor.isActive("underline");
        case "strike":
          return editor.isActive("strike");
        case "code":
          return editor.isActive("code");
        case "codeblock":
          return editor.isActive("codeBlock");
        case "bullet":
          return editor.isActive("bulletList");
        case "ordered":
          return editor.isActive("orderedList");
        case "alignLeft":
          return editor.isActive({ textAlign: "left" });
        case "alignCenter":
          return editor.isActive({ textAlign: "center" });
        case "alignRight":
          return editor.isActive({ textAlign: "right" });
        case "alignJustify":
          return editor.isActive({ textAlign: "justify" });
        default:
          return false;
      }
    } catch {
      return false;
    }
  };

  const IconFor = (key) => {
    return iconMap[key] || null;
  };

  const shouldSeparateBefore = new Set([
    "undo", "bold", "code", "bullet", "alignLeft", "hr", "link", 
    "table", "special", "source", "export", "fullscreen", "clear", "track"
  ]);

  return {
    primaryItems,
    isActive,
    IconFor,
    shouldSeparateBefore
  };
};