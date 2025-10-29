// src/pages/BlogPage.js
import React, { useState, useEffect } from 'react';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    // Load blogs from localStorage on component mount
    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  const handleDeleteBlog = (blogId) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    
    if (selectedBlog && selectedBlog.id === blogId) {
      setSelectedBlog(null);
    }
  };

  if (selectedBlog) {
    return (
      <div className="blog-page">
        <div className="blog-container">
          <button className="back-button" onClick={handleBackToList}>
            ← Back to Blogs
          </button>
          
          <article className="blog-full">
            <header className="blog-full-header">
              <h1 className="blog-full-title">{selectedBlog.title}</h1>
              <div className="blog-meta">
                <span className="blog-author">By {selectedBlog.author}</span>
                <span className="blog-date">{formatDate(selectedBlog.date)}</span>
              </div>
            </header>
            
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
            
            <div className="blog-actions">
              <button 
                className="delete-button"
                onClick={() => handleDeleteBlog(selectedBlog.id)}
              >
                Delete Blog
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-container">
        <header className="blog-header">
          <h1 className="blog-title">Our Blog</h1>
          <p className="blog-subtitle">Read the latest articles and stories</p>
        </header>

        {blogs.length === 0 ? (
          <div className="no-blogs">
            <h2>No blogs yet</h2>
            <p>Create your first blog post using the editor!</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map(blog => (
              <article key={blog.id} className="blog-card">
                <div className="blog-card-content">
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <div className="blog-card-meta">
                    <span className="blog-card-author">By {blog.author}</span>
                    <span className="blog-card-date">{formatDate(blog.date)}</span>
                  </div>
                  <div 
                    className="blog-card-excerpt"
                    dangerouslySetInnerHTML={{ 
                      __html: blog.content.length > 150 
                        ? blog.content.substring(0, 150) + '...' 
                        : blog.content 
                    }}
                  />
                  <div className="blog-card-actions">
                    <button 
                      className="read-more-button"
                      onClick={() => handleReadMore(blog)}
                    >
                      Read More
                    </button>
                    <button 
                      className="delete-button-small"
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;