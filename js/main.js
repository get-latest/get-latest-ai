/**
 * Component Loader
 * Fetches HTML snippets and injects them into placeholders
 */
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();
        const container = document.getElementById(elementId);

        if (container) {
            container.innerHTML = html;

            // Trigger specific logic after the header exists in the DOM
            if (elementId === 'header-placeholder') {
                setActiveNavLink();
            }
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

/**
 * Highlights active link and handles Bootstrap specific 'active' states
 */
function setActiveNavLink() {
    // Get current page path
    let currentPath = window.location.pathname;
    
    // Default to index.html if at root
    if (currentPath === "" || currentPath === "/") {
        currentPath = "/index.html";
    }

    // Target the links inside your nav
    const links = document.querySelectorAll('.navbar-nav .nav-link');

    links.forEach(link => {
        // Remove existing active classes
        link.classList.remove('active');
        link.removeAttribute('aria-current');

        // Match the href against current path
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath.endsWith(href) && href.startsWith('/'))) {
            link.classList.add('active');
            // Accessibility: Tells screen readers this is the current page
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    // Using components/ folder as suggested by your AI Studio output
    loadComponent('header-placeholder', '/components/header.html');
    loadComponent('footer-placeholder', '/components/footer.html');
    
    // Initialize pain points carousel if it exists on the page
    initPainPointsCarousel();
});

/**
 * Pain Points Carousel
 * Auto-rotates through pain points with manual navigation
 */
function initPainPointsCarousel() {
    const carousel = document.querySelector('.pain-point-carousel');
    if (!carousel) return; // Exit if not on a page with the carousel
    
    const cards = carousel.querySelectorAll('.pain-point-card');
    const dots = document.querySelectorAll('.pain-point-dots .dot');
    let currentIndex = 0;
    let autoRotateInterval;
    
    // Function to show a specific card
    function showCard(index) {
        // Remove active class from all cards and dots
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current card and dot
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }
    
    // Function to go to next card
    function nextCard() {
        const nextIndex = (currentIndex + 1) % cards.length;
        showCard(nextIndex);
    }
    
    // Start auto-rotation
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextCard, 5000); // Change every 5 seconds
    }
    
    // Stop auto-rotation
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoRotate();
            showCard(index);
            startAutoRotate(); // Restart auto-rotation after manual selection
        });
    });
    
    // Start the carousel
    startAutoRotate();
    
    // Pause rotation when user hovers over the carousel
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
}
