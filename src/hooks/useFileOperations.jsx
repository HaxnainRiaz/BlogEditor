import { useState } from 'react';
import mammoth from 'mammoth';

export const useFileOperations = ({ editor, setToast, currentFile, setCurrentFile, trackChanges, comments }) => {
  const [recentFiles, setRecentFiles] = useState([]);

  const showToast = (text, ms = 2000) => {
    setToast(text);
    setTimeout(() => setToast(null), ms);
  };

  const getActiveEditor = () => {
    try {
      if (typeof window !== 'undefined' && window.__multiPageActiveEditor) {
        return window.__multiPageActiveEditor;
      }
    } catch (e) {}
    return editor;
  };

  const STORAGE_KEY = "editorContentArea.pages.v1";
  const getMergedPagesHtml = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          return parsed.pages.join("\n");
        }
      }
    } catch (e) {}
    const activeEditor = getActiveEditor();
    return activeEditor?.getHTML?.() || "";
  };

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

  // Enhanced Word document import with full styling
  const importWordDocument = async (file) => {
    const activeEditor = getActiveEditor();
    if (!file || !activeEditor) return;

    try {
      showToast("Importing Word document with full formatting...");
      
      const arrayBuffer = await file.arrayBuffer();
      
      const result = await mammoth.convertToHtml({ 
        arrayBuffer: arrayBuffer 
      }, {
        styleMap: [
          "p[style-name='Title'] => h1.title:fresh",
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Heading 5'] => h5:fresh",
          "p[style-name='Heading 6'] => h6:fresh",
          "p[style-name='Normal'] => p.normal",
          "p[style-name='Quote'] => blockquote.quote:fresh",
          "r[style-name='Strong'] => strong",
          "r[style-name='Emphasis'] => em",
          "r[style-name='Underline'] => u",
        ],
        includeEmbeddedStyleMap: true,
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.imgElement(function(image) {
          return image.read("base64").then(function(imageBuffer) {
            const src = "data:" + image.contentType + ";base64," + imageBuffer;
            return {
              src: src,
              style: "max-width: 100%; height: auto;"
            };
          });
        })
      });
      
      let htmlContent = result.value;
      
      // Process for TipTap compatibility
      htmlContent = processWordHTMLForTipTap(htmlContent);
      
      try {
        activeEditor.commands.setContent(htmlContent);
      } catch (e) {
        try { activeEditor.commands.setContent(htmlContent, false); } catch (e2) {}
      }
      setCurrentFile(file);
      
      // Add to recent files
      setRecentFiles(prev => [
        { name: file.name, path: file.name, lastOpened: new Date() },
        ...prev.slice(0, 9)
      ]);
      
      showToast(`Successfully imported "${file.name}" with full formatting`);
      
    } catch (error) {
      console.error("Word import error:", error);
      showToast("Failed to import Word document");
    }
  };

  const processWordHTMLForTipTap = (html) => {
    return html
      .replace(/<b\b[^>]*>/gi, '<strong>')
      .replace(/<\/b>/gi, '</strong>')
      .replace(/<i\b[^>]*>/gi, '<em>')
      .replace(/<\/i>/gi, '</em>')
      .replace(/<u\b[^>]*>/gi, '<u>')
      .replace(/<\/u>/gi, '</u>')
      .replace(/<strike\b[^>]*>/gi, '<s>')
      .replace(/<\/strike>/gi, '</s>')
      .replace(/<img([^>]+)>/gi, '<img$1 class="max-w-full h-auto">');
  };

  const openFile = async (file) => {
    const activeEditor = getActiveEditor();
    if (!file || !activeEditor) return;

    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.docx')) {
      await importWordDocument(file);
    } else if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
      try {
        const text = await file.text();
        try {
          activeEditor.commands.setContent(text);
        } catch (e) {
          try { activeEditor.commands.setContent(text, false); } catch (e2) {}
        }
        setCurrentFile(file);
        showToast(`Opened ${file.name}`);
      } catch (error) {
        showToast("Error opening HTML file");
      }
    } else {
      showToast("Please select Word (.docx) or HTML files");
    }
  };

  const uploadImage = (file) => {
    const activeEditor = getActiveEditor();
    if (!file || !activeEditor) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (activeEditor.chain().focus().setImage) {
          activeEditor.chain().focus().setImage({ src: reader.result }).run();
        } else {
          activeEditor.chain().focus().insertContent(`<img src="${reader.result}" style="max-width:100%;height:auto;"/>`).run();
        }
      } catch (e) {
        try { activeEditor.chain().focus().insertContent(`<img src="${reader.result}" style="max-width:100%;height:auto;"/>`).run(); } catch (e2) {}
      }
      showToast("Image inserted");
    };
    reader.onerror = () => showToast("Error uploading image");
    reader.readAsDataURL(file);
  };

  const uploadVideo = (file) => {
    const activeEditor = getActiveEditor();
    if (!file || !activeEditor) return;
    const url = URL.createObjectURL(file);
    activeEditor.chain().focus().insertContent(
      `<div class="video-wrapper my-4">
        <video controls src="${url}" class="w-full max-w-full rounded-lg"></video>
      </div>`
    ).run();
    showToast("Video inserted");
  };

  const attachFile = (file) => {
    const activeEditor = getActiveEditor();
    if (!file || !activeEditor) return;
    const url = URL.createObjectURL(file);
    activeEditor.chain().focus().insertContent(
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="file-attachment inline-flex items-center gap-2 px-3 py-1 border rounded-lg bg-gray-50 hover:bg-gray-100">
        <span class="text-sm">📎 ${file.name}</span>
      </a>`
    ).run();
    showToast("File attached");
  };

  const saveAsHtml = () => {
    const merged = sanitizeHtml(getMergedPagesHtml());
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentFile?.name || 'Document'}</title>
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
  ${merged}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentFile?.name.replace(/\.[^/.]+$/, "") || 'document'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Saved as HTML");
  };

  const saveAsWord = () => {
    const merged = sanitizeHtml(getMergedPagesHtml());
    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${currentFile?.name || 'Document'}</title>
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
    p { margin: 6pt 0; }
    img { max-width: 6.5in; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #000; padding: 4pt; }
  </style>
</head>
<body>
  ${merged}
</body>
</html>`;

    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentFile?.name.replace(/\.[^/.]+$/, "") || 'document'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Saved as Word document");
  };

  const saveAsPdf = () => {
    const merged = sanitizeHtml(getMergedPagesHtml());
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${currentFile?.name || 'Document'}</title>
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
    @media print {
      body { padding: 0.5in; }
      .page-break { page-break-before: always; }
    }
  </style>
</head>
<body>
  ${merged}
</body>
</html>`;

    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) {
      showToast("Please allow popups to export PDF");
      return;
    }

    w.document.write(html);
    w.document.close();

    setTimeout(() => {
      w.print();
      showToast("Choose 'Save as PDF' in print dialog");
    }, 500);
  };

  return {
    openFile,
    uploadImage,
    uploadVideo,
    attachFile,
    saveAsHtml,
    saveAsWord,
    saveAsPdf,
    importWordDocument,
    recentFiles,
    currentFile
  };
};