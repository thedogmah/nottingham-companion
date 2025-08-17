// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            try {
                // Get form data
                const formData = new FormData(this);
                const formObject = {};
                
                // Convert FormData to object
                formData.forEach((value, key) => {
                    if (value.trim() !== '') {
                        formObject[key] = value.trim();
                    }
                });
                
                // Add UTM parameters if available
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('utm_source')) formObject.utmSource = urlParams.get('utm_source');
                if (urlParams.get('utm_medium')) formObject.utmMedium = urlParams.get('utm_medium');
                if (urlParams.get('utm_campaign')) formObject.utmCampaign = urlParams.get('utm_campaign');
                
                // Submit to MongoDB API
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Success
                    showNotification(result.message, 'success');
                    contactForm.reset();
                    
                    // Track successful submission (for analytics)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'engagement',
                            'event_label': 'companion_service_inquiry'
                        });
                    }
                } else {
                    // Error from server
                    showNotification(result.error || 'Failed to send message. Please try again.', 'error');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.reason-card, .contact-method');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Mobile menu toggle (for smaller screens)
    const nav = document.querySelector('.nav');
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '☰';
    navToggle.style.display = 'none';
    
    // Insert toggle button before nav
    nav.parentNode.insertBefore(navToggle, nav);
    
    navToggle.addEventListener('click', function() {
        nav.classList.toggle('nav-open');
        this.innerHTML = nav.classList.contains('nav-open') ? '✕' : '☰';
    });

    // Hide mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
            nav.classList.remove('nav-open');
            navToggle.innerHTML = '☰';
        }
    });

    // Add mobile nav styles
    const mobileNavStyles = `
        @media (max-width: 768px) {
            .nav-toggle {
                display: block !important;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
            }
            
            .nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #2c3e50;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            
            .nav.nav-open {
                display: flex;
            }
            
            .nav a {
                padding: 1rem;
                border-radius: 6px;
                text-align: center;
            }
        }
    `;
    
    // Add mobile nav styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mobileNavStyles;
    document.head.appendChild(styleSheet);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        }
        
        .notification-success {
            border-left: 4px solid #27ae60;
        }
        
        .notification-error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification-info {
            border-left: 4px solid #3498db;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.5rem;
        }
        
        .notification-message {
            color: #2c3e50;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #95a5a6;
            cursor: pointer;
            padding: 0;
            margin-left: 1rem;
        }
        
        .notification-close:hover {
            color: #2c3e50;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e74c3c';
            
            // Reset border color after 3 seconds
            setTimeout(() => {
                field.style.borderColor = '#ecf0f1';
            }, 3000);
        } else {
            field.style.borderColor = '#ecf0f1';
        }
    });
    
    return isValid;
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Load pricing from admin panel
function loadPricing() {
    const pricing = JSON.parse(localStorage.getItem('companionPricing')) || {
        hourlyRate: '£35',
        halfDayRate: '£120',
        fullDayRate: '£200',
        overnightRate: '£250',
        weeklyRate: '£1000',
        travelFee: '£0.50'
    };
    
    // Update pricing display
    const hourlyPrice = document.getElementById('hourlyPrice');
    const halfDayPrice = document.getElementById('halfDayPrice');
    const fullDayPrice = document.getElementById('fullDayPrice');
    
    if (hourlyPrice) hourlyPrice.textContent = pricing.hourlyRate;
    if (halfDayPrice) halfDayPrice.textContent = pricing.halfDayRate;
    if (fullDayPrice) fullDayPrice.textContent = pricing.fullDayRate;
}

// Update form service type options based on pricing
function updateServiceTypeOptions() {
    const serviceTypeSelect = document.getElementById('serviceType');
    if (!serviceTypeSelect) return;
    
    const pricing = JSON.parse(localStorage.getItem('companionPricing')) || {
        hourlyRate: '£35',
        halfDayRate: '£120',
        fullDayRate: '£200'
    };
    
    // Update the service type options to include pricing
    const options = serviceTypeSelect.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === 'errands') {
            option.textContent = `Running Errands (from ${pricing.hourlyRate}/hour)`;
        } else if (option.value === 'local-guidance') {
            option.textContent = `Local Area Guidance (from ${pricing.hourlyRate}/hour)`;
        } else if (option.value === 'life-admin') {
            option.textContent = `Life Admin Help (from ${pricing.hourlyRate}/hour)`;
        } else if (option.value === 'companionship') {
            option.textContent = `General Companionship (from ${pricing.hourlyRate}/hour)`;
        }
    });
}

// Image Carousel Functionality
let currentImageIndex = 0;
let imageCarousel = null;
let carouselInterval = null;
const carouselDelay = 5000; // 5 seconds

// Initialize image carousel
function initImageCarousel() {
    imageCarousel = document.getElementById('imageCarousel');
    if (!imageCarousel) return;
    
    // Load images from the images folder
    loadCarouselImages();
    
    // Start auto-rotation
    startCarouselAutoRotation();
}

// Load images from the images folder
async function loadCarouselImages() {
    try {
        // Fetch images from the API
        const response = await fetch('/api/images');
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load images');
        }
        
        if (data.images.length === 0) {
            showCarouselFallback();
            return;
        }
        
        // Create carousel images
        data.images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.name || `Professional photo ${index + 1}`;
            img.className = 'carousel-image';
            img.style.zIndex = index === 0 ? '1' : '0';
            
            if (index === 0) {
                img.classList.add('active');
            }
            
            imageCarousel.appendChild(img);
        });
        
        // Create indicators
        createCarouselIndicators(data.images.length);
        
        // Set initial state
        currentImageIndex = 0;
        updateCarouselDisplay();
        
        console.log(`✅ Loaded ${data.images.length} images for carousel`);
        
    } catch (error) {
        console.error('Error loading carousel images:', error);
        showCarouselFallback();
    }
}

// Show fallback message when no images are available
function showCarouselFallback() {
    imageCarousel.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
            <div>
                <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">Add Your Photos</h3>
                <p style="color: #64748b; line-height: 1.6;">
                    Upload professional photos to the <strong>/images</strong> folder<br>
                    to showcase your services and personality
                </p>
                <div style="margin-top: 1rem; padding: 1rem; background: #f1f5f9; border-radius: 8px; font-size: 0.9rem;">
                    <strong>Recommended:</strong> Professional headshots, Nottingham landmarks,<br>
                    service-related photos (1200x800px, under 2MB)
                </div>
            </div>
        </div>
    `;
}

// Create carousel indicators
function createCarouselIndicators(count) {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        
        indicator.addEventListener('click', () => {
            goToImage(i);
        });
        
        indicatorsContainer.appendChild(indicator);
    }
}

// Update carousel display
function updateCarouselDisplay() {
    const images = imageCarousel.querySelectorAll('.carousel-image');
    const indicators = document.querySelectorAll('.indicator');
    
    if (images.length === 0) return;
    
    // Update images
    images.forEach((img, index) => {
        img.classList.remove('active');
        img.style.zIndex = '0';
    });
    
    images[currentImageIndex].classList.add('active');
    images[currentImageIndex].style.zIndex = '1';
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
    });
    
    if (indicators[currentImageIndex]) {
        indicators[currentImageIndex].classList.add('active');
    }
}

// Go to specific image
function goToImage(index) {
    const images = imageCarousel.querySelectorAll('.carousel-image');
    if (index < 0 || index >= images.length) return;
    
    currentImageIndex = index;
    updateCarouselDisplay();
    
    // Reset auto-rotation timer
    resetCarouselTimer();
}

// Next image
function nextImage() {
    const images = imageCarousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateCarouselDisplay();
    resetCarouselTimer();
}

// Previous image
function previousImage() {
    const images = imageCarousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;
    
    currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    updateCarouselDisplay();
    resetCarouselTimer();
}

// Start auto-rotation
function startCarouselAutoRotation() {
    if (carouselInterval) clearInterval(carouselInterval);
    
    carouselInterval = setInterval(() => {
        nextImage();
    }, carouselDelay);
}

// Reset carousel timer
function resetCarouselTimer() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        startCarouselAutoRotation();
    }
}

// Pause auto-rotation on hover
function pauseCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// Resume auto-rotation when mouse leaves
function resumeCarousel() {
    if (!carouselInterval) {
        startCarouselAutoRotation();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadPricing();
    updateServiceTypeOptions();
    initImageCarousel();
    
    // Add hover events to pause/resume carousel
    const carousel = document.getElementById('imageCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseCarousel);
        carousel.addEventListener('mouseleave', resumeCarousel);
    }
    
    // Listen for pricing changes from admin panel
    window.addEventListener('storage', function(e) {
        if (e.key === 'companionPricing') {
            loadPricing();
            updateServiceTypeOptions();
        }
    });
});
