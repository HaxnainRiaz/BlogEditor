import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', BlogSchema);



