import React from 'react';
import {
  FileText, FolderOpen, Download,
  Undo2, Redo2, Scissors, Copy, ClipboardPaste,
  Search, Eye, Code, Maximize2, Minimize2, SidebarClose,
  History, Image as ImageIcon, Video as VideoIcon
} from 'lucide-react';

const PrimaryToolbar = ({
  editor,
  showToast,
  onToggleSource,
  onTogglePreview,
  onFindOpen,
  onFullscreenToggle,
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
  onSavePdf
}) => {
  const STORAGE_KEY = "editorContentArea.pages.v1";

  // Safely compute availability for undo/redo to avoid null editor errors
  const canUndo = !!(editor && editor.can && typeof editor.can === 'function' && editor.can().undo && editor.can().undo());
  const canRedo = !!(editor && editor.can && typeof editor.can === 'function' && editor.can().redo && editor.can().redo());

  const sanitizeHtml = (html) => {
    if (!html) return "";
    let out = html;
    out = out.replace(/\sstyle=\"[^\"]*background[^\"]*\"/gi, (m) => {
      const cleaned = m
        .replace(/background-color\s*:[^;\"]*;?/gi, "")
        .replace(/background\s*:[^;\"]*;?/gi, "");
      return cleaned === ' style=""' ? "" : cleaned;
    });
    out = out.replace(/[\u200B\uFEFF]/g, "");
    return out;
  };
  const handleNewDocument = () => {
    if (window.confirm("Create new document? Unsaved changes will be lost.")) {
      editor.commands.clearContent();
      editor.commands.setContent(`
        <div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.15; margin: 1in;">
          <h1 style="text-align: center; margin-bottom: 12pt; font-size: 18pt;">Document Title</h1>
          <p style="text-align: center; margin-bottom: 24pt; font-style: italic;">Subtitle or Author Information</p>
          <p style="text-indent: 0.5in; margin-bottom: 12pt;">Start typing your document here. This editor provides Word-like functionality with full formatting support.</p>
        </div>
      `);
      showToast("New document created");
    }
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

const getMergedPagesHtml = () => {
  try {
    // Try to get HTML from the multi-page system first
    if (typeof window !== 'undefined' && window.__getMergedPagesHTML) {
      return window.__getMergedPagesHTML();
    }
    
    // Fallback to editor content
    return editor?.getHTML() || "";
  } catch (e) {
    return editor?.getHTML() || "";
  }
};

const handleExportHtml = () => {
  const content = sanitizeHtml(getMergedPagesHtml());
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      line-height: 1.6; 
      max-width: 8.5in; 
      margin: 0 auto; 
      padding: 1in;
      color: #000;
      background: white;
    }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #ddd; padding: 8px; }
    .page-break { page-break-before: always; }
    @media print {
      body { padding: 0.5in; }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "document.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Exported as HTML");
};

const handleExportWord = () => {
  const content = sanitizeHtml(getMergedPagesHtml());
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    /* Word-compatible styles */
    body { 
      font-family: "Times New Roman", serif; 
      font-size: 12pt;
      line-height: 1.15; 
      margin: 1in;
    }
    h1, h2, h3, h4, h5, h6 { 
      font-family: "Arial", sans-serif; 
      margin: 12pt 0 6pt 0;
    }
    h1 { font-size: 18pt; }
    h2 { font-size: 16pt; }
    h3 { font-size: 14pt; }
    h4 { font-size: 12pt; font-weight: bold; }
    h5 { font-size: 11pt; font-weight: bold; }
    h6 { font-size: 10pt; font-weight: bold; }
    p { 
      margin: 6pt 0; 
      text-align: justify;
    }
    img { 
      max-width: 6.5in; 
      height: auto; 
      display: block;
      margin: 12pt auto;
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 12pt 0;
    }
    td, th { 
      border: 1px solid #000000; 
      padding: 4pt 8pt; 
      text-align: left;
    }
    th { 
      background: #F0F0F0; 
      font-weight: bold;
    }
    ul, ol { 
      margin: 12pt 0 12pt 24pt; 
    }
    li { 
      margin: 6pt 0; 
    }
    strong { font-weight: bold; }
    em { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    code { 
      font-family: "Courier New", monospace; 
      background: #F5F5F5;
      padding: 2pt 4pt;
    }
    blockquote { 
      border-left: 4px solid #3B82F6; 
      padding-left: 12pt;
      margin: 12pt 0 12pt 12pt;
      font-style: italic;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "document.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Exported as Word document");
};

  const handleExportPdf = () => {
    const content = sanitizeHtml(getMergedPagesHtml());
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Document</title>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: "Times New Roman", serif; 
      font-size: 12pt;
      line-height: 1.15; 
      padding: 1in;
      margin: 0;
      color: #000;
      background: white;
    }
    h1, h2, h3, h4, h5, h6 { 
      font-family: "Arial", sans-serif; 
      margin: 16pt 0 8pt 0;
    }
    h1 { font-size: 18pt; }
    h2 { font-size: 16pt; }
    h3 { font-size: 14pt; }
    img { max-width: 100%; height: auto; margin: 12pt auto; display: block; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    td, th { border: 1px solid #000; padding: 6pt 8pt; }
    @media print {
      body { padding: 0.5in; margin: 0; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      showToast("Please allow popups to export PDF");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      showToast("Choose 'Save as PDF' in print dialog");
      // Don't close immediately - let user handle the print dialog
      setTimeout(() => {
        printWindow.close();
      }, 5000);
    }, 1000);

    document.getElementById('file-export-menu')?.close();
  };

  // Prefer callbacks passed from parent when available
  const onExportHtmlClick = onSaveHtml || handleExportHtml;
  const onExportWordClick = onSaveWord || handleExportWord;
  const onExportPdfClick = onSavePdf || handleExportPdf;
  const onInsertImageClick = onImageUpload || (() => document.getElementById('file-image-input')?.click());
  const onInsertVideoClick = onVideoUpload || (() => document.getElementById('file-video-input')?.click());

  return (
    <div className="primary-toolbar">
      {/* File Operations */}
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={handleNewDocument} title="New (Ctrl+N)">
          <FileText size={16} />
          <span className="toolbar-label">New</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={onFileOpen || (() => document.getElementById('file-open-input')?.click())}
          title="Open (Ctrl+O)"
        >
          <FolderOpen size={16} />
          <span className="toolbar-label">Open</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => document.getElementById('file-export-menu')?.showModal()}
          title="Export Document"
        >
          <Download size={16} />
          <span className="toolbar-label">Export</span>
        </button>
      </div>

      {/* Edit Operations */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => editor?.chain?.().focus().undo().run()}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
          <span className="toolbar-label">Undo</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => editor?.chain?.().focus().redo().run()}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
          <span className="toolbar-label">Redo</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={handleCut}
          title="Cut (Ctrl+X)"
        >
          <Scissors size={16} />
          <span className="toolbar-label">Cut</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={handleCopy}
          title="Copy (Ctrl+C)"
        >
          <Copy size={16} />
          <span className="toolbar-label">Copy</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={handlePaste}
          title="Paste (Ctrl+V)"
        >
          <ClipboardPaste size={16} />
          <span className="toolbar-label">Paste</span>
        </button>
      </div>

      {/* Insert Operations */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onInsertImageClick}
          title="Insert Image"
        >
          <ImageIcon size={16} />
          <span className="toolbar-label">Image</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={onInsertVideoClick}
          title="Insert Video"
        >
          <VideoIcon size={16} />
          <span className="toolbar-label">Video</span>
        </button>
      </div>

      {/* View Operations */}
      <div className="toolbar-group">
        <button className="toolbar-btn" onClick={onFindOpen} title="Find (Ctrl+F)">
          <Search size={16} />
          <span className="toolbar-label">Find</span>
        </button>
        <button
          className={`toolbar-btn ${trackChanges ? 'toolbar-btn-active' : ''}`}
          onClick={onTrackChangesToggle}
          title="Track Changes"
        >
          <History size={16} />
          <span className="toolbar-label">Track Changes</span>
        </button>
        <button className="toolbar-btn" onClick={onTogglePreview} title="Preview">
          <Eye size={16} />
          <span className="toolbar-label">Preview</span>
        </button>
        <button className="toolbar-btn" onClick={onToggleSource} title="Source Code">
          <Code size={16} />
          <span className="toolbar-label">Source</span>
        </button>
      </div>

      {/* Layout Operations */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          <SidebarClose size={16} />
          <span className="toolbar-label">Sidebar</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={onFullscreenToggle}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 size={16} />
          ) : (
            <Maximize2 size={16} />
          )}
          <span className="toolbar-label">Fullscreen</span>
        </button>
      </div>

      {/* Export Menu */}
      <dialog id="file-export-menu" className="export-dialog">
        <div className="export-dialog-content">
          <h3>Export Document</h3>
          <div className="export-options">
            <button onClick={onExportHtmlClick} className="export-option">
              <div className="export-icon">📄</div>
              <div className="export-info">
                <strong>Export as HTML</strong>
                <span>Web page with formatting</span>
              </div>
            </button>

            <button onClick={onExportWordClick} className="export-option">
              <div className="export-icon">📝</div>
              <div className="export-info">
                <strong>Export as Word</strong>
                <span>Microsoft Word document</span>
              </div>
            </button>

            <button onClick={onExportPdfClick} className="export-option">
              <div className="export-icon">📊</div>
              <div className="export-info">
                <strong>Export as PDF</strong>
                <span>Printable document</span>
              </div>
            </button>
          </div>
          <div className="export-actions">
            <button onClick={() => document.getElementById('file-export-menu')?.close()} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PrimaryToolbar;