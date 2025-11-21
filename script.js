// Main JavaScript functionality for Gadget Nexus
class GadgetNexus {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = this.getProducts();
        this.init();
    }

    init() {
        this.initTheme();
        this.initCart();
        this.initProducts();
        this.initServices();
        this.initContactForm();
        this.initAnimations();
        this.initStats();
        this.initWatermark();
    }

    // Stats counters (About page)
    initStats() {
        const stats = document.querySelectorAll('.stat-number');
        if (!stats || stats.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        stats.forEach(s => observer.observe(s));
    }

    animateCount(el) {
        const target = parseInt(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400; // ms
        const start = 0;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(progress * (target - start) + start);
            el.textContent = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target + suffix;
            }
        };

        requestAnimationFrame(tick);
    }

    // Watermark avatar upload and persistence
    initWatermark() {
        // Ensure watermark text includes phone number on pages
        try {
            document.querySelectorAll('.watermark').forEach(wm => {
                // If watermark already contains a phone link, skip
                if (wm.querySelector('.wm-phone')) return;
                wm.innerHTML = `Created by <strong>Mahlatsi Mashifane</strong> — <a class="wm-phone" href="tel:0812668996">081 266 8996</a>`;
            });
        } catch (err) {
            // Non-fatal
        }
    }

    // Theme Management
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';

        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon();

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon();
            });
        }
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const theme = document.documentElement.getAttribute('data-theme');
            icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Cart Management
    initCart() {
        const cartIcon = document.getElementById('cartIcon');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');
        const getQuoteBtn = document.getElementById('getQuoteBtn');

        if (cartIcon && cartSidebar) {
            cartIcon.addEventListener('click', () => this.toggleCart());
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => this.toggleCart());
        }

        if (getQuoteBtn) {
            getQuoteBtn.addEventListener('click', () => this.sendQuoteRequest());
        }

        this.updateCartCount();
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('active');
            this.updateCartDisplay();
        }
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
        });
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartTotal) return;

        cartItems.innerHTML = '';
        let total = 0;

        this.cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="gadgetNexus.removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        if (cartTotal) {
            cartTotal.textContent = total;
        }
        
        this.updateCartCount();
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addToCart(productName, productPrice) {
        const existingItem = this.cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: productName,
                price: parseInt(productPrice),
                quantity: 1
            });
        }
        
        this.updateCartDisplay();
        this.showNotification(`${productName} added to cart!`);
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartDisplay();
        this.showNotification('Item removed from cart');
    }

    // Products Management
    initProducts() {
        this.loadProducts();
        this.initProductFilters();
        this.initProductModals();
    }

    getProducts() {
        return [
            {
                id: 'dell-xps-13',
                name: 'Dell XPS 13',
                price: 8499,
                image: 'assets/images/laptops/dell-xps-13.jpg',
                specs: 'Intel Core i7-1165G7 • 16GB RAM • 512GB SSD • 13.4" FHD+ • Windows 11 Pro',
                condition: 'Excellent - Minor cosmetic wear, fully tested',
                features: ['Thunderbolt 4', 'Backlit Keyboard', 'Fingerprint Reader', 'Wi-Fi 6']
            },
            {
                id: 'macbook-pro-16',
                name: 'MacBook Pro 16"',
                price: 15999,
                image: 'assets/images/laptops/macbook-pro-16.jpg',
                specs: 'Apple M1 Pro • 16GB RAM • 1TB SSD • 16" Liquid Retina • macOS',
                condition: 'Like New - Minimal usage, battery health 95%',
                features: ['M1 Pro Chip', 'Liquid Retina XDR', 'Magic Keyboard', 'Touch ID']
            },
            {
                id: 'hp-spectre-x360',
                name: 'HP Spectre x360',
                price: 6299,
                image: 'assets/images/laptops/hp-spectre-x360.jpg',
                specs: 'Intel Core i5-1135G7 • 8GB RAM • 256GB SSD • 13.5" Touch • Windows 11',
                condition: 'Very Good - Light use, excellent condition',
                features: ['2-in-1 Convertible', 'Pen Support', 'Bang & Olufsen Audio', 'IR Camera']
            },
            {
                id: 'lenovo-thinkpad-x1',
                name: 'Lenovo ThinkPad X1',
                price: 7299,
                image: 'assets/images/laptops/lenovo-thinkpad-x1.jpg',
                specs: 'Intel Core i5-1145G7 • 16GB RAM • 512GB SSD • 14" FHD • Windows 11 Pro',
                condition: 'Excellent - Business grade, well maintained',
                features: ['Military Durability', 'ThinkShutter', 'Dolby Audio', 'Rapid Charge']
            },
            {
                id: 'asus-rog-zephyrus',
                name: 'ASUS ROG Zephyrus',
                price: 11999,
                image: 'assets/images/laptops/asus-rog-zephyrus.jpg',
                specs: 'AMD Ryzen 7 • 16GB RAM • 1TB SSD • RTX 3060 • 15.6" QHD • Windows 11',
                condition: 'Good - Gaming laptop, performance tested',
                features: ['NVIDIA RTX 3060', '144Hz Display', 'RGB Keyboard', 'Advanced Cooling']
            },
            {
                id: 'microsoft-surface-laptop',
                name: 'Microsoft Surface Laptop',
                price: 8999,
                image: 'assets/images/laptops/microsoft-surface-laptop.jpg',
                specs: 'Intel Core i5 • 8GB RAM • 256GB SSD • 13.5" Touch • Windows 11',
                condition: 'Like New - Minimal use, pristine condition',
                features: ['Alcantara Keyboard', 'Touch Display', 'Windows Hello', 'Surface Pen']
            },
            {
                id: 'acer-swift-3',
                name: 'Acer Swift 3',
                price: 5499,
                image: 'assets/images/laptops/acer-swift-3.jpg',
                specs: 'AMD Ryzen 5 • 8GB RAM • 512GB SSD • 14" FHD • Windows 11',
                condition: 'Very Good - Lightweight, excellent battery',
                features: ['AMD Ryzen 5', 'Fingerprint Reader', 'Backlit KB', 'Fast Charging']
            },
            {
                id: 'razer-blade-15',
                name: 'Razer Blade 15',
                price: 13999,
                image: 'assets/images/laptops/razer-blade-15.jpg',
                specs: 'Intel Core i7 • 16GB RAM • 1TB SSD • RTX 3070 • 15.6" QHD • Windows 11',
                condition: 'Good - Gaming laptop, fully tested',
                features: ['CNC Aluminum', 'Per-key RGB', 'Vapor Chamber', 'Thunderbolt 4']
            },
            {
                id: 'samsung-galaxy-book',
                name: 'Samsung Galaxy Book',
                price: 6899,
                image: 'assets/images/laptops/samsung-galaxy-book.jpg',
                specs: 'Intel Core i5 • 8GB RAM • 512GB SSD • 15.6" FHD • Windows 11',
                condition: 'Excellent - Business laptop, like new',
                features: ['Samsung Ecosystem', 'Fast Charging', 'Num Pad', 'Slim Design']
            },
            {
                id: 'lg-gram-17',
                name: 'LG Gram 17',
                price: 9999,
                image: 'assets/images/laptops/lg-gram-17.jpg',
                specs: 'Intel Core i7 • 16GB RAM • 1TB SSD • 17" WQXGA • Windows 11',
                condition: 'Like New - Ultra-light, barely used',
                features: ['Ultra Lightweight', 'Military Durability', 'Long Battery', 'Num Pad']
            }
        ];
    }

    loadProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';

        this.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card slide-up';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-specs">${product.specs.split('•').slice(0, 3).join('•')}</p>
                    <div class="product-price">R${product.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" 
                                data-product="${product.name}" 
                                data-price="${product.price}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline info-btn" 
                                data-product="${product.id}">
                            <i class="fas fa-info-circle"></i> Info
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });

        this.attachProductEvents();
    }

    attachProductEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = e.target.closest('.add-to-cart').dataset.product;
                const price = e.target.closest('.add-to-cart').dataset.price;
                this.addToCart(product, price);
            });
        });

        // Info buttons
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.info-btn').dataset.product;
                this.showProductInfo(productId);
            });
        });
    }

    initProductFilters() {
        const searchInput = document.getElementById('searchInput');
        const priceFilter = document.getElementById('priceFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value, priceFilter?.value);
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.filterProducts(searchInput?.value, e.target.value);
            });
        }
    }

    filterProducts(searchTerm = '', priceRange = 'all') {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productPrice = parseInt(card.querySelector('.product-price').textContent.replace('R', '').replace(',', ''));
            
            let matchesSearch = true;
            let matchesPrice = true;

            if (searchTerm) {
                matchesSearch = productName.includes(searchTerm.toLowerCase());
            }

            if (priceRange !== 'all') {
                switch (priceRange) {
                    case '2000-5000':
                        matchesPrice = productPrice >= 2000 && productPrice <= 5000;
                        break;
                    case '5000-10000':
                        matchesPrice = productPrice >= 5000 && productPrice <= 10000;
                        break;
                    case '10000+':
                        matchesPrice = productPrice >= 10000;
                        break;
                }
            }

            if (matchesSearch && matchesPrice) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    initProductModals() {
        const modal = document.getElementById('productModal');
        const closeModal = document.querySelector('.close-modal');

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showProductInfo(productId) {
        const product = this.products.find(p => p.id === productId);
        const modal = document.getElementById('productModal');
        const modalContent = document.getElementById('modalContent');

        if (!product || !modal || !modalContent) return;

        modalContent.innerHTML = `
            <h2>${product.name}</h2>
            <div class="product-modal-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
            </div>
            <div class="product-modal-details">
                <div class="detail-section">
                    <h3>Specifications</h3>
                    <p>${product.specs}</p>
                </div>
                <div class="detail-section">
                    <h3>Condition</h3>
                    <p>${product.condition}</p>
                </div>
                <div class="detail-section">
                    <h3>Key Features</h3>
                    <ul class="feature-list">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h3>Warranty</h3>
                    <p>30 Days Comprehensive Warranty Included</p>
                </div>
                <div class="product-modal-actions">
                    <button class="btn btn-primary" onclick="gadgetNexus.addToCart('${product.name}', ${product.price}); gadgetNexus.closeModal();">
                        <i class="fas fa-cart-plus"></i> Add to Cart - R${product.price}
                    </button>
                    <button class="btn btn-secondary" onclick="gadgetNexus.sendSingleQuote('${product.name}', ${product.price})">
                        <i class="fas fa-paper-plane"></i> Get Quote
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Services Management
    initServices() {
        document.querySelectorAll('.service-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const service = e.target.closest('.service-btn').dataset.service;
                this.sendServiceQuote(service);
            });
        });
    }

    // Contact Form
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }
    }

    handleContactForm() {
        const form = document.getElementById('contactForm');
        const success = document.getElementById('formSuccess');

        // Simulate form submission
        form.style.display = 'none';
        success.style.display = 'block';

        // Reset form after 5 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            success.style.display = 'none';
        }, 5000);
    }

    // Quote System
    sendQuoteRequest() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        const subject = "Laptop Quote Request - Gadget Nexus";
        const items = this.cart.map(item => `${item.name} (Qty: ${item.quantity}) - R${item.price * item.quantity}`).join('%0A');
        const body = `Hello Gadget Nexus,%0A%0AI'm interested in getting a quote for the following laptops:%0A%0A${items}%0A%0APlease provide me with more information and availability.%0A%0ABest regards,%0A[Your Name]`;
        
        window.location.href = `mailto:mahlatsimashifane@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    }

    sendSingleQuote(productName, productPrice) {
        const subject = "Laptop Quote Request - Gadget Nexus";
        const body = `Hello Gadget Nexus,%0A%0AI'm interested in getting a quote for:%0A%0A${productName} - R${productPrice}%0A%0APlease provide me with more information and availability.%0A%0ABest regards,%0A[Your Name]`;
        
        window.location.href = `mailto:mahlatsimashifane@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        this.closeModal();
    }

    sendServiceQuote(serviceName) {
        const subject = "Service Quote Request - Gadget Nexus";
        const body = `Hello Gadget Nexus,%0A%0AI'm interested in your ${serviceName} service.%0A%0APlease provide me with more information and pricing.%0A%0ABest regards,%0A[Your Name]`;
        
        window.location.href = `mailto:mahlatsimashifane@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    }

    // Animations
    initAnimations() {
        this.initScrollAnimations();
        this.initHoverEffects();
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    initHoverEffects() {
        // Add tilt effect to product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', this.handleTilt);
            card.addEventListener('mouseleave', this.resetTilt);
        });
    }

    handleTilt(e) {
        const card = e.currentTarget;
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rotateX = (mouseY / cardRect.height) * -10;
        const rotateY = (mouseX / cardRect.width) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }

    // Utilities
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification slide-up';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-gold);
            color: var(--black);
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 1000;
            box-shadow: var(--shadow-xl);
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize the application
const gadgetNexus = new GadgetNexus();

// Make it globally available
window.gadgetNexus = gadgetNexus;

// WhatsApp integration
function openWhatsAppCatalog() {
    window.open('https://wa.me/c/27719679307', '_blank');
}

// Order Now buttons (for products.html)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.order-now').forEach(btn => {
        btn.addEventListener('click', openWhatsAppCatalog);
    });
});