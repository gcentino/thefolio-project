require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();

// Connect to MongoDB
connectDB();

// ✅ FIXED CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://thefolio-project-3czf4viry-gcentinos-projects.vercel.app',
  'https://thefolio-project-zeta.vercel.app',
  'https://thefolio-project-6uwruzn3-gcentinos-projects.vercel.app' // ✅ ADD THIS
];

app.use(cors({
  origin: true,
  credentials: true
}));

// Handle preflight
app.options('*', cors());

// Middleware
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});