// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <main>
      <div className="picture">
        <h2>Smash Your Limits!</h2>
        <p>Welcome to my personal portfolio showcasing my passion for Badminton.</p>
      </div>

      <section className="posts-section">
        <h3>Latest Posts</h3>
        {error && <div className="error-message">{error}</div>}
        
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to create a post!</p>
            <Link to="/create-post" className="create-post-link">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post._id} className="post-card">
                {post.image && (
                  <img 
                    src={`http://localhost:5000/uploads/${post.image}`} 
                    alt={post.title}
                    className="post-image"
                  />
                )}
                <div className="post-content">
                  <h4>{post.title}</h4>
                  <p className="post-excerpt">
                    {post.body.length > 150 
                      ? `${post.body.substring(0, 150)}...` 
                      : post.body}
                  </p>
                  <div className="post-meta">
                    <span className="post-author">
                      By {post.author?.name || 'Unknown'}
                    </span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {(user?._id === post.author?._id || user?.role === 'admin') && (
                    <Link to={`/edit-post/${post._id}`} className="edit-btn-small">
                      Edit
                    </Link>
                  )}
                  
                  <Link to={`/post/${post._id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card-container">
        <div className="card">
          <h4>My Journey</h4>
          <Link to="/about">Read more...</Link>
        </div>
        <div className="card">
          <h4>Resources</h4>
          <Link to="/contact">View links...</Link>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 All Rights Reserved. Greshamin Centino</p>
      </footer>
    </main>
  );
};

export default HomePage;