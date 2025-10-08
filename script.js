// Set a debounce time for performance-intensive listeners (like scroll)
const DEBOUNCE_TIME = 100;

/**
 * Utility function to debounce repeated function calls, ensuring it only runs once 
 * after the specified delay has passed since the last call.
 * @param {Function} func The function to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

/**
 * ----------------------------------------------------------------
 * 1. Mobile Menu Toggle Logic
 * ----------------------------------------------------------------
 * Handles opening/closing the mobile navigation and toggling the menu icon.
 */
const setupMobileMenu = () => {
    const toggleButton = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (!toggleButton || !mobileMenu || !menuIcon || !closeIcon) return;

    const toggleMenu = () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        
        // Toggle visibility and ARIA attributes
        mobileMenu.classList.toggle('hidden');
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle icons
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    };

    toggleButton.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked (for smooth scroll or navigation)
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu); // Re-use toggleMenu to close it
    });
};

/**
 * ----------------------------------------------------------------
 * 2. Scroll-based Animation Logic (Fade-up effect)
 * ----------------------------------------------------------------
 * Applies the 'is-visible' class when an element scrolls into view.
 */
const setupScrollAnimations = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (elements.length === 0) return;

    // Determines if an element is visible past the trigger point.
    const checkVisibility = () => {
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            // Trigger point: 85% down the viewport
            const triggerPoint = window.innerHeight * 0.85;

            // Element is visible if its top edge is above the trigger point AND it's not off the top of the screen
            if (rect.top < triggerPoint && rect.bottom > 0) {
                element.classList.add('is-visible');
            }
        });
    };

    // Apply the debounced check on load and scroll events
    const debouncedCheck = debounce(checkVisibility, DEBOUNCE_TIME);
    
    // Set up listeners
    window.addEventListener('load', debouncedCheck);
    window.addEventListener('scroll', debouncedCheck);
    window.addEventListener('resize', debouncedCheck);

    // Initial check immediately
    checkVisibility();
};

/**
 * ----------------------------------------------------------------
 * 3. Form Submission Handling (Setup for Email Delivery)
 * ----------------------------------------------------------------
 * Handles AJAX submission of the contact form.
 * * IMPORTANT: To receive customer messages, the HTML form's 'action' 
 * attribute MUST be configured with a third-party email service endpoint 
 * (e.g., Formspree). The client-side JS handles the submission/feedback only.
 */
const setupFormSubmission = () => {
    const form = document.getElementById('contact-form');
    const statusMessage = document.getElementById('form-status-message');
    const submitButton = document.getElementById('form-submit-button');

    if (!form || !statusMessage || !submitButton) return;

    const displayMessage = (message, isSuccess = false) => {
        statusMessage.textContent = message;
        // Determine color class based on success state
        statusMessage.classList.remove('text-red-500', 'text-green-500', 'opacity-0');
        statusMessage.classList.add(isSuccess ? 'text-green-500' : 'text-red-500');
        
        // Timeout to clear the message
        setTimeout(() => {
            statusMessage.classList.add('opacity-0');
            // Clear content after fade out transition
            setTimeout(() => { statusMessage.textContent = ''; }, 300); 
        }, 5000); 
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // The fetch request submits data to the URL specified in the form's 'action' attribute.
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success message confirming delivery to the configured email service
                displayMessage('Message Sent Successfully! Your message is being forwarded to our email inbox.', true);
                form.reset(); // Clear the form
            } else {
                // Handle errors from the submission service
                // Attempt to parse JSON response for specific error details
                const data = await response.json().catch(() => ({ error: 'Unknown response format.' }));
                
                displayMessage(data.error 
                    ? `Error: ${data.error}` 
                    : 'Oops! There was an issue sending your message. Please check your form\'s network configuration.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            displayMessage('A network error occurred. Please try again later.');
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
};


/**
 * ----------------------------------------------------------------
 * Initialize all scripts on page load
 * ----------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupScrollAnimations();
    setupFormSubmission();
});
