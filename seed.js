/**
 * PulseForge Database Seeder
 * ─────────────────────────
 * Usage: node seed.js
 *
 * Clears the products collection and inserts fresh demo data
 * including Smart Jump Rope, Adjustable Dumbbells, Resistance Bands,
 * Ab Roller, and Posture Corrector.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulseforge';

const products = [
  {
    name: 'Smart Jump Rope Pro',
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
    specs: new Map([
      ['Weight', '280 g'],
      ['Cable', 'Stainless steel, PVC coated'],
      ['Handle', 'ABS + Rubber'],
      ['Battery', 'CR2032'],
      ['Compatibility', 'iOS & Android']
    ]),
    isFeatured: true,
    stock: 87,
    reviews: [
      { name: 'Rahul S.', rating: 5, comment: 'Best jump rope I have ever used. Counter is spot-on, handles feel premium, and the app sync works flawlessly. My CrossFit sessions are a whole different level now!' },
      { name: 'Priya M.', rating: 5, comment: 'Bought this on a whim and now I can\'t imagine training without it. The calorie tracking is surprisingly accurate compared to my chest strap HR monitor.' },
      { name: 'Arjun K.', rating: 4, comment: 'Solid product. The ball bearings make a noticeable difference in smoothness. Knocked one star because the app onboarding could be clearer.' }
    ]
  },
  {
    name: 'Adjustable Dumbbell Set',
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
    specs: new Map([
      ['Weight Range', '5–32 kg / dumbbell'],
      ['Material', 'Steel + Urethane'],
      ['Dimensions', '40 × 18 × 20 cm'],
      ['Max Load', '32 kg each'],
      ['Warranty', 'Lifetime']
    ]),
    isFeatured: true,
    stock: 34,
    reviews: [
      { name: 'Vikram P.', rating: 5, comment: 'Replaced my entire dumbbell rack. The dial mechanism is buttery smooth and the build quality is clearly commercial grade.' },
      { name: 'Sneha R.', rating: 5, comment: 'Worth every single rupee. I\'ve been using these daily for 8 months and there\'s zero wobble, no paint chips, no issues.' }
    ]
  },
  {
    name: 'Power Resistance Band Kit',
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
    specs: new Map([
      ['Resistance', '10–150 lbs (combined)'],
      ['Material', 'Natural Latex'],
      ['Bands Included', '5'],
      ['Length', '120 cm each'],
      ['Extras', 'Handles, Ankle Straps, Door Anchor, Bag']
    ]),
    isFeatured: true,
    stock: 210,
    reviews: [
      { name: 'Ananya G.', rating: 5, comment: 'These bands are incredibly durable. Six months of daily use, travel included, and they\'re in perfect shape.' },
      { name: 'Kiran T.', rating: 4, comment: 'Excellent kit overall. The door anchor is very sturdy. Ankle straps could be slightly thicker for comfort.' }
    ]
  },
  {
    name: 'Carbon Ab Roller Pro',
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
    specs: new Map([
      ['Wheel Width', '20 cm'],
      ['Max Load', '150 kg'],
      ['Material', 'ABS + NBR Foam + Steel axle'],
      ['Includes', 'Knee Pad']
    ]),
    isFeatured: true,
    stock: 145,
    reviews: [
      { name: 'Rohit V.', rating: 5, comment: 'The wide wheel is a game-changer. Zero wobble even on deep extensions. My core strength has improved visibly in 6 weeks.' }
    ]
  },
  {
    name: 'AI Posture Corrector',
    price: 3299,
    comparePrice: 4999,
    shortDesc: 'Smart wearable vibrates on slouch detection. 15-day battery, app-connected.',
    description: 'Fix years of desk-job damage in weeks. The AI Posture Corrector mounts discreetly between your shoulder blades and uses bio-sensing accelerometers to detect forward slouch in real time. The moment your spine curves below your personalised threshold, a gentle haptic buzz reminds you to sit up straight. After 14 days users report a 73% reduction in slouching incidents.',
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
      'Weight: 18 g — invisible under clothing'
    ],
    specs: new Map([
      ['Weight', '18 g'],
      ['Battery', '15 days (standby)'],
      ['Charging', 'USB-C, 60 min full charge'],
      ['Connectivity', 'Bluetooth 5.0'],
      ['Compatibility', 'iOS 12+ / Android 8+']
    ]),
    isFeatured: false,
    stock: 62,
    reviews: [
      { name: 'Deepika N.', rating: 5, comment: 'Three weeks in and my colleagues are literally commenting on how my posture has improved. The vibration feedback is subtle but very effective.' }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️   Cleared existing products');

    const saved = await Product.insertMany(products);
    console.log(`✅  Seeded ${saved.length} products:`);
    saved.forEach(p => console.log(`    → [${p.category}] ${p.name}  ₹${p.price}  (${p._id})`));

    console.log('\n🎉  Database ready. Run  npm start  to launch the server.');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
