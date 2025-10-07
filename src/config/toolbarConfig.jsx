import { 
  Bold, Italic, UnderlineIcon, Strikethrough, Type, Code, Code2, 
  List, ListOrdered, Link2, ImageIcon, Video, TableIcon, 
  FileCode, Eye, Search, Copy, Printer, Maximize2, Trash2, 
  Download, RotateCcw, RotateCw, Smile, FileText, File,
  Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Scissors, ClipboardPaste, Zap, CheckSquare, Bookmark
} from "lucide-react";

// Helper function for mark-once behavior
const applyMarkOnce = (editor, markName, toggleFn) => {
  const selection = editor.state.selection;
  const { from, to, empty } = selection;

  if (!empty && to > from) {
    toggleFn();
    setTimeout(() => {
      editor.chain().focus().setTextSelection(to).unsetMark(markName).run();
    }, 0);
  } else {
    toggleFn();
  }
};

export const toolbarConfig = [
  // File Operations - Primary
  { 
    key: "new", 
    title: "New", 
    onClick: (editor, showToast) => {
      if (window.confirm("Clear editor and create new document?")) {
        editor.commands.clearContent();
        showToast("New document created");
      }
    }, 
    category: "primary", 
    icon: "new" 
  },
  { 
    key: "open", 
    title: "Open", 
    onClick: (editor, showToast, actions) => {
      actions.onFileOpen?.();
    }, 
    category: "primary", 
    icon: "open" 
  },
  { 
    key: "save", 
    title: "Save HTML", 
    onClick: (editor, showToast, actions) => {
      actions.onSaveHtml?.();
    }, 
    category: "primary", 
    icon: "save" 
  },
  { 
    key: "saveWord", 
    title: "Save as Word", 
    onClick: (editor, showToast, actions) => {
      actions.onSaveWord?.();
    }, 
    category: "primary", 
    icon: "saveWord" 
  },
  { 
    key: "savePdf", 
    title: "Save as PDF", 
    onClick: (editor, showToast, actions) => {
      actions.onSavePdf?.();
    }, 
    category: "primary", 
    icon: "savePdf" 
  },

  // Editing - Primary
  { 
    key: "undo", 
    title: "", 
    onClick: (editor) => editor.chain().focus().undo().run(), 
    category: "primary", 
    icon: "undo" 
  },
  { 
    key: "redo", 
    title: "", 
    onClick: (editor) => editor.chain().focus().redo().run(), 
    category: "primary", 
    icon: "redo" 
  },

  // Text Formatting - Primary
  { 
    key: "bold", 
    title: "", 
    onClick: (editor) => applyMarkOnce(editor, "bold", () => editor.chain().focus().toggleBold().run()), 
    category: "primary", 
    icon: "bold" 
  },
  { 
    key: "italic", 
    title: "", 
    onClick: (editor) => applyMarkOnce(editor, "italic", () => editor.chain().focus().toggleItalic().run()), 
    category: "primary", 
    icon: "italic" 
  },
  { 
    key: "underline", 
    title: "", 
    onClick: (editor) => applyMarkOnce(editor, "underline", () => editor.chain().focus().toggleUnderline().run()), 
    category: "primary", 
    icon: "underline" 
  },
  { 
    key: "strike", 
    title: "", 
    onClick: (editor) => applyMarkOnce(editor, "strike", () => editor.chain().focus().toggleStrike().run()), 
    category: "primary", 
    icon: "strike" 
  },

  // Advanced Formatting - Primary
  { 
    key: "code", 
    title: "Inline code", 
    onClick: (editor) => applyMarkOnce(editor, "code", () => editor.chain().focus().toggleCode().run()), 
    category: "primary", 
    icon: "code" 
  },
  { 
    key: "codeblock", 
    title: "Code block", 
    onClick: (editor) => editor.chain().focus().toggleCodeBlock().run(), 
    category: "primary", 
    icon: "codeblock" 
  },

  // Lists - Primary
  { 
    key: "bullet", 
    title: "", 
    onClick: (editor) => editor.chain().focus().toggleBulletList().run(), 
    category: "primary", 
    icon: "bullet" 
  },
  { 
    key: "ordered", 
    title: "", 
    onClick: (editor) => editor.chain().focus().toggleOrderedList().run(), 
    category: "primary", 
    icon: "ordered" 
  },

  // Alignment - Primary
  { 
    key: "alignLeft", 
    title: "", 
    onClick: (editor) => editor.chain().focus().setTextAlign("left").run(), 
    category: "primary", 
    icon: "alignLeft" 
  },
  { 
    key: "alignCenter", 
    title: "", 
    onClick: (editor) => editor.chain().focus().setTextAlign("center").run(), 
    category: "primary", 
    icon: "alignCenter" 
  },
  { 
    key: "alignRight", 
    title: "", 
    onClick: (editor) => editor.chain().focus().setTextAlign("right").run(), 
    category: "primary", 
    icon: "alignRight" 
  },
  { 
    key: "alignJustify", 
    title: "", 
    onClick: (editor) => editor.chain().focus().setTextAlign("justify").run(), 
    category: "primary", 
    icon: "alignJustify" 
  },

  // Media & Elements - Primary
  { 
    key: "link", 
    title: "", 
    onClick: (editor) => {
      const url = prompt("Enter URL:");
      if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, 
    category: "primary", 
    icon: "link" 
  },
  { 
    key: "image", 
    title: "", 
    onClick: (editor, showToast, actions) => {
      actions.onImageUpload?.();
    }, 
    category: "primary", 
    icon: "image" 
  },
  { 
    key: "video", 
    title: "", 
    onClick: (editor, showToast, actions) => {
      actions.onVideoUpload?.();
    }, 
    category: "primary", 
    icon: "video" 
  },
  { 
    key: "table", 
    title: "", 
    onClick: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), 
    category: "primary", 
    icon: "table" 
  },
  { 
    key: "hr", 
    title: "", 
    onClick: (editor) => editor.chain().focus().setHorizontalRule().run(), 
    category: "primary", 
    icon: "hr" 
  },

  // Special Characters - Primary
  { 
    key: "special", 
    title: "", 
    onClick: (editor) => editor.chain().focus().insertContent("—").run(), 
    category: "primary", 
    icon: "special" 
  },
  { 
    key: "emoji", 
    title: "", 
    onClick: (editor, showToast, actions) => {
      actions.onEmojiOpen?.();
    }, 
    category: "primary", 
    icon: "emoji" 
  },

  // View & Tools - Primary
  { 
    key: "source", 
    title: "Source", 
    onClick: (editor, showToast, actions) => {
      actions.onToggleSource?.();
    }, 
    category: "primary", 
    icon: "source" 
  },
  { 
    key: "preview", 
    title: "", 
    onClick: (editor, showToast, actions) => {
      actions.onTogglePreview?.();
    }, 
    category: "primary", 
    icon: "preview" 
  },
  { 
    key: "find", 
    title: "", 
    onClick: (editor, showToast, actions) => {
      actions.onFindOpen?.();
    }, 
    category: "primary", 
    icon: "find" 
  },

  // Export & Print - Secondary
  { 
    key: "export", 
    title: "Copy HTML", 
    onClick: async (editor, showToast) => {
      const html = editor.getHTML();
      try {
        await navigator.clipboard.writeText(html);
        showToast("HTML copied to clipboard");
      } catch {
        const textArea = document.createElement("textarea");
        textArea.value = html;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showToast("HTML copied to clipboard");
      }
    }, 
    category: "secondary", 
    icon: "export" 
  },
  { 
    key: "print", 
    title: "", 
    onClick: (editor, showToast) => {
      const w = window.open("", "_blank", "noopener,noreferrer");
      const html = `<!DOCTYPE html><html><head><title>Print</title><style>body { font-family: system-ui, sans-serif; padding: 20px; line-height: 1.6; } img { max-width: 100%; height: auto; }</style></head><body>${editor.getHTML()}</body></html>`;
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        w.print();
        setTimeout(() => w.close(), 1000);
      }, 500);
    }, 
    category: "secondary", 
    icon: "print" 
  },

  // Layout - Secondary
  { 
    key: "fullscreen", 
    title: "", 
    onClick: (editor, showToast, actions) => {
      actions.onFullscreenToggle?.();
    }, 
    category: "secondary", 
    icon: "fullscreen" 
  },

  // Advanced Features - Secondary
  { 
    key: "clear", 
    title: "", 
    onClick: (editor) => editor.chain().focus().clearNodes().unsetAllMarks().run(), 
    category: "secondary", 
    icon: "clear" 
  },
  { 
    key: "track", 
    title: "Track changes", 
    onClick: (editor, showToast, actions) => {
      actions.onTrackChanges?.();
    }, 
    category: "secondary", 
    icon: "track" 
  },
  { 
    key: "comment", 
    title: "Add comment", 
    onClick: (editor, showToast, actions) => {
      actions.onCommentAdd?.();
    }, 
    category: "secondary", 
    icon: "comment" 
  },
  { 
    key: "equation", 
    title: "Insert equation", 
    onClick: (editor, showToast, actions) => {
      actions.onEquationInsert?.();
    }, 
    category: "secondary", 
    icon: "equation" 
  },
  { 
    key: "dropcap", 
    title: "Toggle Drop Cap", 
    onClick: (editor, showToast) => {
      const nodeType = editor.state.selection.$from.parent.type.name;
      const curr = editor.state.selection.$from.parent.attrs.dropcap;
      editor.chain().focus().updateAttributes(nodeType, { dropcap: !curr }).run();
      showToast(curr ? "Drop cap removed" : "Drop cap added");
    }, 
    category: "secondary", 
    icon: "dropcap" 
  },
  { 
    key: "bookmark", 
    title: "Insert bookmark", 
    onClick: (editor, showToast) => {
      const name = prompt("Bookmark ID (no spaces):");
      if (!name || !name.trim()) return;
      const cleanName = name.trim().replace(/\s+/g, '-');
      const nodeType = editor.state.selection.$from.parent.type.name;
      editor.chain().focus().updateAttributes(nodeType, { bookmark: cleanName }).run();
      showToast(`Bookmark '${cleanName}' inserted`);
    }, 
    category: "secondary", 
    icon: "bookmark" 
  },
  { 
    key: "footnote", 
    title: "Insert footnote", 
    onClick: (editor, showToast) => {
      const note = prompt("Footnote text:");
      if (!note || !note.trim()) return;
      showToast("Footnote inserted");
    }, 
    category: "secondary", 
    icon: "footnote" 
  },
];

export const iconMap = {
  bold: <Bold className="w-4 h-4" />,
  italic: <Italic className="w-4 h-4" />,
  underline: <UnderlineIcon className="w-4 h-4" />,
  strike: <Strikethrough className="w-4 h-4" />,
  undo: <RotateCcw className="w-4 h-4" />,
  redo: <RotateCw className="w-4 h-4" />,
  code: <Code className="w-4 h-4" />,
  codeblock: <Code2 className="w-4 h-4" />,
  bullet: <List className="w-4 h-4" />,
  ordered: <ListOrdered className="w-4 h-4" />,
  alignLeft: <AlignLeft className="w-4 h-4" />,
  alignCenter: <AlignCenter className="w-4 h-4" />,
  alignRight: <AlignRight className="w-4 h-4" />,
  alignJustify: <AlignJustify className="w-4 h-4" />,
  link: <Link2 className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  table: <TableIcon className="w-4 h-4" />,
  hr: <Minus className="w-4 h-4" />,
  special: <Type className="w-4 h-4" />,
  emoji: <Smile className="w-4 h-4" />,
  source: <FileCode className="w-4 h-4" />,
  preview: <Eye className="w-4 h-4" />,
  find: <Search className="w-4 h-4" />,
  export: <Copy className="w-4 h-4" />,
  print: <Printer className="w-4 h-4" />,
  fullscreen: <Maximize2 className="w-4 h-4" />,
  clear: <Trash2 className="w-4 h-4" />,
  save: <Download className="w-4 h-4" />,
  saveWord: <FileText className="w-4 h-4" />,
  savePdf: <File className="w-4 h-4" />,
  open: <File className="w-4 h-4" />,
  new: <FileText className="w-4 h-4" />,
  track: <Zap className="w-4 h-4" />,
  comment: <ClipboardPaste className="w-4 h-4" />,
  equation: <Type className="w-4 h-4" />,
  dropcap: <Type className="w-4 h-4" />,
  bookmark: <Bookmark className="w-4 h-4" />,
  footnote: <FileText className="w-4 h-4" />,
};