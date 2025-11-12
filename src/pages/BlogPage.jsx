// src/pages/BlogPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:4025';

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/blogs`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to load blogs');
      }
      const data = await res.json();
      setBlogs(data.blogs || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchBlogs();

    const handleRefresh = () => fetchBlogs();
    window.addEventListener('blog:created', handleRefresh);

    return () => {
      window.removeEventListener('blog:created', handleRefresh);
    };
  }, [fetchBlogs]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  const handleDeleteBlog = async (blogId) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog post?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiBase}/api/blogs/${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete blog');
      }
      toast.success('Blog deleted successfully');
      setSelectedBlog((prev) => (prev && (prev.id === blogId || prev._id === blogId) ? null : prev));
      fetchBlogs();
    } catch (err) {
      console.error('Failed to delete blog:', err);
      toast.error(err.message);
    }
  };

  if (selectedBlog) {
    return (
      <div className="blog-page">
        <ToastContainer />
        <div className="blog-container">
          <button className="back-button" onClick={handleBackToList}>
            ← Back to Blogs
          </button>
          
          <article className="blog-full">
            <header className="blog-full-header">
              <h1 className="blog-full-title">{selectedBlog.title}</h1>
              <div className="blog-meta">
                <span className="blog-author">
                  By{' '}
                  {selectedBlog.author?.username ||
                    selectedBlog.author?.email ||
                    'Anonymous'}
                </span>
                <span className="blog-date">
                  {formatDate(selectedBlog.createdAt || selectedBlog.updatedAt || selectedBlog.date)}
                </span>
              </div>
            </header>
            
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
            
            <div className="blog-actions">
              <button 
                className="delete-button"
                onClick={() => handleDeleteBlog(selectedBlog.id || selectedBlog._id)}
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
      <ToastContainer />
      <div className="blog-container">
        <header className="blog-header">
          <h1 className="blog-title">Our Blog</h1>
          <p className="blog-subtitle">Read the latest articles and stories</p>
        </header>

        {loading && (
          <div className="no-blogs">
            <h2>Loading blogs...</h2>
            <p>Please wait while we fetch the latest posts.</p>
          </div>
        )}

        {!loading && error && (
          <div className="no-blogs">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 ? (
          <div className="no-blogs">
            <h2>No blogs yet</h2>
            <p>Create your first blog post using the editor!</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map(blog => (
              <article key={blog.id || blog._id} className="blog-card">
                <div className="blog-card-content">
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <div className="blog-card-meta">
                    <span className="blog-card-author">
                      By {blog.author?.username || blog.author?.email || 'Anonymous'}
                    </span>
                    <span className="blog-card-date">
                      {formatDate(blog.createdAt || blog.updatedAt || blog.date)}
                    </span>
                  </div>
                  <div className="blog-card-excerpt">
                    {blog.excerpt ? (
                      <p>{blog.excerpt}{blog.excerpt.length >= 300 ? '…' : ''}</p>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            blog.content && blog.content.length > 150
                              ? `${blog.content.substring(0, 150)}…`
                              : blog.content,
                        }}
                      />
                    )}
                  </div>
                  <div className="blog-card-actions">
                    <button 
                      className="read-more-button"
                      onClick={() => handleReadMore(blog)}
                    >
                      Read More
                    </button>
                    <button 
                      className="delete-button-small"
                      onClick={() => handleDeleteBlog(blog.id || blog._id)}
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