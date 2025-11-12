const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');

const stripHtml = (html) =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

exports.listBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate('author', 'username email')
      .lean({ virtuals: true });

    res.json({
      blogs: blogs.map((blog) => ({
        ...blog,
        author: blog.author
          ? {
              id: blog.author._id?.toString?.() || blog.author.id,
              username: blog.author.username,
              email: blog.author.email,
            }
          : null,
      })),
    });
  } catch (err) {
    next(err);
  }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
      .lean({ virtuals: true });

    if (!blog || !blog.isPublished) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({
      ...blog,
      author: blog.author
        ? {
            id: blog.author._id?.toString?.() || blog.author.id,
            username: blog.author.username,
            email: blog.author.email,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { title, content, tags } = req.body;
    const excerpt = stripHtml(content).slice(0, 300);

    const blog = await Blog.create({
      title,
      content,
      tags,
      excerpt,
      author: req.user.id,
    });

    await blog.populate('author', 'username email');

    res.status(201).json({
      blog: {
        ...blog.toJSON(),
        author: blog.author
          ? {
              id: blog.author.id,
              username: blog.author.username,
              email: blog.author.email,
            }
          : null,
      },
      message: 'Blog posted successfully',
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this blog' });
    }

    const { title, content, tags, isPublished } = req.body;
    if (title) blog.title = title;
    if (typeof content === 'string') {
      blog.content = content;
      blog.excerpt = stripHtml(content).slice(0, 300);
    }
    if (Array.isArray(tags)) {
      blog.tags = tags;
    }
    if (typeof isPublished === 'boolean') {
      blog.isPublished = isPublished;
    }

    await blog.save();
    await blog.populate('author', 'username email');

    res.json({
      blog: {
        ...blog.toJSON(),
        author: {
          id: blog.author.id,
          username: blog.author.username,
          email: blog.author.email,
        },
      },
      message: 'Blog updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
};

