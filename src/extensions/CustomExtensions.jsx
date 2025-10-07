import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import Document from "@tiptap/extension-document";

// Custom Document extension for Word-like layout
export const CustomDocument = Document.extend({
  content: 'block+',
});

// Enhanced Paragraph with Word-compatible attributes
export const CustomParagraph = Paragraph.extend({
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
export const CustomHeading = Heading.extend({
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
export const CustomTable = Table.extend({
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

export const CustomTableCell = TableCell.extend({
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
export const CustomImage = Image.extend({
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

// Custom Mark for comments
export const CommentMark = Mark.create({
  name: 'comment',
  
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-id'),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return { 'data-comment-id': attributes.id };
        }
      },
      text: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-text'),
        renderHTML: attributes => {
          if (!attributes.text) return {};
          return { 'data-comment-text': attributes.text };
        }
      }
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-comment-id]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', { 
      ...HTMLAttributes, 
      class: 'comment-highlight bg-yellow-100 border-b-2 border-yellow-300 cursor-pointer',
      title: HTMLAttributes.text
    }, 0];
  },
});