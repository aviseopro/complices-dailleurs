import React, { useState } from 'react';
import { useData } from '../data/store.js';

export function formatWhatsAppUrl(phone, message) {
  if (!phone) return null;
  // Nettoyage : retire espaces, tirets, points
  let clean = phone.replace(/[^\d+]/g, '');
  // Format international France
  if (clean.startsWith('0')) {
    clean = '33' + clean.slice(1);
  } else if (clean.startsWith('+')) {
    clean = clean.slice(1);
  }
  const defaultMsg = message || "Bonjour Émilie & Virginie, j’aimerais avoir des informations sur les séjours Complices d’ailleurs 🌿";
  return `https://wa.me/${clean}?text=${encodeURIComponent(defaultMsg)}`;
}

export default function WhatsAppButton() {
  const { settings } = useData();
  const phone = settings?.whatsapp || '0629849653';
  const waUrl = formatWhatsAppUrl(phone);
  const [hover, setHover] = useState(false);

  if (!waUrl) return null;

  return (
    <aside className="wa-float-wrap" aria-label="Contact direct WhatsApp">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-btn"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Discuter directement avec Émilie et Virginie sur WhatsApp (06 29 84 96 53)"
      >
        <span className="wa-pulse" aria-hidden="true" />
        <svg
          viewBox="0 0 32 32"
          className="wa-icon"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.3 1.1 1.2-4.2-.3-.5A11.6 11.6 0 1 1 16 27.5zm6.4-8.6c-.3-.2-2-.9-2.3-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.4.2-.7.1a9.3 9.3 0 0 1-2.7-1.7 10.3 10.3 0 0 1-1.9-2.3c-.2-.3 0-.5.1-.7s.3-.4.5-.6.2-.3.3-.5.1-.4 0-.5-.8-1.9-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7a1.4 1.4 0 0 0-1 1c-.3 1.1.3 2.8 1.4 4.5a13.8 13.8 0 0 0 5.4 4.8c.8.4 1.5.6 2 .8.9.3 1.7.2 2.3.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6s-.3-.2-.6-.4z" />
        </svg>
        <span className="wa-label">Discuter sur WhatsApp</span>
      </a>
    </aside>
  );
}
