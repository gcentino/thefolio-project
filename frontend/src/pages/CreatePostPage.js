// frontend/src/pages/CreatePostPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);
    
    try {
      await API.post('/posts', fd);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/home`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <div className="create-post-header">
          <h1>✍️ Write a New Post</h1>
          <p>Share your thoughts and stories with the community</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Post published successfully! 🎉 Redirecting...</div>}
        
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
            <label>Cover Image (Optional)</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="image-input"
              />
              <label htmlFor="image" className="image-label">
                {image ? image.name : '📷 Choose an image'}
              </label>
              {image && (
                <p className="image-preview-text">Selected: {image.name}</p>
              )}
            </div>
          </div>
          
          <button type="submit" className="publish-btn" disabled={loading}>
            {loading ? 'Publishing...' : '📢 Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;