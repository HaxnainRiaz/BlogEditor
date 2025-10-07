  import React from 'react';

  const AdvancedModals = ({
    findOpen,
    findQuery,
    replaceQuery,
    setFindOpen,
    setFindQuery,
    setReplaceQuery,
    commentModal,
    setCommentModal,
    equationModalOpen,
    equationInput,
    setEquationModalOpen,
    setEquationInput,
    emojiOpen,
    setEmojiOpen,
    onFindReplace,
    onCommentAdd,
    onEquationInsert,
    onEmojiInsert
  }) => {
    const handleFindReplace = () => {
      onFindReplace(findQuery, replaceQuery, setFindOpen, setFindQuery, setReplaceQuery);
    };

    const handleCommentAdd = () => {
      const commentText = document.getElementById('comment-text')?.value || '';
      onCommentAdd(commentText, setCommentModal);
    };

    const handleEquationInsert = () => {
      onEquationInsert(equationInput, setEquationInput, setEquationModalOpen);
    };

    const commonEmojis = ['😀', '😂', '❤️', '👍', '🔥', '🎉', '✨', '📚', '💡', '🚀'];

    return (
      <>
        {/* Find & Replace Modal */}
        {findOpen && (
          <div className="modal-backdrop">
            <div className="modal-panel">
              <h3 className="modal-title">Find and Replace</h3>
              <input 
                value={findQuery} 
                onChange={(e) => setFindQuery(e.target.value)} 
                placeholder="Find what..." 
                className="modal-input" 
              />
              <input 
                value={replaceQuery} 
                onChange={(e) => setReplaceQuery(e.target.value)} 
                placeholder="Replace with..." 
                className="modal-input" 
              />
              <div className="modal-options">
                <label>
                  <input type="checkbox" /> Match case
                </label>
                <label>
                  <input type="checkbox" /> Whole words only
                </label>
              </div>
              <div className="modal-actions">
                <button onClick={() => setFindOpen(false)} className="modal-cancel">Cancel</button>
                <button onClick={handleFindReplace} className="modal-primary">Replace All</button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Modal */}
        {commentModal.open && (
          <div className="modal-backdrop">
            <div className="modal-panel">
              <h3 className="modal-title">Add Comment</h3>
              <p className="modal-subtitle">Selected text: "{commentModal.selection}"</p>
              <textarea 
                id="comment-text" 
                placeholder="Enter your comment..." 
                rows="4" 
                className="modal-textarea" 
              />
              <div className="modal-actions">
                <button onClick={() => setCommentModal({ open: false, selection: null })} className="modal-cancel">Cancel</button>
                <button onClick={handleCommentAdd} className="modal-primary">Add Comment</button>
              </div>
            </div>
          </div>
        )}

        {/* Equation Modal */}
        {equationModalOpen && (
          <div className="modal-backdrop">
            <div className="modal-panel">
              <h3 className="modal-title">Insert Equation</h3>
              <input 
                type="text" 
                value={equationInput} 
                onChange={(e) => setEquationInput(e.target.value)} 
                placeholder="e.g., x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}" 
                className="modal-input" 
              />
              <div className="equation-preview">
                <p>Preview: {equationInput || 'Enter LaTeX equation'}</p>
              </div>
              <div className="modal-actions">
                <button onClick={() => setEquationModalOpen(false)} className="modal-cancel">Cancel</button>
                <button onClick={handleEquationInsert} className="modal-primary">Insert Equation</button>
              </div>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {emojiOpen && (
          <div className="emoji-picker-modal">
            <div className="emoji-panel">
              <h4>Insert Emoji</h4>
              <div className="emoji-grid">
                {commonEmojis.map((emoji) => (
                  <button 
                    key={emoji} 
                    onClick={() => { onEmojiInsert(emoji); setEmojiOpen(false); }} 
                    className="emoji-btn"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button onClick={() => setEmojiOpen(false)} className="modal-cancel">Close</button>
            </div>
          </div>
        )}
      </>
    );
  };

  export default AdvancedModals;