import config from './config.js';
import i18n from './i18n.js';
import playground from './playground.js';
import aiPlayground from './ai-playground.js';
import aiImageGenerator from './ai-image-generation.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize i18n first and wait for it to complete
    await i18n.init();
    
    // Initialize playground after i18n is ready
    playground.init();
    
    // Initialize AI playground
    aiPlayground.init();
    
    // Initialize AI Image Generator
    aiImageGenerator.init();

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const ctaButtons = document.querySelector('.cta-buttons');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            ctaButtons.classList.toggle('active');
        });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Testimonial Slider
    let currentSlide = 0;
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    function showSlide(index) {
        // Handle edge cases
        if (index >= testimonialCards.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = testimonialCards.length - 1;
        } else {
            currentSlide = index;
        }
        
        // Update slide position
        const offset = currentSlide * -100;
        document.querySelector('.testimonials-slider').style.transform = `translateX(${offset}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => showSlide(i));
        });
    }

    // Pricing toggle
    const billingToggle = document.getElementById('billing-toggle');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', updatePricing);
        
        function updatePricing() {
            const isAnnual = billingToggle.checked;
            const pricingType = isAnnual ? 'annually' : 'monthly';
            
            document.getElementById('basic-price').textContent = config.pricing[pricingType].basic;
            document.getElementById('pro-price').textContent = config.pricing[pricingType].pro;
            document.getElementById('enterprise-price').textContent = config.pricing[pricingType].enterprise;
        }
        
        // Initialize pricing
        updatePricing();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a button or non-navigational link
            if (href === '#' || this.classList.contains('btn-icon')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href === '#' ? 'body' : href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                    mobileMenuToggle.click();
                }
            }
        });
    });

    // Theme toggle (if implemented)
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        // Set theme from local storage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    // Add animation on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .solution-card, .pricing-card');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on load
});