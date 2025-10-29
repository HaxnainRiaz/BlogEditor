"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { EditorContent } from "@tiptap/react";
import { ChevronLeft, ChevronRight, Settings, Trash2 } from "lucide-react";

export default function EditorContentArea({
  editor, // Use the main editor instance from parent
  contentRef,
  showSource,
  showPreview,
  quickText,
  setQuickText,
  onSourceToggle,
  onPostToBlog,
  zoomLevel = 100,
}) {
  // Constants for A4 at 96 DPI
  const DPI = 96;
  const A4_IN = { widthIn: 8.27, heightIn: 11.69 };
  const PAGE_WIDTH_PX = Math.round(A4_IN.widthIn * DPI);
  const PAGE_HEIGHT_PX = Math.round(A4_IN.heightIn * DPI);

  // Margins
  const MARGIN_TOP_PX = Math.round(1 * DPI);
  const MARGIN_BOTTOM_PX = Math.round(1 * DPI);
  const MARGIN_LEFT_PX = Math.round(1 * DPI);
  const MARGIN_RIGHT_PX = Math.round(1 * DPI);

  // Usable content height
  const CONTENT_MAX_HEIGHT = PAGE_HEIGHT_PX - MARGIN_TOP_PX - MARGIN_BOTTOM_PX;

  const pagesRef = useRef([]);
  const [, setVersion] = useState(0);
  const [activePage, setActivePage] = useState(0);

  // Set global editor reference and sync content
  useEffect(() => {
    if (editor && typeof window !== 'undefined') {
      window.__multiPageActiveEditor = editor;
      focusedEditorRef.current = editor;
      
      // Sync editor content with active page when editor changes
      const updateEditorFromPage = () => {
        if (pagesRef.current[activePage]) {
          const currentContent = pagesRef.current[activePage].content;
          if (currentContent && currentContent !== editor.getHTML()) {
            editor.commands.setContent(currentContent, false);
          }
        }
      };
      
      updateEditorFromPage();
    }
  }, [editor, activePage]);

  // Track focused editor
  const focusedEditorRef = useRef(null);

  // Local persistence
  const STORAGE_KEY = "editorContentArea.pages.v1";
  const saveTimeoutRef = useRef(null);

  const saveStateNow = useCallback(() => {
    try {
      const payload = {
        pages: pagesRef.current.map((p) => p.content || "<p></p>"),
        activePage: Math.max(0, Math.min(activePage, pagesRef.current.length - 1)),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
  }, [activePage]);

  const saveStateDebounced = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveStateNow();
    }, 250);
  }, [saveStateNow]);

  // Sync editor content to current page when editor updates
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (pagesRef.current[activePage]) {
        const editorHtml = editor.getHTML();
        if (editorHtml !== pagesRef.current[activePage].content) {
          pagesRef.current[activePage].content = editorHtml;
          saveStateDebounced();
        }
      }
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, activePage, saveStateDebounced]);

  // Add a blank new page after index
  const addPage = useCallback((afterIndex = -1, initialHTML = "<p></p>") => {
    const id = `page-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const page = {
      id,
      content: initialHTML,
      wrapperRef: React.createRef(),
    };

    if (afterIndex < 0 || afterIndex >= pagesRef.current.length) {
      pagesRef.current.push(page);
    } else {
      pagesRef.current.splice(afterIndex + 1, 0, page);
    }
    setVersion((v) => v + 1);
    try { saveStateDebounced(); } catch (e) { }
    return page;
  }, [saveStateDebounced]);

  // Delete a page by index
  const deletePage = useCallback((pageIndex) => {
    if (pagesRef.current.length <= 1) {
      alert("Cannot delete the last page");
      return;
    }

    const pageToDelete = pagesRef.current[pageIndex];
    if (!pageToDelete) return;

    // Remove from array
    pagesRef.current.splice(pageIndex, 1);

    // Adjust active page if needed
    if (activePage >= pageIndex) {
      const newActivePage = Math.max(0, Math.min(activePage - 1, pagesRef.current.length - 1));
      setActivePage(newActivePage);
    }

    setVersion((v) => v + 1);
    try { saveStateDebounced(); } catch (e) { }
  }, [activePage, saveStateDebounced]);

  // Utility: merge all pages HTML
  const getMergedHTML = useCallback(() => {
    return pagesRef.current.map((p) => p.content || "<p></p>").join("\n");
  }, []);

  // Expose getMergedHTML to parent component for exports
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__getMergedPagesHTML = getMergedHTML;
    }
  }, [getMergedHTML]);

  // Sanitize HTML to remove unwanted backgrounds and zero-widths
  const sanitizeHtml = useCallback((html) => {
    if (!html) return "";
    let out = html;
    // Remove inline background styles
    out = out.replace(/\sstyle=\"[^\"]*background[^\"]*\"/gi, (m) => {
      const cleaned = m
        .replace(/background-color\s*:[^;\"]*;?/gi, "")
        .replace(/background\s*:[^;\"]*;?/gi, "");
      return cleaned === ' style=""' ? "" : cleaned;
    });
    // Remove zero-width spaces
    out = out.replace(/[\u200B\uFEFF]/g, "");
    return out;
  }, []);

  // Insert a manual page break after current active page
  const insertPageBreak = useCallback(() => {
    const idx = Math.max(0, activePage);
    addPage(idx, "<p></p>");
    setTimeout(() => {
      const nextIndex = Math.min(pagesRef.current.length - 1, idx + 1);
      setActivePage(nextIndex);
      setVersion((v) => v + 1);
      saveStateDebounced();
    }, 30);
  }, [activePage, addPage, saveStateDebounced]);

  // Initialize from localStorage or with one page
  useEffect(() => {
    if (pagesRef.current.length !== 0) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          parsed.pages.forEach((html, idx) => {
            addPage(idx - 1, html || "<p></p>");
          });
          const nextActive = Math.max(0, Math.min(parsed.activePage || 0, parsed.pages.length - 1));
          setActivePage(nextActive);
          return;
        }
      }
    } catch (e) {
      // fallback to default page
    }
    addPage(-1, "<h2>Welcome</h2><p>Start writing...</p>");
    setActivePage(0);
  }, [addPage]);

  // Save when active page changes
  useEffect(() => {
    saveStateDebounced();
  }, [activePage, saveStateDebounced]);

  // Save as HTML - flush pagination and sanitize output
  const saveAsHtml = useCallback(() => {
    const merged = sanitizeHtml(getMergedHTML());
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Document</title><style>body{background:#ffffff;color:#111;margin:40px auto;max-width:800px;line-height:1.6;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}h1,h2,h3,h4,h5,h6{line-height:1.25}</style></head><body>${merged}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getMergedHTML, sanitizeHtml]);

  // Save as plain text
  const saveAsText = useCallback(() => {
    const merged = sanitizeHtml(getMergedHTML());
    const temp = document.createElement("div");
    temp.innerHTML = merged;
    const text = (temp.textContent || temp.innerText || "").replace(/[\u200B\uFEFF]/g, "");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [getMergedHTML, sanitizeHtml]);

  // Handle page change and sync editor content
  const handlePageChange = useCallback((newPageIndex) => {
    // Save current editor content to current page before switching
    if (editor && pagesRef.current[activePage]) {
      pagesRef.current[activePage].content = editor.getHTML();
    }
    
    setActivePage(newPageIndex);
    
    // Load new page content into editor after a brief delay
    setTimeout(() => {
      if (editor && pagesRef.current[newPageIndex]) {
        const newContent = pagesRef.current[newPageIndex].content;
        if (newContent !== editor.getHTML()) {
          editor.commands.setContent(newContent, false);
        }
      }
    }, 10);
  }, [editor, activePage]);

  // Render pages with delete button
  const renderPages = () => {
    if (!pagesRef.current || pagesRef.current.length === 0) {
      return null;
    }

    return pagesRef.current.map((p, idx) => {
      const isActive = idx === activePage;
      return (
        <div
          key={p.id}
          style={{
            width: `${PAGE_WIDTH_PX}px`,
            height: `${PAGE_HEIGHT_PX}px`,
            margin: "20px auto",
            paddingTop: `${MARGIN_TOP_PX}px`,
            paddingRight: `${MARGIN_RIGHT_PX}px`,
            paddingBottom: `${MARGIN_BOTTOM_PX}px`,
            paddingLeft: `${MARGIN_LEFT_PX}px`,
            background: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            borderRadius: 8,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top left",
            transition: "box-shadow .15s",
          }}
          onClick={() => handlePageChange(idx)}
        >
          <div
            ref={(el) => {
              if (p) p.wrapperRef.current = el;
            }}
            style={{
              width: "100%",
              height: `${CONTENT_MAX_HEIGHT}px`,
              overflow: "hidden",
            }}
            className="page-editable-wrapper"
          >
            {/* Only render EditorContent for the active page to improve performance */}
            {isActive && editor && (
              <EditorContent editor={editor} />
            )}
            {!isActive && (
              <div
                className="page-preview"
                dangerouslySetInnerHTML={{ __html: p.content }}
                style={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: "12pt",
                  lineHeight: "1.15"
                }}
              />
            )}
          </div>

          {/* Page number */}
          <div style={{ position: "absolute", bottom: 12, right: 14, color: "#666", fontSize: 12 }}>
            {idx + 1}
          </div>

          {/* Delete button - only show on active page and not the only page */}
          {isActive && pagesRef.current.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePage(idx);
              }}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(239, 68, 68, 0.9)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              title="Delete page"
            >
              <Trash2 size={12} />
              Delete
            </button>
          )}

          {/* Active focus ring */}
          {isActive && (
            <div
              style={{
                position: "absolute",
                inset: 6,
                borderRadius: 6,
                pointerEvents: "none",
                boxShadow: "inset 0 0 0 2px rgba(59,130,246,0.08)",
              }}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ width: "100%", overflowY: "auto" }} ref={contentRef}>
      <style>
        {`
          /* Remove borders/outlines from TipTap editable area */
          .multi-page-prose, .multi-page-prose:focus, .ProseMirror, .ProseMirror:focus {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            background: transparent;
          }

          /* Improve paragraph spacing to better mimic word processors */
          .multi-page-prose p { margin: 0 0 12px; }
          .multi-page-prose h1, .multi-page-prose h2, .multi-page-prose h3,
          .multi-page-prose h4, .multi-page-prose h5, .multi-page-prose h6 { margin: 16px 0 12px; }

          /* Page preview styling */
          .page-preview {
            height: 100%;
            overflow: hidden;
            pointer-events: none;
          }
        `}
      </style>

      {/* Page Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => handlePageChange(Math.max(0, activePage - 1))}
            title="Prev page"
            style={{ padding: "6px", border: "1px solid #e5e7eb", borderRadius: "4px" }}
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              value={activePage + 1}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= pagesRef.current.length) {
                  handlePageChange(val - 1);
                }
              }}
              style={{ width: 64, padding: "4px 8px", borderRadius: 6, border: "1px solid #e5e7eb" }}
            />
            <span>of {pagesRef.current.length}</span>
          </div>

          <button
            onClick={() => handlePageChange(Math.min(pagesRef.current.length - 1, activePage + 1))}
            title="Next page"
            style={{ padding: "6px", border: "1px solid #e5e7eb", borderRadius: "4px" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setVersion((v) => v + 1)}
            title="Refresh Pages"
            style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: "4px" }}
          >
            Refresh
          </button>
          <button
            onClick={() => setVersion((v) => v + 1)}
            title="Page Setup"
            style={{ padding: "6px", border: "1px solid #e5e7eb", borderRadius: "4px" }}
          >
            <Settings size={16} />
          </button>
          <button
            onClick={insertPageBreak}
            title="Insert Page Break"
            style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: "4px" }}
          >
            Insert Page Break
          </button>
          <button
    onClick={onPostToBlog}
    className="toolbar-button blog-button"
    title="Post to Blog"
    style={{ 
      padding: "6px 12px", 
      border: "1px solid #e5e7eb", 
      borderRadius: "4px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease"
    }}
    onMouseOver={(e) => {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
    }}
    onMouseOut={(e) => {
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "none";
    }}
  >
    📝 Post to Blog
  </button>
          <button
            onClick={saveAsText}
            title="Save as Plain Text"
            style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: "4px" }}
          >
            Save Text
          </button>
        </div>
      </div>

      {/* Pages list */}
      <div style={{ padding: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {renderPages()}
      </div>
    </div>
  );
}