import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import CharacterCount from "@tiptap/extension-character-count";
import Dropcursor from "@tiptap/extension-dropcursor";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import FontFamily from "@tiptap/extension-font-family";
import { Markdown } from "tiptap-markdown";
import Focus from "@tiptap/extension-focus";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";

const lowlight = createLowlight();
lowlight.register("js", js);

// Custom Document extension for Word-like layout
const CustomDocument = Document.extend({
  content: 'block+',
});

// Enhanced Paragraph with Word-compatible attributes
const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        }
      },
      align: {
        default: null,
        parseHTML: element => element.getAttribute('align') || element.style.textAlign,
        renderHTML: attributes => {
          if (!attributes.align) return {};
          return { style: `text-align: ${attributes.align}` };
        }
      },
      indent: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style');
          const match = style?.match(/margin-left:\s*([\d.]+)(in|pt)/);
          return match ? parseFloat(match[1]) : null;
        },
        renderHTML: attributes => {
          if (!attributes.indent) return {};
          return { style: `margin-left: ${attributes.indent}in` };
        }
      }
    };
  },
});

// Enhanced Heading with Word-compatible attributes
const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        }
      },
      level: {
        default: 1,
        parseHTML: element => {
          const level = element.tagName.toLowerCase().replace('h', '');
          return parseInt(level) || 1;
        },
        renderHTML: attributes => {
          return { level: attributes.level };
        }
      }
    };
  },
});

// Custom Table extensions for better Word compatibility
const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      border: {
        default: '1',
        parseHTML: element => element.getAttribute('border') || '1',
        renderHTML: attributes => {
          return { border: attributes.border };
        }
      }
    };
  },
});

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      colspan: {
        default: 1,
        parseHTML: element => parseInt(element.getAttribute('colspan')) || 1,
        renderHTML: attributes => {
          if (attributes.colspan > 1) {
            return { colspan: attributes.colspan };
          }
          return {};
        }
      },
      rowspan: {
        default: 1,
        parseHTML: element => parseInt(element.getAttribute('rowspan')) || 1,
        renderHTML: attributes => {
          if (attributes.rowspan > 1) {
            return { rowspan: attributes.rowspan };
          }
          return {};
        }
      }
    };
  },
});

// Custom Image extension for better handling
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        }
      },
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        }
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        }
      },
      align: {
        default: null,
        parseHTML: element => element.getAttribute('align') || element.style.float,
        renderHTML: attributes => {
          if (!attributes.align) return {};
          return { style: `float: ${attributes.align}` };
        }
      }
    };
  },
});

export const editorConfig = {
  extensions: [
    CustomDocument,
    Text,
    CustomParagraph,
    CustomHeading,
    FontFamily.configure({
      types: ['textStyle'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 hover:text-blue-800 underline',
      },
    }),
    CustomImage.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto border',
      },
    }),
    Placeholder.configure({ 
      placeholder: "Start typing your document...",
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'list-none my-2',
      },
    }),
    TaskItem.configure({
      HTMLAttributes: {
        class: 'flex items-start my-1',
      },
    }),
    CustomTable.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'border-collapse border border-gray-300 my-4',
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: 'border border-gray-300',
      },
    }),
    CustomTableCell.configure({
      HTMLAttributes: {
        class: 'border border-gray-300 px-4 py-2',
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-bold',
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: 'bg-gray-900 text-gray-100 rounded p-4 my-2 font-mono text-sm',
      },
    }),
    CharacterCount.configure(),
    Dropcursor.configure({
      width: 2,
      class: 'text-blue-500',
    }),
    TextStyle,
    Color.configure({
      types: ['textStyle'],
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'rounded px-1 py-0.5',
      },
    }),
    HorizontalRule.configure({
      HTMLAttributes: {
        class: 'border-t-2 border-gray-300 my-8',
      },
    }),
    Youtube.configure({
      controls: true,
      HTMLAttributes: {
        class: 'rounded-lg my-4',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: 'list-disc list-inside my-4',
      },
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: 'list-decimal list-inside my-4',
      },
    }),
    ListItem.configure({
      HTMLAttributes: {
        class: 'my-1',
      },
    }),
    HardBreak.configure({
      keepMarks: true,
    }),
    Markdown,
    Focus.configure({
      className: 'has-focus',
      mode: 'all',
    }),
    StarterKit.configure({
    bold: {},
    italic: {},
    strike: {},
    blockquote: {},
    codeBlock: {},
    bulletList: {},
    orderedList: {},
    listItem: {},
    heading: {
      levels: [1, 2, 3],
    },
  }),
  ],
  content: `
    
  `,
  immediatelyRender: false,
  editorProps: {
    attributes: {
      class: 'prose prose-lg max-w-none focus:outline-none min-h-[800px] p-12 bg-white shadow-inner word-document',
      style: 'font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.15;',
      spellCheck: "true"
    },
    handlePaste: (view, event) => {
      // Enhanced paste handling for Word content
      const html = event.clipboardData?.getData('text/html');
      const text = event.clipboardData?.getData('text/plain');
      
      if (html && html.includes('mso-')) {
        // Word content detected - use special handling
        event.preventDefault();
        // Process Word HTML content
        const processedHtml = processWordPaste(html);
        view.dispatch(view.state.tr.insertText(processedHtml));
        return true;
      }
      
      // Handle image pasting
      const items = Array.from(event.clipboardData?.items || []);
      for (let item of items) {
        if (item.type.indexOf("image") === 0) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = () => {
            view.dispatch(view.state.tr.insertText(''));
            // Insert image at current position
            // This would need to be handled by the image extension
          };
          reader.readAsDataURL(file);
          event.preventDefault();
          return true;
        }
      }
      
      return false;
    },
    handleDrop: (view, event, _slice, moved) => {
      if (!moved && event.dataTransfer?.files?.length) {
        const files = Array.from(event.dataTransfer.files);
        for (let file of files) {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
              // Insert image at drop position
              // This would need to be handled by the image extension
            };
            reader.readAsDataURL(file);
            event.preventDefault();
            return true;
          }
        }
      }
      return false;
    },
  },
};

// Helper function to process Word paste content
const processWordPaste = (html) => {
  return html
    .replace(/<o:p>.*?<\/o:p>/g, '') // Remove Office namespace tags
    .replace(/<span\s+[^>]*>(.*?)<\/span>/gi, '$1') // Simplify spans
    .replace(/<p\s+class="MsoNormal"[^>]*>/gi, '<p>') // Normalize paragraphs
    .replace(/<b>/gi, '<strong>').replace(/<\/b>/gi, '</strong>')
    .replace(/<i>/gi, '<em>').replace(/<\/i>/gi, '</em>')
    .replace(/<u>/gi, '<u>').replace(/<\/u>/gi, '</u>')
    .replace(/<strike>/gi, '<s>').replace(/<\/strike>/gi, '</s>')
    .replace(/\n/g, ' ') // Normalize line breaks
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};