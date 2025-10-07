import { useState, useCallback } from 'react';

export const useAdvancedFeatures = ({ 
  editor, 
  setToast,
  comments,
  setComments,
  trackChanges,
  setTrackChanges
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const showToast = useCallback((text, ms = 2000) => {
    setToast(text);
    setTimeout(() => setToast(null), ms);
  }, [setToast]);

  // Track changes toggle
  const toggleTrackChanges = useCallback(() => {
    setTrackChanges(!trackChanges);
    showToast(trackChanges ? "Track changes turned off" : "Track changes turned on");
  }, [trackChanges, setTrackChanges, showToast]);

  // Add comment to selection
  const addCommentToSelection = useCallback((text, setCommentModal) => {
    if (!text.trim()) {
      showToast("Please enter comment text");
      return;
    }

    if (!editor) return;

    const sel = editor.state.selection;
    if (sel.empty) {
      showToast("Select some text to comment on");
      return;
    }

    const id = `cmt-${Date.now()}`;
    const selectedText = editor.state.doc.textBetween(sel.from, sel.to, " ");
    const timestamp = new Date().toISOString();

    // Create a comment span with styling
    editor.chain().focus().setMark("textStyle", {
      style: "background: #fff3bf; border-bottom: 2px dotted #f59f00; padding: 2px 1px;"
    }).run();

    // Store comment
    setComments(prev => [...prev, {
      id,
      text,
      selection: selectedText,
      from: sel.from,
      to: sel.to,
      timestamp,
      resolved: false
    }]);

    setCommentModal({ open: false, selection: null });
    showToast("Comment added");
  }, [editor, setComments, showToast]);

  // Navigate to comment
  const navigateToComment = useCallback((comment) => {
    if (!editor) return;
    
    editor.chain().focus().setTextSelection(comment.from).run();
    // Scroll to the comment position
    const element = document.querySelector(`[data-comment-id="${comment.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editor]);

  // Resolve comment
  const resolveComment = useCallback((commentId) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ));
    showToast("Comment resolved");
  }, [setComments, showToast]);

  // Delete comment
  const deleteComment = useCallback((commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    showToast("Comment deleted");
  }, [setComments, showToast]);

  // Insert equation
  const insertEquation = useCallback((equationInput, setEquationInput, setEquationModalOpen) => {
    if (!equationInput.trim()) {
      showToast("Please enter equation");
      return;
    }

    if (!editor) return;

    editor.chain().focus().insertContent(
      `<span class="math-equation bg-gray-100 px-3 py-2 rounded border inline-block font-mono text-sm" data-latex="${equationInput.replace(/"/g, '&quot;')}">\\(${equationInput}\\)</span>`
    ).run();

    setEquationInput("");
    setEquationModalOpen(false);
    showToast("Equation inserted");
  }, [editor, showToast]);

  // Accept all changes
  const acceptAllChanges = useCallback(() => {
    if (!editor) return;
    
    const html = editor.getHTML().replace(/<span class="suggest">(.*?)<\/span>/g, "$1");
    editor.commands.setContent(html);
    setTrackChanges(false);
    setSuggestions([]);
    showToast("Accepted all changes");
  }, [editor, setTrackChanges, showToast]);

  // Reject all changes
  const rejectAllChanges = useCallback(() => {
    if (!editor) return;
    
    const html = editor.getHTML().replace(/<span class="suggest">.*?<\/span>/g, "");
    editor.commands.setContent(html);
    setTrackChanges(false);
    setSuggestions([]);
    showToast("Rejected all changes");
  }, [editor, setTrackChanges, showToast]);

  // Add suggestion (for track changes)
  const addSuggestion = useCallback((originalText, suggestedText) => {
    if (!editor) return;
    
    const id = `sug-${Date.now()}`;
    setSuggestions(prev => [...prev, {
      id,
      originalText,
      suggestedText,
      timestamp: new Date().toISOString(),
      accepted: false
    }]);

    // Replace the text with a suggestion span
    const currentSelection = editor.state.selection;
    editor.chain().focus().insertContent(
      `<span class="suggest bg-blue-100 border border-blue-300 px-1" data-suggestion-id="${id}">${suggestedText}</span>`
    ).run();

    showToast("Suggestion added");
  }, [editor, showToast]);

  // Accept suggestion
  const acceptSuggestion = useCallback((suggestionId) => {
    setSuggestions(prev => prev.map(sug => 
      sug.id === suggestionId ? { ...sug, accepted: true } : sug
    ));
    
    // Update the document
    const suggestion = suggestions.find(sug => sug.id === suggestionId);
    if (suggestion && editor) {
      const html = editor.getHTML().replace(
        `<span class="suggest" data-suggestion-id="${suggestionId}">${suggestion.suggestedText}</span>`,
        suggestion.suggestedText
      );
      editor.commands.setContent(html);
    }
    
    showToast("Suggestion accepted");
  }, [suggestions, editor, showToast]);

  // Reject suggestion
  const rejectSuggestion = useCallback((suggestionId) => {
    setSuggestions(prev => prev.map(sug => 
      sug.id === suggestionId ? { ...sug, accepted: false, rejected: true } : sug
    ));
    
    // Update the document
    const suggestion = suggestions.find(sug => sug.id === suggestionId);
    if (suggestion && editor) {
      const html = editor.getHTML().replace(
        `<span class="suggest" data-suggestion-id="${suggestionId}">${suggestion.suggestedText}</span>`,
        suggestion.originalText
      );
      editor.commands.setContent(html);
    }
    
    showToast("Suggestion rejected");
  }, [suggestions, editor, showToast]);

  // Word count statistics
  const getAdvancedStats = useCallback(() => {
    if (!editor) return null;
    
    const content = editor.getHTML();
    const wordCount = editor.storage.characterCount?.words() || 0;
    const charCount = editor.storage.characterCount?.characters() || 0;
    const paragraphCount = (content.match(/<p[^>]*>/g) || []).length;
    const commentCount = comments.length;
    const suggestionCount = suggestions.length;

    return {
      wordCount,
      charCount,
      paragraphCount,
      commentCount,
      suggestionCount,
      readingTime: Math.ceil(wordCount / 200), // 200 words per minute
      pages: Math.ceil(wordCount / 500) // 500 words per page
    };
  }, [editor, comments, suggestions]);

  return {
    trackChanges,
    toggleTrackChanges,
    comments,
    addCommentToSelection,
    navigateToComment,
    resolveComment,
    deleteComment,
    insertEquation,
    acceptAllChanges,
    rejectAllChanges,
    suggestions,
    addSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    getAdvancedStats
  };
};