/* ============================================
   ParcBois - Frontend JavaScript ONLY
   Backend (PHP / SQL) REMOVED
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSlider();
    initAnimations();
    initForms();
    initModals();
    initFilters();
    initCharts();
});

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    document.addEventListener('click', e => {
        if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });

    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 100);
        });
    }
}

/* ============================================
   Slider
   ============================================ */
function initSlider() {
    const slider = document.getElementById('woodsSlider');
    const prev = document.getElementById('sliderPrev');
    const next = document.getElementById('sliderNext');

    if (!slider || !prev || !next) return;

    const step = 310;

    prev.onclick = () => slider.scrollBy({ left: -step, behavior: 'smooth' });
    next.onclick = () => slider.scrollBy({ left: step, behavior: 'smooth' });
}

/* ============================================
   Cart (TEMPORAIRE – FRONTEND SEULEMENT)
   ============================================ */
const Cart = {
    items: [],

    add(item) {
        this.items.push(item);
        updateCartUI();
    },

    remove(index) {
        this.items.splice(index, 1);
        updateCartUI();
    },

    total() {
        return this.items.reduce((t, i) => t + i.price, 0);
    }
};

function updateCartUI() {
    const count = document.querySelectorAll('.cart-count');
    count.forEach(c => c.textContent = Cart.items.length);

    const list = document.getElementById('cartItems');
    if (!list) return;

    if (Cart.items.length === 0) {
        list.innerHTML = `<p class="empty-cart">Panier vide</p>`;
        return;
    }

    list.innerHTML = Cart.items.map((i, idx) => `
        <div class="cart-item">
            <span>${i.name}</span>
            <span>${formatPrice(i.price)}</span>
            <button onclick="Cart.remove(${idx})">×</button>
        </div>
    `).join('');
}

/* ============================================
   Animations
   ============================================ */
function initAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('fade-in-up');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .wood-card').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   Forms (UI ONLY)
   ============================================ */
function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            showAlert('Formulaire envoyé (backend à venir)', 'info');
            form.reset();
        });
    });
}

/* ============================================
   Alerts
   ============================================ */
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    Object.assign(alert.style, {
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3000
    });

    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

/* ============================================
   Modals
   ============================================ */
function initModals() {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = () => closeModal(btn.closest('.modal').id);
    });
}

function openModal(id) {
    document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

/* ============================================
   Filters (UI ONLY)
   ============================================ */
function initFilters() {
    const search = document.getElementById('searchStock');
    if (!search) return;

    search.addEventListener('input', () => {
        console.log('Recherche UI:', search.value);
    });
}

/* ============================================
   Charts (VISUELS)
   ============================================ */
function initCharts() {
    const chart = document.getElementById('salesChart');
    if (!chart) return;

    chart.innerHTML = `
        <div style="display:flex;gap:10px;height:200px;">
            ${[40, 70, 50, 90, 60].map(v => `
                <div style="flex:1;background:#228B22;height:${v * 2}px"></div>
            `).join('')}
        </div>
    `;
}
const API = "backend/";
/* =======================
   ADMIN
======================= */

function addCaissier(nom, email, password) {
    const data = new URLSearchParams({ nom, email, password });

    return fetch(API + "admin/add_caissier.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    }).then(r => r.json());
}

function deleteUser(userId) {
    const data = new URLSearchParams({ user_id: userId });

    return fetch(API + "admin/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    }).then(r => r.json());
}
/* =======================
   CLIENT
======================= */

function passerCommande(panier) {
    const data = new URLSearchParams();
    data.append("items", JSON.stringify(panier));

    return fetch(API + "commandes/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    }).then(r => r.json());
}
/* =======================
   CAISSIER
======================= */

function validerCommande(commandeId) {
    const data = new URLSearchParams({ commande_id: commandeId });

    return fetch(API + "commandes/validate.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    }).then(r => r.json());
}
/* =======================
   CONTACT
======================= */

function envoyerMessage(nom, email, message) {
    const data = new URLSearchParams({ nom, email, message });

    return fetch(API + "messages/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
    }).then(r => r.json());
}

headers: {
  "Content-Type": "application/x-www-form-urlencoded"
},
credentials: "include"
document.getElementById("formAddCaissier").addEventListener("submit", e => {
    e.preventDefault();

    const data = new URLSearchParams();
    data.append("nom", nom.value);
    data.append("email", email.value);
    data.append("password", password.value);

    fetch("backend/admin/add_caissier.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) alert("Caissier ajouté");
        else alert("Erreur");
    });
});
function deleteUser(userId) {
    const data = new URLSearchParams();
    data.append("user_id", userId);

    fetch("backend/admin/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            alert("Utilisateur supprimé");
            location.reload();
        }
    });
}
function passerCommande(panier) {
    const data = new URLSearchParams();
    data.append("items", JSON.stringify(panier));

    fetch("backend/commandes/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            alert("Commande envoyée");
        }
    });
}
[
  { stock_id: 3, quantite: 2, prix: 15000 },
  { stock_id: 7, quantite: 1, prix: 30000 }
]
function validerCommande(commandeId) {
    const data = new URLSearchParams();
    data.append("commande_id", commandeId);

    fetch("backend/commandes/validate.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            alert("Commande validée");
            location.reload();
        }
    });
}
document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = new URLSearchParams();
    data.append("nom", nom.value);
    data.append("email", email.value);
    data.append("message", message.value);

    fetch("backend/messages/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) alert("Message envoyé");
    });
});
if (USER_ROLE === "admin") {
  document.getElementById("menu-admin").style.display = "block";
}
/*=============================
    Login
================================*/ 
function login(email, password) {
    const data = new URLSearchParams({ email, password });

    fetch("backend/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            window.location.href = res.redirect;
        } else {
            alert(res.message);
        }
    });
}
