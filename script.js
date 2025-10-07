// Custom Tailwind Configuration (Colors, Fonts, Animations)
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary-dark': '#0d0d0d', // Near Black
                        'secondary-dark': '#1a1a1a', // Dark Gray for elements
                        'accent-gold': '#b8860b', // Darker, Rich Gold (Goldenrod)
                        'highlight-gold': '#ffd700', // Bright Gold for subtle highlights
                        'off-white': '#f0f0f0',
                    },
                    fontFamily: {
                        heading: ['Cinzel', 'serif'],
                        sans: ['Inter', 'sans-serif'],
                    },
                    keyframes: {
                        shimmer: {
                            '0%': { 'background-position': '-200% 0' },
                            '100%': { 'background-position': '200% 0' },
                        },
                    },
                    animation: {
                        shimmer: 'shimmer 4s infinite linear',
                    }
                }
            }
        }

        // --- Mobile Menu Toggle ---
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
        
        // Also close menu when a link is clicked
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            });
        });

        // --- Confirmation Message for Form ---
        function showConfirmation() {
            // In a real application, AJAX request would go here
            document.getElementById('confirmation-message').classList.remove('hidden');
            // Optional: clear the form after submission
            document.querySelector('#booking form').reset();
        }

        // --- Scroll Animation Observer (Performance/Style) ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-scroll-animation');
                    // Stop observing once it has been animated once
                    observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1 // Triggers when 10% of the element is visible
        });

        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });