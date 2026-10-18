import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export function Logo({ className = '' }) {
  return (
    <Link to="/" className={`logo-brand ${className}`} aria-label="Complices d’ailleurs — Voyages au féminin, retour à l’accueil">
      <div className="logo-lockup">
        <div className="logo-main">
          <span className="logo-brand-name">Complice<span className="logo-s">S</span></span>
          <span className="logo-script">d’ailleurs</span>
        </div>
        <div className="logo-baseline">Voyages au féminin</div>
      </div>
      <svg className="logo-symbol" viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Dunes stylisées */}
        <path d="M4 28 C16 16, 26 12, 36 24 C44 14, 52 16, 60 28" stroke="#a8553a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 28 C22 20, 32 18, 42 28" stroke="#c58a4a" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" fill="none"/>
        {/* Étoiles scintillantes */}
        <path d="M52 4 Q52 9 47 9 Q52 9 52 14 Q52 9 57 9 Q52 9 52 4 Z" fill="#a8553a"/>
        <path d="M60 12 Q60 15 57 15 Q60 15 60 18 Q60 15 63 15 Q60 15 60 12 Z" fill="#c58a4a"/>
      </svg>
    </Link>
  );
}

// Apparition douce au scroll (désactivée si prefers-reduced-motion via CSS)
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

// Composant Photo haute définition nette avec fallback élégant
export function Photo({ src, label, theme = 'neutral', className = '', children }) {
  return (
    <div className={`photo ${theme} ${className}`}>
      {src ? (
        <img src={src} alt={label} loading="lazy" />
      ) : (
        <span className="ph-note">{label}</span>
      )}
      {children}
    </div>
  );
}

export const STATUS = { open: 'Ouverte', waitlist: 'Liste d’attente', soon: 'Bientôt' };

// Prix non annoncé : chiffre à 3 chiffres FLOUTÉ (purement visuel, non réel). S'affiche en clair dès qu'un tarif est saisi dans l'admin.
export function Price({ value, suffix = '' }) {
  if (value == null)
    return (
      <span className="price-blur">
        <span className="blur" aria-hidden="true">000 €</span>
        <span className="sr"> Tarif communiqué prochainement</span>
        <small> Tarif communiqué prochainement</small>
      </span>
    );
  return <>{value.toLocaleString('fr-FR')} €{suffix}</>;
}
