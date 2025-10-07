import { useState, useEffect, useCallback } from 'react';

export const useEditorFunctions = ({ 
  editor, 
  setToast,
  setPastePlainNext,
  setIsFullscreen,
  isFullscreen,
  editorContainerRef,
  // Keep all parameters but don't reassign them directly
  fontSize: initialFontSize,
  setFontSize: externalSetFontSize,
  fontFamily: initialFontFamily,
  setFontFamily: externalSetFontFamily,
  lineHeight: initialLineHeight,
  setLineHeight: externalSetLineHeight,
  textColor: initialTextColor,
  setTextColor: externalSetTextColor,
  highlightColor: initialHighlightColor,
  setHighlightColor: externalSetHighlightColor,
  zoomLevel: initialZoomLevel,
  setZoomLevel: externalSetZoomLevel
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Use local state as fallback if external state isn't provided
  const [internalFontSize, setInternalFontSize] = useState(initialFontSize || 12);
  const [internalFontFamily, setInternalFontFamily] = useState(initialFontFamily || "'Times New Roman', serif");
  const [internalLineHeight, setInternalLineHeight] = useState(initialLineHeight || 1.15);
  const [internalTextColor, setInternalTextColor] = useState(initialTextColor || "#000000");
  const [internalHighlightColor, setInternalHighlightColor] = useState(initialHighlightColor || "#ffff00");
  const [internalZoomLevel, setInternalZoomLevel] = useState(initialZoomLevel || 100);

  // Use external state if provided, otherwise use internal state
  const fontSize = externalSetFontSize ? initialFontSize : internalFontSize;
  const fontFamily = externalSetFontFamily ? initialFontFamily : internalFontFamily;
  const lineHeight = externalSetLineHeight ? initialLineHeight : internalLineHeight;
  const textColor = externalSetTextColor ? initialTextColor : internalTextColor;
  const highlightColor = externalSetHighlightColor ? initialHighlightColor : internalHighlightColor;
  const zoomLevel = externalSetZoomLevel ? initialZoomLevel : internalZoomLevel;

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [setIsFullscreen]);

  const showToast = useCallback((text, ms = 2000) => {
    setToast(text);
    setTimeout(() => setToast(null), ms);
  }, [setToast]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        await editorContainerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      showToast("Fullscreen not supported");
    }
  }, [isFullscreen, editorContainerRef, setIsFullscreen, showToast]);

  // Quick text insertion
  const handleQuickAdd = useCallback((e, quickText, setQuickText) => {
    e.preventDefault();
    const text = quickText.trim();
    if (text && editor) {
      editor.chain().focus().insertContent(`<p>${text}</p>`).run();
      setQuickText("");
      showToast("Text inserted");
    }
  }, [editor, showToast]);

  // Character insertion
  const insertChar = useCallback((ch) => {
    if (editor) {
      editor.chain().focus().insertContent(ch).run();
    }
  }, [editor]);

  // Find and replace
  const doFindReplace = useCallback((findQuery, replaceQuery, setFindOpen, setFindQuery, setReplaceQuery) => {
    if (!findQuery.trim()) {
      showToast("Please enter search text");
      return;
    }

    if (!editor) return;

    const html = editor.getHTML();
    const escapedFind = findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedFind, 'gi');
    const replaced = html.replace(regex, replaceQuery);

    editor.commands.setContent(replaced);
    setFindOpen(false);
    setFindQuery("");
    setReplaceQuery("");
    showToast("Replacement completed");
  }, [editor, showToast]);

  // Font size control - use external setter if provided
  const handleFontSizeChange = useCallback((size) => {
    if (externalSetFontSize) {
      externalSetFontSize(size);
    } else {
      setInternalFontSize(size);
    }
    
    if (editor) {
      // Apply to current selection
      const nodeType = editor.state.selection.$from.parent.type.name;
      const existing = editor.state.selection.$from.parent.attrs.style || "";
      const cleaned = existing.replace(/font-size:\s*[^;]+;?/g, "").trim();
      const style = cleaned ? `${cleaned}; font-size: ${size}pt;` : `font-size: ${size}pt;`;
      editor.chain().focus().updateAttributes(nodeType, { style }).run();
    }
  }, [editor, externalSetFontSize]);

  // Font family control - use external setter if provided
  const handleFontFamilyChange = useCallback((family) => {
    if (externalSetFontFamily) {
      externalSetFontFamily(family);
    } else {
      setInternalFontFamily(family);
    }
    
    if (editor) {
      // Apply to current selection or paragraph
      const nodeType = editor.state.selection.$from.parent.type.name;
      const existing = editor.state.selection.$from.parent.attrs.style || "";
      const cleaned = existing.replace(/font-family:\s*[^;]+;?/g, "").trim();
      const style = cleaned ? `${cleaned}; font-family: ${family};` : `font-family: ${family};`;
      editor.chain().focus().updateAttributes(nodeType, { style }).run();
    }
  }, [editor, externalSetFontFamily]);

  // Line height control - use external setter if provided
  const handleLineHeightChange = useCallback((height) => {
    if (externalSetLineHeight) {
      externalSetLineHeight(height);
    } else {
      setInternalLineHeight(height);
    }
    
    if (editor) {
      const nodeType = editor.state.selection.$from.parent.type.name;
      const existing = editor.state.selection.$from.parent.attrs.style || "";
      const cleaned = existing.replace(/line-height:\s*[^;]+;?/g, "").trim();
      const style = cleaned ? `${cleaned}; line-height: ${height};` : `line-height: ${height};`;
      editor.chain().focus().updateAttributes(nodeType, { style }).run();
    }
  }, [editor, externalSetLineHeight]);

  // Text color control - use external setter if provided
  const handleTextColorChange = useCallback((color) => {
    if (externalSetTextColor) {
      externalSetTextColor(color);
    } else {
      setInternalTextColor(color);
    }
    
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  }, [editor, externalSetTextColor]);

  // Highlight color control - use external setter if provided
  const handleHighlightColorChange = useCallback((color) => {
    if (externalSetHighlightColor) {
      externalSetHighlightColor(color);
    } else {
      setInternalHighlightColor(color);
    }
    
    if (editor) {
      editor.chain().focus().setHighlight({ color }).run();
    }
  }, [editor, externalSetHighlightColor]);

  // Zoom control - use external setter if provided
  const handleZoomChange = useCallback((level) => {
    if (externalSetZoomLevel) {
      externalSetZoomLevel(level);
    } else {
      setInternalZoomLevel(level);
    }
  }, [externalSetZoomLevel]);

  // Apply mark once (Word-like behavior)
  const applyMarkOnce = useCallback((markName, toggleFn) => {
    if (!editor) return;
    
    const selection = editor.state.selection;
    const { from, to, empty } = selection;

    if (!empty && to > from) {
      toggleFn();
      // Move cursor to end and remove the mark for subsequent typing
      setTimeout(() => {
        editor.chain().focus().setTextSelection(to).unsetMark(markName).run();
      }, 0);
    } else {
      toggleFn();
    }
  }, [editor]);

  // Superscript/Subscript toggles
  const toggleSuper = useCallback(() => {
    if (!editor) return;
    
    const existing = editor.getAttributes("textStyle")?.style || "";
    const isActive = /vertical-align:\s*super/.test(existing);

    if (isActive) {
      const cleaned = existing
        .replace(/vertical-align:\s*super;?/g, "")
        .replace(/font-size:\s*0\.8em;?/g, "")
        .trim()
        .replace(/;+/g, ';')
        .replace(/;$/, '');
      editor.chain().focus().setMark("textStyle", { style: cleaned || null }).run();
    } else {
      const style = existing ?
        `${existing}; vertical-align: super; font-size: 0.8em;` :
        "vertical-align: super; font-size: 0.8em;";
      editor.chain().focus().setMark("textStyle", { style }).run();
    }
  }, [editor]);

  const toggleSub = useCallback(() => {
    if (!editor) return;
    
    const existing = editor.getAttributes("textStyle")?.style || "";
    const isActive = /vertical-align:\s*sub/.test(existing);

    if (isActive) {
      const cleaned = existing
        .replace(/vertical-align:\s*sub;?/g, "")
        .replace(/font-size:\s*0\.8em;?/g, "")
        .trim()
        .replace(/;+/g, ';')
        .replace(/;$/, '');
      editor.chain().focus().setMark("textStyle", { style: cleaned || null }).run();
    } else {
      const style = existing ?
        `${existing}; vertical-align: sub; font-size: 0.8em;` :
        "vertical-align: sub; font-size: 0.8em;";
      editor.chain().focus().setMark("textStyle", { style }).run();
    }
  }, [editor]);

  // Indentation helpers
  const indent = useCallback(() => {
    if (!editor) return;
    
    const { state } = editor;
    const node = state.selection.$from.parent;
    const curr = node.attrs.style || "";
    const match = /margin-left:\s*([\d.]+)in/.exec(curr);
    const curVal = match ? parseFloat(match[1]) : 0;
    const next = `${curVal + 0.5}in`;
    editor.chain().focus().updateAttributes(node.type.name, {
      style: `margin-left: ${next};`
    }).run();
  }, [editor]);

  const outdent = useCallback(() => {
    if (!editor) return;
    
    const { state } = editor;
    const node = state.selection.$from.parent;
    const curr = node.attrs.style || "";
    const match = /margin-left:\s*([\d.]+)in/.exec(curr);
    const curVal = match ? parseFloat(match[1]) : 0;
    const nextVal = Math.max(0, curVal - 0.5);
    const next = nextVal ? `margin-left: ${nextVal}in;` : "";
    editor.chain().focus().updateAttributes(node.type.name, {
      style: next
    }).run();
  }, [editor]);

  // Paragraph styling
  const setParagraphBorder = useCallback((borderCss) => {
    if (!editor) return;
    
    const nodeType = editor.state.selection.$from.parent.type.name;
    const existing = editor.state.selection.$from.parent.attrs.style || "";
    const cleaned = existing.replace(/border:[^;]+;?/g, "").replace(/border-[^;]+;?/g, "").trim();
    const style = cleaned ? `${cleaned}; ${borderCss}` : borderCss;
    editor.chain().focus().updateAttributes(nodeType, { style }).run();
  }, [editor]);

  const setParagraphBg = useCallback((color) => {
    if (!editor) return;
    
    const nodeType = editor.state.selection.$from.parent.type.name;
    const existing = editor.state.selection.$from.parent.attrs.style || "";
    const cleaned = existing.replace(/background:[^;]+;?/g, "").replace(/background-color:[^;]+;?/g, "").trim();
    const style = cleaned ? `${cleaned}; background: ${color};` : `background: ${color};`;
    editor.chain().focus().updateAttributes(nodeType, { style }).run();
  }, [editor]);

  // Text direction
  const toggleDirection = useCallback(() => {
    if (!editor) return;
    
    const nodeType = editor.state.selection.$from.parent.type.name;
    const currDir = editor.state.selection.$from.parent.attrs.style?.includes('direction: rtl') ? 'rtl' : 'ltr';
    const next = currDir === "ltr" ? "rtl" : "ltr";
    const existing = editor.state.selection.$from.parent.attrs.style || "";
    const cleaned = existing.replace(/direction:\s*[^;]+;?/g, "").trim();
    const style = cleaned ? `${cleaned}; direction: ${next};` : `direction: ${next};`;
    editor.chain().focus().updateAttributes(nodeType, { style }).run();
  }, [editor]);

  // Clear formatting
  const clearFormatting = useCallback(() => {
    if (!editor) return;
    
    editor.chain().focus().clearNodes().unsetAllMarks().run();
    showToast("Formatting cleared");
  }, [editor, showToast]);

  // Word count and statistics
  const getDocumentStats = useCallback(() => {
    if (!editor) return { words: 0, characters: 0, paragraphs: 0 };
    
    return {
      words: editor.storage.characterCount?.words() || 0,
      characters: editor.storage.characterCount?.characters() || 0,
      paragraphs: editor.state.doc.content.childCount || 0
    };
  }, [editor]);

  return {
    showToast,
    toggleFullscreen,
    handleQuickAdd,
    insertChar,
    doFindReplace,
    // Return the handlers
    setFontSize: handleFontSizeChange,
    setFontFamily: handleFontFamilyChange,
    setLineHeight: handleLineHeightChange,
    setTextColor: handleTextColorChange,
    setHighlightColor: handleHighlightColorChange,
    setZoomLevel: handleZoomChange,
    applyMarkOnce,
    toggleSuper,
    toggleSub,
    indent,
    outdent,
    setParagraphBorder,
    setParagraphBg,
    toggleDirection,
    clearFormatting,
    getDocumentStats,
    isEditing,
    setIsEditing,
    // Return the current state values (use the combined values)
    fontSize,
    fontFamily,
    lineHeight,
    textColor,
    highlightColor,
    zoomLevel
  };
};