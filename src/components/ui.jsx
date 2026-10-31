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

// Logo officiel Alma (Fintech française de paiement en plusieurs fois)
export function AlmaLogo({ height = 15, className = '' }) {
  return (
    <span className={`alma-badge-tag ${className}`} title="Paiement en plusieurs fois avec Alma" aria-label="Alma">
      <svg
        height={height}
        viewBox="0 0 70 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="alma-svg"
        aria-hidden="true"
      >
        <path
          d="M64.7968 13.5118V15.4756C63.6814 14.0476 62.0621 13.1554 60.1394 13.1554C56.4294 13.1554 53.5548 16.468 53.5548 20.5564C53.5548 24.6448 56.4294 27.9575 60.1394 27.9575C62.1974 27.9575 63.9078 26.9371 65.0254 25.3297V27.6034H68.5744V13.5118H64.7968ZM61.0611 24.4282C58.9984 24.4282 57.3278 22.695 57.3278 20.5564C57.3278 18.4179 58.9984 16.6847 61.0611 16.6847C63.1238 16.6847 64.7944 18.4179 64.7944 20.5564C64.7944 22.695 63.1238 24.4282 61.0611 24.4282ZM21.2918 9.60043H25.0671V27.601H21.2918V9.60043ZM29.4094 19.6153C29.4094 15.7412 31.7918 13.1577 35.0911 13.1577C37.1398 13.1577 38.7591 14.0662 39.7344 15.6154C40.7121 14.0662 42.3291 13.1577 44.3778 13.1577C47.6771 13.1577 50.0594 15.7412 50.0594 19.6153V27.6034H46.2841V19.2076C46.2841 17.6957 45.2808 16.7103 43.9531 16.7103C42.6254 16.7103 41.6221 17.698 41.6221 19.2076V27.6034H37.8468V19.2076C37.8468 17.6957 36.8434 16.7103 35.5158 16.7103C34.1881 16.7103 33.1848 17.698 33.1848 19.2076V27.6034H29.4094V19.6153ZM14.4551 13.6585C13.5614 10.3156 11.6714 9.24634 9.87242 9.24634C8.07342 9.24634 6.18342 10.3156 5.28976 13.6585L1.40942 27.6057H5.23376C5.85676 25.2761 7.77709 23.9786 9.87242 23.9786C11.9678 23.9786 13.8881 25.2784 14.5111 27.6057H18.3378L14.4551 13.6585ZM9.87242 20.7288C8.65442 20.7288 7.55076 21.1901 6.73642 21.9378L8.92976 13.8216C9.13976 13.0459 9.45009 12.7989 9.87476 12.7989C10.2994 12.7989 10.6098 13.0459 10.8198 13.8216L13.0108 21.9378C12.1964 21.1901 11.0904 20.7288 9.87242 20.7288Z"
          fill="#FA5022"
        />
      </svg>
    </span>
  );
}
