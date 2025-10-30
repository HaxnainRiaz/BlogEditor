"use client";
import './EditorStyles.css'; // Remove @/ prefix
import React from "react";
import { useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import { editorConfig } from './editorConfig';
import AdvancedToolbar from './AdvancedToolbar';
import EditorContentArea from './EditorContentArea';
import AdvancedModals from './AdvancedModals';
import StatusBar from './StatusBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from './Sidebar';
import { useEditorFunctions } from '../hooks/useEditorFunctions'; // Fix path
import { useFileOperations } from '../hooks/useFileOperations'; // Fix path
import { useAdvancedFeatures } from '../hooks/useAdvancedFeatures'; // Fix path
import { useWordCompatibility } from '../hooks/useWordCompatibility'; // Fix path


export default function Editor() {



// Add this function to your Editor component
const handlePostToBlog = () => {
  if (!editor) return;
  
  const title = prompt('Enter blog title:') || 'Untitled Blog';
  if (!title) return;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const content = editor.getHTML();
  
  const newBlog = {
    id: Date.now().toString(),
    title: title,
    content: content,
    author: currentUser.fullName || 'Anonymous',
    date: new Date().toISOString()
  };

  const existingBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
  const updatedBlogs = [newBlog, ...existingBlogs];
  localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  
  // Use react-toastify instead of custom toast
  toast.success('Blog posted successfully!');
  // Clear editor content and reset paginated pages after posting
  try {
    editor.commands.clearContent();
    if (typeof window !== 'undefined' && typeof window.__resetPages === 'function') {
      window.__resetPages();
    }
  } catch (e) {}
  };


  // Refs
  const editorContainerRef = useRef(null);
  const toolbarRef = useRef(null);
  const contentRef = useRef(null);

  // Core state management
  const [showSource, setShowSource] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quickText, setQuickText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentFile, setCurrentFile] = useState(null);

  // Advanced state management
  const [findOpen, setFindOpen] = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [replaceQuery, setReplaceQuery] = useState("");
  const [pastePlainNext, setPastePlainNext] = useState(false);
  const [trackChanges, setTrackChanges] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentModal, setCommentModal] = useState({ open: false, selection: null });
  const [equationModalOpen, setEquationModalOpen] = useState(false);
  const [equationInput, setEquationInput] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Inter, system-ui, Arial");
  const [lineHeight, setLineHeight] = useState(1.6);
  const [textColor, setTextColor] = useState("#000000");
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [zoomLevel, setZoomLevel] = useState(100);

  // Initialize editor
  const editor = useEditor(editorConfig);

  // Custom hooks for functionality grouping
  const editorFunctions = useEditorFunctions({
    editor,
    setToast: setToastMessage,
    setPastePlainNext,
    setIsFullscreen,
    isFullscreen,
    editorContainerRef,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    lineHeight,
    setLineHeight,
    textColor,
    setTextColor,
    highlightColor,
    setHighlightColor,
    zoomLevel,
    setZoomLevel
  });

  const fileOperations = useFileOperations({
    editor,
    setToast: setToastMessage,
    currentFile,
    setCurrentFile,
    trackChanges,
    comments
  });

  const advancedFeatures = useAdvancedFeatures({
    editor,
    setToast: setToastMessage,
    comments,
    setComments,
    trackChanges,
    setTrackChanges
  });

  const wordCompatibility = useWordCompatibility({
    editor,
    setToast: setToastMessage
  });

  if (!editor) {
    return (
      <div className="min-h-screen bg-gray-900/60 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading Word-compatible Editor...</div>
      </div>
    );
  }

  return (
    <div className='editor-container'>
      <div className="page-root word-editor-theme">
        <div ref={editorContainerRef} className="editor-wrapper">
          <ToastContainer />
          <AdvancedToolbar
  editor={editor}
  toolbarRef={toolbarRef}
  showToast={setToastMessage}
  onToggleSource={() => setShowSource(!showSource)}
  onTogglePreview={() => setShowPreview(!showPreview)}
  onFindOpen={() => setFindOpen(true)}
  onFullscreenToggle={editorFunctions.toggleFullscreen}
  onCommentAdd={() => setCommentModal({ open: true, selection: null })}
  onEquationInsert={() => setEquationModalOpen(true)}
  onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
  onTrackChangesToggle={() => setTrackChanges(!trackChanges)}
  onPostToBlog={handlePostToBlog} // Add this line
  isFullscreen={isFullscreen}
  sidebarOpen={sidebarOpen}
  trackChanges={trackChanges}
  onFileOpen={() => document.getElementById('file-open-input')?.click()}
  onImageUpload={() => document.getElementById('file-image-input')?.click()}
  onVideoUpload={() => document.getElementById('file-video-input')?.click()}
  onSaveHtml={fileOperations.saveAsHtml}
  onSaveWord={fileOperations.saveAsWord}
  onSavePdf={fileOperations.saveAsPdf}
  fontSize={fontSize}
  fontFamily={fontFamily}
  lineHeight={lineHeight}
  textColor={textColor}
  highlightColor={highlightColor}
  zoomLevel={zoomLevel}
  onFontSizeChange={editorFunctions.setFontSize}
  onFontFamilyChange={editorFunctions.setFontFamily}
  onLineHeightChange={editorFunctions.setLineHeight}
  onTextColorChange={editorFunctions.setTextColor}
  onHighlightColorChange={editorFunctions.setHighlightColor}
  onZoomChange={editorFunctions.setZoomLevel}
/>

          <div className="editor-content-wrapper">
            {/* {sidebarOpen && (
              <Sidebar
                editor={editor}
                comments={comments}
                trackChanges={trackChanges}
                onCommentClick={(comment) => advancedFeatures.navigateToComment(comment)}
                onAcceptAllChanges={advancedFeatures.acceptAllChanges}
                onRejectAllChanges={advancedFeatures.rejectAllChanges}
              />
            )} */}

            <EditorContentArea
              editor={editor} // Pass the main editor instance
              contentRef={contentRef}
              showSource={showSource}
              showPreview={showPreview}
              quickText={quickText}
              setQuickText={setQuickText}
              onQuickAdd={editorFunctions.handleQuickAdd}
              onSourceToggle={() => setShowSource(!showSource)}
              onPostToBlog={handlePostToBlog}
              zoomLevel={zoomLevel}
            />
          </div>

          <StatusBar
            editor={editor}
            currentFile={currentFile}
            trackChanges={trackChanges}
            wordCount={editor.storage.characterCount?.words() || 0}
            charCount={editor.storage.characterCount?.characters() || 0}
            pageCount={Math.ceil((editor.storage.characterCount?.characters() || 0) / 2000)}
            zoomLevel={zoomLevel}
            onZoomChange={editorFunctions.setZoomLevel}
          />

          {/* FileHandlers removed */}

          <AdvancedModals
            findOpen={findOpen}
            findQuery={findQuery}
            replaceQuery={replaceQuery}
            setFindOpen={setFindOpen}
            setFindQuery={setFindQuery}
            setReplaceQuery={setReplaceQuery}
            commentModal={commentModal}
            setCommentModal={setCommentModal}
            equationModalOpen={equationModalOpen}
            equationInput={equationInput}
            setEquationModalOpen={setEquationModalOpen}
            setEquationInput={setEquationInput}
            emojiOpen={emojiOpen}
            setEmojiOpen={setEmojiOpen}
            onFindReplace={editorFunctions.doFindReplace}
            onCommentAdd={advancedFeatures.addCommentToSelection}
            onEquationInsert={advancedFeatures.insertEquation}
            onEmojiInsert={editorFunctions.insertChar}
          />
        </div>
      </div>
    </div>
  );
}