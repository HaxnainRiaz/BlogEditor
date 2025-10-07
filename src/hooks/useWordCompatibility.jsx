import { useCallback } from 'react';
import mammoth from 'mammoth';

export const useWordCompatibility = ({ 
  editor, 
  setToast
}) => {
  const showToast = useCallback((text, ms = 2000) => {
    setToast(text);
    setTimeout(() => setToast(null), ms);
  }, [setToast]);

  // Import Word document with full styling
  const importWordDocument = useCallback(async (file) => {
    if (!file || !editor) return;

    try {
      showToast("Importing Word document with full formatting...");
      
      const arrayBuffer = await file.arrayBuffer();
      
      const result = await mammoth.convertToHtml({ 
        arrayBuffer: arrayBuffer 
      }, {
        styleMap: [
          // Comprehensive style mapping for Word documents
          "p[style-name='Title'] => h1.title:fresh",
          "p[style-name='Subtitle'] => h2.subtitle:fresh",
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Heading 5'] => h5:fresh",
          "p[style-name='Heading 6'] => h6:fresh",
          "p[style-name='Normal'] => p.normal",
          "p[style-name='Body Text'] => p.body-text",
          "p[style-name='Quote'] => blockquote.quote:fresh",
          "p[style-name='Intense Quote'] => blockquote.intense-quote:fresh",
          "p[style-name='List Paragraph'] => p.list-paragraph",
          "p[style-name='Footer'] => p.footer",
          "p[style-name='Header'] => p.header",
          "r[style-name='Strong'] => strong",
          "r[style-name='Emphasis'] => em",
          "r[style-name='Intense Emphasis'] => strong > em",
          "r[style-name='Subtle Emphasis'] => em.subtle",
          "r[style-name='Book Title'] => cite.book-title",
          "r[style-name='Code'] => code",
        ],
        includeEmbeddedStyleMap: true,
        includeDefaultStyleMap: true,
        ignoreEmptyParagraphs: false,
        includeHiddenText: false,
        convertImage: mammoth.images.imgElement(function(image) {
          return image.read("base64").then(function(imageBuffer) {
            const src = "data:" + image.contentType + ";base64," + imageBuffer;
            return {
              src: src,
              style: "max-width: 100%; height: auto; display: block; margin: 1em auto;"
            };
          });
        }),
        transformDocument: function(document) {
          // Custom transformation to preserve more styling
          return document;
        }
      });
      
      let htmlContent = result.value;
      
      // Enhanced processing for TipTap compatibility
      htmlContent = processWordHTMLForTipTap(htmlContent);
      
      // Set content in editor
      editor.commands.setContent(htmlContent);
      
      // Handle conversion messages
      if (result.messages && result.messages.length > 0) {
        console.log('Word conversion details:', result.messages);
        const warningCount = result.messages.filter(m => m.type === 'warning').length;
        if (warningCount > 0) {
          showToast(`Imported with ${warningCount} formatting notes`);
        } else {
          showToast("Word document imported with full styling!");
        }
      } else {
        showToast("Word document imported successfully!");
      }
      
    } catch (error) {
      console.error("Word import error:", error);
      showToast("Failed to import Word document. The file may be corrupted or in an unsupported format.");
    }
  }, [editor, showToast]);

  // Export to Word format
  const exportToWord = useCallback(() => {
    if (!editor) return;
    
    const content = editor.getHTML();
    const processedContent = processHTMLForWordExport(content);
    
    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    /* Word-compatible styles */
    @page {
      size: 8.5in 11in;
      margin: 1in;
    }
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
    p.normal { margin: 6pt 0; }
    p.title { 
      text-align: center; 
      font-size: 18pt; 
      font-weight: bold;
      margin: 24pt 0 12pt 0;
    }
    p.subtitle { 
      text-align: center; 
      font-style: italic;
      margin: 12pt 0 24pt 0;
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
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  ${processedContent}
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
  }, [editor, showToast]);

  // Process HTML for Word export compatibility
  const processHTMLForWordExport = (html) => {
    return html
      .replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>')
      .replace(/<em>/g, '<i>').replace(/<\/em>/g, '</i>')
      .replace(/<u>/g, '<u>').replace(/<\/u>/g, '</u>')
      .replace(/<s>/g, '<strike>').replace(/<\/s>/g, '</strike>')
      .replace(/<code>/g, '<code>').replace(/<\/code>/g, '</code>')
      .replace(/style="[^"]*"/g, (match) => {
        // Convert CSS styles to Word-compatible styles
        return match
          .replace(/font-size:\s*(\d+)pt/g, '')
          .replace(/font-family:[^;"]+/g, '')
          .replace(/line-height:[^;"]+/g, '')
          .replace(/text-align:\s*(left|center|right|justify)/g, 'align="$1"');
      })
      .replace(/<p>/g, '<p class="normal">')
      .replace(/<h1[^>]*>/g, '<p class="title">')
      .replace(/<\/h1>/g, '</p>')
      .replace(/<h2[^>]*>/g, '<h2>')
      .replace(/<h3[^>]*>/g, '<h3>');
  };

  // Enhanced HTML processing for TipTap
  const processWordHTMLForTipTap = (html) => {
    return html
      // Convert Word-specific tags
      .replace(/<o:p>.*?<\/o:p>/g, '')
      .replace(/<b\b[^>]*>/gi, '<strong>')
      .replace(/<\/b>/gi, '</strong>')
      .replace(/<i\b[^>]*>/gi, '<em>')
      .replace(/<\/i>/gi, '</em>')
      .replace(/<u\b[^>]*>/gi, '<u>')
      .replace(/<\/u>/gi, '</u>')
      .replace(/<strike\b[^>]*>/gi, '<s>')
      .replace(/<\/strike>/gi, '</s>')
      
      // Handle images
      .replace(/<img([^>]+)>/gi, (match, attributes) => {
        const srcMatch = attributes.match(/src="([^"]*)"/);
        const styleMatch = attributes.match(/style="([^"]*)"/);
        
        const src = srcMatch ? srcMatch[1] : '';
        const style = styleMatch ? styleMatch[1] : 'max-width: 100%; height: auto;';
        
        return `<img src="${src}" style="${style}" class="max-w-full h-auto" />`;
      })
      
      // Clean up spans and preserve styling
      .replace(/<span[^>]*style="([^"]*)"[^>]*>(.*?)<\/span>/gi, (match, style, content) => {
        // Preserve important styles
        if (style.includes('font-weight:bold')) {
          return `<strong>${content}</strong>`;
        } else if (style.includes('font-style:italic')) {
          return `<em>${content}</em>`;
        } else if (style.includes('text-decoration:underline')) {
          return `<u>${content}</u>`;
        }
        return content;
      })
      
      // Normalize paragraphs
      .replace(/<p[^>]*>/gi, '<p>')
      .replace(/<p>\s*<\/p>/g, '')
      
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  };

  // Check Word document compatibility
  const checkWordCompatibility = useCallback((file) => {
    if (!file) return { compatible: false, reason: 'No file provided' };
    
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    
    if (!fileName.endsWith('.docx')) {
      return { compatible: false, reason: 'Only .docx files are supported' };
    }
    
    if (fileSize > 50 * 1024 * 1024) { // 50MB limit
      return { compatible: false, reason: 'File size too large (max 50MB)' };
    }
    
    return { compatible: true, reason: 'File is compatible' };
  }, []);

  return {
    importWordDocument,
    exportToWord,
    checkWordCompatibility,
    processWordHTMLForTipTap,
    processHTMLForWordExport
  };
};