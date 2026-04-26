document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 100);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

// Menu filter
window.filterMenu = function(cat, event) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  
  // Add active class to clicked tab
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  } else {
    // Fallback if event is not passed directly
    const tabToActivate = document.querySelector(`.tab[onclick*="filterMenu('${cat}'"]`);
    if (tabToActivate) tabToActivate.classList.add('active');
  }

  // Show/Hide menu items based on category
  document.querySelectorAll('.menu-item').forEach(item => {
    if (cat === 'todos' || item.dataset.cat === cat) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};
