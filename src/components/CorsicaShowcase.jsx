import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Waves, Sun, Sparkles, Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const CORSICA_PHOTOS = [
  {
    src: '/img/corse-canoe-piana.jpg',
    badge: 'Expérience Signature · Inclus',
    title: 'Canoë en binôme vers la Grotte d’Amour & Snorkeling',
    caption: 'Départ depuis la plage à deux par canoë : première escale magique dans la Grotte d’Amour où l’on descend des canoës pour explorer les eaux translucides en snorkeling, avant de pagayer jusqu’aux roches de l’Île de Piana.',
  },
  {
    src: '/img/corse-piana-yoga-plage.jpg',
    badge: 'Lagon & Sororité · Inclus',
    title: 'Île de Piana : Pique-nique sur la plage, Yoga & Cercle de parole',
    caption: 'Arrivées sur l’Île de Piana entre rochers granitiques et lagon turquoise : deuxième session de snorkeling, pique-nique convivial sur la plage, séance de yoga en plein air avec Virginie et cercle de parole avec Émilie.',
  },
  {
    src: '/img/corse-bonifacio-falaises.jpg',
    badge: 'Découverte Mythique · Inclus',
    title: 'Bonifacio : Tour en bateau, Vieille Ville & Restaurant vue mer',
    caption: 'Croisière en bateau au pied des vertigineuses falaises blanches de Bonifacio, flânerie dans les ruelles de la haute ville et repas inoubliable dans un restaurant surplombant la mer.',
  },
  {
    src: '/img/corse-sartene-bain-sonore.jpg',
    badge: 'Âme Corse & Vibrations · Inclus',
    title: 'Le village de Sartène, Porto-Vecchio & Détente Bain Sonore',
    caption: 'Découverte du village authentique de Sartène et de ses ruelles de granit, séance exclusive de détente par Bain Sonore animée par notre amie sur place, et escapades entre Porto-Vecchio, plages et montagnes (plongée sous-marine en option).',
  },
];

export default function CorsicaShowcase({ embedded = false }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + CORSICA_PHOTOS.length) % CORSICA_PHOTOS.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % CORSICA_PHOTOS.length);
  };

  const content = (
    <>
      <Reveal>
        <div className="corse-header">
          <span className="corse-badge"><Compass size={14} /> Évasion Méditerranéenne · 3 à 4 jours en Corse du Sud · 8 femmes</span>
          <h2>Corse du Sud — Entre Eaux Cristallines, Falaises &amp; Villages d’Âme</h2>
          <p className="script-sub" style={{ color: '#1f6f78' }}>
            De Sartène à Porto-Vecchio et Bonifacio : canoë vers la Grotte d’Amour, Île de Piana, yoga &amp; bain sonore
          </p>
          <p className="mc-lead">
            Nous vous donnons rendez-vous directement en Corse pour une échappée lumineuse de <strong>3 à 4 jours (du jeudi ou vendredi au dimanche ou lundi)</strong> en petit groupe complice de <strong>8 femmes</strong>. Dès votre atterrissage à <strong>l’aéroport de Figari ou d’Ajaccio</strong>, nous vous récupérons pour rejoindre notre villa de charme située du côté de <strong>Sartène ou de Porto-Vecchio</strong>. Au programme : la beauté sauvage de l’Île de Beauté entre plages secrètes, montagnes, balades en mer, yoga et lâcher-prise.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="corse-highlight-box">
          <div className="corse-hl-left">
            <span className="corse-hl-tag">✨ L’Aventure Phare du Séjour · Inclus</span>
            <h3>L’Odyssée en Canoë : de la Grotte d’Amour au lagon de l’Île de Piana</h3>
            <p>
              C’est le moment fort que vous n’oublierez jamais : par deux (en binôme par canoë), nous quittons la plage en pagayant sur une eau d’une pureté irréelle :
            </p>
            <ul className="ticks corse-ticks">
              <li><Check size={15} /> <strong>Escale secrète à la Grotte d’Amour</strong> : nous accostons et descendons des canoës pour plonger en <strong>snorkeling</strong> au cœur des eaux turquoise translucides.</li>
              <li><Check size={15} /> <strong>Traversée en canoë jusqu’à l’Île de Piana</strong> : découverte d’un décor sauvage de roches sculptées et deuxième temps de <strong>snorkeling</strong> dans les eaux claires.</li>
              <li><Check size={15} /> <strong>Pique-nique, Yoga &amp; Cercle de parole sur l’Île de Piana</strong> : déjeuner pique-nique les pieds dans le sable, suivi d’un cours de <strong>yoga en plein air avec Virginie</strong> et d’un <strong>cercle de parole avec Émilie</strong> face au lagon.</li>
            </ul>
          </div>

          <div className="corse-hl-right">
            <span className="corse-hl-tag">🌊 Découvertes, Bien-Être &amp; Options</span>
            <h3>Bonifacio, Porto-Vecchio, Sartène &amp; Bain Sonore</h3>
            <ul className="ticks corse-ticks">
              <li><Check size={15} /> <strong>Bonifacio par la mer &amp; les falaises</strong> : tour en bateau au pied des falaises calcaires et des grottes marines, visite de la Vieille Ville et <strong>restaurant panoramique surplombant la mer</strong>.</li>
              <li><Check size={15} /> <strong>Sartène &amp; Détente Bain Sonore</strong> : découverte du charmant village de Sartène et séance de <strong>relaxation par Bain Sonore</strong> guidée par notre amie sur place.</li>
              <li><Check size={15} /> <strong>Porto-Vecchio, plages &amp; montagnes</strong> : immersion entre criques paradisiaques et reliefs corses.</li>
              <li><Check size={15} /> <strong>En option : Plongée sous-marine</strong> pour explorer la richesse des fonds marins de Corse du Sud.</li>
              <li><Check size={15} /> <strong>Accueil aéroport inclus</strong> : nous vous récupérons à votre arrivée à <strong>Ajaccio ou Figari</strong>.</li>
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="mc-gallery-grid">
        {CORSICA_PHOTOS.map((item, idx) => (
          <Reveal key={item.title} delay={idx * 90}>
            <button
              type="button"
              className="mc-photo-card"
              onClick={() => setLightboxIdx(idx)}
              aria-label={`Agrandir : ${item.title}`}
            >
              <div className="mc-photo-img-wrap">
                <img src={item.src} alt={item.title} loading="lazy" />
                <span className="mc-photo-badge" style={{ background: 'rgba(20,75,82,.82)' }}>{item.badge}</span>
              </div>
              <div className="mc-photo-body">
                <h4>{item.title}</h4>
                <p>{item.caption}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {!embedded && (
        <Reveal delay={100}>
          <div className="cta-row" style={{ justifyContent: 'center', marginTop: '.5rem' }}>
            <Link to="/experiences/corse" className="btn btn-corse">Découvrir tout le programme Corse du Sud (3–4 jours) <ArrowRight size={16} /></Link>
            <Link to="/contact" className="btn btn-ghost">Être prévenue des prochaines dates en Corse</Link>
          </div>
        </Reveal>
      )}

      {lightboxIdx !== null && (
        <div
          className="villa-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={CORSICA_PHOTOS[lightboxIdx].title}
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            className="villa-lb-close"
            aria-label="Fermer"
            onClick={() => setLightboxIdx(null)}
          >
            <X size={24} />
          </button>
          <button type="button" className="villa-lb-nav prev" aria-label="Précédent" onClick={prev}>
            <ChevronLeft size={28} />
          </button>
          <div className="villa-lb-content" onClick={(e) => e.stopPropagation()}>
            <img src={CORSICA_PHOTOS[lightboxIdx].src} alt={CORSICA_PHOTOS[lightboxIdx].title} />
            <div className="villa-lb-caption">
              <strong>{CORSICA_PHOTOS[lightboxIdx].title}</strong>
              <p>{CORSICA_PHOTOS[lightboxIdx].caption}</p>
              <small>{lightboxIdx + 1} / {CORSICA_PHOTOS.length}</small>
            </div>
          </div>
          <button type="button" className="villa-lb-nav next" aria-label="Suivant" onClick={next}>
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="corse-embedded" id="corse">{content}</div>;
  }

  return (
    <section className="section corse-section" id="corse">
      <div className="wrap">{content}</div>
    </section>
  );
}
