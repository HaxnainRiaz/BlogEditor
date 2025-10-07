import React from 'react';
import './EditorStyles.css';
const Modals = ({
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

  return (
    <>
      {findOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <h3 className="modal-title">Find & Replace</h3>
            <input value={findQuery} onChange={(e) => setFindQuery(e.target.value)} placeholder="Find" className="modal-input" />
            <input value={replaceQuery} onChange={(e) => setReplaceQuery(e.target.value)} placeholder="Replace with" className="modal-input" />
            <div className="modal-actions">
              <button onClick={() => setFindOpen(false)} className="modal-cancel">Cancel</button>
              <button onClick={handleFindReplace} className="modal-primary">Replace All</button>
            </div>
          </div>
        </div>
      )}

      {commentModal.open && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <h3 className="modal-title">Add Comment</h3>
            <textarea id="comment-text" placeholder="Enter your comment..." rows="4" className="modal-textarea" />
            <div className="modal-actions">
              <button onClick={() => setCommentModal({ open: false, selection: null })} className="modal-cancel">Cancel</button>
              <button onClick={handleCommentAdd} className="modal-primary">Add Comment</button>
            </div>
          </div>
        </div>
      )}

      {equationModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <h3 className="modal-title">Insert LaTeX Equation</h3>
            <input type="text" value={equationInput} onChange={(e) => setEquationInput(e.target.value)} placeholder="e.g. x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}" className="modal-input" />
            <div className="modal-actions">
              <button onClick={() => setEquationModalOpen(false)} className="modal-cancel">Cancel</button>
              <button onClick={handleEquationInsert} className="modal-primary">Insert Equation</button>
            </div>
          </div>
        </div>
      )}

      {emojiOpen && (
        <div className="emoji-picker">
          {['😀', '👍', '🔥', '🎉', '✨', '❤️', '🚀', '😊'].map((e) => (
            <button key={e} onClick={() => { onEmojiInsert(e); setEmojiOpen(false); }} className="emoji-btn">{e}</button>
          ))}
        </div>
      )}
    </>
  );
};

export default Modals;