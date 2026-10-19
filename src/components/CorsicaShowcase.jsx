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
    badge: 'Découverte Mythique · Bonifacio',
    title: 'Bonifacio : Tour en bateau, Vieille Ville & Restaurant vue mer',
    caption: 'Croisière en bateau au pied des vertigineuses falaises blanches de Bonifacio, flânerie dans les ruelles de la haute ville et moment privilégié dans un restaurant surplombant la mer (restaurants non inclus).',
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
            Nous vous donnons rendez-vous directement en Corse pour une échappée lumineuse de <strong>3 à 4 jours (du jeudi ou vendredi au dimanche ou lundi)</strong> en petit groupe complice de <strong>8 femmes</strong>. Le transport jusqu’en Corse (ainsi que les restaurants) est à votre charge, mais <strong>nous vous aidons et vous conseillons : nous faisons la réservation des billets ensemble pour vous faire bénéficier de remises</strong>. Dès votre atterrissage à <strong>l’aéroport de Figari ou d’Ajaccio</strong>, nous vous récupérons pour rejoindre notre villa de charme située du côté de <strong>Sartène ou de Porto-Vecchio</strong>.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="corse-dual-grid">
          <div className="corse-card">
            <div className="corse-card-head">
              <span className="corse-hl-tag">✨ L’Aventure Phare du Séjour · Inclus</span>
              <h3>L’Odyssée en Canoë : Grotte d’Amour &amp; Île de Piana</h3>
              <p>
                Le moment fort du séjour : par deux (en binôme par canoë), nous quittons la plage en pagayant sur une eau turquoise d’une pureté irréelle.
              </p>
            </div>
            <ul className="corse-list">
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>1. Escale secrète à la Grotte d’Amour &amp; Snorkeling</strong>
                  <span>Nous accostons et descendons des canoës (en les gardant auprès de nous) pour explorer les eaux cristallines en snorkeling.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>2. Traversée en canoë jusqu’aux roches de l’Île de Piana</strong>
                  <span>Nous reprenons les canoës pour ramer jusqu’à l’Île de Piana : décor sauvage de roches granitiques et deuxième session de snorkeling.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>3. Pique-nique les pieds dans l’eau sur la plage de Piana</strong>
                  <span>Pause déjeuner conviviale sur le banc de sable blanc face au lagon translucide.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>4. Yoga en plein air &amp; Cercle de parole</strong>
                  <span>Séance de yoga face à la mer avec Virginie et cercle de parole entre femmes avec Émilie.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="corse-card corse-card-alt">
            <div className="corse-card-head">
              <span className="corse-hl-tag">🌊 Découvertes, Bien-Être &amp; Modalités</span>
              <h3>Bonifacio, Porto-Vecchio, Sartène &amp; Bain Sonore</h3>
              <p>
                Entre falaises mythiques, villages corses de caractère, vibrations sonores et plages secrètes entre mer et montagne.
              </p>
            </div>
            <ul className="corse-list">
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>Bonifacio : Tour en bateau, Vieille Ville &amp; Vue mer</strong>
                  <span>Croisière au pied des falaises blanches, flânerie dans la haute ville et restaurant surplombant la mer <em>(restaurants non inclus)</em>.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>Village de Sartène &amp; Détente Bain Sonore</strong>
                  <span>Découverte du charmant village de granit de Sartène et séance de relaxation par Bain Sonore animée par notre amie sur place.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>Porto-Vecchio, plages, montagnes &amp; Plongée</strong>
                  <span>Immersion entre criques paradisiaques et reliefs corses, avec possibilité de <strong>plongée sous-marine en option</strong>.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>Vols réservés ensemble (avec remises) &amp; Accueil aéroport</strong>
                  <span>Transport et restaurants à votre charge : nous vous conseillons et réservons les billets ensemble pour bénéficier de remises, puis vous récupérons à Ajaccio ou Figari.</span>
                </div>
              </li>
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
