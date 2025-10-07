import React from 'react';
import './EditorStyles.css';

const Footer = ({ editor, category, setCategory, isPopular, setIsPopular, showToast }) => {
  const nodeName = editor?.state.selection.$from.parent.type.name || "paragraph";

  const handleSaveDraft = () => {
    showToast("Saved draft (demo)");
  };

  const handlePublishBlog = () => {
    showToast("Published as Blog (demo)");
  };

  const handlePublishNews = () => {
    showToast("Published as News (demo)");
  };

  return (
    <div className="footer-actions">
      <div className="stats-panel">
        <div className="stat">Node: <span className="stat-value">{nodeName}</span></div>
        <div className="stat">Words: <span className="stat-value">{editor?.storage.characterCount.words() || 0}</span></div>
        <div className="stat">Chars: <span className="stat-value">{editor?.storage.characterCount.characters() || 0}</span></div>
      </div>

      <div className="action-buttons">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
          <option value="">Select Category</option>
          <option value="tech">Tech</option>
          <option value="life">Life</option>
          <option value="news">News</option>
        </select>

        <label className="popular-label">
          Popular
          <select value={isPopular ? "true" : "false"} onChange={(e) => setIsPopular(e.target.value === "true")} className="popular-select">
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </label>

        <button onClick={handleSaveDraft} className="save-draft-btn">Save Draft</button>
        <button onClick={handlePublishBlog} className="publish-blog-btn">Publish as Blog</button>
        <button onClick={handlePublishNews} className="publish-news-btn">Publish as News</button>
      </div>
    </div>
  );
};

export default Footer;