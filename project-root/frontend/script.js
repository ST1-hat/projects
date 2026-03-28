// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-container').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

// Add 'visible' class style behavior dynamically or in CSS
// For simplicity, we are injecting a style rule here to handle the visible state if not in CSS
const style = document.createElement('style');
style.innerHTML = `
    .section-container.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Quantum Particles Background
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() * 1.5 - 0.75);
            this.speedY = (Math.random() * 1.5 - 0.75);
            this.color = 'rgba(139, 92, 246, ' + Math.random() * 0.5 + ')'; // Purple tint
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = (canvas.width * canvas.height) / 15000; // Low density as requested
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}

// Profile Picture Upload Logic
const profileUpload = document.getElementById('profile-upload');
const profilePics = document.querySelectorAll('.profile-pic img, .nav-avatar');

if (profileUpload) {
    // Trigger file input when any profile picture is clicked
    profilePics.forEach(img => {
        img.addEventListener('click', () => {
            profileUpload.click();
        });
        img.style.cursor = 'pointer'; // Visual cue
        img.title = "Click to upload new profile picture";
    });

    // Update images when a new file is selected
    profileUpload.addEventListener('change', async function (e) {
        if (this.files && this.files[0]) {
            const formData = new FormData();
            formData.append('profilePic', this.files[0]);

            try {
                const response = await fetch('/api/profile-pic', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success && result.url) {
                    profilePics.forEach(img => {
                        img.src = result.url;
                    });
                } else {
                    console.error('Upload failed:', result.error);
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            }
        }
    });
}

// Function to load the saved profile picture
async function loadProfilePicture() {
    try {
        const response = await fetch('/api/profile-pic');
        const result = await response.json();

        if (result.success && result.url) {
            const profilePics = document.querySelectorAll('.profile-pic img, .nav-avatar');
            profilePics.forEach(img => {
                img.src = result.url;
            });
        }
    } catch (error) {
        console.error('Error loading profile picture:', error);
    }
}

// Dynamic Dashboard Counters
async function updateDashboardCounts() {
    const pages = [
        { url: 'projects.html', id: 'project-count', selector: '.work-card' },
        { url: 'internships.html', id: 'internship-count', selector: '.work-card' }, // Assuming .work-card for internships too
        { url: 'tools.html', id: 'tool-count', selector: '.tag' },
        { url: 'accomplishments.html', id: 'cert-count', selector: '.cert-item' }
    ];

    for (const page of pages) {
        const element = document.getElementById(page.id);
        if (element) {
            try {
                const response = await fetch(page.url);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const count = doc.querySelectorAll(page.selector).length;

                animateValue(element, parseInt(element.innerText), count, 1500);
            } catch (error) {
                console.error(`Error fetching ${page.url}:`, error);
            }
        }
    }
}

function animateValue(obj, start, end, duration) {
    if (end === 0) {
        obj.innerHTML = 0;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}

// Initial call
document.addEventListener('DOMContentLoaded', () => {

    updateDashboardCounts();
    loadProfilePicture();
});
