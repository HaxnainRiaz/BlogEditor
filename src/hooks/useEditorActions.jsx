// hooks/useEditorActions.js
import { useCallback } from 'react';

export const useEditorActions = (editor) => {
  const safeCommand = useCallback((command) => {
    if (!editor || !command) return;
    try {
      command().run();
    } catch (error) {
      console.warn('Editor command failed:', error);
    }
  }, [editor]);

  const toggleBold = useCallback(() => {
    safeCommand(() => editor.chain().focus().toggleBold());
  }, [safeCommand]);

  const toggleItalic = useCallback(() => {
    safeCommand(() => editor.chain().focus().toggleItalic());
  }, [safeCommand]);

  const toggleStrike = useCallback(() => {
    safeCommand(() => editor.chain().focus().toggleStrike());
  }, [safeCommand]);

  const toggleBlockquote = useCallback(() => {
    safeCommand(() => editor.chain().focus().toggleBlockquote());
  }, [safeCommand]);

  const toggleCodeBlock = useCallback(() => {
    safeCommand(() => editor.chain().focus().toggleCodeBlock());
  }, [safeCommand]);

  // Add other methods as needed...

  return {
    toggleBold,
    toggleItalic,
    toggleStrike,
    toggleBlockquote,
    toggleCodeBlock,
    // ... other methods
  };
};