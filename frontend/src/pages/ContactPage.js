import React, { useState } from 'react';
import API from '../api/axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim() === "" || formData.email.trim() === "" || formData.message.trim() === "") {
      alert("Please provide your name, email, and message.");
    } else {
      setLoading(true);
      try {
        await API.post('/contact', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } catch (err) {
        alert("Failed to send message. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    /* 1. Tinanggal ang padding dito para makasagad ang footer sa ilalim at gilid */
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Modal logic */}
      {submitted && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: 'var(--card-bg)', color: 'var(--text-color)', padding: '30px', borderRadius: '15px', border: '2px solid var(--secondary-color)' }}>
            <h2 style={{ color: 'var(--secondary-color)' }}>Message Sent!</h2>
            <p>Salamat! mwuah 🏸</p>
            <button onClick={() => setSubmitted(false)} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Got it!</button>
          </div>
        </div>
      )}

      {/* 2. Dito natin inilipat ang maxWidth at padding para ang CONTENT lang ang maipit, hindi ang footer */}
      <section style={{ flex: '1', padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--text-color)' }}>Get in Touch</h2>
        
        <form onSubmit={handleSubmit} style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-color)' }}>Name:</label>
          <input 
            type="text" name="name" value={formData.name} onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', background: 'var(--light-bg)', color: 'var(--text-color)' }} 
          />
          
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-color)' }}>Email:</label>
          <input 
            type="email" name="email" value={formData.email} onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', background: 'var(--light-bg)', color: 'var(--text-color)' }} 
          />
          
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-color)' }}>Message:</label>
          <textarea 
            name="message" rows="4" value={formData.message} onChange={handleChange}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', background: 'var(--light-bg)', color: 'var(--text-color)' }}
          ></textarea>
          
          <button type="submit" disabled={loading} style={{ background: loading ? '#ccc' : 'var(--primary-color)', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--text-color)' }}>Badminton Resources</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--card-bg)', color: 'var(--text-color)', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '15px', border: '1px solid #444' }}>Resource Name</th>
              <th style={{ padding: '15px', border: '1px solid #444' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '15px', border: '1px solid #444' }}>
                <a href="https://bwfbadminton.com/" target="_blank" rel="noreferrer" 
                   style={{ color: 'var(--secondary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                   BWF Official
                </a>
              </td>
              <td style={{ padding: '15px', border: '1px solid #444', color: 'var(--text-color)' }}>
                The governing body for international badminton.
              </td>
            </tr>
            <tr>
              <td style={{ padding: '15px', border: '1px solid #444' }}>
                <a href="https://www.badmintoncentral.com/forums/" target="_blank" rel="noreferrer" 
                   style={{ color: 'var(--secondary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                   Badminton Central
                </a>
              </td>
              <td style={{ padding: '15px', border: '1px solid #444', color: 'var(--text-color)' }}>
                Forum for racket reviews and technique tips.
              </td>
            </tr>
            <tr>
              <td style={{ padding: '15px', border: '1px solid #444' }}>
                <a href="https://www.youtube.com/@BWF" target="_blank" rel="noreferrer" 
                   style={{ color: 'var(--secondary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                   World of Badminton
                </a>
              </td>
              <td style={{ padding: '15px', border: '1px solid #444', color: 'var(--text-color)' }}>
                YouTube channel for professional match highlights.
              </td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ marginTop: '50px', fontSize: '24px', fontWeight: 'bold', color: 'var(--text-color)' }}>Our Home Court</h2>
        <div style={{ marginTop: '15px', textAlign: 'center', marginBottom: '40px' }}>
           <img 
             src="/picture/googleMap.png" 
             alt="map" 
             style={{ maxWidth: '100%', borderRadius: '10px' }} 
           />
        </div>
      </section>

      {/* 3. SLIM FOOTER: Sagad na ito dahil wala na siyang "ipit" mula sa parent container */}
      <footer style={{ 
        background: 'var(--footer-bg)', 
        color: 'white', 
        textAlign: 'center', 
        padding: '15px 0',    /* Same slim padding sa Register Page */
        width: '100%',        /* 100% na lang dahil labas na siya sa section */
        marginTop: 'auto'     /* Itutulak siya sa pinaka-bottom */
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>&copy; 2026 Greshamin Centino</p>
      </footer>
    </div>
  );
};

export default ContactPage;