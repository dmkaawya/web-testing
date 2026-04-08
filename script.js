/**
 * ============================================
 * PIXORA DIGITAL AGENCY - Main JavaScript
 * Handles: Navbar, Marquee, Smooth Scroll, Interactions
 * ============================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initSmoothScrolling();
    initMarquee();
    initBackToTop();
    initActiveNavLink();
    initScrollAnimations();
});

/**
 * ============================================
 * STICKY NAVBAR FUNCTIONALITY
 * Adds scrolled class when user scrolls down
 * ============================================
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 50;

    // Check scroll position on load
    checkNavbarScroll();

    // Add scroll event listener with throttle for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function checkNavbarScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

/**
 * ============================================
 * MOBILE MENU TOGGLE
 * Handles hamburger menu open/close
 * ============================================
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (!mobileMenuBtn || !navLinks) return;

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a nav link
    const navItems = navLinks.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * ============================================
 * SMOOTH SCROLLING FOR ANCHOR LINKS
 * Enables smooth scroll to sections
 * ============================================
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ============================================
 * TESTIMONIALS MARQUEE AUTO-SCROLL
 * Creates infinite horizontal scrolling effect
 * Uses requestAnimationFrame for smooth performance
 * ============================================
 */
function initMarquee() {
    const marqueeTrack = document.getElementById('marqueeTrack');
    
    if (!marqueeTrack) return;

    // Configuration
    const config = {
        speed: 0.5,           // Pixels per frame (lower = slower)
        direction: -1,       // -1 for left, 1 for right
        pauseOnHover: true
    };

    let position = 0;
    let isPaused = false;
    let animationFrameId = null;

    // Clone track content for seamless loop
    const originalContent = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = originalContent + originalContent;

    /**
     * Main animation loop using requestAnimationFrame
     * Provides smooth 60fps scrolling
     */
    function animate() {
        if (!isPaused) {
            position += config.speed * config.direction;

            // Get the half width (original content width)
            const halfWidth = marqueeTrack.scrollWidth / 2;

            // Reset position when we've scrolled one full cycle
            if (Math.abs(position) >= halfWidth) {
                position = 0;
            }

            // Apply transform
            marqueeTrack.style.transform = `translateX(${position}px)`;
        }

        // Continue animation loop
        animationFrameId = requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Pause on hover functionality
    if (config.pauseOnHover) {
        const marqueeWrapper = marqueeTrack.parentElement;
        
        marqueeWrapper.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        marqueeWrapper.addEventListener('mouseleave', () => {
            isPaused = false;
        });
    }

    // Pause when tab is not visible (performance optimization)
    document.addEventListener('visibilitychange', () => {
        isPaused = document.hidden;
    });

    // Cleanup function (if needed)
    return {
        stop: () => cancelAnimationFrame(animationFrameId),
        destroy: () => {
            cancelAnimationFrame(animationFrameId);
            marqueeTrack.innerHTML = originalContent;
        }
    };
}

/**
 * ============================================
 * BACK TO TOP BUTTON
 * Shows/hides button based on scroll position
 * ============================================
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;

    const showThreshold = 400;

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > showThreshold) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * ============================================
 * ACTIVE NAV LINK ON SCROLL
 * Highlights current section in navigation
 * ============================================
 */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    // Create intersection observer for each section
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                // Update active state
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * ============================================
 * SCROLL ANIMATIONS (Intersection Observer)
 * Adds fade-in effect to elements as they enter viewport
 * ============================================
 */
function initScrollAnimations() {
    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.service-card, .project-card, .team-member-card, .testimonial-card, .section-header'
    );

    if (!animatedElements.length) return;

    // Add initial hidden state
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);

                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * ============================================
 * UTILITY: Debounce Function
 * Limits how often a function can fire
 * ============================================
 */
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * ============================================
 * UTILITY: Throttle Function
 * Ensures function runs at most once per time period
 * ============================================
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
