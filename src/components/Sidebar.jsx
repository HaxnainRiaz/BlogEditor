import React from 'react';
import { MessageSquare, History, Settings, FileSearch } from 'lucide-react';

const Sidebar = ({
  editor,
  comments,
  trackChanges,
  onCommentClick,
  onAcceptAllChanges,
  onRejectAllChanges
}) => {
  const [activeTab, setActiveTab] = React.useState('comments');

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button 
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <MessageSquare size={16} />
          <span>Comments</span>
          {comments.length > 0 && <span className="badge">{comments.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'changes' ? 'active' : ''}`}
          onClick={() => setActiveTab('changes')}
        >
          <History size={16} />
          <span>Track Changes</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'navigation' ? 'active' : ''}`}
          onClick={() => setActiveTab('navigation')}
        >
          <FileSearch size={16} />
          <span>Navigation</span>
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'comments' && (
          <div className="sidebar-section">
            <h3 className="sidebar-title">Comments</h3>
            {comments.length === 0 ? (
              <p className="empty-state">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="comment-item"
                  onClick={() => onCommentClick(comment)}
                >
                  <div className="comment-selection">"{comment.selection}"</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-meta">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'changes' && (
          <div className="sidebar-section">
            <h3 className="sidebar-title">Track Changes</h3>
            <div className="change-controls">
              <p>Track Changes is {trackChanges ? 'ON' : 'OFF'}</p>
              {trackChanges && (
                <div className="change-actions">
                  <button 
                    className="action-btn primary"
                    onClick={onAcceptAllChanges}
                  >
                    Accept All
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={onRejectAllChanges}
                  >
                    Reject All
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'navigation' && (
          <div className="sidebar-section">
            <h3 className="sidebar-title">Document Navigation</h3>
            <div className="navigation-list">
              <button className="nav-item">Go to Page...</button>
              <button className="nav-item">Find Next Change</button>
              <button className="nav-item">Previous Comment</button>
              <button className="nav-item">Next Comment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;