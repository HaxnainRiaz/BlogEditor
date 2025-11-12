const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const rawOrigins = process.env.CLIENT_URL || 'http://localhost:3000';
const allowedOrigins = rawOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;

