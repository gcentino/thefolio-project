// frontend/src/pages/EditPostPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setTitle(data.title);
      setBody(data.body);
      setCurrentImage(data.image || '');
      setLoading(false);
    } catch (err) {
      setError('Post not found');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) {
      formData.append('image', image);
    }

    try {
      await API.put(`/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setSubmitting(false);
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

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <div className="create-post-header">
          <h1>✏️ Edit Post</h1>
          <p>Update your story</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an eye-catching title..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body">Content</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your story here..."
              rows="12"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Cover Image</label>
            {currentImage && (
              <div style={{ marginBottom: '10px' }}>
                <p>Current image:</p>
                <img 
                  src={`http://localhost:5000/uploads/${currentImage}`} 
                  alt="Current" 
                  style={{ width: '100px', borderRadius: '8px' }}
                />
              </div>
            )}
            <div className="image-upload-area">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="image-input"
              />
              <label htmlFor="image" className="image-label">
                {image ? image.name : '📷 Choose a new image (optional)'}
              </label>
            </div>
          </div>
          
          <button type="submit" className="publish-btn" disabled={submitting}>
            {submitting ? 'Updating...' : '💾 Update Post'}
          </button>
          
          <Link to={`/post/${id}`} style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: 'var(--text-color)' }}>
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;