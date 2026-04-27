/**
 * ════════════════════════════════════════════════════
 * main.js — La Cueva · Orchestrator Module
 *
 * Modules:
 *  1. Navbar         — Scroll state + active link
 *  2. Mobile Menu    — Hamburger toggle + overlay
 *  3. Menu Filter    — Category tabs with animation
 *  4. Scroll Reveal  — IntersectionObserver fade-ins
 *  5. Smooth Scroll  — Offset-aware anchor navigation
 *  6. Back to Top    — Show/hide + scroll behavior
 *  7. Date Guard     — Min date = today on reservation input
 * ════════════════════════════════════════════════════
 */

'use strict';

import { initReservationForm } from './reservationForm.js';

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObs.observe(s));
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobileOverlay');
  if (!hamburger || !overlay) return;

  function open() {
    hamburger.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  overlay.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

function initMenuFilter() {
  const tabs  = document.querySelectorAll('.tab');
  const items = document.querySelectorAll('.menu-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.filter;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      items.forEach(item => {
        const match = cat === 'todos' || item.dataset.cat === cat;
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        setTimeout(() => {
          item.style.display = match ? 'block' : 'none';
          if (match) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          }
        }, 200);
      });
    });
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });
}

function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initDateGuard() {
  const dateInput = document.getElementById('fecha');
  if (!dateInput) return;
  dateInput.min = new Date().toISOString().split('T')[0];
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initMenuFilter();
  initScrollReveal();
  initSmoothScroll();
  initBackTop();
  initDateGuard();
  initReservationForm();
});
