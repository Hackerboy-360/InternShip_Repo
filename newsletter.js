/**
 * Newsletter Router
 * POST /api/newsletter/subscribe
 */
const express     = require('express');
const router      = express.Router();
const subscribers = new Set(); // In production: store in DB

router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Valid email required' });
  }
  if (subscribers.has(email)) {
    return res.json({ success: true, message: "You're already subscribed!" });
  }
  subscribers.add(email);
  console.log(`📧 Newsletter subscriber: ${email} (total: ${subscribers.size})`);
  res.json({ success: true, message: 'Welcome to PulseForge! 🎉' });
});

module.exports = router;
