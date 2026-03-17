/**
 * Products Router
 *
 * GET    /api/products              — list all (supports ?category, ?featured, ?search, ?sort)
 * GET    /api/products/featured     — featured products shortcut
 * GET    /api/products/:id          — single product by _id or slug
 * POST   /api/products              — create product
 * PUT    /api/products/:id          — update product
 * DELETE /api/products/:id          — soft-delete (isActive = false)
 * POST   /api/products/:id/reviews  — add review
 */

const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// ── Static mock products (fallback when MongoDB is down) ──────
const MOCK = [
  {
    _id: 'mock-1',
    name: 'Smart Jump Rope Pro',
    slug: 'smart-jump-rope-pro',
    price: 2499,
    comparePrice: 3499,
    shortDesc: 'AI-powered jump rope with digital counter, calorie tracker & 360° ball bearings.',
    description: 'Take your cardio to the next level with the Smart Jump Rope Pro. An integrated LCD counter tracks jumps, calories and session time automatically. Ultra-smooth 360° precision ball bearings eliminate tangles so you can push past 1,000+ jumps per minute. Adjustable stainless-steel PVC cable fits heights from 5\'0"–6\'5". Syncs via Bluetooth to the PulseForge app for detailed session analytics.',
    image: null,
    category: 'smart-fitness',
    badge: 'bestseller',
    tags: ['jump rope', 'cardio', 'smart', 'tracking'],
    features: [
      'LCD display — jumps, calories, time',
      '360° precision ball-bearing system',
      'Adjustable cable: 2.5m – 3.5m',
      'Bluetooth 5.0 app sync',
      'Ergonomic ABS + rubber grip handles',
      'Battery: CR2032 (included)'
    ],
    specs: { Weight: '280 g', Cable: 'Stainless steel, PVC coated', Handle: 'ABS + Rubber', Battery: 'CR2032', Compatibility: 'iOS & Android' },
    rating: { average: 4.8, count: 312 },
    isFeatured: true,
    stock: 87
  },
  {
    _id: 'mock-2',
    name: 'Adjustable Dumbbell Set',
    slug: 'adjustable-dumbbell-set',
    price: 8999,
    comparePrice: 12999,
    shortDesc: 'Replace 15 dumbbells. Quick-dial 5 kg to 32 kg in 3 seconds.',
    description: 'The Adjustable Dumbbell Set is the cornerstone of any serious home gym. A single twist of the patented dial selects from 5 kg to 32 kg across 15 increments — no fumbling with loose plates. Industrial-grade steel plates, sealed in a rubberised urethane shell, sit flush in the custom storage tray to protect your floors. Lifetime structural warranty included.',
    image: null,
    category: 'strength-training',
    badge: 'bestseller',
    tags: ['dumbbells', 'strength', 'adjustable', 'home gym'],
    features: [
      '15 weight settings: 5 kg – 32 kg per dumbbell',
      'Patented single-dial quick-lock',
      'Industrial steel + urethane-coated plates',
      'Compact storage tray included',
      'Non-slip knurled grip',
      'Lifetime structural warranty'
    ],
    specs: { 'Weight Range': '5–32 kg / dumbbell', Material: 'Steel + Urethane', Dimensions: '40 × 18 × 20 cm', 'Max Load': '32 kg each', Warranty: 'Lifetime' },
    rating: { average: 4.9, count: 548 },
    isFeatured: true,
    stock: 34
  },
  {
    _id: 'mock-3',
    name: 'Power Resistance Band Kit',
    slug: 'power-resistance-band-kit',
    price: 1299,
    comparePrice: 1999,
    shortDesc: '5-band set from 10 to 150 lbs. Door anchor, handles & ankle straps included.',
    description: 'The Power Resistance Band Kit delivers a full-body workout anywhere — living room, hotel, or outdoor park. Five premium natural-latex bands stack from 10 lbs to 150 lbs of combined resistance. Heavy-duty carabiner clips, padded handles, a steel door anchor and neoprene ankle straps round out the kit. The carry bag keeps everything together.',
    image: null,
    category: 'home-workout',
    badge: 'sale',
    tags: ['resistance bands', 'latex', 'portable', 'full body'],
    features: [
      '5 bands: 10, 20, 30, 40, 50 lbs',
      'Stackable up to 150 lbs total',
      '100% natural latex — no snap risk',
      'Padded foam handles & ankle straps',
      'Heavy-duty steel door anchor',
      'Premium carry bag included'
    ],
    specs: { Resistance: '10–150 lbs (combined)', Material: 'Natural Latex', 'Bands Included': '5', Length: '120 cm each', Extras: 'Handles, Ankle Straps, Door Anchor, Bag' },
    rating: { average: 4.7, count: 891 },
    isFeatured: true,
    stock: 210
  },
  {
    _id: 'mock-4',
    name: 'Carbon Ab Roller Pro',
    slug: 'carbon-ab-roller-pro',
    price: 1799,
    comparePrice: 2499,
    shortDesc: 'Ultra-wide 20 cm wheel with auto-return spring. Beginner to advanced.',
    description: 'The Carbon Ab Roller Pro is engineered for real core development. The extra-wide 20 cm polypropylene wheel eliminates side-to-side wobble that plagues standard rollers. The auto-rebound spring assists the return phase — essential for beginners learning proper form. Dual non-slip foam handles reduce wrist strain during extended sets.',
    image: null,
    category: 'home-workout',
    badge: 'new',
    tags: ['ab roller', 'core', 'abs', 'strength'],
    features: [
      '20 cm ultra-wide stability wheel',
      'Auto-rebound spring assist',
      'Dual non-slip foam handles',
      'Thick knee pad included',
      'Non-slip rubber tread',
      'Max load: 150 kg'
    ],
    specs: { 'Wheel Width': '20 cm', 'Max Load': '150 kg', Material: 'ABS + NBR Foam + Steel axle', Includes: 'Knee Pad' },
    rating: { average: 4.6, count: 267 },
    isFeatured: true,
    stock: 145
  },
  {
    _id: 'mock-5',
    name: 'AI Posture Corrector',
    slug: 'ai-posture-corrector',
    price: 3299,
    comparePrice: 4999,
    shortDesc: 'Smart wearable vibrates on slouch detection. 15-day battery, app-connected.',
    description: 'Fix years of desk-job damage in weeks. The AI Posture Corrector mounts discreetly between your shoulder blades and uses bio-sensing accelerometers to detect forward slouch in real time. The moment your spine curves below your personalised threshold, a gentle haptic buzz reminds you to sit up straight. After 14 days users report a 73% reduction in slouching incidents. Pairs via Bluetooth 5.0 with the PulseForge app for streak tracking and weekly progress reports.',
    image: null,
    category: 'smart-fitness',
    badge: 'new',
    tags: ['posture', 'smart', 'wearable', 'back'],
    features: [
      'Bio-sensing accelerometer array',
      'Personalised slouch threshold',
      'Gentle haptic vibration feedback',
      'Bluetooth 5.0 + companion app',
      'USB-C rechargeable — 15-day battery',
      'Weight: 18 g — completely invisible under clothing'
    ],
    specs: { Weight: '18 g', Battery: '15 days (standby)', Charging: 'USB-C, 60 min full charge', Connectivity: 'Bluetooth 5.0', Compatibility: 'iOS 12+ / Android 8+' },
    rating: { average: 4.5, count: 183 },
    isFeatured: false,
    stock: 62
  }
];

let usingMock = false;

// ── Helper: filter mock products ──────────────────────────────
function filterMock({ category, featured, search }) {
  let results = MOCK.filter(p => p.stock > 0);
  if (category)              results = results.filter(p => p.category === category);
  if (featured === 'true')   results = results.filter(p => p.isFeatured);
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }
  return results;
}

// ── GET /api/products ─────────────────────────────────────────
router.get('/', async (req, res) => {
  const { category, featured, search, sort = 'default', limit = 20, page = 1 } = req.query;

  try {
    const query = { isActive: true };
    if (category)            query.category   = category;
    if (featured === 'true') query.isFeatured = true;
    if (search)              query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];

    const sortMap = {
      'price-asc':  { price: 1 },
      'price-desc': { price: -1 },
      'rating':     { 'rating.average': -1 },
      'newest':     { createdAt: -1 },
      default:      { isFeatured: -1, createdAt: -1 }
    };

    const skip  = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortMap[sort] || sortMap.default).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) }
    });
  } catch (err) {
    // Fallback to mock data
    const products = filterMock(req.query);
    res.json({ success: true, products, source: 'mock' });
  }
});

// ── GET /api/products/featured ────────────────────────────────
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(6).lean();
    res.json({ success: true, products });
  } catch {
    res.json({ success: true, products: MOCK.filter(p => p.isFeatured), source: 'mock' });
  }
});

// ── GET /api/products/:id (by _id or slug) ────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      $or: [{ _id: mongoose.isValidObjectId ? id : null }, { slug: id }],
      isActive: true
    }).lean().catch(() => Product.findOne({ slug: id, isActive: true }).lean());

    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch {
    const product = MOCK.find(p => p._id === id || p.slug === id);
    if (product) return res.json({ success: true, product, source: 'mock' });
    res.status(404).json({ success: false, error: 'Product not found' });
  }
});

// ── POST /api/products ────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ── PUT /api/products/:id ─────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/products/:id (soft delete) ────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/products/:id/reviews ───────────────────────────
router.post('/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    product.reviews.push({ name, rating, comment });
    await product.save();
    res.status(201).json({ success: true, review: product.reviews.at(-1), rating: product.rating });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Make mongoose accessible in route (needed for ObjectId check)
const mongoose = require('mongoose');

module.exports = router;
