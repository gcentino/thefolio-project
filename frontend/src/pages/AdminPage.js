import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get('/admin/users');
        const postsRes = await API.get('/admin/posts');
        const contactsRes = await API.get('/contact');
        setUsers(usersRes.data);
        setPosts(postsRes.data);
        setContacts(contactsRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      // I-update ang listahan ng users base sa bagong status mula sa backend
      setUsers(users.map(u => u._id === id ? { ...u, status: data.user.status } : u));
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const removePost = async (id) => {
    if (window.confirm("Are you sure you want to remove this post?")) {
      try {
        await API.put(`/admin/posts/${id}/remove`);
        setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
      } catch (err) {
        alert("Failed to remove post");
      }
    }
  };

  const markMessageAsRead = async (id) => {
    try {
      await API.put(`/contact/${id}/read`);
      setContacts(contacts.map(c => c._id === id ? { ...c, status: 'read' } : c));
    } catch (err) {
      alert("Failed to mark message as read");
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await API.delete(`/contact/${id}`);
        setContacts(contacts.filter(c => c._id !== id));
      } catch (err) {
        alert("Failed to delete message");
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-color)' }}>Loading Admin Dashboard...</div>;

  return (
    <div style={{ padding: '40px 5%', color: 'var(--text-color)', minHeight: '100vh' }}>
      <h2 style={{ borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px' }}>🏸 Admin Dashboard</h2>
      
      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button 
          onClick={() => setTab('users')} 
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            background: tab === 'users' ? 'var(--primary-color)' : '#ccc', 
            color: 'white', border: 'none', borderRadius: '5px' 
          }}
        >
          Members ({users.length})
        </button>
        <button 
          onClick={() => setTab('posts')} 
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            background: tab === 'posts' ? 'var(--primary-color)' : '#ccc', 
            color: 'white', border: 'none', borderRadius: '5px' 
          }}
        >
          All Posts ({posts.length})
        </button>
        <button 
          onClick={() => setTab('messages')} 
          style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            background: tab === 'messages' ? 'var(--primary-color)' : '#ccc', 
            color: 'white', border: 'none', borderRadius: '5px' 
          }}
        >
          Messages ({contacts.length})
        </button>
      </div>

      {/* Users Table */}
      {tab === 'users' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <td style={tableCellStyle}>{u.name}</td>
                  <td style={tableCellStyle}>{u.email}</td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      background: u.status === 'active' ? '#d4edda' : '#f8d7da',
                      color: u.status === 'active' ? '#155724' : '#721c24'
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <button 
                      onClick={() => toggleStatus(u._id)}
                      style={{ 
                        padding: '6px 12px', 
                        cursor: 'pointer', 
                        background: u.status === 'active' ? '#dc3545' : '#28a745', 
                        color: 'white', border: 'none', borderRadius: '4px' 
                      }}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Posts Table */}
      {tab === 'posts' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                <th style={tableHeaderStyle}>Title</th>
                <th style={tableHeaderStyle}>Author</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <td style={tableCellStyle}>{p.title}</td>
                  <td style={tableCellStyle}>{p.author?.name || 'Unknown'}</td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      background: p.status === 'published' ? '#cce5ff' : '#e2e3e5',
                      color: p.status === 'published' ? '#004085' : '#383d41'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    {p.status === 'published' && (
                      <button 
                        onClick={() => removePost(p._id)}
                        style={{ padding: '6px 12px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Messages Table */}
      {tab === 'messages' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Message</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-color)' }}>
                    No messages yet
                  </td>
                </tr>
              ) : (
                contacts.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={tableCellStyle}>{c.name}</td>
                    <td style={tableCellStyle}>{c.email}</td>
                    <td style={{ ...tableCellStyle, maxWidth: '300px', wordWrap: 'break-word' }}>{c.message}</td>
                    <td style={tableCellStyle}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        background: c.status === 'new' ? '#fff3cd' : '#d1ecf1',
                        color: c.status === 'new' ? '#856404' : '#0c5460'
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      {c.status === 'new' && (
                        <button 
                          onClick={() => markMessageAsRead(c._id)}
                          style={{ padding: '6px 12px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', marginRight: '5px' }}
                        >
                          Mark Read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMessage(c._id)}
                        style={{ padding: '6px 12px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Reusable Styles
const tableHeaderStyle = { padding: '15px', border: '1px solid rgba(0,0,0,0.1)' };
const tableCellStyle = { padding: '12px', border: '1px solid rgba(0,0,0,0.05)' };

export default AdminPage;