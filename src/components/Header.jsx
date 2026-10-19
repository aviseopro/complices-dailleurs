import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
  </svg>
);
import { Logo } from './ui.jsx';
import { useData } from '../data/store.js';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { settings } = useData();
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 20);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const close = () => setOpen(false);
  return (
    <header className={`header ${solid ? 'solid' : ''}`}>
      <div className="header-in">
        <Logo />
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Navigation principale">
          <NavLink to="/" end onClick={close}>Accueil</NavLink>
          <NavLink to="/notre-histoire" onClick={close}>Notre histoire</NavLink>
          <NavLink to="/experiences/arcachon-entre-femmes" onClick={close} className="nav-arcachon">Bassin d’Arcachon</NavLink>
          <NavLink to="/experiences/arcachon-mere-enfant" onClick={close} className="nav-mere-enfant">Ateliers &amp; Yoga Mère-Enfant</NavLink>
          <NavLink to="/experiences/trek-compostelle" onClick={close} className="nav-trek">Trek Compostelle</NavLink>
          <Link to="/#marrakech" onClick={close}>Marrakech</Link>
          <Link to="/#faq" onClick={close}>FAQ</Link>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
          <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="ig"><Instagram size={17} /></a>
        </nav>
        <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue btn-sm head-cta">Pré-réserver — 95 € d’acompte</Link>
        <button className="burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
