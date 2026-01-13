/**
 * Saiteja Asset Management - Main JavaScript
 * Handles all interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
    initFaqToggle();
    initChartAnimation();
    initTestimonialSlider();
    initBackToTop();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                header.style.height = '70px';
            } else {
                header.classList.remove('scrolled');
                header.style.height = '80px';
            }
        });
    }
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(function(element) {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        animatedElements.forEach(function(element) {
            element.classList.add('visible');
        });
    }
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Contact Form Validation and Submission
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            
            // Validation
            let isValid = true;
            let errors = [];
            
            if (name.length < 2) {
                isValid = false;
                errors.push('Please enter a valid name');
                highlightError('name');
            } else {
                removeError('name');
            }
            
            if (!isValidEmail(email)) {
                isValid = false;
                errors.push('Please enter a valid email address');
                highlightError('email');
            } else {
                removeError('email');
            }
            
            if (!isValidPhone(phone)) {
                isValid = false;
                errors.push('Please enter a valid phone number');
                highlightError('phone');
            } else {
                removeError('phone');
            }
            
            if (!service) {
                isValid = false;
                errors.push('Please select a service');
                highlightError('service');
            } else {
                removeError('service');
            }
            
            if (message.length < 10) {
                isValid = false;
                errors.push('Please enter a message (at least 10 characters)');
                highlightError('message');
            } else {
                removeError('message');
            }
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = form.querySelector('.form-submit');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(function() {
                    showNotification('success', 'Thank you for your message! We will get back to you within 24 hours.');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                showNotification('error', errors[0]);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateField(field) {
    const id = field.id;
    const value = field.value.trim();
    
    switch(id) {
        case 'name':
            if (value.length < 2) {
                highlightError('name');
                return false;
            }
            removeError('name');
            return true;
            
        case 'email':
            if (!isValidEmail(value)) {
                highlightError('email');
                return false;
            }
            removeError('email');
            return true;
            
        case 'phone':
            if (!isValidPhone(value)) {
                highlightError('phone');
                return false;
            }
            removeError('phone');
            return true;
            
        case 'service':
            if (!value) {
                highlightError('service');
                return false;
            }
            removeError('service');
            return true;
            
        case 'message':
            if (value.length < 10) {
                highlightError('message');
                return false;
            }
            removeError('message');
            return true;
            
        default:
            return true;
    }
}

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    var phoneRegex = /^[0-9]{10}$/;
    var phoneRegex2 = /^[0-9+\-\s]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-]/g, '')) || phoneRegex2.test(phone);
}

function highlightError(fieldId) {
    var field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#EF4444';
        field.style.backgroundColor = '#FEF2F2';
        field.classList.add('error');
    }
}

function removeError(fieldId) {
    var field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        field.classList.remove('error');
    }
}

function showNotification(type, message) {
    // Remove existing notification
    var existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = '<span>' + message + '</span><button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>';
    
    // Add styles
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; padding: 16px 24px; border-radius: 8px; display: flex; align-items: center; gap: 12px; z-index: 9999; animation: slideInRight 0.3s ease; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);';
    
    if (type === 'success') {
        notification.style.backgroundColor = '#10B981';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#EF4444';
        notification.style.color = 'white';
    }
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        var style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = '@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(function() {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * FAQ Toggle Functionality
 */
function initFaqToggle() {
    // Add click event to all FAQ items
    var faqItems = document.querySelectorAll('.why-feature');
    faqItems.forEach(function(item) {
        item.addEventListener('click', function() {
            toggleFaq(this);
        });
    });
}

function toggleFaq(element) {
    var answer = element.querySelector('p');
    var icon = element.querySelector('.fa-chevron-down');
    
    if (answer) {
        if (answer.style.display === 'none' || answer.style.display === '') {
            answer.style.display = 'block';
            answer.style.animation = 'fadeIn 0.3s ease';
            
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
            
            // Close other FAQs
            var allFaqItems = document.querySelectorAll('.why-feature');
            allFaqItems.forEach(function(item) {
                if (item !== element) {
                    var otherAnswer = item.querySelector('p');
                    var otherIcon = item.querySelector('.fa-chevron-up');
                    if (otherAnswer && otherAnswer.style.display === 'block') {
                        otherAnswer.style.display = 'none';
                    }
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });
        } else {
            answer.style.display = 'none';
            
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    }
}

/**
 * Hero Chart Animation
 */
function initChartAnimation() {
    var chartBars = document.querySelectorAll('.chart-bar');
    
    if (chartBars.length > 0) {
        // Animate bars on load
        setTimeout(function() {
            chartBars.forEach(function(bar, index) {
                setTimeout(function() {
                    bar.style.transform = 'scaleY(1)';
                    bar.style.opacity = '1';
                }, index * 100);
            });
        }, 500);
        
        // Set initial state
        chartBars.forEach(function(bar) {
            var height = bar.style.height;
            bar.style.transform = 'scaleY(0)';
            bar.style.transformOrigin = 'bottom';
            bar.style.opacity = '0';
        });
    }
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    var slider = document.querySelector('.testimonials-slider');
    var dots = document.querySelectorAll('.dot');
    var currentSlide = 0;
    var slides = [];
    
    // Get all testimonial cards
    var testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(function(card) {
        slides.push(card.cloneNode(true));
        card.style.display = 'none';
    });
    
    if (slides.length > 0 && testimonialCards.length > 0) {
        // Show first slide
        testimonialCards[0].style.display = 'block';
        
        // Add click handlers to dots
        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        });
        
        function goToSlide(index) {
            // Hide current slide
            testimonialCards[currentSlide].style.display = 'none';
            testimonialCards[currentSlide].style.animation = 'fadeOut 0.3s ease';
            
            // Update dots
            dots[currentSlide].classList.remove('active');
            
            // Show new slide
            currentSlide = index;
            testimonialCards[currentSlide].style.display = 'block';
            testimonialCards[currentSlide].style.animation = 'fadeIn 0.3s ease';
            
            dots[currentSlide].classList.add('active');
        }
        
        // Auto-rotate slides
        setInterval(function() {
            var nextSlide = (currentSlide + 1) % slides.length;
            goToSlide(nextSlide);
        }, 5000);
    }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    // Create button
    var backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = 'position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dark) 100%); color: white; border: none; cursor: pointer; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 9999; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4); font-size: 1.2rem;';
    
    document.body.appendChild(backToTop);
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Animate numbers on scroll
 */
function animateNumber(element, target, duration) {
    var start = 0;
    var increment = target / (duration / 16);
    
    var timer = setInterval(function() {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

/**
 * Lazy load images
 */
function initLazyLoad() {
    var images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        var imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback
        images.forEach(function(img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Parallax effect for hero section
 */
function initParallax() {
    var hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            var scrolled = window.pageYOffset;
            var heroBackground = hero.querySelector('.hero::before');
            
            if (heroBackground) {
                heroBackground.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
            }
        });
    }
}

/**
 * Preloader (optional)
 */
function initPreloader() {
    var preloader = document.querySelector('.preloader');
    
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(function() {
                preloader.remove();
            }, 300);
        });
    }
}

// Add fadeIn and fadeOut animations if not exists
var animationStyles = document.createElement('style');
animationStyles.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }';
document.head.appendChild(animationStyles);
