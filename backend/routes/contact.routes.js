// backend/routes/contact.routes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Submit a contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ message: 'Message received successfully', contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contact messages (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark a contact message as read (admin only)
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!contact) return res.status(404).json({ message: 'Contact message not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a contact message (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact message not found' });
    res.json({ message: 'Contact message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
