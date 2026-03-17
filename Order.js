/**
 * Order Model
 * Stores cart/checkout submissions
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:        String,
  price:       Number,
  quantity:    { type: Number, default: 1 },
  image:       String
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  customer: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   String,
    address: {
      street:  String,
      city:    String,
      state:   String,
      zip:     String,
      country: { type: String, default: 'India' }
    }
  },
  subtotal:      { type: Number, required: true },
  shippingCost:  { type: Number, default: 0 },
  total:         { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: { type: String, default: 'cod' },
  notes:         String,
  orderNumber:   { type: String, unique: true }
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'PF-' + Date.now().toString(36).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
