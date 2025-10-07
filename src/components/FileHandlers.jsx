import React, { useRef } from 'react';

const FileHandlers = ({ onFileOpen, onImageUpload, onVideoUpload, onFileAttach, onWordImport }) => {
  const fileOpenRef = useRef(null);
  const fileImageRef = useRef(null);
  const fileVideoRef = useRef(null);
  const fileAttachRef = useRef(null);
  const wordImportRef = useRef(null);

  const handleFileOpen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.docx')) {
      onWordImport(file);
    } else if (fileName.endsWith('.html') || fileName.endsWith('.htm') || fileName.endsWith('.txt')) {
      onFileOpen(file);
    } else {
      alert('Please select Word (.docx), HTML (.html, .htm) or Text (.txt) files only.');
    }
    
    e.target.value = '';
  };

  const handleWordImport = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.docx')) {
      onWordImport(file);
    } else {
      alert('Please select a Word document (.docx)');
    }
    e.target.value = '';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
    e.target.value = '';
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) onVideoUpload(file);
    e.target.value = '';
  };

  const handleFileAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileAttach(file);
    e.target.value = '';
  };

  return (
    <>
      {/* <input 
        id="file-open-input"
        ref={fileOpenRef} 
        type="file" 
        accept=".docx,.html,.htm,.txt" 
        className="hidden-input" 
        onChange={handleFileOpen} 
      />
      <input 
        id="word-import-input"
        ref={wordImportRef} 
        type="file" 
        accept=".docx" 
        className="hidden-input" 
        onChange={handleWordImport} 
      />
      <input 
        id="file-image-input"
        ref={fileImageRef} 
        type="file" 
        accept="image/*" 
        className="hidden-input" 
        onChange={handleImageUpload} 
      />
      <input 
        id="file-video-input"
        ref={fileVideoRef} 
        type="file" 
        accept="video/*" 
        className="hidden-input" 
        onChange={handleVideoUpload} 
      />
      <input 
        ref={fileAttachRef} 
        type="file" 
        className="hidden-input" 
        onChange={handleFileAttach} 
      /> */}
    </>
  );
};

export default FileHandlers;