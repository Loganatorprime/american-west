// American West Interactive Timeline - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initTimeline();
    initNavigation();
    initScrollAnimations();
    initFilterButtons();
    initGalleryHover();
});

// Timeline Functionality
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        const content = item.querySelector('.timeline-content');
        const marker = item.querySelector('.timeline-marker');

        // Click to expand/collapse
        content.addEventListener('click', () => toggleTimelineItem(item));
        marker.addEventListener('click', () => toggleTimelineItem(item));

        // Keyboard accessibility
        content.setAttribute('tabindex', '0');
        content.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTimelineItem(item);
            }
        });
    });
}

function toggleTimelineItem(item) {
    const isActive = item.classList.contains('active');

    // Close all other items
    document.querySelectorAll('.timeline-item.active').forEach(activeItem => {
        if (activeItem !== item) {
            activeItem.classList.remove('active');
        }
    });

    // Toggle current item
    item.classList.toggle('active');

    // Scroll into view if expanding
    if (!isActive) {
        setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(44, 36, 22, 0.98)';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(44, 36, 22, 0.95), rgba(44, 36, 22, 0.8))';
        }
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Scroll Animations (Intersection Observer)
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const index = Array.from(document.querySelectorAll('.timeline-item')).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // Observe other sections for fade-in
    document.querySelectorAll('.legend-card, .gallery-item').forEach(item => {
        item.classList.add('fade-in-item');
        observer.observe(item);
    });
}

// Filter Buttons
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filter timeline items
            timelineItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('filtered-out');
                    item.classList.add('filtered-in');
                    item.style.display = '';
                } else {
                    item.classList.add('filtered-out');
                    item.classList.remove('filtered-in');
                }
            });

            // Close any expanded items
            document.querySelectorAll('.timeline-item.active').forEach(item => {
                item.classList.remove('active');
            });
        });
    });
}

// Gallery Hover Effects
function initGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '1';
        });

        // Click to show title
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            showGalleryModal(title);
        });
    });
}

// Gallery Modal (simple alert for now, can be enhanced)
function showGalleryModal(title) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${title}</h3>
            <p>Images of the American West would be displayed here.</p>
        </div>
    `;

    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(44, 36, 22, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;

    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: #F4E4BC;
        padding: 40px;
        border: 4px solid #DAA520;
        max-width: 500px;
        text-align: center;
        position: relative;
    `;

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 2rem;
        background: none;
        border: none;
        cursor: pointer;
        color: #8B4513;
    `;

    const heading = modal.querySelector('h3');
    heading.style.cssText = `
        font-family: 'Rye', cursive;
        color: #8B4513;
        margin-bottom: 15px;
        font-size: 1.5rem;
    `;

    document.body.appendChild(modal);

    // Close modal
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Close on escape
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Parallax effect for hero (subtle)
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;

    if (scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
    }
});

// Add some western flair - random dust particles
function createDustParticle() {
    const hero = document.querySelector('.hero');
    const particle = document.createElement('div');

    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(212, 165, 116, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        animation: float ${Math.random() * 10 + 10}s linear infinite;
    `;

    hero.appendChild(particle);

    // Remove after animation
    setTimeout(() => particle.remove(), 20000);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .fade-in-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in-item.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .nav-links a.active {
        color: #DAA520 !important;
    }

    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Create dust particles periodically
setInterval(createDustParticle, 2000);

// Initialize a few particles on load
for (let i = 0; i < 5; i++) {
    setTimeout(createDustParticle, i * 500);
}

// Console Easter Egg
console.log(`
%c★ THE AMERICAN WEST ★
%c"The West is the best." - Jim Morrison

Welcome to the frontier, partner!
`,
'font-family: serif; font-size: 20px; color: #DAA520; font-weight: bold;',
'font-style: italic; color: #8B4513;'
);
