/**
 * Product Model
 * MongoDB/Mongoose schema for PulseForge fitness products
 *
 * Fields: name, price, description, image, category
 * + Extended fields for rich product pages
 */

const mongoose = require('mongoose');

// ── Review Sub-Schema ─────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, required: true },
  verified: { type: Boolean, default: true },
  date:     { type: Date, default: Date.now }
});

// ── Product Schema ────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    // Core required fields (per assignment spec)
    name:        { type: String, required: true, trim: true, maxlength: 120 },
    price:       { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image:       { type: String, default: null },
    category:    {
      type: String,
      required: true,
      enum: ['strength-training', 'home-workout', 'smart-fitness', 'cardio', 'recovery']
    },

    // Extended fields for premium store experience
    slug:          { type: String, unique: true, lowercase: true },
    comparePrice:  { type: Number, default: null },  // For "was ₹X" display
    shortDesc:     { type: String, maxlength: 220 },
    images:        [String],
    features:      [String],
    specs:         { type: Map, of: String },
    tags:          [String],
    badge:         { type: String, enum: ['bestseller', 'new', 'sale', 'limited', null], default: null },
    stock:         { type: Number, default: 100 },
    sku:           String,
    weight:        Number,
    isFeatured:    { type: Boolean, default: false },
    isActive:      { type: Boolean, default: true },

    // Aggregated rating (updated when reviews are added)
    rating: {
      average: { type: Number, default: 0 },
      count:   { type: Number, default: 0 }
    },
    reviews: [reviewSchema]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// ── Pre-save Hook: generate slug & recalculate rating ─────────
productSchema.pre('save', function (next) {
  // Auto-slug from name
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  // Recalculate average rating
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count   = this.reviews.length;
  }
  next();
});

// ── Virtual: discount percentage ─────────────────────────────
productSchema.virtual('discountPercent').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

module.exports = mongoose.model('Product', productSchema);
