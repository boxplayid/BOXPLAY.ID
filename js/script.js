// --- DATA & CONFIG ---
const HOURLY_RATE = 15000;

// Force NUD CAFE Setup for fresh experience with unit images
if (!localStorage.getItem('pb_nud_setup_v7')) {
    localStorage.clear(); // Clear old conflicting data
    localStorage.setItem('pb_nud_setup_v7', 'true');
}

const defaultUnits = [
    { id: 1, name: 'Unit 01', type: 'PS4 ', branch: 'NUD CAFE', status: 'idle', customer: '', startTime: null, elapsed: 0, image: 'foto_boxplay/unitps.jpg' },
    { id: 2, name: 'Unit 02', type: 'PS4 ', branch: 'NUD CAFE', status: 'idle', customer: '', startTime: null, elapsed: 0, image: 'foto_boxplay/unitps.jpg' },
    { id: 3, name: 'Unit 03', type: 'PS4 ', branch: 'NUD CAFE', status: 'idle', customer: '', startTime: null, elapsed: 0, image: 'foto_boxplay/unitps.jpg' },
    { id: 4, name: 'Unit 04', type: 'PS4 ', branch: 'NUD CAFE', status: 'idle', customer: '', startTime: null, elapsed: 0, image: 'foto_boxplay/unitps.jpg' },
    { id: 5, name: 'Unit 05', type: 'PS4 ', branch: 'NUD CAFE', status: 'idle', customer: '', startTime: null, elapsed: 0, image: 'foto_boxplay/unitps.jpg' }
];

let units = JSON.parse(localStorage.getItem('pb_units'));

// Pastikan setiap unit memiliki field image
if (units) {
    units = units.map((unit, index) => {
        if (!unit.image) {
            const defaultUnit = defaultUnits.find(u => u.id === unit.id) || defaultUnits[index];
            unit.image = defaultUnit ? defaultUnit.image : 'foto_boxplay/FOTO 2.JPG';
        }
        return unit;
    });
} else {
    units = defaultUnits;
}
let history = JSON.parse(localStorage.getItem('pb_history')) || [];
let promos = JSON.parse(localStorage.getItem('pb_promos')) || [
    { id: 1, tag: 'SPECIAL NUD', title: 'Main 3 Jam, Bayar 2 Jam!', desc: 'Nikmati promo khusus di NUD Cafe setiap hari Jumat.', icon: 'fab fa-playstation', color: 'promo-1' },
    { id: 2, tag: 'NUD SNACK', title: 'Gratis Kopi Susu', desc: 'Dapatkan Kopi Susu NUD gratis untuk booking minimal 3 jam.', icon: 'fas fa-coffee', color: 'promo-2' },
    { id: 3, tag: 'GAMER NIGHT', title: 'Diskon 10% Menu Cafe', desc: 'Tunjukkan sesi bermainmu dan dapatkan diskon untuk semua menu NUD Cafe.', icon: 'fas fa-utensils', color: 'promo-3' }
];
let cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
let waitingList = JSON.parse(localStorage.getItem('pb_waiting')) || {
    'NUD CAFE': 0
};
let products = JSON.parse(localStorage.getItem('pb_products')) || [
    // Minuman (10)
    { id: 101, name: 'Kopi Susu Gula Aren', price: 15000, category: 'Minuman', icon: 'fas fa-coffee', stock: 8 },
    { id: 102, name: 'Americano Ice', price: 12000, category: 'Minuman', icon: 'fas fa-coffee', stock: 5 },
    { id: 103, name: 'Cafe Latte', price: 18000, category: 'Minuman', icon: 'fas fa-coffee', stock: 3 },
    { id: 104, name: 'Matcha Latte', price: 20000, category: 'Minuman', icon: 'fas fa-leaf', stock: 0 },
    { id: 105, name: 'Chocolate Hot/Ice', price: 18000, category: 'Minuman', icon: 'fas fa-mug-hot', stock: 2 },
    { id: 106, name: 'Es Teh Manis', price: 5000, category: 'Minuman', icon: 'fas fa-glass-whiskey', stock: 12 },
    { id: 107, name: 'Lemon Tea', price: 8000, category: 'Minuman', icon: 'fas fa-glass-whiskey', stock: 7 },
    { id: 108, name: 'Lychee Tea', price: 15000, category: 'Minuman', icon: 'fas fa-glass-whiskey', stock: 4 },
    { id: 109, name: 'Coca Cola Dingin', price: 8000, category: 'Minuman', icon: 'fas fa-wine-glass-alt', stock: 10 },
    { id: 110, name: 'Air Mineral', price: 5000, category: 'Minuman', icon: 'fas fa-tint', stock: 15 },
    // Snacks (10)
    { id: 201, name: 'Kentang Goreng Original', price: 15000, category: 'Snacks', icon: 'fas fa-cookie', stock: 6 },
    { id: 202, name: 'Kentang Goreng Keju', price: 18000, category: 'Snacks', icon: 'fas fa-cookie', stock: 4 },
    { id: 203, name: 'Cireng Crispy', price: 12000, category: 'Snacks', icon: 'fas fa-cookie-bite', stock: 0 },
    { id: 204, name: 'Roti Bakar Coklat', price: 15000, category: 'Snacks', icon: 'fas fa-bread-slice', stock: 3 },
    { id: 205, name: 'Roti Bakar Keju', price: 15000, category: 'Snacks', icon: 'fas fa-bread-slice', stock: 5 },
    { id: 206, name: 'Indomie Goreng Original', price: 10000, category: 'Snacks', icon: 'fas fa-utensils', stock: 7 },
    { id: 207, name: 'Indomie Goreng + Telur', price: 13000, category: 'Snacks', icon: 'fas fa-utensils', stock: 2 },
    { id: 208, name: 'Indomie Kuah Soto', price: 10000, category: 'Snacks', icon: 'fas fa-utensils', stock: 8 },
    { id: 209, name: 'Dimsum Ayam (4pcs)', price: 15000, category: 'Snacks', icon: 'fas fa-hotdog', stock: 0 },
    { id: 210, name: 'Pisang Goreng Coklat', price: 12000, category: 'Snacks', icon: 'fas fa-pepper-hot', stock: 3 }
];

let activeOrders = JSON.parse(localStorage.getItem('pb_active_orders')) || [];
let currentUnitId = null;

let selectedUnitForBooking = null;

// --- NAVIGATION ---
function navigate(sectionId, data = null) {
    console.log("Navigating to:", sectionId);
    const pages = {
        'home': 'beranda.html',
        'login': 'login.html',
        'dashboard': 'dashboard.html',
        'booking': 'booking.html',
        'waiting': 'waiting.html'
    };

    if (pages[sectionId]) {
        if (data) sessionStorage.setItem('pb_temp_data', data);
        window.location.href = pages[sectionId];
    }
}

// --- PROMO SLIDER ---
let promoCurrentIndex = 0;
let promoInterval;

// --- HERO PHOTO SLIDER ---
let heroCurrentIndex = 0;
let heroInterval;

function startHeroSlider() {
    const slider = document.getElementById('hero-photo-slider');
    const dots = document.querySelectorAll('#hero-dots .dot');
    if (!slider || dots.length === 0) return;

    console.log("Starting Hero Slider...");
    if (heroInterval) clearInterval(heroInterval);

    heroInterval = setInterval(() => {
        heroCurrentIndex++;
        if (heroCurrentIndex >= 4) {
            heroCurrentIndex = 0;
        }
        updateHeroSlider();
    }, 4000);

    function updateHeroSlider() {
        slider.style.transform = `translateX(-${heroCurrentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === heroCurrentIndex);
        });
    }

    dots.forEach((dot, i) => {
        dot.onclick = () => {
            heroCurrentIndex = i;
            updateHeroSlider();
            clearInterval(heroInterval);
            startHeroSlider();
        };
    });
}

function renderPromos() {
    const slider = document.getElementById('promo-slider');
    const dotsContainer = document.getElementById('slider-dots');
    if (!slider || !dotsContainer) return;

    slider.innerHTML = promos.map(p => `
        <div class="promo-card ${p.color}">
            <span class="promo-tag">${p.tag}</span>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <i class="${p.icon}"></i>
        </div>
    `).join('');

    dotsContainer.innerHTML = promos.map((_, i) => `
        <span class="dot ${i === 0 ? 'active' : ''}" onclick="jumpToPromo(${i})"></span>
    `).join('');
}

function jumpToPromo(index) {
    promoCurrentIndex = index;
    const slider = document.getElementById('promo-slider');
    const dots = document.querySelectorAll('.dot');
    if (!slider) return;

    slider.style.transform = `translateX(-${promoCurrentIndex * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === promoCurrentIndex);
    });

    // Reset auto-slide timer
    clearInterval(promoInterval);
    startPromoSlider();
}

function startPromoSlider() {
    const slider = document.getElementById('promo-slider');
    const dots = document.querySelectorAll('.dot');
    if (!slider || dots.length === 0) return;

    if (promoInterval) clearInterval(promoInterval);

    promoInterval = setInterval(() => {
        promoCurrentIndex++;
        if (promoCurrentIndex >= promos.length) {
            promoCurrentIndex = 0;
        }
        updateSlider();
    }, 5000);

    function updateSlider() {
        slider.style.transform = `translateX(-${promoCurrentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === promoCurrentIndex);
        });
    }
}

// --- PROMO MANAGEMENT (ADMIN) ---
function renderPromoManagement() {
    const list = document.getElementById('promo-manage-list');
    if (!list) return;

    list.innerHTML = promos.map(p => `
        <div class="history-card" style="margin-bottom: 1rem; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <div class="flex items-center gap-4">
                <div class="promo-card ${p.color}" style="min-width: 80px; height: 50px; padding: 0.5rem; font-size: 0.5rem; border-radius: 0.5rem;">
                    <i class="${p.icon}" style="font-size: 1.5rem; opacity: 0.5;"></i>
                </div>
                <div>
                    <div style="font-weight: 800; color: var(--primary);">${p.tag}</div>
                    <div style="font-weight: 700;">${p.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${p.desc}</div>
                </div>
            </div>
            <button class="btn btn-outline" style="border-color: var(--danger); color: var(--danger); padding: 0.5rem 1rem;" onclick="deletePromo(${p.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function addPromo() {
    const tag = document.getElementById('promo-tag-input').value.trim();
    const title = document.getElementById('promo-title-input').value.trim();
    const desc = document.getElementById('promo-desc-input').value.trim();
    const icon = document.getElementById('promo-icon-input').value || 'fas fa-star';
    const color = document.getElementById('promo-color-input').value || 'promo-1';

    if (!tag || !title || !desc) return alert('Lengkapi data promo!');

    const newPromo = {
        id: Date.now(),
        tag,
        title,
        desc,
        icon,
        color
    };

    promos.push(newPromo);
    saveData();
    renderPromoManagement();
    
    // Reset form
    document.getElementById('promo-tag-input').value = '';
    document.getElementById('promo-title-input').value = '';
    document.getElementById('promo-desc-input').value = '';
    alert('Promo berhasil ditambahkan!');
}

function deletePromo(id) {
    if (confirm('Hapus promo ini?')) {
        promos = promos.filter(p => p.id !== id);
        saveData();
        renderPromoManagement();
    }
}

// --- CART LOGIC ---
function addToCart(item) {
    console.log("Adding to cart:", item);
    // Load current cart from storage to be sure
    cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    
    // Check if item already exists
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    saveData();
    updateCartUI();
    
    // Show feedback
    if (event && event.currentTarget) {
        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> BERHASIL';
        btn.style.background = 'var(--success)';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 1000);
    }
}

function updateCartQty(id, delta) {
    // Reload cart to ensure we have latest
    cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(c => c.id !== id);
        }
        saveData();
        updateCartUI();
    }
}

function removeFromCart(id) {
    cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    cart = cart.filter(c => c.id !== id);
    saveData();
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    // Ensure cart is up to date
    cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    
    if (badge) {
        const totalQty = cart.reduce((acc, curr) => acc + curr.qty, 0);
        badge.innerText = totalQty;
        badge.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    if (container) {
        if (cart.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-muted);">Keranjang masih kosong</div>';
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item" style="padding: 1rem 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <div class="cart-item-info">
                        <div style="font-weight: 700; color: #fff;">${item.name}</div>
                        <div style="font-size: 0.8rem; color: var(--primary);">${formatIDR(item.price)}</div>
                    </div>
                    <div class="cart-item-actions" style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="updateCartQty(${item.id}, -1)" style="background: rgba(255,255,255,0.1); border:none; color:#fff; border-radius: 6px; width: 24px; height: 24px; cursor:pointer;">-</button>
                        <span style="min-width: 20px; text-align: center;">${item.qty}</span>
                        <button onclick="updateCartQty(${item.id}, 1)" style="background: rgba(255,255,255,0.1); border:none; color:#fff; border-radius: 6px; width: 24px; height: 24px; cursor:pointer;">+</button>
                        <button onclick="removeFromCart(${item.id})" style="color: var(--danger); margin-left: 0.5rem; background: none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
        }
    }

    if (totalEl) {
        const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
        totalEl.innerText = formatIDR(total);
    }
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            updateCartUI();
        }
    }
}

function goToCheckout() {
    console.log("Navigating to checkout...");
    // Ensure we are using the latest cart from storage
    const currentCart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    
    if (currentCart.length === 0) {
        alert('Keranjang Anda masih kosong!');
        return;
    }
    
    // Save to be sure
    localStorage.setItem('pb_cart', JSON.stringify(currentCart));
    
    // Use window.location.href directly for better compatibility
    window.location.href = 'checkout.html';
}

function initPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop().toLowerCase();
    
    console.log("Current page detected:", page);

    // Simpan data units yang sudah diperbarui dengan gambar ke localStorage
    localStorage.setItem('pb_units', JSON.stringify(units));
    console.log("Units data saved with images:", units);

    // Initial Cart UI sync
    cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    updateCartUI();

    // Load data from Firebase (real-time listener)
    loadDataFromFirebase();

    if (page === 'beranda.html' || page === 'index.html' || page === '' || page === 'beranda') {
        renderHomeProducts();
        renderPromos();
        startPromoSlider();
        startHeroSlider();
    } else if (page.includes('checkout')) {
        renderCheckoutSummary();
    } else if (page.includes('dashboard_operator')) {
        renderDashboard();
    } else if (page.includes('dashboard_kasir')) {
        renderKasirDashboard();
    } else if (page.includes('dashboard.html')) {
        renderDashboard();
        renderHistory();
        renderPromoManagement();
        renderProductManagement();
        renderUnitsManagement(); // For units section
    } else if (page.includes('booking')) {
        const data = sessionStorage.getItem('pb_temp_data');
        const unitLabel = document.getElementById('selected-unit-label');
        if (data && unitLabel) {
            unitLabel.innerText = `Booking: ${data}`;
        }
    } else if (page.includes('waiting')) {
        const lastBranch = localStorage.getItem('pb_last_branch');
        const lastQueue = localStorage.getItem('pb_last_queue');
        const lastName = localStorage.getItem('pb_last_name');
        const lastPhone = localStorage.getItem('pb_last_phone');

        if (lastBranch && lastQueue) {
            document.getElementById('display-branch').innerText = lastBranch;
            document.getElementById('waiting-number').innerText = lastQueue;
            document.getElementById('display-name').innerText = lastName;
            document.getElementById('display-phone').innerText = lastPhone;
        }
    }
}

function renderCheckoutSummary() {
    const list = document.getElementById('checkout-items-list');
    const totalEl = document.getElementById('checkout-total-price');
    if (!list || !totalEl) return;

    cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--text-muted);">Keranjang kosong.</p>';
        totalEl.innerText = formatIDR(0);
        return;
    }

    list.innerHTML = cart.map(item => `
        <div class="cart-item" style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
            <div class="cart-item-info">
                <div style="font-weight: 700; color: #fff;">${item.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${item.qty} x ${formatIDR(item.price)}</div>
            </div>
            <div style="font-weight: 800; color: var(--primary);">${formatIDR(item.price * item.qty)}</div>
        </div>
    `).join('');

    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    totalEl.innerText = formatIDR(total);
}

// --- AUTH ---
function handleLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (u === 'operator' && p === 'op123') {
        sessionStorage.setItem('pb_user_role', 'operator');
        sessionStorage.setItem('pb_admin_logged', 'true');
        window.location.href = 'dashboard_operator.html';
    } else if (u === 'kasir' && p === 'ka123') {
        sessionStorage.setItem('pb_user_role', 'kasir');
        sessionStorage.setItem('pb_admin_logged', 'true');
        window.location.href = 'dashboard_kasir.html';
    } else if (u === 'admin' && p === '12345') {
        sessionStorage.setItem('pb_user_role', 'admin');
        sessionStorage.setItem('pb_admin_logged', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('Login Gagal! \nOperator: operator / op123 \nKasir: kasir / ka123');
    }
}

function logout() {
    if (confirm('Keluar dari sistem?')) {
        sessionStorage.removeItem('pb_admin_logged');
        sessionStorage.removeItem('pb_user_role');
        window.location.href = 'beranda.html';
    }
}

// --- BOOKING LOGIC ---
function processBooking() {
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const branch = document.getElementById('booking-branch').value;
    const btn = document.querySelector('.btn-primary');

    if (!name || !phone || !branch) {
        alert('Harap lengkapi semua data pemesanan!');
        return;
    }

    // Show loading state
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES...';

    setTimeout(() => {
        // Increment waiting number for selected branch
        waitingList[branch]++;
        const queueNumber = waitingList[branch].toString().padStart(2, '0');

        // Save to localStorage
        localStorage.setItem('pb_waiting', JSON.stringify(waitingList));
        localStorage.setItem('pb_last_branch', branch);
        localStorage.setItem('pb_last_queue', queueNumber);
        localStorage.setItem('pb_last_name', name);
        localStorage.setItem('pb_last_phone', phone);

        // Redirect to waiting page
        window.location.href = 'waiting.html';
    }, 1000);
}

// --- BILLING LOGIC ---
function renderHomeProducts() {
    const container = document.getElementById('home-product-grid');
    if (!container) {
        console.error("Container 'home-product-grid' not found!");
        return;
    }
    
    console.log("Rendering units:", units.length);
    container.innerHTML = units.map(unit => `
        <div class="product-card">
            <div class="product-img">
                <img src="${unit.image || 'foto_boxplay/FOTO 2.JPG'}" alt="${unit.name}">
                <span class="product-status ${unit.status === 'active' ? 'status-used' : 'status-ready'}">
                    ${unit.status === 'active' ? 'Digunakan' : 'Ready'}
                </span>
                <i class="fab fa-playstation"></i>
            </div>
            <div class="product-info">
                <p class="product-cat">${unit.type} - ${unit.branch}</p>
                <h4 class="product-title">${unit.name}</h4>
                <div class="product-price">Rp 15.000 <span>/ Jam</span></div>
                <button class="btn btn-primary w-full" style="width: 100%" 
                    onclick="${unit.status === 'active' ? '' : `navigate('booking', '${unit.name} (${unit.branch})')`}" ${unit.status === 'active' ? 'disabled' : ''}>
                    ${unit.status === 'active' ? 'SEDANG BERMAIN' : 'BOOKING UNIT'}
                </button>
            </div>
        </div>
    `).join('');

    renderHomeMenu();
}

function renderHomeMenu() {
    const container = document.getElementById('home-menu-grid');
    if (!container) {
        console.error("Container 'home-menu-grid' not found!");
        return;
    }

    console.log("Rendering products:", products.length);
    container.innerHTML = products.map(p => {
        const isAvailable = p.stock > 0;
        const stockLabel = isAvailable ? 'Ready' : 'Sold Out';
        const stockClass = isAvailable ? 'status-ready' : 'status-sold';
        const imgHtml = `<img src="foto_boxplay/foto4.jpg" alt="${p.name}">`;

        return `
            <div class="product-card">
                <div class="product-img">
                    <span class="product-status ${stockClass}">${stockLabel}</span>
                    ${imgHtml}
                </div>
                <div class="product-info">
                    <p class="product-cat">${p.category}</p>
                    <h4 class="product-title">${p.name}</h4>
                    <div class="product-price">${formatIDR(p.price)}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Stok: ${p.stock}</div>
                    <button class="btn btn-primary w-full" onclick="addToCart({id: ${p.id}, name: '${p.name}', price: ${p.price}})" ${isAvailable ? '' : 'disabled'}>
                        <i class="fas fa-cart-plus"></i> ${isAvailable ? 'TAMBAH' : 'HABIS'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderDashboard() {
    const container = document.getElementById('units-container');
    if (!container) return;
    
    // Update Stats
    const statsIncome = document.getElementById('stats-income');
    const statsActive = document.getElementById('stats-active');
    const statsWaiting = document.getElementById('stats-waiting');
    
    if (statsIncome) {
        const totalIncome = history.reduce((acc, curr) => acc + curr.cost, 0);
        statsIncome.innerText = formatIDR(totalIncome);
    }
    if (statsActive) {
        const activeCount = units.filter(u => u.status === 'active').length;
        statsActive.innerText = `${activeCount} / ${units.length}`;
    }
    if (statsWaiting) {
        const totalWaiting = Object.values(waitingList).reduce((a, b) => a + b, 0);
        statsWaiting.innerText = totalWaiting;
    }

    container.innerHTML = units.map(unit => {
        const durationInfo = unit.duration ? `<p><strong>Durasi Pilihan:</strong> ${Math.floor(unit.duration / 60)} jam ${unit.duration % 60} menit</p>` : '';
        const elapsedInfo = unit.status === 'active' ? `<p><strong>Realtime:</strong> <span class="timer-unit timer-${unit.id}">${formatTime(unit.elapsed)}</span></p>` : '';
        const estimateInfo = unit.status === 'active' && unit.duration ? `<p><strong>Estimasi:</strong> ${Math.floor(unit.duration / 60)}j ${unit.duration % 60}m</p>` : '';

        return `
        <div class="unit-card">
            <div class="unit-header">
                <h4>${unit.name}</h4>
                <span class="unit-status ${unit.status === 'active' ? 'status-active' : 'status-idle'}">
                    ${unit.status === 'active' ? 'SEDANG DIGUNAKAN' : 'IDLE'}
                </span>
            </div>
            <div class="unit-info">
                <p><strong>Type:</strong> ${unit.type}</p>
                <p><strong>Branch:</strong> ${unit.branch}</p>
                ${unit.status === 'active' ? `<p><strong>Customer:</strong> ${unit.customer}</p>` : ''}
                ${durationInfo}
                ${elapsedInfo}
                ${estimateInfo}
            </div>
            <div class="unit-actions">
                ${unit.status === 'idle' ? 
                    `<button class="btn btn-primary" onclick="openStartModal(${unit.id})">MULAI SESI</button>` :
                    `<button class="btn btn-danger" onclick="stopSession(${unit.id})">STOP SESI</button>`
                }
            </div>
        </div>
    `;
    }).join('');
}

function renderUnitsManagement() {
    const container = document.getElementById('units-management-container');
    if (!container) return;
    
    container.innerHTML = units.map(unit => {
        const durationInfo = unit.duration ? `<p><strong>Durasi Pilihan:</strong> ${Math.floor(unit.duration / 60)} jam ${unit.duration % 60} menit</p>` : '';
        const elapsedInfo = unit.status === 'active' ? `<p><strong>Realtime:</strong> <span class="timer-unit timer-${unit.id}">${formatTime(unit.elapsed)}</span></p>` : '';
        const estimateInfo = unit.status === 'active' && unit.duration ? `<p><strong>Estimasi:</strong> ${Math.floor(unit.duration / 60)}j ${unit.duration % 60}m</p>` : '';

        return `
        <div class="unit-card">
            <div class="unit-header">
                <h4>${unit.name}</h4>
                <span class="unit-status ${unit.status === 'active' ? 'status-active' : 'status-idle'}">
                    ${unit.status === 'active' ? 'SEDANG DIGUNAKAN' : 'IDLE'}
                </span>
            </div>
            <div class="unit-info">
                <p><strong>Type:</strong> ${unit.type}</p>
                <p><strong>Branch:</strong> ${unit.branch}</p>
                ${unit.status === 'active' ? `<p><strong>Customer:</strong> ${unit.customer}</p>` : ''}
                ${durationInfo}
                ${elapsedInfo}
                ${estimateInfo}
            </div>
            <div class="unit-actions">
                ${unit.status === 'idle' ? 
                    `<button class="btn btn-primary" onclick="openStartModal(${unit.id})">MULAI SESI</button>` :
                    `<button class="btn btn-danger" onclick="stopSession(${unit.id})">STOP SESI</button>`
                }
            </div>
        </div>
    `;
    }).join('');

    renderWaitingListAdmin();
}

function renderWaitingListAdmin() {
    const container = document.getElementById('waiting-list-admin');
    if (!container) return;

    const branches = Object.keys(waitingList);
    const hasWaiting = branches.some(b => waitingList[b] > 0);

    if (!hasWaiting) {
        container.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Tidak ada antrian saat ini</div>';
        return;
    }

    container.innerHTML = branches.map(branch => {
        if (waitingList[branch] === 0) return '';
        return `
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 800; color: var(--primary);">Cabang ${branch}</div>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">Total Antrian: <span style="color: #fff; font-weight: 700;">${waitingList[branch]}</span></div>
                </div>
                <button class="btn btn-outline" style="padding: 0.5rem 0.8rem; font-size: 0.75rem;" onclick="resetWaiting('${branch}')">
                    PANGGIL / RESET
                </button>
            </div>
        `;
    }).join('');
}

function resetWaiting(branch) {
    if (confirm(`Reset antrian untuk Cabang ${branch}?`)) {
        waitingList[branch] = 0;
        saveData();
        renderDashboard();
    }
}

function openStartModal(id) {
    currentUnitId = id;
    const unit = units.find(u => u.id === id);
    document.getElementById('modal-title').innerText = `Mulai Sesi - ${unit.name}`;
    document.getElementById('cust-name-input').value = '';
    document.getElementById('cust-duration-input').value = unit.duration || 60;
    document.getElementById('modal-start').classList.remove('hidden');
    document.getElementById('cust-name-input').focus();
}

function closeModal() {
    document.getElementById('modal-start').classList.add('hidden');
}

const confirmBtn = document.getElementById('confirm-start-btn');
if (confirmBtn) {
    confirmBtn.onclick = function() {
        const name = document.getElementById('cust-name-input').value.trim();
        const duration = parseInt(document.getElementById('cust-duration-input').value, 10);
        if (!name) return alert('Masukkan nama pelanggan!');
        if (isNaN(duration) || duration <= 0) return alert('Masukkan durasi sesi (menit) yang valid!');
        
        const unit = units.find(u => u.id === currentUnitId);
        unit.status = 'active';
        unit.customer = name;
        unit.duration = duration;
        unit.startTime = Date.now();
        unit.elapsed = 0;
        
        saveData();
        closeModal();
        renderDashboard();
        renderUnitsManagement();
    };
}

function stopSession(id) {
    const unit = units.find(u => u.id === id);
    const cost = calculateCost(unit.elapsed);
    
    if (confirm(`Hentikan sesi ${unit.name}?\nPelanggan: ${unit.customer}\nTotal Biaya: ${formatIDR(cost)}`)) {
        // Add to history
        history.unshift({
            id: Date.now(),
            unit: unit.name,
            customer: unit.customer,
            duration: formatTime(unit.elapsed),
            cost: cost,
            endTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });

        // Reset Unit
        unit.status = 'idle';
        unit.customer = '';
        unit.startTime = null;
        unit.elapsed = 0;
        
        saveData();
        renderDashboard();
        renderHistory();
    }
}

function updateTimers() {
    units.forEach(unit => {
        if (unit.status === 'active') {
            unit.elapsed = Math.floor((Date.now() - unit.startTime) / 1000);
            
            const timerSelector = `.timer-${unit.id}`;
            const timerEls = document.querySelectorAll(timerSelector);
            const priceEl = document.getElementById(`price-${unit.id}`);
            
            timerEls.forEach(el => el.innerText = formatTime(unit.elapsed));
            if (priceEl) priceEl.innerText = formatIDR(calculateCost(unit.elapsed));
        }
    });
}

function renderHistory() {
    const body = document.getElementById('history-body');
    if (!body) return;
    if (history.length === 0) {
        body.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">Belum ada transaksi hari ini</td></tr>';
        return;
    }
    body.innerHTML = history.slice(0, 10).map((item, idx) => `
        <tr>
            <td><span style="font-weight: 700;">${item.unit}</span></td>
            <td>${item.customer}</td>
            <td><code>${item.duration}</code></td>
            <td><span style="color: var(--primary); font-weight: 800;">${formatIDR(item.cost)}</span></td>
            <td style="color: var(--text-muted);">${item.endTime}</td>
            <td style="display: flex; gap: 0.5rem;">
                <button class="btn btn-small" onclick="openEditHistoryModal(${idx})" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;"><i class="fas fa-edit"></i></button>
                <button class="btn btn-small btn-danger" onclick="deleteHistory(${idx})" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// --- HELPERS ---
function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

function formatIDR(val) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
}

function calculateCost(sec) {
    // Rounding up to the nearest hour
    const hours = Math.ceil(sec / 3600) || 1; 
    return hours * HOURLY_RATE;
}

function openEditHistoryModal(idx) {
    const item = history[idx];
    if (!item) return;
    
    document.getElementById('edit-history-customer').value = item.customer || '';
    document.getElementById('edit-history-duration').value = item.duration || '';
    document.getElementById('edit-history-cost').value = item.cost || '';
    document.getElementById('edit-history-idx').value = idx;
    document.getElementById('modal-edit-history').classList.remove('hidden');
}

function closeEditHistoryModal() {
    document.getElementById('modal-edit-history').classList.add('hidden');
}

function saveEditHistory() {
    const idx = parseInt(document.getElementById('edit-history-idx').value);
    const customer = document.getElementById('edit-history-customer').value.trim();
    const duration = document.getElementById('edit-history-duration').value.trim();
    const cost = parseInt(document.getElementById('edit-history-cost').value);
    
    if (!customer || !duration || !cost) {
        alert('Lengkapi semua data!');
        return;
    }
    
    if (history[idx]) {
        history[idx].customer = customer;
        history[idx].duration = duration;
        history[idx].cost = cost;
        saveData();
        renderHistory();
        closeEditHistoryModal();
        alert('Transaksi berhasil diperbarui!');
    }
}

function deleteHistory(idx) {
    if (confirm('Hapus transaksi ini?')) {
        history.splice(idx, 1);
        saveData();
        renderHistory();
        alert('Transaksi berhasil dihapus!');
    }
}

function saveData() {
    if (typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE) {
        const data = {
            units: units,
            history: history,
            promos: promos,
            products: products,
            cart: cart,
            activeOrders: activeOrders,
            waitingList: waitingList,
            updatedAt: Date.now()
        };
        db.ref('boxplay').set(data)
            .then(() => console.log('Data saved to Firebase successfully'))
            .catch((error) => console.error('Error saving to Firebase:', error));
    }
    
    localStorage.setItem('pb_units', JSON.stringify(units));
    localStorage.setItem('pb_history', JSON.stringify(history));
    localStorage.setItem('pb_promos', JSON.stringify(promos));
    localStorage.setItem('pb_products', JSON.stringify(products));
    localStorage.setItem('pb_cart', JSON.stringify(cart));
    localStorage.setItem('pb_active_orders', JSON.stringify(activeOrders));
}

function loadDataFromFirebase() {
    if (typeof USE_FIREBASE === 'undefined' || !USE_FIREBASE) return;
    
    db.ref('boxplay').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log('Data loaded from Firebase:', data);
            
            if (data.units) {
                units = data.units.map((unit, index) => {
                    if (!unit.image) {
                        const defaultUnit = defaultUnits.find(u => u.id === unit.id) || defaultUnits[index];
                        unit.image = defaultUnit ? defaultUnit.image : 'foto_boxplay/FOTO 2.JPG';
                    }
                    return unit;
                });
            }
            if (data.history) history = data.history;
            if (data.promos) promos = data.promos;
            if (data.products) products = data.products;
            if (data.cart) cart = data.cart;
            if (data.activeOrders) activeOrders = data.activeOrders;
            if (data.waitingList) waitingList = data.waitingList;
            
            const path = window.location.pathname;
            const page = path.split("/").pop().toLowerCase();
            
            if (page.includes('dashboard.html')) {
                renderDashboard();
                renderHistory();
                renderPromoManagement();
                renderProductManagement();
                renderUnitsManagement();
            } else if (page === 'beranda.html' || page === 'index.html' || page === '' || page === 'beranda') {
                renderHomeProducts();
                renderPromos();
            } else if (page.includes('dashboard_operator')) {
                renderDashboard();
            } else if (page.includes('dashboard_kasir')) {
                renderKasirDashboard();
            }
        } else {
            console.log('No data in Firebase, initializing with default data and pushing to Firebase');
            saveData();
        }
    }, (error) => {
        console.error('Error loading from Firebase:', error);
    });
}

// --- KASIR LOGIC ---
function renderKasirDashboard() {
    renderKasirOrders();
}

function renderKasirOrders() {
    const container = document.getElementById('kasir-orders-container');
    if (!container) return;

    activeOrders = JSON.parse(localStorage.getItem('pb_active_orders')) || [];

    if (activeOrders.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 4rem; color: var(--text-muted);">Belum ada pesanan masuk</div>';
        return;
    }

    container.innerHTML = activeOrders.map(order => `
        <div class="unit-card" style="border-left: 5px solid ${order.status === 'selesai' ? 'var(--success)' : 'var(--warning)'}">
            <div class="flex justify-between items-center mb-4">
                <span class="status-pill ${order.status === 'selesai' ? 'status-active' : 'status-idle'}">${order.status.toUpperCase()}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${order.time}</span>
            </div>
            <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${order.customer}</h4>
            <p style="font-size: 0.85rem; color: var(--primary); font-weight: 700; margin-bottom: 1rem;">Meja: ${order.table}</p>
            
            <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 1rem; margin-bottom: 1.5rem;">
                ${order.items.map(item => `
                    <div class="flex justify-between" style="font-size: 0.85rem; margin-bottom: 0.3rem;">
                        <span>${item.name} (x${item.qty})</span>
                        <span>${formatIDR(item.price * item.qty)}</span>
                    </div>
                `).join('')}
                <div class="flex justify-between" style="border-top: 1px solid var(--border); margin-top: 0.5rem; padding-top: 0.5rem; font-weight: 800; color: #fff;">
                    <span>TOTAL</span>
                    <span>${formatIDR(order.total)}</span>
                </div>
            </div>

            <div class="flex gap-2">
                ${order.status === 'masuk' ? `
                    <button class="btn btn-primary w-full" onclick="updateOrderStatus(${order.id}, 'proses')">PROSES</button>
                ` : order.status === 'proses' ? `
                    <button class="btn btn-primary w-full" style="background: var(--success); color: #000;" onclick="updateOrderStatus(${order.id}, 'selesai')">SELESAI</button>
                ` : `
                    <button class="btn btn-outline w-full" onclick="deleteOrder(${order.id})"><i class="fas fa-trash"></i> HAPUS</button>
                `}
            </div>
        </div>
    `).join('');
}

function updateOrderStatus(id, newStatus) {
    // Re-assign for safety
    activeOrders = JSON.parse(localStorage.getItem('pb_active_orders')) || [];
    const idx = activeOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
        activeOrders[idx].status = newStatus;
        saveData();
        renderKasirDashboard();
    }
}

function deleteOrder(id) {
    if (confirm('Hapus riwayat pesanan ini?')) {
        activeOrders = activeOrders.filter(o => o.id !== id);
        saveData();
        renderKasirDashboard();
    }
}

// Reset data to defaults for NUD CAFE setup
function resetToNudDefaults() {
    localStorage.removeItem('pb_units');
    localStorage.removeItem('pb_products');
    localStorage.removeItem('pb_waiting');
    location.reload();
}

// --- PRODUCT MANAGEMENT (ADMIN) ---
function renderProductManagement() {
    const list = document.getElementById('product-manage-list');
    if (!list) return;

    list.innerHTML = products.map(p => {
        const isReady = p.stock > 0;
        const buttonText = isReady ? 'Set to Sold' : 'Set to Ready';
        const buttonClass = isReady ? 'btn-outline' : 'btn-primary';
        
        return `
        <div class="history-card" style="margin-bottom: 1rem; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <div class="flex items-center gap-4">
                <div style="background: var(--border); width: 50px; height: 50px; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: var(--primary);">
                    <i class="${p.icon}" style="font-size: 1.5rem;"></i>
                </div>
                <div>
                    <div style="font-weight: 800; color: var(--primary); font-size: 0.75rem;">${p.category}</div>
                    <div style="font-weight: 700;">${p.name}</div>
                    <div style="font-size: 0.9rem; font-weight: 800; color: #fff;">${formatIDR(p.price)}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Status: <span class="${isReady ? 'status-ready' : 'status-sold'}" style="padding: 0.2rem 0.5rem; border-radius: 0.3rem; font-size: 0.7rem; font-weight: 700;">${isReady ? 'READY' : 'SOLD'}</span></div>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="btn ${buttonClass}" style="padding: 0.5rem 1rem;" onclick="toggleStock(${p.id})">
                    <i class="fas fa-${isReady ? 'times' : 'check'}"></i> ${buttonText}
                </button>
                <button class="btn btn-outline" style="border-color: var(--danger); color: var(--danger); padding: 0.5rem 1rem;" onclick="deleteProduct(${p.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function addProduct() {
    const name = document.getElementById('prod-name-input').value.trim();
    const price = parseInt(document.getElementById('prod-price-input').value);
    const category = document.getElementById('prod-cat-input').value;
    const stock = parseInt(document.getElementById('prod-stock-input').value) || 0;
    const icon = document.getElementById('prod-icon-input').value || 'fas fa-utensils';

    if (!name || isNaN(price)) return alert('Lengkapi data produk!');

    const newProd = {
        id: Date.now(),
        name,
        price,
        category,
        stock,
        icon
    };

    products.push(newProd);
    saveData();
    renderProductManagement();
    
    // Reset form
    document.getElementById('prod-name-input').value = '';
    document.getElementById('prod-price-input').value = '';
    document.getElementById('prod-stock-input').value = '10';
    alert('Produk berhasil ditambahkan!');
}

function deleteProduct(id) {
    if (confirm('Hapus produk ini?')) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProductManagement();
    }
}

function editStock(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStock = prompt(`Edit stok untuk "${product.name}":`, product.stock);
    if (newStock === null) return; // Cancelled

    const stockValue = parseInt(newStock);
    if (isNaN(stockValue) || stockValue < 0) {
        alert('Stok harus berupa angka positif!');
        return;
    }

    product.stock = stockValue;
    saveData();
    renderProductManagement();
    renderHomeMenu(); // Update tampilan di beranda juga
    alert(`Stok "${product.name}" berhasil diubah menjadi ${stockValue}!`);
}

function toggleStock(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Toggle: jika ready (stok > 0) -> set to sold (0), jika sold (0) -> set to ready (1)
    const newStock = product.stock > 0 ? 0 : 1;
    const newStatus = newStock > 0 ? 'READY' : 'SOLD';

    product.stock = newStock;
    saveData();
    renderProductManagement();
    renderHomeMenu(); // Update tampilan di beranda juga
    alert(`Status "${product.name}" berhasil diubah ke ${newStatus}!`);
}

function processCheckout() {
    console.log("Processing checkout...");
    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const tableInput = document.getElementById('checkout-table');
    const methodInput = document.getElementById('checkout-method');

    if (!nameInput || !phoneInput || !tableInput || !methodInput) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const table = tableInput.value.trim();
    const method = methodInput.value;

    if (!name || !phone || !table) {
        alert('Harap lengkapi semua data pengiriman!');
        return;
    }

    // Ensure we have latest cart
    cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    
    // Create new order
    const newOrder = {
        id: Date.now(),
        customer: name,
        phone: phone,
        table: table,
        method: method,
        items: [...cart],
        total: total,
        status: 'masuk',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Update active orders
    activeOrders = JSON.parse(localStorage.getItem('pb_active_orders')) || [];
    activeOrders.unshift(newOrder);
    
    // Clear cart
    cart = [];
    
    // Save everything
    saveData();

    // Prepare WhatsApp Message
    let message = `*PESANAN BARU - BOXPLAY x NUD*\n`;
    message += `--------------------------------\n`;
    message += `*Nama:* ${name}\n`;
    message += `*No. HP:* ${phone}\n`;
    message += `*Meja/Posisi:* ${table}\n`;
    message += `*Metode Bayar:* ${method.toUpperCase()}\n`;
    message += `--------------------------------\n`;
    message += `*DAFTAR PESANAN:*\n`;
    
    newOrder.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.qty}x) - ${formatIDR(item.price * item.qty)}\n`;
    });
    
    message += `--------------------------------\n`;
    message += `*TOTAL BAYAR: ${formatIDR(total)}*\n\n`;
    
    if (method === 'qris') {
        message += `_Pelanggan telah membayar via QRIS. Mohon cek mutasi._\n`;
    } else {
        message += `_Pelanggan akan bayar tunai di kasir._\n`;
    }

    const waNumber = "6281234567890"; // Ganti dengan nomor WhatsApp admin
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    // Feedback and Redirect
    const btn = document.getElementById('pay-button');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MENGARAHKAN...';
    }

    // Direct redirect to avoid popup block issues
    window.location.href = waUrl;
}

function processBooking() {
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const branch = document.getElementById('booking-branch').value;
    const unitLabel = document.getElementById('selected-unit-label').innerText;

    if (!name || !phone) return alert('Lengkapi data pemesanan!');

    // Update Waiting List
    waitingList = JSON.parse(localStorage.getItem('pb_waiting_list')) || [];
    const newBooking = {
        id: Date.now(),
        name,
        phone,
        branch,
        unit: unitLabel,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    waitingList.push(newBooking);
    
    // Save
    saveData();

    // WhatsApp logic
    const message = `*BOOKING UNIT - BOXPLAY*\n------------------\n*Nama:* ${name}\n*No. HP:* ${phone}\n*Cabang:* ${branch}\n*Unit:* ${unitLabel}\n------------------\n_Mohon tunggu konfirmasi operator._`;
    const waNumber = "6281234567890";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    alert('Booking berhasil! Anda akan diarahkan ke WhatsApp.');
    window.location.href = waUrl;
}

// --- INIT ---
initPage(); // Initial render for current page
setInterval(updateTimers, 1000);

// Enter key for modal
const custInput = document.getElementById('cust-name-input');
if (custInput) {
    custInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('confirm-start-btn').click();
    });
}
