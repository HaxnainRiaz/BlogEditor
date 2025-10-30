'use client'
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold, Italic, Underline, Strikethrough,
  Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered,
  Square, Minus,
  ArrowLeftToLine, ArrowRightToLine,
  Grid3X3, Eye,
  PanelTop, PanelBottom, PanelLeft, PanelRight,
  SquareStack, Combine, Split,
  Table, Plus, MinusCircle, Rows, Columns as ColumnsIcon
} from 'lucide-react';

const FormattingToolbar = ({
  editor,
  fontSize,
  fontFamily,
  lineHeight,
  textColor,
  highlightColor,
  onFontSizeChange,
  onFontFamilyChange,
  onLineHeightChange,
  onTextColorChange,
  onHighlightColorChange
}) => {
  const [showBorderMenu, setShowBorderMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [tableMenuPos, setTableMenuPos] = useState({ top: 0, left: 0 });
  const [borderMenuPos, setBorderMenuPos] = useState({ top: 0, left: 0 });
  const borderBtnRef = useRef(null);
  const tableBtnRef = useRef(null);
  const [hoverRows, setHoverRows] = useState(0);
  const [hoverCols, setHoverCols] = useState(0);
  const [showGridlines, setShowGridlines] = useState(false);
  // Removed case menu, superscript/subscript, columns, page/section breaks


  const fonts = [
    { label: "Inter", value: "Inter, system-ui, sans-serif" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Helvetica", value: "Helvetica, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Calibri", value: "Calibri, sans-serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { label: "Garamond", value: "Garamond, serif" },
    { label: "Palatino", value: "Palatino, serif" },
    { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
    { label: "Impact", value: "Impact, sans-serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Lucida Sans", value: "'Lucida Sans', sans-serif" },
    { label: "Book Antiqua", value: "'Book Antiqua', serif" }
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  const lineSpacings = [
    { label: "1.0", value: 1.0 },
    { label: "1.15", value: 1.15 },
    { label: "1.5", value: 1.5 },
    { label: "2.0", value: 2.0 },
    { label: "2.5", value: 2.5 },
    { label: "3.0", value: 3.0 }
  ];

  const paragraphSpacings = [
    { label: "0 pt", value: "0" },
    { label: "6 pt", value: "6pt" },
    { label: "12 pt", value: "12pt" },
    { label: "18 pt", value: "18pt" },
    { label: "24 pt", value: "24pt" }
  ];

  const columnOptions = [
    { label: "1 Column", value: 1 },
    { label: "2 Columns", value: 2 },
    { label: "3 Columns", value: 3 }
  ];

  const borderStyles = [
    { label: "None", value: "none" },
    { label: "Solid", value: "solid" },
    { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" },
    { label: "Double", value: "double" }
  ];

  const borderColors = [
    { label: "Black", value: "#000000" },
    { label: "Gray", value: "#666666" },
    { label: "Blue", value: "#3B82F6" },
    { label: "Red", value: "#EF4444" },
    { label: "Green", value: "#10B981" }
  ];

  // Table grid for visual selection (Word-like 10x10)
  const GRID_ROWS = 10;
  const GRID_COLS = 10;

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    if (size && onFontSizeChange) {
      onFontSizeChange(parseInt(size));
    }
  };

  const handleFontFamilyChange = (e) => {
    const family = e.target.value;
    if (family && onFontFamilyChange) {
      onFontFamilyChange(family);
    }
  };

  const handleLineSpacingChange = (e) => {
    const spacing = parseFloat(e.target.value);
    if (onLineHeightChange) {
      onLineHeightChange(spacing);
    }
  };

  // Safe command execution function
  const executeCommand = (commandName, ...args) => {
    if (!editor) return false;

    try {
      // Try direct command first
      if (editor.commands && typeof editor.commands[commandName] === 'function') {
        editor.commands[commandName](...args);
        return true;
      }

      // Try chain command
      if (editor.chain && typeof editor.chain === 'function') {
        const chain = editor.chain().focus();
        if (typeof chain[commandName] === 'function') {
          chain[commandName](...args).run();
          return true;
        }
      }

      // Fallbacks for common formatting if extensions not present
      switch (commandName) {
        case 'setTextAlign': {
          const align = args[0] || 'left';
          const { state } = editor;
          const node = state.selection.$from.parent;
          const curr = node.attrs.style || '';
          const cleaned = curr.replace(/text-align:\s*\w+;?/g, '').trim();
          const newStyle = `${cleaned} text-align: ${align};`.trim();
          return executeCommand('updateAttributes', node.type.name, { style: newStyle });
        }
        case 'setColor': {
          const color = args[0];
          return executeCommand('setMark', 'textStyle', { style: `color: ${color};` });
        }
        case 'setHighlight': {
          const opt = args[0] || {}; const color = opt.color || '#ffff00';
          return executeCommand('setMark', 'textStyle', { style: `background-color: ${color};` });
        }
        case 'unsetHighlight': {
          const existing = editor.getAttributes('textStyle')?.style || '';
          const cleaned = existing.replace(/background-color:\s*[^;]+;?/g, '').trim();
          return executeCommand('setMark', 'textStyle', { style: cleaned || null });
        }
        default:
          break;
      }

      console.warn(`Command ${commandName} not available`);
      return false;
    } catch (error) {
      console.error(`Error executing ${commandName}:`, error);
      return false;
    }
  };

  // Case transform helpers removed

  // Border Functions
  const applyBorder = (borderType, style = 'solid', color = '#000000', width = '1px') => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;
      const curr = node.attrs.style || '';

      let newStyle = curr
        .replace(/border[^;]*;?/g, '')
        .replace(/border-top[^;]*;?/g, '')
        .replace(/border-right[^;]*;?/g, '')
        .replace(/border-bottom[^;]*;?/g, '')
        .replace(/border-left[^;]*;?/g, '')
        .replace(/background[^;]*;?/g, '')
        .replace(/padding[^;]*;?/g, '')
        .trim();

      const borderValue = `${width} ${style} ${color}`;

      switch (borderType) {
        case 'none':
          // Already cleared borders above
          break;
        case 'all':
          newStyle += ` border: ${borderValue}; padding: 8px; background: #f9f9f9;`;
          break;
        case 'outside':
          newStyle += ` border: ${borderValue}; padding: 8px;`;
          break;
        case 'top':
          newStyle += ` border-top: ${borderValue}; padding-top: 8px;`;
          break;
        case 'bottom':
          newStyle += ` border-bottom: ${borderValue}; padding-bottom: 8px;`;
          break;
        case 'left':
          newStyle += ` border-left: ${borderValue}; padding-left: 8px;`;
          break;
        case 'right':
          newStyle += ` border-right: ${borderValue}; padding-right: 8px;`;
          break;
        case 'inside-horizontal':
          newStyle += ` border-top: ${borderValue}; border-bottom: ${borderValue}; padding: 8px 0;`;
          break;
        case 'inside-vertical':
          newStyle += ` border-left: ${borderValue}; border-right: ${borderValue}; padding: 0 8px;`;
          break;
        case 'inside':
          newStyle += ` border: ${borderValue}; border-style: none solid solid none; padding: 8px;`;
          break;
        case 'diagonal-down':
          newStyle += ` background: linear-gradient(135deg, transparent 49%, ${color} 50%, transparent 51%); padding: 8px;`;
          break;
        case 'diagonal-up':
          newStyle += ` background: linear-gradient(45deg, transparent 49%, ${color} 50%, transparent 51%); padding: 8px;`;
          break;
        default:
          break;
      }

      executeCommand('updateAttributes', node.type.name, {
        style: newStyle.trim()
      });

      setShowBorderMenu(false);
    } catch (error) {
      console.error('Error applying border:', error);
    }
  };

  const insertHorizontalLine = () => {
    if (!editor) return;

    try {
      executeCommand('setHorizontalRule');
      setShowBorderMenu(false);
    } catch (error) {
      console.error('Error inserting horizontal line:', error);
    }
  };

  const openBordersAndShadingDialog = () => {
    // For advanced border and shading options
    const style = prompt('Enter border style (solid, dashed, dotted, double):', 'solid');
    const color = prompt('Enter border color (hex or name):', '#000000');
    const width = prompt('Enter border width (e.g., 1px, 2px):', '1px');
    const shading = prompt('Enter background color (hex or name, or leave empty):', '#f9f9f9');

    if (style && color && width) {
      if (!editor) return;

      try {
        const { state } = editor;
        const node = state.selection.$from.parent;
        const curr = node.attrs.style || '';

        let newStyle = curr
          .replace(/border[^;]*;?/g, '')
          .replace(/background[^;]*;?/g, '')
          .replace(/padding[^;]*;?/g, '')
          .trim();

        newStyle += ` border: ${width} ${style} ${color}; padding: 8px;`;

        if (shading) {
          newStyle += ` background: ${shading};`;
        }

        executeCommand('updateAttributes', node.type.name, {
          style: newStyle.trim()
        });
      } catch (error) {
        console.error('Error in borders and shading:', error);
      }
    }
    setShowBorderMenu(false);
  };

  const toggleGridlines = () => {
    setShowGridlines(!showGridlines);
    // This would typically toggle CSS classes on the editor content
    document.querySelector('.editor-content')?.classList.toggle('show-gridlines');
  };

  // Draw Table functionality
  // Table Functions
  const insertTable = (rows, cols) => {
    if (!editor) return;

    try {
      if (editor.commands && editor.commands.insertTable) {
        editor.commands.insertTable({
          rows: parseInt(rows),
          cols: parseInt(cols),
          withHeaderRow: false
        });
      } else {
        editor.chain().focus().insertTable({
          rows: parseInt(rows),
          cols: parseInt(cols),
          withHeaderRow: false
        }).run();
      }
      setShowTableMenu(false);
    } catch (error) {
      console.error('Error inserting table:', error);
    }
  };

  const deleteTable = () => {
    if (!editor) return;
    executeCommand('deleteTable');
    setShowTableMenu(false);
  };

  const addColumnBefore = () => {
    if (!editor) return;
    executeCommand('addColumnBefore');
  };

  const addColumnAfter = () => {
    if (!editor) return;
    executeCommand('addColumnAfter');
  };

  const deleteColumn = () => {
    if (!editor) return;
    executeCommand('deleteColumn');
  };

  const addRowBefore = () => {
    if (!editor) return;
    executeCommand('addRowBefore');
  };

  const addRowAfter = () => {
    if (!editor) return;
    executeCommand('addRowAfter');
  };

  const deleteRow = () => {
    if (!editor) return;
    executeCommand('deleteRow');
  };

  const mergeCells = () => {
    if (!editor) return;
    executeCommand('mergeCells');
  };

  const splitCell = () => {
    if (!editor) return;
    executeCommand('splitCell');
  };

  const toggleHeaderRow = () => {
    if (!editor) return;
    executeCommand('toggleHeaderRow');
  };

  const toggleHeaderColumn = () => {
    if (!editor) return;
    executeCommand('toggleHeaderColumn');
  };

  const toggleHeaderCell = () => {
    if (!editor) return;
    executeCommand('toggleHeaderCell');
  };

  // Quick table insertion with grid
  const handleGridSelection = (rows, cols) => {
    insertTable(rows, cols);
  };


  // Rest of the existing functions remain the same...
  const toggleBold = () => {
    executeCommand('toggleBold');
  };

  const toggleItalic = () => {
    executeCommand('toggleItalic');
  };

  const toggleUnderline = () => {
    if (!editor) return;

    const isActive = editor.isActive('textStyle') &&
      /text-decoration:\s*underline/.test(editor.getAttributes('textStyle').style || '');

    if (isActive) {
      executeCommand('unsetMark', 'textStyle');
    } else {
      executeCommand('setMark', 'textStyle', { style: 'text-decoration: underline;' });
    }
  };

  const toggleStrike = () => {
    executeCommand('toggleStrike');
  };

  const toggleSuper = () => {
    if (!editor) return;

    try {
      const existing = editor.getAttributes("textStyle")?.style || "";
      const isActive = /vertical-align:\s*super/.test(existing);

      if (isActive) {
        const cleaned = existing
          .replace(/vertical-align:\s*super;?/g, "")
          .replace(/font-size:\s*0\.8em;?/g, "")
          .trim()
          .replace(/;+/g, ';')
          .replace(/;$/, '');
        executeCommand('setMark', 'textStyle', { style: cleaned || null });
      } else {
        const style = existing ?
          `${existing}; vertical-align: super; font-size: 0.8em;` :
          "vertical-align: super; font-size: 0.8em;";
        executeCommand('setMark', 'textStyle', { style });
      }
    } catch (error) {
      console.error('Error in toggleSuper:', error);
    }
  };

  const toggleSub = () => {
    if (!editor) return;

    try {
      const existing = editor.getAttributes("textStyle")?.style || "";
      const isActive = /vertical-align:\s*sub/.test(existing);

      if (isActive) {
        const cleaned = existing
          .replace(/vertical-align:\s*sub;?/g, "")
          .replace(/font-size:\s*0\.8em;?/g, "")
          .trim()
          .replace(/;+/g, ';')
          .replace(/;$/, '');
        executeCommand('setMark', 'textStyle', { style: cleaned || null });
      } else {
        const style = existing ?
          `${existing}; vertical-align: sub; font-size: 0.8em;` :
          "vertical-align: sub; font-size: 0.8em;";
        executeCommand('setMark', 'textStyle', { style });
      }
    } catch (error) {
      console.error('Error in toggleSub:', error);
    }
  };

  const handleTextColorChange = (e) => {
    const color = e.target.value;
    if (onTextColorChange) {
      onTextColorChange(color);
    }
    if (editor) {
      executeCommand('setColor', color);
    }
  };

  const handleHighlightColorChange = (e) => {
    const color = e.target.value;
    if (onHighlightColorChange) {
      onHighlightColorChange(color);
    }
    if (editor) {
      executeCommand('setHighlight', { color });
    }
  };

  const clearHighlight = () => {
    if (editor) {
      executeCommand('unsetHighlight');
    }
  };

  const indent = () => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;
      const curr = node.attrs.style || "";
      const match = /margin-left:\s*([\d.]+)in/.exec(curr);
      const curVal = match ? parseFloat(match[1]) : 0;
      const next = `${curVal + 0.5}in`;

      executeCommand('updateAttributes', node.type.name, {
        style: `margin-left: ${next};`
      });
    } catch (error) {
      console.error('Error in indent:', error);
    }
  };

  const outdent = () => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;
      const curr = node.attrs.style || "";
      const match = /margin-left:\s*([\d.]+)in/.exec(curr);
      const curVal = match ? parseFloat(match[1]) : 0;
      const nextVal = Math.max(0, curVal - 0.5);
      const next = nextVal ? `margin-left: ${nextVal}in;` : "";

      executeCommand('updateAttributes', node.type.name, {
        style: next
      });
    } catch (error) {
      console.error('Error in outdent:', error);
    }
  };

  const setFirstLineIndent = () => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;
      const curr = node.attrs.style || "";
      const match = /text-indent:\s*([\d.]+)in/.exec(curr);
      const curVal = match ? parseFloat(match[1]) : 0;
      const next = `${curVal + 0.5}in`;

      executeCommand('updateAttributes', node.type.name, {
        style: `${curr.replace(/text-indent:\s*[\d.]+in;?/, '')} text-indent: ${next};`.trim()
      });
    } catch (error) {
      console.error('Error in setFirstLineIndent:', error);
    }
  };

  const setHangingIndent = () => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;
      const curr = node.attrs.style || "";
      const marginMatch = /margin-left:\s*([\d.]+)in/.exec(curr);
      const textIndentMatch = /text-indent:\s*([\d.-]+)in/.exec(curr);

      const marginVal = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const textIndentVal = textIndentMatch ? parseFloat(textIndentMatch[1]) : 0;
      const newTextIndent = textIndentVal - 0.5;

      let newStyle = curr
        .replace(/text-indent:\s*[\d.-]+in;?/g, '')
        .replace(/margin-left:\s*[\d.]+in;?/g, '')
        .trim();

      newStyle += ` margin-left: ${marginVal + 0.5}in; text-indent: ${newTextIndent}in;`;

      executeCommand('updateAttributes', node.type.name, {
        style: newStyle.trim()
      });
    } catch (error) {
      console.error('Error in setHangingIndent:', error);
    }
  };

  const insertPageBreak = () => {
    if (!editor) return;

    try {
      executeCommand('setHardBreak');
      executeCommand('insertContent', '<div style="page-break-before: always; height: 0;"></div>');
    } catch (error) {
      console.error('Error in insertPageBreak:', error);
    }
  };

  const insertSectionBreak = () => {
    if (!editor) return;

    try {
      executeCommand('setHardBreak');
      executeCommand('insertContent', '<div style="border-top: 2px dashed #ccc; margin: 20px 0; padding: 10px 0; text-align: center; color: #666;">Section Break</div>');
    } catch (error) {
      console.error('Error in insertSectionBreak:', error);
    }
  };

  const setParagraphSpacing = (type, value) => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;
      const curr = node.attrs.style || "";

      const cleaned = curr
        .replace(new RegExp(`margin-${type}:\\s*[^;]+;?`, 'g'), '')
        .trim();

      const newStyle = value ? `${cleaned} margin-${type}: ${value};` : cleaned;

      executeCommand('updateAttributes', node.type.name, {
        style: newStyle.trim()
      });
    } catch (error) {
      console.error('Error in setParagraphSpacing:', error);
    }
  };

  const setColumns = (numColumns) => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;

      if (numColumns === 1) {
        executeCommand('updateAttributes', node.type.name, {
          style: (node.attrs.style || '').replace(/column-count:\s*\d+;?\s*/g, '')
        });
      } else {
        executeCommand('updateAttributes', node.type.name, {
          style: `${node.attrs.style || ''} column-count: ${numColumns}; column-gap: 20px;`.trim()
        });
      }
    } catch (error) {
      console.error('Error in setColumns:', error);
    }
  };

  const setTextDirection = (direction) => {
    if (!editor) return;

    try {
      const { state } = editor;
      const node = state.selection.$from.parent;
      const curr = node.attrs.style || "";

      const cleaned = curr
        .replace(/direction:\s*\w+;?/g, '')
        .trim();

      const newStyle = direction === 'ltr' ? cleaned : `${cleaned} direction: rtl;`;

      executeCommand('updateAttributes', node.type.name, {
        style: newStyle.trim()
      });
    } catch (error) {
      console.error('Error in setTextDirection:', error);
    }
  };

  // Check if editor has the required extensions
  const hasExtension = (extensionName) => {
    if (!editor) return false;
    return editor.extensionManager.extensions.some(ext => ext.name === extensionName);
  };

  return (
    <div className="formatting-toolbar">
      {/* Font Family */}
      <div className="font-controls">
        <select
          value={fontFamily}
          onChange={handleFontFamilyChange}
          className="select-input"
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="font-controls">
        <select
          value={fontSize}
          onChange={handleFontSizeChange}
          className="select-input"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>{size} pt</option>
          ))}
        </select>
      </div>

      {/* Line Spacing */}
      <div className="font-controls">
        <select
          value={lineHeight}
          onChange={handleLineSpacingChange}
          className="select-input"
          title="Line Spacing"
        >
          {lineSpacings.map((spacing) => (
            <option key={spacing.value} value={spacing.value}>
              {spacing.label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Formatting */}
      <div className="font-controls">
        <button
          className={`format-btn ${editor?.isActive('bold') ? 'format-btn-active' : ''}`}
          onClick={toggleBold}
          disabled={!hasExtension('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          className={`format-btn ${editor?.isActive('italic') ? 'format-btn-active' : ''}`}
          onClick={toggleItalic}
          disabled={!hasExtension('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          className={`format-btn ${editor?.isActive('textStyle') && /text-decoration:\s*underline/.test(editor.getAttributes('textStyle').style || '') ? 'format-btn-active' : ''}`}
          onClick={toggleUnderline}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
        <button
          className={`format-btn ${editor?.isActive('strike') ? 'format-btn-active' : ''}`}
          onClick={toggleStrike}
          disabled={!hasExtension('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
      </div>

      {/* Removed superscript/subscript and case menu */}

      {/* Text Color & Highlight */}
      <div className="font-controls">
        <input
          type="color"
          value={textColor}
          onChange={handleTextColorChange}
          className="color-input"
          title="Text Color"
        />
        <input type="color" value={highlightColor} onChange={handleHighlightColorChange} className="color-input" title="Text Highlight Color" />
      </div>

      {/* Alignment */}
      <div className="font-controls">
        <button
          className={`format-btn ${editor?.isActive({ textAlign: 'left' }) ? 'format-btn-active' : ''}`}
          onClick={() => executeCommand('setTextAlign', 'left')}
          disabled={!hasExtension('textAlign')}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          className={`format-btn ${editor?.isActive({ textAlign: 'center' }) ? 'format-btn-active' : ''}`}
          onClick={() => executeCommand('setTextAlign', 'center')}
          disabled={!hasExtension('textAlign')}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          className={`format-btn ${editor?.isActive({ textAlign: 'right' }) ? 'format-btn-active' : ''}`}
          onClick={() => executeCommand('setTextAlign', 'right')}
          disabled={!hasExtension('textAlign')}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          className={`format-btn ${editor?.isActive({ textAlign: 'justify' }) ? 'format-btn-active' : ''}`}
          onClick={() => executeCommand('setTextAlign', 'justify')}
          disabled={!hasExtension('textAlign')}
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      {/* Lists */}
      <div className="font-controls">
        <button
          className={`format-btn ${editor?.isActive('bulletList') ? 'format-btn-active' : ''}`}
          onClick={() => executeCommand('toggleBulletList')}
          disabled={!hasExtension('bulletList')}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          className={`format-btn ${editor?.isActive('orderedList') ? 'format-btn-active' : ''}`}
          onClick={() => executeCommand('toggleOrderedList')}
          disabled={!hasExtension('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      {/* NEW: Borders Dropdown */}
      <div className="font-controls" style={{ position: 'relative' }}>
        <button
          ref={borderBtnRef}
          className="format-btn"
          onClick={() => {
            const el = borderBtnRef.current;
            setShowBorderMenu((prev) => {
              const next = !prev;
              if (next && el) {
                const r = el.getBoundingClientRect();
                const left = Math.min(window.innerWidth - 260, Math.max(8, r.left));
                const top = Math.min(window.innerHeight - 240, r.bottom + 6);
                setBorderMenuPos({ top, left });
                setShowTableMenu(false);
              }
              return next;
            });
          }}
          title="Borders"
        >
          <SquareStack size={16} />
        </button>

        {showBorderMenu && createPortal(
          <div className="border-menu" style={{ position: 'fixed', top: borderMenuPos.top, left: borderMenuPos.left, zIndex: 10000 }}>
            <div className="border-menu-header">
              <span>Borders</span>
              <button onClick={() => setShowBorderMenu(false)}>×</button>
            </div>

            <div className="border-options-grid">
              {/* Row 1 */}
              <button onClick={() => applyBorder('bottom')} title="Bottom Border">
                <PanelBottom size={14} />
              </button>
              <button onClick={() => applyBorder('top')} title="Top Border">
                <PanelTop size={14} />
              </button>
              <button onClick={() => applyBorder('left')} title="Left Border">
                <PanelLeft size={14} />
              </button>
              <button onClick={() => applyBorder('right')} title="Right Border">
                <PanelRight size={14} />
              </button>

              {/* Row 2 */}
              <button onClick={() => applyBorder('none')} title="No Border">
                <Square size={14} />
              </button>
              <button onClick={() => applyBorder('all')} title="All Borders">
                <SquareStack size={14} />
              </button>
              <button onClick={() => applyBorder('outside')} title="Outside Borders">
                <Combine size={14} />
              </button>
              <button onClick={() => applyBorder('inside')} title="Inside Borders">
                <Split size={14} />
              </button>

              {/* Row 3 */}
              <button onClick={() => applyBorder('inside-horizontal')} title="Inside Horizontal Border">
                <Minus size={14} />
              </button>
              <button onClick={() => applyBorder('inside-vertical')} title="Inside Vertical Border">
                <div style={{ transform: 'rotate(90deg)' }}><Minus size={14} /></div>
              </button>
              <button onClick={() => applyBorder('diagonal-down')} title="Diagonal Down Border">
                <Square size={14} />
              </button>
              <button onClick={() => applyBorder('diagonal-up')} title="Diagonal Up Border">
                <Square size={14} />
              </button>

              {/* Row 4 */}
              <button onClick={insertHorizontalLine} title="Horizontal Line">
                <Minus size={14} />
              </button>
              <button
                onClick={toggleGridlines}
                className={showGridlines ? 'format-btn-active' : ''}
                title="View Gridlines"
              >
                <Grid3X3 size={14} />
              </button>
              <button onClick={openBordersAndShadingDialog} title="Borders and Shading...">
                <Eye size={14} />
              </button>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* NEW: Table Dropdown */}
      <div className="font-controls" style={{ position: 'relative' }}>
        <button
          ref={tableBtnRef}
          className="format-btn"
          onClick={() => {
            const el = tableBtnRef.current;
            setShowTableMenu((prev) => {
              const next = !prev;
              if (next && el) {
                const r = el.getBoundingClientRect();
                const left = Math.min(window.innerWidth - 260, Math.max(8, r.left));
                const top = Math.min(window.innerHeight - 320, r.bottom + 6);
                setTableMenuPos({ top, left });
                setShowBorderMenu(false);
              }
              return next;
            });
          }}
          title="Table"
        >
          <Table size={16} />
        </button>

        {showTableMenu && createPortal(
          <div className="table-menu" style={{ position: 'fixed', top: tableMenuPos.top, left: tableMenuPos.left, zIndex: 10000 }}>
            <div className="table-menu-header">
              <span>Insert Table</span>
              <button onClick={() => setShowTableMenu(false)}>×</button>
            </div>

            <div className="table-grid-selector">
              <div
                className="table-grid"
                onMouseLeave={() => { setHoverRows(0); setHoverCols(0); }}
                role="grid"
                aria-label="Insert table size"
              >
                {Array.from({ length: GRID_ROWS * GRID_COLS }, (_, idx) => {
                  const rowIndex = Math.floor(idx / GRID_COLS);
                  const colIndex = idx % GRID_COLS;
                  const isHighlighted = hoverRows > 0 && hoverCols > 0
                    ? rowIndex < hoverRows && colIndex < hoverCols
                    : false;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`table-grid-cell ${isHighlighted ? 'highlighted' : ''}`}
                      onMouseEnter={() => { setHoverRows(rowIndex + 1); setHoverCols(colIndex + 1); }}
                      onClick={() => handleGridSelection(rowIndex + 1, colIndex + 1)}
                      title={`${rowIndex + 1} × ${colIndex + 1}`}
                      role="gridcell"
                      aria-label={`${rowIndex + 1} by ${colIndex + 1}`}
                    />
                  );
                })}
              </div>
              <div className="table-grid-size">
                {hoverRows > 0 && hoverCols > 0 ? `${hoverRows} × ${hoverCols} Table` : 'Select table size'}
              </div>
            </div>

            <div className="table-actions">
              <button onClick={() => insertTable(3, 3)} className="table-action-btn">
                <Plus size={14} />
                Insert Table...
              </button>
              <button onClick={deleteTable} className="table-action-btn" disabled={!editor?.isActive('table')}>
                <MinusCircle size={14} />
                Delete Table
              </button>
            </div>

            <div className="table-edit-options">
              <div className="table-edit-group">
                <h4>Rows & Columns</h4>
                <button onClick={addRowBefore} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <Rows size={14} />
                  Insert Row Above
                </button>
                <button onClick={addRowAfter} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <Rows size={14} />
                  Insert Row Below
                </button>
                <button onClick={deleteRow} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <MinusCircle size={14} />
                  Delete Row
                </button>
                <button onClick={addColumnBefore} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <ColumnsIcon size={14} />
                  Insert Column Left
                </button>
                <button onClick={addColumnAfter} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <ColumnsIcon size={14} />
                  Insert Column Right
                </button>
                <button onClick={deleteColumn} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <MinusCircle size={14} />
                  Delete Column
                </button>
              </div>

              <div className="table-edit-group">
                <h4>Cells</h4>
                <button onClick={mergeCells} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <Combine size={14} />
                  Merge Cells
                </button>
                <button onClick={splitCell} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  <Split size={14} />
                  Split Cell
                </button>
              </div>

              <div className="table-edit-group">
                <h4>Headers</h4>
                <button onClick={toggleHeaderRow} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  Toggle Header Row
                </button>
                <button onClick={toggleHeaderColumn} className="table-edit-btn" disabled={!editor?.isActive('table')}>
                  Toggle Header Column
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Removed paragraph spacing, indentation, columns, breaks */}

      {/* Text Direction */}
      <div className="font-controls">
        <button
          className="format-btn"
          onClick={() => setTextDirection('ltr')}
          title="Left to Right"
        >
          <ArrowLeftToLine size={16} />
        </button>
        <button
          className="format-btn"
          onClick={() => setTextDirection('rtl')}
          title="Right to Left"
        >
          <ArrowRightToLine size={16} />
        </button>
      </div>
    </div>
  );
};

export default FormattingToolbar;