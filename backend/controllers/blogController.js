import Blog from '../models/Blog.js';

const stripHtml = (html = '') =>
  html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const formatAuthor = (user = null) => {
  if (!user) return null;
  const id =
    user._id?.toString?.() ||
    user.id?.toString?.() ||
    (typeof user === 'string' ? user : null);

  return {
    id,
    username: user.username,
    email: user.email,
  };
};

const formatBlog = (blog) => {
  if (!blog) return null;
  const base = blog.toObject ? blog.toObject() : blog;
  const author = formatAuthor(base.user);

  return {
    id: base._id?.toString?.() || base.id,
    title: base.title,
    content: base.content,
    tags: base.tags ?? [],
    excerpt: base.excerpt ?? stripHtml(base.content).slice(0, 300),
    isPublished: base.isPublished ?? true,
    author,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
  };
};

export const listBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      blogs: blogs.map((blog) => formatBlog(blog)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.userId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      blogs: blogs.map((blog) => formatBlog(blog)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const blog = await Blog.create({
      title,
      content,
      tags,
      excerpt: stripHtml(content).slice(0, 300),
      user: req.userId,
    });

    await blog.populate('user', 'username email');

    res.status(201).json({
      blog: formatBlog(blog),
      message: 'Blog created successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (typeof updates.content === 'string') {
      updates.excerpt = stripHtml(updates.content).slice(0, 300);
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    ).populate('user', 'username email');

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.json({
      blog: formatBlog(blog),
      message: 'Blog updated successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

