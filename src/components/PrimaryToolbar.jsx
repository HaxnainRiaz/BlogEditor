import React from 'react';
import { Undo2, Redo2, Scissors, Copy, ClipboardPaste, Maximize2, Minimize2 } from 'lucide-react';

const PrimaryToolbar = ({ editor, showToast, onFullscreenToggle, isFullscreen }) => {
  const STORAGE_KEY = "editorContentArea.pages.v1";

  // Safely compute availability for undo/redo to avoid null editor errors
  const canUndo = !!(editor && editor.can && typeof editor.can === 'function' && editor.can().undo && editor.can().undo());
  const canRedo = !!(editor && editor.can && typeof editor.can === 'function' && editor.can().redo && editor.can().redo());

  const sanitizeHtml = (html) => {
    if (!html) return "";
    let out = html;
    out = out.replace(/\sstyle="[^"]*background[^"]*"/gi, (m) => {
      const cleaned = m
        .replace(/background-color\s*:[^;"]*;?/gi, "")
        .replace(/background\s*:[^;"]*;?/gi, "");
      return cleaned === ' style=""' ? "" : cleaned;
    });
    out = out.replace(/[\u200B\uFEFF]/g, "");
    return out;
  };
  const handleNewDocument = () => {
    editor?.commands?.clearContent();
  };

  // Enhanced clipboard functions
  const handleCut = () => {
    if (!editor) return;

    const { state } = editor;
    const { from, to, empty } = state.selection;

    if (!empty) {
      const selectedText = state.doc.textBetween(from, to, '');
      navigator.clipboard.writeText(selectedText).then(() => {
        editor.chain().focus().deleteSelection().run();
        showToast("Text cut to clipboard");
      }).catch(() => {
        showToast("Failed to cut text");
      });
    } else {
      showToast("Select text to cut");
    }
  };

  const handleCopy = () => {
    if (!editor) return;

    const { state } = editor;
    const { from, to, empty } = state.selection;

    if (!empty) {
      const selectedText = state.doc.textBetween(from, to, '');
      navigator.clipboard.writeText(selectedText).then(() => {
        showToast("Text copied to clipboard");
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = selectedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast("Text copied to clipboard");
      });
    } else {
      showToast("Select text to copy");
    }
  };

  const handlePaste = async () => {
    if (!editor) return;

    try {
      const text = await navigator.clipboard.readText();
      editor.chain().focus().insertContent(text).run();
      showToast("Text pasted");
    } catch (error) {
      // Fallback for older browsers or permission issues
      showToast("Please use Ctrl+V to paste");
    }
  };

// Prefer callbacks passed from parent when available (exports removed)
  // Insert image/video removed for blog-only editor

  return (
    <div className="primary-toolbar single-row">
      <button className="toolbar-btn" onClick={handleNewDocument} title="New Document">🆕</button>
      <button className="toolbar-btn" onClick={() => editor?.chain?.().focus().undo().run()} disabled={!canUndo} title="Undo (Ctrl+Z)"><Undo2 size={16} /></button>
      <button className="toolbar-btn" onClick={() => editor?.chain?.().focus().redo().run()} disabled={!canRedo} title="Redo (Ctrl+Y)"><Redo2 size={16} /></button>
      <button className="toolbar-btn" onClick={handleCut} title="Cut (Ctrl+X)"><Scissors size={16} /></button>
      <button className="toolbar-btn" onClick={handleCopy} title="Copy (Ctrl+C)"><Copy size={16} /></button>
      <button className="toolbar-btn" onClick={handlePaste} title="Paste (Ctrl+V)"><ClipboardPaste size={16} /></button>
      <button className="toolbar-btn" onClick={onFullscreenToggle} title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>{isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
    </div>
  );
};

export default PrimaryToolbar;