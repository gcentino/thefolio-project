// frontend/src/pages/PostDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError('Post not found');
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/comments/${id}`);
        setComments(data);
      } catch (err) {
        console.error('Failed to fetch comments');
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!commentBody.trim()) {
      alert('Please write a comment');
      return;
    }
    
    setSubmitting(true);
    try {
      await API.post(`/comments/${id}`, { body: commentBody });
      setCommentBody('');
      const { data } = await API.get(`/comments/${id}`);
      setComments(data);
    } catch (err) {
      console.error('Comment error:', err);
      alert(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      const { data } = await API.get(`/comments/${id}`);
      setComments(data);
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <h2>Post not found</h2>
        <Link to="/home">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        {post.image && (
          <img 
            src={`http://localhost:5000/uploads/${post.image}`} 
            alt={post.title}
            className="post-detail-image"
          />
        )}
        
        <div className="post-detail-content">
          <h1>{post.title}</h1>
          
          <div className="post-detail-meta">
            <span>By {post.author?.name || 'Unknown'}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          
          {(user?._id === post.author?._id || user?.role === 'admin') && (
            <div style={{ marginBottom: '20px' }}>
              <Link to={`/edit-post/${post._id}`} className="edit-post-btn">
                ✏️ Edit Post
              </Link>
            </div>
          )}
          
          <div className="post-detail-body">
            {post.body}
          </div>
          
          <Link to="/home" className="back-home-btn">
            ← Back to Home
          </Link>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                required
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="login-to-comment">
              <Link to="/login">Login</Link> to leave a comment
            </p>
          )}
          
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment-card">
                  <div className="comment-header">
                    <strong>{comment.author?.name || 'Unknown'}</strong>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="comment-body">{comment.body}</p>
                  {(user?.role === 'admin' || user?._id === comment.author?._id) && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      className="delete-comment-btn"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;