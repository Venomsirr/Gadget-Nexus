// Main JavaScript functionality for Gadget Nexus
class GadgetNexus {
    constructor() {
        this.products = this.getProducts();
        this.init();
    }

    init() {
        this.initTheme();
        this.initProducts();
        this.initServices();
        this.initContactForm();
        this.initAnimations();
        this.initStats();
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

    redirectToWhatsApp(productName) {
        const message = encodeURIComponent(`Hi, I'm interested in the ${productName}. Can you provide a custom quote including delivery options?`);
        const whatsappUrl = `https://wa.me/27812668996?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }

    // Products Management
    initProducts() {
        this.loadProducts();
        this.attachProductEvents();
        this.initProductFilters();
        this.initProductModals();
    }

    getProducts() {
        return [
            {
                id: 'dell-vostro-core-i5-gaming',
                name: 'Dell Vostro Core i5 Gaming',
                price: 3799,
                image: 'assets/images/laptops/WhatsApp Image 2026-04-08 at 19.22.07 (1).jpeg',
                specs: 'Intel Core i5 • 8GB RAM • Nvidia GeForce GTX 1650 • 15.6" FHD • 512GB SSD',
                condition: 'Excellent condition',
                features: ['Gaming Performance', 'Reliable Build', 'Great Value', 'Backlit Keyboard', 'Fast SSD Storage'],
                detailedSpecs: {
                    processor: 'Intel Core i5-10300H (10th Gen)',
                    ram: '8GB DDR4',
                    storage: '512GB SSD',
                    graphics: 'NVIDIA GeForce GTX 1650 4GB',
                    display: '15.6" FHD (1920x1080) Anti-Glare',
                    os: 'Windows 11 Home',
                    battery: '3-cell, 42Wh',
                    weight: '2.3 kg',
                    ports: 'USB 3.1, HDMI, USB-C, SD Card Reader',
                    warranty: '30 days'
                },
                reviews: [
                    { user: 'GamingFan92', rating: 5, comment: 'Great for casual gaming and work!' },
                    { user: 'TechStudent', rating: 4, comment: 'Solid performance for the price.' }
                ]
            },
            {
                id: 'dell-inspiron-core-i5',
                name: 'Dell Inspiron Core i5',
                price: 3299,
                image: 'assets/images/laptops/WhatsApp Image 2026-04-08 at 19.22.07.jpeg',
                specs: 'Intel Core i5 • 4GB RAM • 500GB HDD • 15.6" HD',
                condition: 'Excellent condition',
                features: ['Student Friendly', 'Lightweight', 'Affordable', 'DVD Drive', 'Numeric Keypad'],
                detailedSpecs: {
                    processor: 'Intel Core i5-7200U (7th Gen)',
                    ram: '4GB DDR4',
                    storage: '500GB HDD',
                    graphics: 'Intel HD Graphics 620',
                    display: '15.6" HD (1366x768)',
                    os: 'Windows 10 Pro',
                    battery: '4-cell, 40Wh',
                    weight: '2.1 kg',
                    ports: 'USB 3.0, USB 2.0, HDMI, Ethernet',
                    warranty: '30 days'
                },
                reviews: [
                    { user: 'StudentLife', rating: 4, comment: 'Perfect for university work and light gaming.' },
                    { user: 'OfficeUser', rating: 5, comment: 'Reliable for daily office tasks.' }
                ]
            },
            {
                id: 'dell-latitude-e7440',
                name: 'Dell Latitude E7440',
                price: 3000,
                image: 'assets/images/laptops/WhatsApp Image 2026-04-08 at 19.22.08 (1).jpeg',
                specs: 'Intel Core i5 (4th Gen) • 4GB RAM • 14" HD • Business Grade',
                condition: 'Excellent condition',
                features: ['Business Grade', 'Durable', 'Professional', 'Smart Card Reader', 'ExpressSign-in'],
                detailedSpecs: {
                    processor: 'Intel Core i5-4300M (4th Gen)',
                    ram: '4GB DDR3',
                    storage: '320GB HDD',
                    graphics: 'Intel HD Graphics 4600',
                    display: '14" HD (1366x768) Anti-Glare',
                    os: 'Windows 10 Pro',
                    battery: '6-cell, 65Wh',
                    weight: '1.9 kg',
                    ports: 'USB 3.0, VGA, HDMI, Smart Card, ExpressCard',
                    warranty: '30 days'
                },
                reviews: [
                    { user: 'BusinessPro', rating: 5, comment: 'Excellent build quality, still runs smoothly.' },
                    { user: 'RemoteWorker', rating: 4, comment: 'Great for business applications.' }
                ]
            },
            {
                id: 'dell-latitude-e5470-1',
                name: 'Dell Latitude E5470',
                price: 3100,
                image: 'assets/images/laptops/WhatsApp Image 2026-04-08 at 19.22.08 (2).jpeg',
                specs: 'Intel Core i5 (6th Gen) • 4GB RAM • 15.6" FHD • Professional',
                condition: 'Excellent condition',
                features: ['Reliable Performance', 'Compact Design', 'Value for Money', 'TPM Security', 'Contacted SmartCard'],
                detailedSpecs: {
                    processor: 'Intel Core i5-6300U (6th Gen)',
                    ram: '4GB DDR4',
                    storage: '500GB HDD',
                    graphics: 'Intel HD Graphics 520',
                    display: '15.6" FHD (1920x1080) Anti-Glare',
                    os: 'Windows 10 Pro',
                    battery: '6-cell, 68Wh',
                    weight: '2.1 kg',
                    ports: 'USB 3.0, USB-C, HDMI, VGA, Smart Card',
                    warranty: '30 days'
                },
                reviews: [
                    { user: 'ITManager', rating: 5, comment: 'Solid business laptop, good value.' },
                    { user: 'Consultant', rating: 4, comment: 'Reliable for client work.' }
                ]
            },
            {
                id: 'dell-inspiron-core-i3',
                name: 'Dell Inspiron Core i3',
                price: 3100,
                image: 'assets/images/laptops/WhatsApp Image 2026-04-08 at 19.22.08.jpeg',
                specs: 'Intel Core i3-6100U • 6GB RAM • 64-bit • Touch Screen • 15.6" HD',
                condition: 'Excellent condition',
                features: ['Touch Screen', 'Versatile', 'Budget Friendly', 'DVD Writer', 'Wave MaxxAudio'],
                detailedSpecs: {
                    processor: 'Intel Core i3-6100U (6th Gen)',
                    ram: '6GB DDR4',
                    storage: '1TB HDD',
                    graphics: 'Intel HD Graphics 520',
                    display: '15.6" HD Touch (1366x768)',
                    os: 'Windows 10 Home',
                    battery: '4-cell, 40Wh',
                    weight: '2.3 kg',
                    ports: 'USB 3.0, USB 2.0, HDMI, SD Card',
                    warranty: '30 days'
                },
                reviews: [
                    { user: 'HomeUser', rating: 4, comment: 'Great touch screen for browsing and media.' },
                    { user: 'Student', rating: 5, comment: 'Perfect for schoolwork and entertainment.' }
                ]
            },
            {
                id: 'lenovo-amd-gaming',
                name: 'Lenovo AMD Gaming',
                price: 3799,
                image: 'assets/images/laptops/WhatsApp Image 2026-04-08 at 19.22.09 (1).jpeg',
                specs: 'AMD Ryzen 5 • 4GB RAM • 9th Gen • 15.6" FHD • Radeon Graphics',
                condition: 'Excellent condition',
                features: ['Gaming Ready', 'AMD Power', 'Great Performance', 'RGB Keyboard', 'Cooling System'],
                detailedSpecs: {
                    processor: 'AMD Ryzen 5 3550H (2nd Gen)',
                    ram: '4GB DDR4',
                    storage: '256GB SSD',
                    graphics: 'AMD Radeon RX 560X 4GB',
                    display: '15.6" FHD (1920x1080) IPS',
                    os: 'Windows 10 Home',
                    battery: '3-cell, 45Wh',
                    weight: '2.2 kg',
                    ports: 'USB 3.1, HDMI, USB-C, Ethernet',
                    warranty: '30 days'
                },
                reviews: [
                    { user: 'GamerDude', rating: 5, comment: 'Awesome gaming performance on a budget!' },
                    { user: 'TechEnthusiast', rating: 4, comment: 'Good AMD setup for gaming and work.' }
                ]
            },
            {
                id: 'dell-latitude-e5470-2',
                name: 'Dell Latitude E5470',
                price: 3100,
                image: 'assets/images/laptops/WhatsApp Image 2026-04-08 at 19.22.09.jpeg',
                specs: 'Intel Core i5 (6th Gen) • 4GB RAM • 15.6" FHD • Business Reliable',
                condition: 'Excellent condition',
                features: ['Business Reliable', 'Long Battery Life', 'Affordable', 'ExpressSign-in', 'SafeID'],
                detailedSpecs: {
                    processor: 'Intel Core i5-6300U (6th Gen)',
                    ram: '4GB DDR4',
                    storage: '500GB HDD',
                    graphics: 'Intel HD Graphics 520',
                    display: '15.6" FHD (1920x1080) Anti-Glare',
                    os: 'Windows 10 Pro',
                    battery: '6-cell, 68Wh',
                    weight: '2.1 kg',
                    ports: 'USB 3.0, USB-C, HDMI, VGA, Smart Card',
                    warranty: '30 days'
                },
                reviews: [
                    { user: 'CorporateUser', rating: 5, comment: 'Excellent battery life and reliability.' },
                    { user: 'Freelancer', rating: 4, comment: 'Good for business and light creative work.' }
                ]
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
            productCard.setAttribute('data-product', product.id);
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-specs">${product.specs.split('•').slice(0, 3).join('•')}</p>
                    <div class="product-price">R${product.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary get-quote-btn" 
                                data-product="${product.name}">
                            <i class="fab fa-whatsapp"></i> Get Quote
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
    }

    attachProductEvents() {
        // Get Quote buttons
        document.querySelectorAll('.get-quote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const product = e.target.closest('.get-quote-btn').dataset.product;
                this.redirectToWhatsApp(product);
            });
        });

        // Product card click opens detail modal
        document.querySelectorAll('.product-card[data-product]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                const productId = card.dataset.product;
                this.showProductInfo(productId);
            });
        });

        // Info buttons
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
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
                    case '2000-2500':
                        matchesPrice = productPrice >= 2000 && productPrice <= 2500;
                        break;
                    case '2500-3000':
                        matchesPrice = productPrice >= 2500 && productPrice <= 3000;
                        break;
                    case '3000+':
                        matchesPrice = productPrice >= 3000;
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

        const specsList = Object.entries(product.detailedSpecs).map(([key, value]) => 
            `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`
        ).join('');

        const reviewsHtml = product.reviews.map(review => 
            `<div class="review-item">
                <div class="review-header">
                    <span class="review-user">${review.user}</span>
                    <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                </div>
                <p class="review-comment">${review.comment}</p>
            </div>`
        ).join('');

        modalContent.innerHTML = `
            <h2>${product.name}</h2>
            <div class="product-modal-details">
                <div class="detail-section">
                    <h3>Key Specifications</h3>
                    <ul class="specs-list">
                        ${specsList}
                    </ul>
                </div>
                <div class="detail-section">
                    <h3>Condition & Warranty</h3>
                    <p><strong>Condition:</strong> ${product.condition}</p>
                    <p><strong>Warranty:</strong> ${product.detailedSpecs.warranty}</p>
                </div>
                <div class="detail-section">
                    <h3>Key Features</h3>
                    <ul class="feature-list">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h3>Customer Reviews</h3>
                    <div class="reviews-container">
                        ${reviewsHtml}
                    </div>
                </div>
                <div class="product-modal-actions">
                    <button class="btn btn-primary" onclick="gadgetNexus.redirectToWhatsApp('${product.name}'); gadgetNexus.closeModal();">
                        <i class="fab fa-whatsapp"></i> Get Custom Quote
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
            background: var(--gradient-cyan);
            color: var(--dark-blue);
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
    window.open('https://wa.me/27812668996', '_blank');
}

// Order Now buttons (for products.html)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.order-now').forEach(btn => {
        btn.addEventListener('click', openWhatsAppCatalog);
    });
});