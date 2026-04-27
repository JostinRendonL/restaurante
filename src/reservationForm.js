/**
 * ════════════════════════════════════════════════════
 * reservationForm.js — EmailJS Reservation Module
 *
 * Handles validation, sanitization, honeypot anti-spam,
 * and EmailJS submission for the reservation form.
 * ════════════════════════════════════════════════════
 */

'use strict';

/* ── EmailJS Credentials ───────────────────────────────
   Static site: .env not available at runtime.
   Constants are the single source of truth.
   See .env.example for documentation.
──────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'RxtPZYij4D3MxKDPj';
const EMAILJS_SERVICE_ID  = 'service_sisi0ft';
const EMAILJS_TEMPLATE_ID = 'template_bw81pge';

/**
 * Strips HTML tags and trims whitespace.
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
  return String(str).replace(/<[^>]*>/g, '').trim();
}

function setError(input, errId, show) {
  const group = input.closest('.form-group');
  const err   = document.getElementById(errId);
  group.classList.toggle('error', show);
  if (err) err.style.display = show ? 'block' : 'none';
}

function validate(fields) {
  const { nombre, telefono, fecha, hora, personas } = fields;
  let valid = true;

  if (!sanitize(nombre.value)) {
    setError(nombre, 'errNombre', true); valid = false;
  } else setError(nombre, 'errNombre', false);

  if (!sanitize(telefono.value)) {
    setError(telefono, 'errTelefono', true); valid = false;
  } else setError(telefono, 'errTelefono', false);

  if (!fecha.value) {
    setError(fecha, 'errFecha', true); valid = false;
  } else setError(fecha, 'errFecha', false);

  if (!hora.value) {
    setError(hora, 'errHora', true); valid = false;
  } else setError(hora, 'errHora', false);

  if (!personas.value) {
    setError(personas, 'errPersonas', true); valid = false;
  } else setError(personas, 'errPersonas', false);

  return valid;
}

export function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  emailjs.init(EMAILJS_PUBLIC_KEY);

  const fields = {
    nombre:   document.getElementById('nombre'),
    telefono: document.getElementById('telefono'),
    fecha:    document.getElementById('fecha'),
    hora:     document.getElementById('hora'),
    personas: document.getElementById('personas'),
    ocasion:  document.getElementById('ocasion'),
  };
  const submitBtn = document.getElementById('reservaBtn');
  const successEl = document.getElementById('reservaSuccess');
  const honeypot  = form.querySelector('input[name="_honey"]');

  Object.values(fields).forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      const errMap = {
        nombre:   'errNombre',
        telefono: 'errTelefono',
        fecha:    'errFecha',
        hora:     'errHora',
        personas: 'errPersonas',
      };
      if (errMap[input.id]) setError(input, errMap[input.id], false);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Honeypot check — bots fill hidden fields, real users don't.
    if (honeypot && honeypot.value) return;

    if (!validate(fields)) return;

    const { nombre, telefono, fecha, hora, personas, ocasion } = fields;
    const n = sanitize(nombre.value);
    const f = sanitize(fecha.value);
    const h = sanitize(hora.value);
    const p = sanitize(personas.value);
    const o = sanitize(ocasion?.value) || 'No especificada';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Reservando...';

    const templateParams = {
      from_name: n,
      subject:   `Reserva — ${f} a las ${h} · La Cueva`,
      message:   `NUEVA RESERVA — La Cueva\n\nNombre:   ${n}\nTeléfono: ${sanitize(telefono.value)}\nFecha:    ${f}\nHora:     ${h}\nPersonas: ${p}\nOcasión:  ${o}`,
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      successEl.classList.add('show');
      Array.from(form.children).forEach(child => {
        if (child.id !== 'reservaSuccess') child.style.display = 'none';
      });
    } catch (error) {
      console.error('EmailJS Error:', error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirmar Reserva';
      alert('Hubo un error al enviar la reserva. Por favor intenta de nuevo o contáctanos por WhatsApp.');
    }
  });
}
