import React from 'react';
import { Table, Image, Link2, Minus, Smile, Heading1, Heading2, Heading3, Pilcrow } from 'lucide-react';

const LayoutToolbar = ({ editor, onImageUpload }) => {
  if (!editor) return null;
  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertImage = () => {
    if (onImageUpload) {
      onImageUpload();
    } else {
      document.getElementById('file-image-input')?.click();
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const insertHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const setHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="layout-toolbar">
      {/* Headings */}
      <div className="toolbar-group">
        <button
          className={`format-btn ${editor.isActive('heading', { level: 1 }) ? 'format-btn-active' : ''}`}
          onClick={() => setHeading(1)}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          className={`format-btn ${editor.isActive('heading', { level: 2 }) ? 'format-btn-active' : ''}`}
          onClick={() => setHeading(2)}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          className={`format-btn ${editor.isActive('heading', { level: 3 }) ? 'format-btn-active' : ''}`}
          onClick={() => setHeading(3)}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
        <button
          className={`format-btn ${editor.isActive('paragraph') ? 'format-btn-active' : ''}`}
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="Normal Text"
        >
          <Pilcrow size={16} />
        </button>
      </div>

      {/* Insert Elements */}
      <div className="toolbar-group">
        <button className="format-btn" onClick={insertTable} title="Insert Table">
          <Table size={16} />
        </button>
        <button className="format-btn" onClick={insertImage} title="Insert Image">
          <Image size={16} />
        </button>
        <button className="format-btn" onClick={insertLink} title="Insert Link">
          <Link2 size={16} />
        </button>
        <button className="format-btn" onClick={insertHorizontalRule} title="Insert Horizontal Line">
          <Minus size={16} />
        </button>
      </div>

      {/* Emoji (kept) */}
      <div className="toolbar-group">
        <button
          className="format-btn"
          onClick={() => document.dispatchEvent(new CustomEvent('open-emoji-picker'))}
          title="Insert Emoji"
        >
          <Smile size={16} />
        </button>
      </div>
    </div>
  );
};

export default LayoutToolbar;