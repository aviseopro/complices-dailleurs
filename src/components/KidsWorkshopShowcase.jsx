import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gift, Check, ArrowRight, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const KIDS_CRAFT_ACTIVITIES = [
  {
    badge: 'Terre & Modelage',
    title: 'Atelier Argile : Vide-poches & Petits Plats Déco',
    desc: 'Les enfants mettent les mains dans l’argile pour façonner, lisser et décorer leur propre vide-poche ou petit plat décoratif (empreintes de feuilles, coquillages, gravures et peintures douces).',
    takeaway: 'Repart chez lui avec son vide-poche ou petit plat déco en argile, prêt à accueillir ses petits trésors dans sa chambre ou à offrir.',
  },
  {
    badge: 'Couleurs & Assemblage',
    title: 'Atelier Mosaïque : Dessous de plat, Cadres & Déco',
    desc: 'Un jeu de patience et d’harmonie : chaque enfant choisit ses tesselles colorées, nacres et émaux pour composer un motif géométrique ou figuratif sur son support en bois.',
    takeaway: 'Repart chez lui avec sa création en mosaïque véritable, un objet déco durable et lumineux fait de ses propres mains.',
  },
  {
    badge: 'Atelier Bijoux & Couleurs',
    title: 'Atelier Pâte Fimo : Création de Bijoux & Porte-clés',
    desc: 'Modelage minutieux, mélanges de teintes pastel ou vives et création de perles et breloques en pâte Fimo pour monter ses propres bracelets, colliers ou porte-clés personnalisés.',
    takeaway: 'Repart chez lui avec sa parure de bijoux ou son porte-clés unique créé sur-mesure pendant l’atelier.',
  },
  {
    badge: 'Épanouissement & Fierté',
    title: 'Créativité, Confiance en soi & Joie du « Fait-Main »',
    desc: 'Sans discours compliqué, le développement personnel passe ici par le concret : se concentrer loin des écrans, oser créer, s’entraider en petit groupe et ressentir la fierté du « C’est moi qui l’ai fait ! ».',
    takeaway: 'Repart grandi, fier de son talent manuel, après un goûter maison convivial partagé avec le groupe.',
  },
];

export const KIDS_WORKSHOP_PHOTOS = [
  {
    src: '/img/atelier-enfant-argile.jpg',
    fallback: '/img/atelier-enfants-creatif.jpg',
    badge: 'Argile & Modelage',
    title: 'Création de Vide-poches & Petits Plats Déco en Argile',
    caption: 'Modelage de l’argile, empreintes naturelles et mise en couleur pour façonner un joli vide-poche ou petit plat décoratif à ramener à la maison.',
  },
  {
    src: '/img/atelier-enfant-mosaique.jpg',
    fallback: '/img/villa-table-exterieure.jpg',
    badge: 'Mosaïque Créative',
    title: 'Initiation à la Mosaïque & Composition Colorée',
    caption: 'Assemblage de tesselles colorées et nacrées pour développer la concentration, le sens artistique et créer un véritable objet déco.',
  },
  {
    src: '/img/atelier-enfant-fimo-bijoux.jpg',
    fallback: '/img/atelier-mere-enfant-massage.jpg',
    badge: 'Atelier Bijoux · Pâte Fimo',
    title: 'Atelier Bijoux en Pâte Fimo : Perles, Bracelets & Colliers',
    caption: 'Création de perles façonnées à la main, marbrages de couleurs et montage de bracelets, colliers et porte-clés personnalisés.',
  },
  {
    src: '/img/atelier-enfant-fierte-objet.jpg',
    fallback: '/img/atelier-mere-enfant-lecture.jpg',
    badge: 'Fierté & Goûter Maison',
    title: 'La Fierté de Repartir chez Soi avec sa Création',
    caption: 'Après le goûter gourmand, chaque enfant repart les yeux brillants avec l’objet déco ou le bijou qu’il a fabriqué de ses propres mains.',
  },
];

export default function KidsWorkshopShowcase({ embedded = false }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + KIDS_WORKSHOP_PHOTOS.length) % KIDS_WORKSHOP_PHOTOS.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % KIDS_WORKSHOP_PHOTOS.length);
  };

  const content = (
    <>
      <Reveal>
        <div className="kids-header">
          <span className="kids-badge"><Sparkles size={14} /> Nouveauté · Ateliers Créatifs &amp; Manuels pour les Enfants · Bassin d’Arcachon</span>
          <h2>Atelier Enfant — Argile, Mosaïque &amp; Bijoux en Pâte Fimo</h2>
          <p className="script-sub" style={{ color: '#8c3450' }}>
            Créer de ses mains, prendre confiance en soi et repartir tout fier à la maison avec son objet déco ou son bijou
          </p>
          <p className="mc-lead">
            En plus de nos séjours et journées mère-enfant, nous accueillons les enfants pour des <strong>ateliers manuels, joyeux et concrets</strong>. Ici, le développement personnel se vit simplement et naturellement à travers le plaisir de créer : modeler un <strong>vide-poche ou un petit plat déco en argile</strong>, composer une <strong>mosaïque colorée</strong>, ou fabriquer ses propres <strong>bijoux en pâte Fimo</strong>. Loin des écrans, l’enfant développe sa dextérité, son imagination et sa confiance en lui — et <strong>repart chez lui avec sa propre création</strong> !
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="kids-craft-grid">
          {KIDS_CRAFT_ACTIVITIES.map((item) => (
            <div className="kids-craft-card" key={item.title}>
              <div className="kids-craft-top">
                <span className="kids-craft-tag">{item.badge}</span>
                <h3>{item.title}</h3>
              </div>
              <p className="kids-craft-desc">{item.desc}</p>
              <div className="kids-takeaway-box">
                <span className="kids-takeaway-ico"><Gift size={15} /></span>
                <div>
                  <strong>L’objet rapporté à la maison</strong>
                  <span>{item.takeaway}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mc-gallery-grid">
        {KIDS_WORKSHOP_PHOTOS.map((item, idx) => (
          <Reveal key={item.title} delay={idx * 90}>
            <button
              type="button"
              className="mc-photo-card"
              onClick={() => setLightboxIdx(idx)}
              aria-label={`Agrandir : ${item.title}`}
            >
              <div className="mc-photo-img-wrap">
                <img
                  src={item.src}
                  alt={item.title}
                  onError={(e) => {
                    if (item.fallback && e.currentTarget.src !== item.fallback) {
                      e.currentTarget.src = item.fallback;
                    }
                  }}
                />
                <span className="mc-photo-badge" style={{ background: 'rgba(140, 52, 80, .86)' }}>{item.badge}</span>
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
            <Link to="/experiences/atelier-enfant" className="btn btn-kids">Découvrir l’Atelier Enfant (Argile, Mosaïque &amp; Bijoux Fimo) <ArrowRight size={16} /></Link>
            <Link to="/contact" className="btn btn-ghost">Inscrire mon enfant ou poser une question</Link>
          </div>
        </Reveal>
      )}

      {lightboxIdx !== null && (
        <div
          className="villa-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={KIDS_WORKSHOP_PHOTOS[lightboxIdx].title}
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
            <img src={KIDS_WORKSHOP_PHOTOS[lightboxIdx].src} alt={KIDS_WORKSHOP_PHOTOS[lightboxIdx].title} />
            <div className="villa-lb-caption">
              <strong>{KIDS_WORKSHOP_PHOTOS[lightboxIdx].title}</strong>
              <p>{KIDS_WORKSHOP_PHOTOS[lightboxIdx].caption}</p>
              <small>{lightboxIdx + 1} / {KIDS_WORKSHOP_PHOTOS.length}</small>
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
    return <div className="kids-embedded" id="atelier-enfant">{content}</div>;
  }

  return (
    <section className="section kids-section" id="atelier-enfant">
      <div className="wrap">{content}</div>
    </section>
  );
}
