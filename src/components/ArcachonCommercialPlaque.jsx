import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { AlmaLogo } from './ui.jsx';
import { euro } from '../data/store.js';

export default function ArcachonCommercialPlaque({ e, variant = 'hero', className = '' }) {
  const deposit = e?.depositPerPlace || 150;
  const price = e?.pricePerPerson || 450;
  const original = e?.originalPrice || 550;

  return (
    <div className={`arca-commercial-card arca-card-${variant} ${className}`} aria-label="Offre exclusive Bassin d’Arcachon">
      <div className="acc-left">
        <div className="acc-badge-row">
          <span className="acc-badge">
            <Sparkles size={13} className="acc-spark" /> Offre de départ exclusive · 8 participantes max
          </span>
          <span className="acc-alma-pill">
            <span className="acc-alma-text">Paiement en 3 × 150 € (150 € d’acompte + 2 × 150 €)</span>
          </span>
        </div>

        <div className="acc-main-pitch">
          <div className="acc-hook-title">
            Réservez votre place pour <strong className="acc-deposit-val">{deposit} €</strong> seulement
          </div>
          <div className="acc-price-block">
            <span className="acc-sub-label">Séjour complet tout compris :</span>
            <span className="acc-old-price">{euro(original)}</span>
            <strong className="acc-current-price">{euro(price)}</strong>
            <span className="acc-per-person">/ personne</span>
            <span className="acc-included-note">
              (Hébergement de charme, pension complète &amp; plus de 300 € de soins de beauté et yoga inclus)
            </span>
          </div>
        </div>
      </div>

      <div className="acc-right">
        <Link to="/reserver/arcachon-entre-femmes" className="acc-cta-btn">
          <span className="acc-cta-main">Je m’inscris — {deposit} €</span>
          <span className="acc-cta-sub">Bloquer ma place dès maintenant</span>
          <ArrowRight size={18} className="acc-cta-arrow" />
        </Link>
        <div className="acc-reassurance-list">
          <span><ShieldCheck size={13} /> Paiement 100% sécurisé</span>
          <span><Users size={13} /> Petit groupe intimiste</span>
        </div>
      </div>
    </div>
  );
}
