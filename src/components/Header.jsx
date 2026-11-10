import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from './ui.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [escOpen, setEscOpen] = useState(false);
  const [atelOpen, setAtelOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();
  const escRef = useRef(null);
  const atelRef = useRef(null);

  const isEscapadeActive =
    pathname.includes('arcachon-entre-femmes') ||
    pathname.includes('corse') ||
    pathname.includes('marrakech') ||
    pathname.includes('trek-compostelle');

  const isAtelierActive =
    pathname.includes('journee-entre-copines') ||
    pathname.includes('arcachon-mere-enfant') ||
    pathname.includes('atelier-enfant');

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 20);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (escRef.current && !escRef.current.contains(e.target)) setEscOpen(false);
      if (atelRef.current && !atelRef.current.contains(e.target)) setAtelOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const close = () => {
    setOpen(false);
    setEscOpen(false);
    setAtelOpen(false);
  };

  return (
    <header className={`header ${solid ? 'solid' : ''}`}>
      <div className="header-promo-bar">
        <div className="header-promo-in">
          <Link to="/reserver/arcachon-entre-femmes" onClick={close} className="header-promo-link">
            Prochaine édition — <span>Réservez notre prochain week-end sur le Bassin d’Arcachon · Du 29 au 31 janvier 2027</span>
          </Link>
        </div>
      </div>

      <div className="header-in">
        <Logo />

        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Navigation principale">
          {/* 1. Nos escapades (avec menu déroulant dynamique + ancre #escapades) */}
          <div
            className={`nav-dropdown ${escOpen ? 'is-open' : ''}`}
            ref={escRef}
            onMouseEnter={() => setEscOpen(true)}
            onMouseLeave={() => setEscOpen(false)}
          >
            <button
              type="button"
              className={`nav-drop-btn nav-arcachon ${isEscapadeActive ? 'active' : ''}`}
              aria-expanded={escOpen}
              onClick={() => setEscOpen((v) => !v)}
            >
              <span>Nos escapades</span>
              <ChevronDown size={14} className="nav-chev" />
            </button>
            <div className="nav-drop-menu" role="menu">
              <NavLink to="/experiences/arcachon-entre-femmes" onClick={close} className="drop-item drop-arcachon" role="menuitem">
                <strong>Bassin d’Arcachon entre femmes</strong>
                <small>Week-end en loft privatisé · Soins du visage, spa &amp; yoga</small>
              </NavLink>
              <NavLink to="/experiences/corse" onClick={close} className="drop-item drop-corse" role="menuitem">
                <strong>Corse du Sud entre femmes</strong>
                <small>3–4 jours · Sartène, Porto-Vecchio, Bonifacio &amp; yoga aérien</small>
              </NavLink>
              <NavLink to="/experiences/marrakech-entre-femmes" onClick={close} className="drop-item drop-marrakech" role="menuitem">
                <strong>Marrakech — Entre femmes</strong>
                <small>4 jours / 3 nuits · Riad, yoga, massage &amp; atelier mosaïque</small>
              </NavLink>
              <NavLink to="/experiences/marrakech-mere-enfant" onClick={close} className="drop-item drop-marrakech" role="menuitem">
                <strong>Marrakech — Mère &amp; enfant</strong>
                <small>Séjour complice · Ateliers créatifs, souks &amp; riad</small>
              </NavLink>
              <NavLink to="/experiences/trek-compostelle" onClick={close} className="drop-item drop-trek" role="menuitem">
                <strong>Trek au féminin · Compostelle</strong>
                <small>2–3 jours · Marche douce, yoga &amp; bivouac</small>
              </NavLink>
              <Link to="/#escapades" onClick={close} className="drop-item-footer" role="menuitem">
                Voir toutes nos escapades sur l’accueil →
              </Link>
            </div>
          </div>

          {/* 2. Nos journées & ateliers (avec menu déroulant dynamique + ancre #ateliers) */}
          <div
            className={`nav-dropdown ${atelOpen ? 'is-open' : ''}`}
            ref={atelRef}
            onMouseEnter={() => setAtelOpen(true)}
            onMouseLeave={() => setAtelOpen(false)}
          >
            <button
              type="button"
              className={`nav-drop-btn nav-atelier-pill ${isAtelierActive ? 'active' : ''}`}
              aria-expanded={atelOpen}
              onClick={() => setAtelOpen((v) => !v)}
            >
              <span>Nos journées &amp; ateliers</span>
              <ChevronDown size={14} className="nav-chev" />
            </button>
            <div className="nav-drop-menu" role="menu">
              <NavLink to="/experiences/journee-entre-copines" onClick={close} className="drop-item drop-arcachon" role="menuitem">
                <strong>Une journée entre copines</strong>
                <small>Soins, yoga et détente à la carte près de Bordeaux</small>
              </NavLink>
              <NavLink to="/experiences/arcachon-mere-enfant" onClick={close} className="drop-item drop-mere-enfant" role="menuitem">
                <strong>Journées mère-enfant sur le Bassin</strong>
                <small>Yoga en duo, massage complice, spa mamans &amp; atelier créatif</small>
              </NavLink>
              <NavLink to="/experiences/atelier-enfant" onClick={close} className="drop-item drop-atelier-enfant" role="menuitem">
                <strong>Ateliers créatifs pour enfants</strong>
                <small>Argile, mosaïque &amp; bijoux en pâte Fimo sur le Bassin</small>
              </NavLink>
              <Link to="/#ateliers" onClick={close} className="drop-item-footer" role="menuitem">
                Voir toutes nos journées &amp; ateliers sur l’accueil →
              </Link>
            </div>
          </div>

          {/* 3. Notre histoire */}
          <NavLink to="/notre-histoire" onClick={close} className="nav-accueil">
            Notre histoire
          </NavLink>

          {/* 4. Contact */}
          <NavLink to="/contact" onClick={close} className="nav-contact-pill">
            Contact
          </NavLink>

          {/* 5. Mon espace Complice (Espace membre personnalisé) */}
          <NavLink to="/mon-espace" onClick={close} className="nav-member-btn nav-mobile-cta">
            Mon espace Complice
          </NavLink>

          <Link to="/reserver/arcachon-entre-femmes" onClick={close} className="btn btn-terra btn-sm nav-mobile-cta">
            Réserver ma place
          </Link>
        </nav>

        <div className="head-actions">
          <NavLink to="/mon-espace" className="nav-member-btn head-member-cta">
            Mon espace Complice
          </NavLink>
          <Link to="/reserver/arcachon-entre-femmes" className="btn btn-terra btn-sm head-cta">
            Réserver ma place
          </Link>
        </div>

        <button
          className="burger"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
