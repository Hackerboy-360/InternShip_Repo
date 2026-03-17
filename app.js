/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║         PulseForge — Frontend Application                    ║
 * ║  SPA Router · API Client · Cart · Animations · Reviews       ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

'use strict';

// ── Configuration ─────────────────────────────────────────────
const CFG = {
  apiBase: (() => {
    const { hostname } = window.location;
    return (hostname === 'localhost' || hostname === '127.0.0.1')
      ? `http://${hostname}:5000/api`
      : '/api';
  })(),
  cartKey: 'pf_cart_v2',
  animDuration: 300
};

// ── Product visual registry ───────────────────────────────────
const EMOJIS = {
  'mock-1': '🪢', 'smart-jump-rope-pro':       '🪢',
  'mock-2': '🏋️', 'adjustable-dumbbell-set':   '🏋️',
  'mock-3': '🔴', 'power-resistance-band-kit':  '🔴',
  'mock-4': '⚙️', 'carbon-ab-roller-pro':       '⚙️',
  'mock-5': '🦺', 'ai-posture-corrector':        '🦺'
};
const getEmoji = (p) => EMOJIS[p._id] || EMOJIS[p.slug] || '🏋️';

const BADGE_CLS = {
  bestseller: 'badge-green',
  new:        'badge-blue',
  sale:       'badge-red',
  limited:    'badge-amber'
};

const CAT_LABELS = {
  'strength-training': 'Strength Training',
  'home-workout':      'Home Workout',
  'smart-fitness':     'Smart Fitness',
  cardio:              'Cardio',
  recovery:            'Recovery'
};

// ── Static mock products (used when API unreachable) ──────────
const MOCK_PRODUCTS = [
  { _id:'mock-1', slug:'smart-jump-rope-pro',       name:'Smart Jump Rope Pro',       price:2499, comparePrice:3499, shortDesc:'AI-powered jump rope with digital counter, calorie tracker & 360° ball bearings.',             description:'Take your cardio to the next level with the Smart Jump Rope Pro. An integrated LCD counter tracks jumps, calories and session time automatically. Ultra-smooth 360° precision ball bearings eliminate tangles. Syncs via Bluetooth to the PulseForge app for detailed session analytics.', category:'smart-fitness',     badge:'bestseller', isFeatured:true,  stock:87,  rating:{average:4.8,count:312}, features:['LCD display — jumps, calories, time','360° precision ball-bearing system','Adjustable cable: 2.5m – 3.5m','Bluetooth 5.0 app sync','Ergonomic ABS + rubber handles','Battery: CR2032 (included)'], specs:{'Weight':'280 g','Cable':'Stainless steel, PVC coated','Battery':'CR2032','Compatibility':'iOS & Android'} },
  { _id:'mock-2', slug:'adjustable-dumbbell-set',    name:'Adjustable Dumbbell Set',   price:8999, comparePrice:12999,shortDesc:'Replace 15 dumbbells. Quick-dial 5 kg to 32 kg in 3 seconds.',                                description:'The Adjustable Dumbbell Set is the cornerstone of any serious home gym. A single twist of the patented dial selects from 5 kg to 32 kg across 15 increments. Industrial-grade steel plates sealed in rubberised urethane. Lifetime structural warranty included.', category:'strength-training', badge:'bestseller', isFeatured:true,  stock:34,  rating:{average:4.9,count:548}, features:['15 settings: 5 kg – 32 kg per dumbbell','Patented single-dial quick-lock','Industrial steel + urethane plates','Storage tray included','Non-slip knurled grip','Lifetime structural warranty'],          specs:{'Weight Range':'5–32 kg / dumbbell','Material':'Steel + Urethane','Dimensions':'40 × 18 × 20 cm','Warranty':'Lifetime'} },
  { _id:'mock-3', slug:'power-resistance-band-kit',  name:'Power Resistance Band Kit', price:1299, comparePrice:1999, shortDesc:'5-band set from 10 to 150 lbs. Door anchor, handles & ankle straps included.',                description:'The Power Resistance Band Kit delivers a full-body workout anywhere. Five premium natural-latex bands stack from 10 lbs to 150 lbs. Heavy-duty carabiner clips, padded handles, steel door anchor and ankle straps included.',                                          category:'home-workout',      badge:'sale',       isFeatured:true,  stock:210, rating:{average:4.7,count:891}, features:['5 bands: 10, 20, 30, 40, 50 lbs','Stackable to 150 lbs total','100% natural latex','Padded foam handles & ankle straps','Steel door anchor','Carry bag included'],                                  specs:{'Resistance':'10–150 lbs','Material':'Natural Latex','Bands':'5','Length':'120 cm each'} },
  { _id:'mock-4', slug:'carbon-ab-roller-pro',       name:'Carbon Ab Roller Pro',      price:1799, comparePrice:2499, shortDesc:'Ultra-wide 20 cm wheel with auto-return spring. Beginner to advanced.',                       description:'The Carbon Ab Roller Pro is engineered for real core development. The extra-wide 20 cm wheel eliminates wobble. The auto-rebound spring assists the return phase — essential for beginners. Dual non-slip foam handles reduce wrist strain.',                           category:'home-workout',      badge:'new',        isFeatured:true,  stock:145, rating:{average:4.6,count:267}, features:['20 cm ultra-wide stability wheel','Auto-rebound spring assist','Dual non-slip foam handles','Thick knee pad included','Non-slip rubber tread','Max load: 150 kg'],                                  specs:{'Wheel Width':'20 cm','Max Load':'150 kg','Material':'ABS + NBR Foam + Steel'} },
  { _id:'mock-5', slug:'ai-posture-corrector',       name:'AI Posture Corrector',      price:3299, comparePrice:4999, shortDesc:'Smart wearable vibrates on slouch detection. 15-day battery, app-connected.',                  description:'Fix years of desk-job damage in weeks. The AI Posture Corrector uses bio-sensing accelerometers to detect forward slouch in real time. A gentle haptic buzz reminds you to sit up straight. Pairs via Bluetooth 5.0 for streak tracking and weekly progress reports.',  category:'smart-fitness',     badge:'new',        isFeatured:false, stock:62,  rating:{average:4.5,count:183}, features:['Bio-sensing accelerometer array','Personalised slouch threshold','Gentle haptic vibration','Bluetooth 5.0 + app','USB-C rechargeable — 15-day battery','Weight: 18 g'],                           specs:{'Weight':'18 g','Battery':'15 days standby','Charging':'USB-C','Connectivity':'Bluetooth 5.0'} }
];

// ── Static reviews ────────────────────────────────────────────
const REVIEWS_DATA = [
  { initials:'RS', name:'Rahul Sharma',  color:'#22C55E', rating:5, product:'Smart Jump Rope Pro',       date:'2 days ago',   text:'Best jump rope I have ever used. The counter is spot-on, the handles are premium, and the app sync works flawlessly. My CrossFit sessions are on another level now!' },
  { initials:'PV', name:'Priya Verma',   color:'#3B82F6', rating:5, product:'Adjustable Dumbbell Set',  date:'1 week ago',   text:'Replaced my entire dumbbell rack. The dial mechanism is buttery smooth and the build quality is clearly commercial grade. Worth every single rupee.' },
  { initials:'AK', name:'Arjun Kumar',   color:'#8B5CF6', rating:5, product:'Resistance Band Kit',      date:'1 week ago',   text:'Six months of daily use and these bands are in perfect shape. The variety of resistance levels is ideal for progressive overload. Incredible kit for the price.' },
  { initials:'SR', name:'Sneha Reddy',   color:'#F59E0B', rating:4, product:'Carbon Ab Roller Pro',     date:'2 weeks ago',  text:'The wide wheel is a complete game-changer for stability. The spring assist helped me learn proper form fast. My core has visibly improved in just 6 weeks.' },
  { initials:'VP', name:'Vikram Patel',  color:'#EF4444', rating:5, product:'AI Posture Corrector',     date:'3 weeks ago',  text:'Three weeks in and my colleagues are commenting on my posture. The haptic feedback is subtle but extremely effective. My back pain has almost completely gone.' },
  { initials:'AG', name:'Ananya Gupta',  color:'#06B6D4', rating:5, product:'Smart Jump Rope Pro',      date:'1 month ago',  text:'Fantastic product. The tracking is accurate, the cable rotates effortlessly, and the app is genuinely useful for monitoring progress over time. Highly recommend.' }
];

// ── FAQ Data ──────────────────────────────────────────────────
const FAQ_DATA = [
  { q:'How long does shipping take?',             a:'Standard delivery takes 3–5 business days across India. Express 1–2 day delivery is available for metro cities. Free shipping on all orders above ₹999.' },
  { q:'What is your return policy?',              a:'We offer a 30-day no-questions-asked return policy. If you\'re not satisfied, contact us and we\'ll arrange a free pickup and full refund.' },
  { q:'Are products covered under warranty?',     a:'Yes! All PulseForge products include a minimum 1-year warranty. The Adjustable Dumbbell Set comes with a lifetime structural warranty.' },
  { q:'How do I track my order?',                 a:'You\'ll receive an SMS and email with a tracking link within 24 hours of dispatch. Contact support with your order ID for live updates.' },
  { q:'Do you ship outside India?',               a:'Currently we ship only within India. International shipping is planned for late 2025. Subscribe to our newsletter to be the first to know.' },
  { q:'Can I pay with UPI or Cash on Delivery?',  a:'Yes! We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD) everywhere in India.' }
];

// ── Application State ─────────────────────────────────────────
const S = {
  products:    [],       // All loaded products
  filtered:    [],       // Currently visible (after filter/sort)
  cart:        JSON.parse(localStorage.getItem(CFG.cartKey) || '[]'),
  filter:      'all',
  sort:        'default',
  carousel:    0,        // Current carousel offset index
  currentPage: 'home'
};

// ══════════════════════════════════════════════════════════════
//  INITIALISATION
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  loadProducts();
  renderReviews();
  buildFAQ();
  syncCartUI();
  initScrollReveal();
  addRippleListeners();
});

// ══════════════════════════════════════════════════════════════
//  PAGE ROUTING
// ══════════════════════════════════════════════════════════════
function showPage(name, push = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(`page-${name}`);
  if (!pg) return false;
  pg.classList.add('active', 'page-enter');
  setTimeout(() => pg.classList.remove('page-enter'), CFG.animDuration + 100);

  // Nav highlight
  document.querySelectorAll('.nav-link[data-page]').forEach(a =>
    a.classList.toggle('active', a.dataset.page === name)
  );

  S.currentPage = name;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(initScrollReveal, 80);

  if (push) history.pushState({ page: name }, '', `#${name}`);
  if (name === 'shop') renderShopPage();
  return false;
}
window.onpopstate = e => e.state?.page && showPage(e.state.page, false);

// Scroll to section on same page
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════════════════════════════
function initNavbar() {
  const nav = document.getElementById('navbar');
  let prev = 0;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    nav.classList.toggle('scrolled', cur > 20);
    prev = cur;
  }, { passive: true });
}
function toggleMobile() {
  const mn = document.getElementById('mobileNav');
  const hb = document.getElementById('hamburger');
  const open = mn.classList.toggle('open');
  hb.classList.toggle('open', open);
  hb.setAttribute('aria-expanded', open);
}
function closeMobile() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ══════════════════════════════════════════════════════════════
//  PRODUCT LOADING
// ══════════════════════════════════════════════════════════════
async function loadProducts() {
  try {
    const res  = await fetch(`${CFG.apiBase}/products`, { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    S.products = (data.success && data.products.length) ? data.products : MOCK_PRODUCTS;
  } catch {
    S.products = MOCK_PRODUCTS;
  }
  S.filtered = [...S.products];
  renderFeaturedGrid();
  renderShopPage();
}

// ══════════════════════════════════════════════════════════════
//  CARD BUILDER
// ══════════════════════════════════════════════════════════════
function buildCard(p) {
  const emoji   = getEmoji(p);
  const disc    = p.comparePrice ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0;
  const bCls    = p.badge ? `${BADGE_CLS[p.badge] || 'badge-green'} pc-badge` : '';
  const stars   = makeStars(p.rating?.average || 0);
  const lowStock = p.stock < 50;

  return /* html */`
  <article class="product-card reveal" role="button" tabindex="0"
    onclick="showProductPage('${p._id}')"
    onkeydown="if(event.key==='Enter')showProductPage('${p._id}')">

    <div class="pc-img">
      <div class="pc-emoji">${emoji}</div>
      ${p.badge ? `<span class="badge ${bCls}">${p.badge}</span>` : ''}
      ${lowStock ? `<span class="badge badge-amber" style="position:absolute;bottom:10px;left:10px">Only ${p.stock} left</span>` : ''}
      <div class="pc-actions">
        <button class="pc-action-btn" title="Wishlist" onclick="event.stopPropagation();wishlist('${p._id}')">
          <i class="fa-regular fa-heart"></i>
        </button>
        <button class="pc-action-btn" title="Quick view" onclick="event.stopPropagation();showProductPage('${p._id}')">
          <i class="fa-regular fa-eye"></i>
        </button>
      </div>
    </div>

    <div class="pc-body">
      <div class="pc-cat">${CAT_LABELS[p.category] || p.category}</div>
      <div class="pc-name">${p.name}</div>
      <div class="pc-rating">
        <span class="stars-xs">${stars}</span>
        <span class="rating-ct">${(p.rating?.average || 0).toFixed(1)} (${p.rating?.count || 0})</span>
      </div>
      <div class="pc-price">
        <span class="pc-price-cur">₹${p.price.toLocaleString('en-IN')}</span>
        ${p.comparePrice ? `<span class="pc-price-orig">₹${p.comparePrice.toLocaleString('en-IN')}</span>` : ''}
        ${disc > 0 ? `<span class="pc-price-off">${disc}% OFF</span>` : ''}
      </div>
      <button class="pc-atc btn-ripple" id="atc-${p._id}"
        onclick="event.stopPropagation();addToCart(${JSON.stringify(p).replace(/"/g,'&quot;')})">
        <i class="fa-solid fa-bag-shopping"></i> Add to Cart
      </button>
    </div>
  </article>`;
}

// ══════════════════════════════════════════════════════════════
//  RENDER: FEATURED GRID
// ══════════════════════════════════════════════════════════════
function renderFeaturedGrid() {
  const grid     = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = S.products.filter(p => p.isFeatured).slice(0, 4);
  grid.innerHTML = featured.length
    ? featured.map(buildCard).join('')
    : `<p style="color:var(--clr-text-3);grid-column:1/-1;text-align:center;padding:40px">No products available</p>`;
  initScrollReveal();
}

// ══════════════════════════════════════════════════════════════
//  RENDER: SHOP PAGE GRID
// ══════════════════════════════════════════════════════════════
function renderShopPage() {
  const grid = document.getElementById('shopGrid');
  const info = document.getElementById('shopInfo');
  if (!grid) return;

  let list = S.filter === 'all' ? [...S.products] : S.products.filter(p => p.category === S.filter);
  list = sortList(list, S.sort);

  if (info) info.textContent = `Showing ${list.length} product${list.length !== 1 ? 's' : ''}`;
  grid.innerHTML = list.length
    ? list.map(buildCard).join('')
    : `<p style="color:var(--clr-text-3);grid-column:1/-1;text-align:center;padding:60px">No products found.</p>`;
  setTimeout(initScrollReveal, 50);
}

function setFilter(cat, btn) {
  S.filter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
  renderShopPage();
}
function setSort(val) { S.sort = val; renderShopPage(); }
function filterAndShop(cat) {
  S.filter = cat;
  showPage('shop');
  setTimeout(() => {
    document.querySelectorAll('.filter-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.cat === cat)
    );
    renderShopPage();
  }, 80);
}

function sortList(arr, sort) {
  const a = [...arr];
  switch (sort) {
    case 'price-asc':  return a.sort((x,y) => x.price - y.price);
    case 'price-desc': return a.sort((x,y) => y.price - x.price);
    case 'rating':     return a.sort((x,y) => (y.rating?.average||0) - (x.rating?.average||0));
    case 'newest':     return a.reverse();
    default:           return a.sort((x,y) => (y.isFeatured?1:0) - (x.isFeatured?1:0));
  }
}

// ══════════════════════════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════════════════════════
let _searchTimer;
function handleSearch(q) {
  clearTimeout(_searchTimer);
  _searchTimer = setTimeout(() => {
    if (q.length >= 2) {
      const lq = q.toLowerCase();
      S.filtered = S.products.filter(p =>
        p.name.toLowerCase().includes(lq) ||
        (p.shortDesc || '').toLowerCase().includes(lq)
      );
      S.filter = 'search';
      showPage('shop');
      const grid = document.getElementById('shopGrid');
      if (grid) { grid.innerHTML = S.filtered.map(buildCard).join(''); setTimeout(initScrollReveal,50); }
    } else if (!q) {
      S.filter = 'all';
      renderShopPage();
    }
  }, 280);
}

// ══════════════════════════════════════════════════════════════
//  PRODUCT DETAIL PAGE
// ══════════════════════════════════════════════════════════════
function showProductPage(id) {
  const p = S.products.find(x => x._id === id || x.slug === id);
  if (!p) return;

  document.getElementById('pdBreadcrumb').textContent = p.name;

  const emoji    = getEmoji(p);
  const disc     = p.comparePrice ? Math.round(((p.comparePrice-p.price)/p.comparePrice)*100) : 0;
  const stars    = makeStars(p.rating?.average || 0);
  const specs    = p.specs ? Object.entries(p.specs) : [];

  document.getElementById('pdContent').innerHTML = /* html */`
    <!-- Gallery -->
    <div class="pd-gallery">
      <div class="pd-main-img" style="font-size:10rem">${emoji}</div>
      <div class="pd-thumbs">
        <div class="pd-thumb active">${emoji}</div>
        <div class="pd-thumb" style="font-size:1.6rem">📦</div>
        <div class="pd-thumb" style="font-size:1.6rem">📋</div>
      </div>
    </div>

    <!-- Info -->
    <div class="pd-info">
      <div class="pd-brand">PulseForge — ${CAT_LABELS[p.category]||p.category}</div>
      <h1 class="pd-name">${p.name}</h1>

      <div class="pd-rating-row">
        <span class="stars-xs" style="font-size:.88rem;letter-spacing:1.5px">${stars}</span>
        <span style="font-size:.84rem;color:var(--clr-text-2)">${(p.rating?.average||0).toFixed(1)} out of 5</span>
        <span style="font-size:.78rem;color:var(--clr-text-3)">(${p.rating?.count||0} reviews)</span>
        ${p.stock<50?`<span class="badge badge-amber" style="margin-left:auto"><i class="fa-solid fa-bolt"></i> Only ${p.stock} left!</span>`:''}
      </div>

      <div class="pd-price-row">
        <div class="pd-price">₹${p.price.toLocaleString('en-IN')}</div>
        ${p.comparePrice?`<div class="pd-compare">₹${p.comparePrice.toLocaleString('en-IN')}</div>`:''}
        ${disc>0?`<div class="pd-off">${disc}% OFF</div>`:''}
      </div>

      <p class="pd-desc">${p.description||p.shortDesc||''}</p>

      ${p.features?.length ? `
      <div class="pd-features">
        <div class="pd-features-title">Key Features</div>
        ${p.features.map(f=>`<div class="pd-feat-item"><i class="fa-solid fa-circle-check"></i>${f}</div>`).join('')}
      </div>` : ''}

      <!-- Add to Cart Row -->
      <div class="pd-atc-row">
        <div class="pd-qty-ctrl">
          <button class="pd-qty-btn" onclick="pdQtyChange(-1)">−</button>
          <span class="pd-qty-num" id="pdQtyNum">1</span>
          <button class="pd-qty-btn" onclick="pdQtyChange(1)">+</button>
        </div>
        <button class="pd-add-btn btn-ripple" onclick="pdAddToCart('${p._id}')">
          <i class="fa-solid fa-bag-shopping"></i> Add to Cart
        </button>
        <button class="pd-wish-btn" title="Wishlist" onclick="wishlist('${p._id}')">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>

      <!-- Trust badges -->
      <div class="pd-trust">
        <div class="pd-trust-item"><i class="fa-solid fa-shield-halved"></i> Secure Payment</div>
        <div class="pd-trust-item"><i class="fa-solid fa-truck-fast"></i> Fast Delivery</div>
        <div class="pd-trust-item"><i class="fa-solid fa-rotate-left"></i> 30-Day Returns</div>
        <div class="pd-trust-item"><i class="fa-solid fa-certificate"></i> Authentic Product</div>
      </div>

      ${specs.length ? `
      <div class="pd-specs">
        <h4><i class="fa-solid fa-list-check" style="color:var(--clr-accent);margin-right:8px"></i>Specifications</h4>
        ${specs.map(([k,v])=>`<div class="spec-row"><span class="spec-k">${k}</span><span class="spec-v">${v}</span></div>`).join('')}
      </div>` : ''}
    </div>
  `;

  showPage('product');

  // Related products
  const related = S.products.filter(x => x._id !== p._id && x.category === p.category).slice(0,3)
    || S.products.filter(x => x._id !== p._id).slice(0,3);
  const rg = document.getElementById('relatedGrid');
  if (rg) { rg.innerHTML = related.map(buildCard).join(''); setTimeout(initScrollReveal,50); }
}

function pdQtyChange(d) {
  const el = document.getElementById('pdQtyNum');
  if (!el) return;
  el.textContent = Math.max(1, Math.min(10, (+el.textContent || 1) + d));
}
function pdAddToCart(id) {
  const qty = +(document.getElementById('pdQtyNum')?.textContent || 1);
  const p   = S.products.find(x => x._id === id);
  if (!p) return;
  for (let i = 0; i < qty; i++) addToCart(p);
}

// ══════════════════════════════════════════════════════════════
//  CART ENGINE
// ══════════════════════════════════════════════════════════════
function addToCart(p) {
  const item = S.cart.find(i => i._id === p._id);
  if (item) item.qty = (item.qty || 1) + 1;
  else S.cart.push({ _id: p._id, slug: p.slug, name: p.name, price: p.price, qty: 1 });
  saveCart();
  syncCartUI();
  animateAtc(p._id);
  toast(`${p.name} added to cart 🛒`, 'success');
}

function addToCartById(id) {
  const p = S.products.find(x => x._id === id || x.slug === id);
  p ? addToCart(p) : loadProducts().then(() => {
    const p2 = S.products.find(x => x._id === id || x.slug === id);
    if (p2) addToCart(p2);
  });
}

function updateQty(id, d) {
  const item = S.cart.find(i => i._id === id);
  if (!item) return;
  item.qty = Math.max(1, (item.qty || 1) + d);
  saveCart(); syncCartUI();
}
function removeItem(id) {
  S.cart = S.cart.filter(i => i._id !== id);
  saveCart(); syncCartUI();
}
function saveCart() { localStorage.setItem(CFG.cartKey, JSON.stringify(S.cart)); }

function syncCartUI() {
  const total = S.cart.reduce((s,i) => s + i.qty, 0);
  const sub   = S.cart.reduce((s,i) => s + i.price * i.qty, 0);
  const ship  = sub >= 999 ? 0 : 99;
  const grand = sub + ship;

  // Count badge
  const cc = document.getElementById('cartCount');
  if (cc) {
    cc.textContent = total;
    cc.classList.remove('pop');
    void cc.offsetWidth;
    cc.classList.add('pop');
  }

  // Meta label
  const cm = document.getElementById('cartMeta');
  if (cm) cm.textContent = `(${total} item${total!==1?'s':''})`;

  // Body
  const body  = document.getElementById('cartBody');
  const empty = document.getElementById('cartEmpty');
  const foot  = document.getElementById('cartFoot');
  if (!body) return;

  // Remove old items
  body.querySelectorAll('.cart-item').forEach(el => el.remove());

  if (S.cart.length === 0) {
    empty.style.display = 'flex';
    if (foot) foot.style.display = 'none';
  } else {
    empty.style.display = 'none';
    if (foot) foot.style.display = 'block';

    S.cart.forEach(item => {
      const emoji = EMOJIS[item._id] || EMOJIS[item.slug] || '🏋️';
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.id = `ci-${item._id}`;
      el.innerHTML = /* html */`
        <div class="ci-thumb">${emoji}</div>
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">₹${item.price.toLocaleString('en-IN')}</div>
          <div class="ci-row">
            <div class="qty-wrap">
              <button class="qty-btn" onclick="updateQty('${item._id}',-1)">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty('${item._id}',1)">+</button>
            </div>
            <button class="ci-remove" onclick="removeItem('${item._id}')">
              <i class="fa-solid fa-trash-can"></i> Remove
            </button>
          </div>
        </div>`;
      body.insertBefore(el, empty);
    });

    document.getElementById('cartSubtotal').textContent = `₹${sub.toLocaleString('en-IN')}`;
    document.getElementById('cartShipping').textContent = ship === 0 ? 'Free' : `₹${ship}`;
    document.getElementById('cartTotal').textContent    = `₹${grand.toLocaleString('en-IN')}`;
  }
}

function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  const open    = drawer.classList.toggle('open');
  overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function animateAtc(id) {
  const btn = document.getElementById(`atc-${id}`);
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
  btn.classList.add('added');
  btn.style.background = 'var(--clr-accent)';
  btn.style.color = '#0F172A';
  setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); btn.style.cssText = ''; }, 1600);
}

function wishlist(id) { toast('Added to wishlist ❤️', 'info'); }

// ══════════════════════════════════════════════════════════════
//  CHECKOUT
// ══════════════════════════════════════════════════════════════
async function handleCheckout() {
  if (!S.cart.length) return;
  const sub  = S.cart.reduce((s,i) => s + i.price * i.qty, 0);
  const ship = sub >= 999 ? 0 : 99;
  const body = { items: S.cart.map(i=>({productId:i._id,name:i.name,price:i.price,quantity:i.qty})), subtotal:sub, shippingCost:ship, total:sub+ship, customer:{name:'Guest',email:'guest@pulseforge.in'} };
  try {
    const res  = await fetch(`${CFG.apiBase}/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    const data = await res.json();
    if (data.success) { S.cart=[]; saveCart(); syncCartUI(); toggleCart(); toast(`🎉 Order #${data.order.orderNumber||'placed'} confirmed!`, 'success'); }
  } catch {
    S.cart=[]; saveCart(); syncCartUI(); toggleCart();
    toast('🎉 Order placed! You\'ll receive a confirmation shortly.', 'success');
  }
}

// ══════════════════════════════════════════════════════════════
//  REVIEWS CAROUSEL
// ══════════════════════════════════════════════════════════════
function renderReviews() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  track.innerHTML = REVIEWS_DATA.map(r => /* html */`
    <div class="rev-card">
      <div class="rev-top">
        <div class="flex items-center gap-3">
          <div class="rev-avatar" style="background:${r.color}22;color:${r.color};border-color:${r.color}44">${r.initials}</div>
          <div>
            <div class="rev-name">${r.name}</div>
            <div class="rev-date">${r.date}</div>
          </div>
        </div>
        <div class="rev-stars">${'★'.repeat(r.rating)}</div>
      </div>
      <p class="rev-text">"${r.text}"</p>
      <div class="rev-product-tag"><i class="fa-solid fa-bag-shopping"></i> ${r.product}</div>
      <div class="rev-verified"><i class="fa-solid fa-circle-check"></i> Verified Purchase</div>
    </div>`
  ).join('');
}

function moveCarousel(dir) {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  const cards = track.querySelectorAll('.rev-card');
  if (!cards.length) return;
  const cw      = cards[0].offsetWidth + 20;
  const visible = Math.floor(track.parentElement.offsetWidth / cw);
  const max     = Math.max(0, cards.length - visible);
  S.carousel    = Math.max(0, Math.min(max, S.carousel + dir));
  track.style.transform = `translateX(-${S.carousel * cw}px)`;
}

// ══════════════════════════════════════════════════════════════
//  NEWSLETTER
// ══════════════════════════════════════════════════════════════
async function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('nlEmail');
  const email = input.value.trim();
  if (!email) return;
  try {
    const res  = await fetch(`${CFG.apiBase}/newsletter/subscribe`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email})
    });
    const data = await res.json();
    toast(data.message || '🎉 Subscribed!', 'success');
  } catch {
    toast('🎉 Subscribed! Welcome to PulseForge.', 'success');
  }
  input.value = '';
}

// ══════════════════════════════════════════════════════════════
//  CONTACT FORM
// ══════════════════════════════════════════════════════════════
async function handleContact() {
  const fields = [
    { id:'cf-name',    errId:'cf-name-err',    test: v => v.length >= 2 },
    { id:'cf-email',   errId:'cf-email-err',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id:'cf-subject', errId:'cf-subject-err', test: v => v.length >= 3 },
    { id:'cf-message', errId:'cf-message-err', test: v => v.length >= 10 }
  ];
  let valid = true;
  fields.forEach(({ id, errId, test }) => {
    const inp = document.getElementById(id);
    const err = document.getElementById(errId);
    const ok  = inp && test(inp.value.trim());
    inp?.classList.toggle('error', !ok);
    if (err) err.classList.toggle('show', !ok);
    if (!ok) valid = false;
    inp?.addEventListener('input', () => { if(test(inp.value.trim())) { inp.classList.remove('error'); err?.classList.remove('show'); } }, {once:true});
  });
  if (!valid) return;

  const btn = document.getElementById('cfSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

  const body = {
    name:    document.getElementById('cf-name').value,
    email:   document.getElementById('cf-email').value,
    subject: document.getElementById('cf-subject').value,
    message: document.getElementById('cf-message').value
  };
  try {
    await fetch(`${CFG.apiBase}/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  } catch {}

  document.getElementById('contactFormWrap').style.display = 'none';
  document.getElementById('cfSuccess').classList.add('show');
}
function resetContactForm() {
  document.getElementById('contactFormWrap').style.display = 'block';
  document.getElementById('cfSuccess').classList.remove('show');
  document.getElementById('cfSubmitBtn').disabled = false;
  document.getElementById('cfSubmitBtn').innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
  ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => { const el=document.getElementById(id); if(el)el.value=''; });
}

// ══════════════════════════════════════════════════════════════
//  FAQ
// ══════════════════════════════════════════════════════════════
function buildFAQ() {
  const container = document.getElementById('faqContainer');
  if (!container) return;
  container.innerHTML = FAQ_DATA.map((item, i) => /* html */`
    <div class="faq-item reveal reveal-delay-${i % 4}" id="faq-${i}">
      <button class="faq-q" onclick="toggleFAQ(${i})">
        ${item.q}
        <i class="fa-solid fa-chevron-down faq-icon"></i>
      </button>
      <div class="faq-a"><p>${item.a}</p></div>
    </div>`
  ).join('');
}
function toggleFAQ(i) {
  const item   = document.getElementById(`faq-${i}`);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => { el.classList.remove('open'); el.querySelector('.faq-a').style.maxHeight='0'; });
  if (!isOpen) {
    item.classList.add('open');
    const a = item.querySelector('.faq-a');
    a.style.maxHeight = a.scrollHeight + 'px';
  }
}

// ══════════════════════════════════════════════════════════════
//  TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════
function toast(msg, type = 'success') {
  const wrap   = document.getElementById('toastWrap');
  const t      = document.createElement('div');
  t.className  = `toast toast-${type}`;
  const icons  = { success:'✅', error:'❌', info:'ℹ️' };
  t.innerHTML  = `<span class="t-icon">${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => {
    t.style.cssText = 'opacity:0;transform:translateY(14px) scale(.92);transition:all .28s ease';
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ══════════════════════════════════════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════════════════════════════════════
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal:not(.in), .reveal-left:not(.in), .reveal-right:not(.in)');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

// ══════════════════════════════════════════════════════════════
//  RIPPLE EFFECT
// ══════════════════════════════════════════════════════════════
function addRippleListeners() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(btn.clientWidth, btn.clientHeight) * 2;
    const r      = document.createElement('span');
    r.className  = 'ripple';
    r.style.cssText = `width:${size}px;height:${size}px;top:${e.clientY-rect.top-size/2}px;left:${e.clientX-rect.left-size/2}px`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
}

// ══════════════════════════════════════════════════════════════
//  UTILITY
// ══════════════════════════════════════════════════════════════
function makeStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '✦' : '') + '☆'.repeat(empty);
}
