// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Form submission handling
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Papar data brand dari brands.json
fetch('brands.json')
  .then(res => res.json())
  .then(brands => {
    const list = document.getElementById('brands-list');
    if (!list) return;
    list.innerHTML = brands.map(brand => `
      <div class="brand-card">
        <h3>${brand.nama}</h3>
        <div class="brand-meta">Ditubuhkan: ${brand.tahun_ditubuhkan}</div>
        <div class="brand-meta">Founder: ${brand.founder}</div>
        <div class="brand-meta">HQ: ${brand.lokasi_HQ}</div>
        <a class="brand-instagram" href="${brand.instagram}" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle"><defs><linearGradient id="ig-mini" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#f58529"/><stop offset="0.5" stop-color="#dd2a7b"/><stop offset="1" stop-color="#515bd4"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ig-mini)"/><circle cx="16" cy="16" r="6" stroke="#fff" stroke-width="2" fill="none"/><circle cx="23.2" cy="8.8" r="1.2" fill="#fff"/></svg>
          Instagram
        </a>
      </div>
    `).join('');
  }); 