import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Waves, Sun, Sparkles, Check, ArrowRight, X, ChevronLeft, ChevronRight, Gem } from 'lucide-react';
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
    badge: 'Yoga Aérien (Tissus) & Plage · Inclus',
    title: 'Yoga Aérien dans les tissus, Île de Piana & Cercle de parole',
    caption: 'Expérience inédite de Yoga Aérien (Fly Yoga en hamacs de tissus suspendus) et yoga sur la plage de l’Île de Piana avec Virginie, pique-nique face au lagon turquoise et cercle de parole avec Émilie.',
  },
  {
    src: '/img/corse-bonifacio-falaises.jpg',
    badge: 'Découverte Mythique · Bonifacio',
    title: 'Bonifacio : Tour en bateau, Vieille Ville & Restaurant vue mer',
    caption: 'Croisière en bateau au pied des vertigineuses falaises blanches de Bonifacio, flânerie dans les ruelles de la haute ville et moment privilégié dans un restaurant surplombant la mer (restaurants non inclus).',
  },
  {
    src: '/img/corse-sartene-bain-sonore.jpg',
    badge: '+300 € de Soins Esthétiques & Bain Sonore · Inclus',
    title: 'Soins Esthétiques à la Villa, Sartène & Détente Bain Sonore',
    caption: 'Plus de 300 € de soins esthétiques et massages réalisés par Émilie et Virginie (esthéticiennes diplômées), découverte du village authentique de Sartène et séance exclusive de Bain Sonore vibratoire.',
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
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '.55rem', marginBottom: '.8rem' }}>
            <span className="corse-badge" style={{ marginBottom: 0 }}>
              <Compass size={14} /> Évasion Méditerranéenne · 3 à 4 jours en Corse du Sud · 8 femmes
            </span>
            <span className="exclu-300-pill">
              <Gem size={14} /> EXCLUSIF &amp; INÉDIT : + de 300 € de soins esthétiques &amp; Yoga Aérien (tissus) INCLUS
            </span>
          </div>
          <h2>Corse du Sud — Entre Eaux Cristallines, Yoga Aérien &amp; Soins Esthétiques Inclus</h2>
          <p className="script-sub" style={{ color: '#1f6f78' }}>
            De Sartène à Porto-Vecchio et Bonifacio : Yoga Aérien avec tissus, +300 € de soins esthétiques, canoë vers la Grotte d’Amour, Île de Piana &amp; bain sonore
          </p>
          <p className="mc-lead">
            Nous vous donnons rendez-vous directement en Corse pour une échappée lumineuse de <strong>3 à 4 jours (du jeudi ou vendredi au dimanche ou lundi)</strong> en petit groupe complice de <strong>8 femmes</strong>. En exclusivité totale, votre séjour inclut <strong>plus de 300 € de soins esthétiques réalisés par Émilie &amp; Virginie (esthéticiennes diplômées) et de cours de yoga — avec en inédit en Corse du Yoga Aérien dans les tissus (hamacs suspendus) !</strong> Le transport jusqu’en Corse (ainsi que les restaurants) est à votre charge, mais <strong>nous vous aidons et vous conseillons : nous faisons la réservation des billets ensemble pour vous faire bénéficier de remises</strong>, puis vous récupérons dès votre arrivée à <strong>l’aéroport de Figari ou d’Ajaccio</strong>.
          </p>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="premium-banner" style={{ borderColor: 'rgba(27,107,99,.3)', marginBottom: '2.4rem' }}>
          <div className="premium-banner-head">
            <span className="premium-tag" style={{ background: 'linear-gradient(135deg,#1b6b63,#144b52)' }}>
              <Gem size={15} /> EXCLUSIF &amp; INÉDIT EN CORSE · + de 300 € de soins esthétiques &amp; Yoga Aérien inclus
            </span>
            <h3 style={{ color: '#144b52' }}>
              La légèreté du Yoga Aérien dans les tissus, alliée à plus de 300 € de soins esthétiques &amp; rituels sur place
            </h3>
            <p>
              Parce que vous méritez une parenthèse hors du commun : profitez en Corse de toute l’expertise d’Émilie et Virginie (esthéticiennes diplômées et professeure de yoga) avec un programme bien-être et beauté d’une valeur supérieure à 300 € inclus dans votre séjour :
            </p>
          </div>
          <div className="premium-grid">
            <div className="premium-card">
              <span className="premium-badge" style={{ background: '#e6f5f3', color: '#144b52', borderColor: 'rgba(27,107,99,.3)' }}>
                Inédit en Corse · Inclus
              </span>
              <h4>Yoga Aérien (Fly Yoga avec tissus)</h4>
              <p>
                Découvrez la sensation magique de flotter en apesanteur dans les hamacs en tissus suspendus avec Virginie : décompresser la colonne, ouvrir le corps en douceur et lâcher prise entre ciel et mer.
              </p>
            </div>
            <div className="premium-card">
              <span className="premium-badge" style={{ background: '#e6f5f3', color: '#144b52', borderColor: 'rgba(27,107,99,.3)' }}>
                Haute Beauté · Inclus
              </span>
              <h4>Soins Esthétiques &amp; Rituels Visage</h4>
              <p>
                Soins esthétiques personnalisés et rituels d’éclat réalisés directement à la villa par Émilie et Virginie, toutes deux esthéticiennes diplômées, pour sublimer votre peau après le soleil et la mer.
              </p>
            </div>
            <div className="premium-card">
              <span className="premium-badge" style={{ background: '#e6f5f3', color: '#144b52', borderColor: 'rgba(27,107,99,.3)' }}>
                Modelage Expert · Inclus
              </span>
              <h4>Massages Relaxants sur-mesure</h4>
              <p>
                Massages bien-être enveloppants pratiqués par vos esthéticiennes pour dénouer les tensions, apaiser le corps après le canoë et savourer une détente absolue.
              </p>
            </div>
            <div className="premium-card">
              <span className="premium-badge" style={{ background: '#e6f5f3', color: '#144b52', borderColor: 'rgba(27,107,99,.3)' }}>
                Lagon &amp; Vibrations · Inclus
              </span>
              <h4>Yoga Plage de Piana &amp; Bain Sonore</h4>
              <p>
                Séances de yoga en plein air face au lagon turquoise de l’Île de Piana, cercles de parole avec Émilie et voyage vibratoire par Bain Sonore à Sartène.
              </p>
            </div>
          </div>
          <p className="premium-summary" style={{ borderLeftColor: '#1b6b63', background: 'linear-gradient(90deg,rgba(230,245,243,.85),rgba(250,246,239,.9))' }}>
            💎 <strong>Exclusif &amp; Inédit — Plus de 300 € de soins esthétiques et de cours de yoga inclus :</strong> séances de <strong>Yoga Aérien avec tissus suspendus</strong>, cours de yoga face à la mer, soins esthétiques et massages par nos deux esthéticiennes diplômées, ainsi que le Bain Sonore sont intégralement compris dans votre séjour en Corse du Sud.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="corse-dual-grid">
          <div className="corse-card">
            <div className="corse-card-head">
              <span className="corse-hl-tag">✨ L’Aventure Phare &amp; Le Yoga Aérien · Inclus</span>
              <h3>Canoë vers la Grotte d’Amour, Île de Piana &amp; Yoga Aérien (avec tissus)</h3>
              <p>
                Entre lagon turquoise et envol dans les tissus aériens : une alliance inédite de nature sauvage et de bien-être profond.
              </p>
            </div>
            <ul className="corse-list">
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>1. Inédit : Séances de Yoga Aérien dans les tissus &amp; Yoga Plage</strong>
                  <span>Avec Virginie (professeure diplômée), expérimentez le <strong>Yoga Aérien en hamac de tissu suspendu</strong> pour flotter en apesanteur, ainsi que le yoga face au lagon de Piana.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>2. Escale secrète à la Grotte d’Amour &amp; Snorkeling</strong>
                  <span>En binôme par canoë, nous accostons et descendons des canoës pour explorer les eaux cristallines de la Grotte d’Amour en snorkeling.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>3. Traversée en canoë &amp; Pique-nique sur l’Île de Piana</strong>
                  <span>Nous ramons jusqu’aux roches granitiques de l’Île de Piana : deuxième session de snorkeling et pique-nique convivial les pieds dans l’eau.</span>
                </div>
              </li>
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>4. Cercle de parole entre femmes avec Émilie</strong>
                  <span>Moments de partage sincères et bienveillants face à la mer pour déposer ce qui pèse et repartir le cœur léger.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="corse-card corse-card-alt">
            <div className="corse-card-head">
              <span className="corse-hl-tag">💎 +300 € de Soins Esthétiques, Découvertes &amp; Bain Sonore</span>
              <h3>Soins Beauté inclus, Bonifacio, Porto-Vecchio &amp; Sartène</h3>
              <p>
                Toute l’excellence de nos soins esthétiques à la villa, combinée aux joyaux mythiques de la Corse du Sud.
              </p>
            </div>
            <ul className="corse-list">
              <li>
                <span className="corse-check"><Check size={15} /></span>
                <div>
                  <strong>Exclusif : + de 300 € de Soins Esthétiques &amp; Massages inclus</strong>
                  <span>Soins visage, rituels beauté et massages relaxants réalisés sur place par Émilie et Virginie, toutes deux esthéticiennes diplômées.</span>
                </div>
              </li>
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
                  <strong>Village de Sartène, Porto-Vecchio &amp; Détente Bain Sonore</strong>
                  <span>Découverte de Sartène et Porto-Vecchio, séance de relaxation par Bain Sonore animée par notre amie sur place, et plongée sous-marine en option.</span>
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
