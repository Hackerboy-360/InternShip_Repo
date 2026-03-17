/**
 * Contact Router
 * POST /api/contact
 */
const express = require('express');
const router  = express.Router();

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }
  // Production: send via SendGrid/Nodemailer
  console.log(`📩 Contact: [${subject}] from ${name} <${email}>`);
  res.json({ success: true, message: "Message received! We'll reply within 24 hours." });
});

module.exports = router;
