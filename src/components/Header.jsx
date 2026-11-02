import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from './ui.jsx';
import { useData } from '../data/store.js';

const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
  </svg>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [franceOpen, setFranceOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { settings } = useData();
  const { pathname } = useLocation();
  const dropRef = useRef(null);

  const isFranceActive =
    pathname.includes('arcachon-entre-femmes') ||
    pathname.includes('corse') ||
    pathname.includes('trek-compostelle');

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 20);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setFranceOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const close = () => {
    setOpen(false);
    setFranceOpen(false);
  };

  return (
    <header className={`header ${solid ? 'solid' : ''}`}>
      <div className="header-promo-bar">
        <div className="header-promo-in">
          <span className="header-promo-badge">💎 EXCLUSIF &amp; INÉDIT</span>
          <span className="header-promo-text">
            <strong>+ de 300 € de soins esthétiques &amp; de cours de yoga INCLUS</strong> dans nos séjours — dont <strong>Yoga Aérien (avec tissus)</strong> en Corse !
          </span>
          <Link to="/experiences/corse" onClick={close} className="header-promo-link">
            Voir la Corse →
          </Link>
        </div>
      </div>
      <div className="header-in">
        <Logo />
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Navigation principale">
          <NavLink to="/" end onClick={close} className="nav-accueil">Accueil</NavLink>

          <div
            className={`nav-dropdown ${franceOpen ? 'is-open' : ''}`}
            ref={dropRef}
            onMouseEnter={() => setFranceOpen(true)}
            onMouseLeave={() => setFranceOpen(false)}
          >
            <button
              type="button"
              className={`nav-drop-btn nav-arcachon ${isFranceActive ? 'active' : ''}`}
              aria-expanded={franceOpen}
              onClick={() => setFranceOpen((v) => !v)}
            >
              <span>Destinations France</span>
              <ChevronDown size={14} className="nav-chev" />
            </button>
            <div className="nav-drop-menu" role="menu">
              <NavLink to="/experiences/arcachon-entre-femmes" onClick={close} className="drop-item drop-arcachon" role="menuitem">
                <strong>Bassin d’Arcachon</strong>
                <small>Week-end Phare · +300 € de Soins Esthétiques &amp; Cours de Yoga inclus</small>
              </NavLink>
              <NavLink to="/experiences/corse" onClick={close} className="drop-item drop-corse" role="menuitem">
                <strong>Corse du Sud (Sartène · Porto-Vecchio · Bonifacio)</strong>
                <small>3–4 jours · +300 € de Soins Esthétiques &amp; Yoga Aérien (tissus) inclus</small>
              </NavLink>
              <NavLink to="/experiences/trek-compostelle" onClick={close} className="drop-item drop-trek" role="menuitem">
                <strong>Trek au féminin · Chemin de Compostelle</strong>
                <small>2–3 jours · +300 € de Soins, Massages &amp; Cours de Yoga inclus</small>
              </NavLink>
            </div>
          </div>

          <NavLink to="/experiences/arcachon-mere-enfant" onClick={close} className="nav-mere-enfant">Ateliers &amp; Yoga Mère-Enfant</NavLink>
          <NavLink to="/experiences/atelier-enfant" onClick={close} className="nav-atelier-enfant">Atelier Enfant</NavLink>
          <Link to="/#marrakech" onClick={close} className="nav-marrakech">Marrakech</Link>
          <Link to="/#faq" onClick={close}>FAQ</Link>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
          <span aria-label="Instagram (bientôt disponible)" className="ig ig-disabled" title="Instagram (bientôt disponible)"><Instagram size={17} /></span>
        </nav>
        <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue btn-sm head-cta btn-commercial-glow">Je m’inscris — 95 €</Link>
        <button className="burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
