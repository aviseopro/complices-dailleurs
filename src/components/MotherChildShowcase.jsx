import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, BookOpen, Waves, Sun, Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const MOTHER_CHILD_PHOTOS = [
  {
    src: '/img/atelier-mere-enfant-massage.jpg',
    fallback: '/img/villa-salon-cathedrale.png',
    badge: 'Rituel Signature · En Duo',
    title: 'Atelier Massage Complice Mère ↔ Enfant',
    caption: 'Un moment de tendresse rare guidé par nos esthéticiennes : l’enfant apprend des gestes doux pour masser sa maman (mains, épaules, visage), et la maman masse son enfant dans une bulle d’écoute absolue.',
  },
  {
    src: '/img/atelier-maman-spa.jpg',
    fallback: '/img/villa-jacuzzi.jpg',
    badge: 'Sérénité Absolue · Pour les Mamans',
    title: 'Le Temps des Mamans : Spa 7 places, Sauna & Quiétude',
    caption: 'Pendant qu’Émilie et Virginie animent l’atelier réservé aux enfants, les mamans savourent en toute tranquillité le jacuzzi 7 places, le sauna 4 places, la piscine chauffée et la tisanerie.',
  },
  {
    src: '/img/atelier-mere-enfant-lecture.jpg',
    fallback: '/img/villa-filet-mezzanine.png',
    badge: 'Cocon Poétique · En Duo',
    title: 'Lecture, Contes & Confidences dans le Filet Suspendu',
    caption: 'Lovés dans les coussins en lin du filet suspendu en mezzanine ou du coin lecture, maman et enfant partagent histoires, murmures et câlins hors du temps.',
  },
  {
    src: '/img/atelier-enfants-creatif.jpg',
    fallback: '/img/villa-table-exterieure.jpg',
    badge: 'Éveil & Douceur · Enfants & Duo',
    title: 'Ateliers Créatifs des Enfants & Goûter Chic sur la Terrasse',
    caption: 'Créations poétiques autour des trésors du Bassin, yoga ludique avec Virginie, cercle des émotions avec Émilie et grand goûter maison sain et gourmand sur la terrasse en bois.',
  },
];

export default function MotherChildShowcase({ embedded = false }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + MOTHER_CHILD_PHOTOS.length) % MOTHER_CHILD_PHOTOS.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % MOTHER_CHILD_PHOTOS.length);
  };

  const content = (
    <>
      <Reveal>
        <div className="mc-header">
          <span className="mc-badge"><Sparkles size={14} /> Parenthèse d’Exception à la Journée · Villa privée sur le Bassin d’Arcachon</span>
          <h2>Journées Privilège &amp; Ateliers Mère-Enfant</h2>
          <p className="script-sub">L’art de nourrir un lien complice avec son enfant, tout en s’offrant un vrai temps de repos entre mamans</p>
          <p className="mc-lead">
            Dans l’écrin intimiste de notre <strong>villa-loft avec piscine chauffée, Spa 7 places et Sauna 4 places à 10 minutes à pied du Bassin d’Arcachon</strong>, nous avons imaginé des journées confidentielles en tout petit comité. Une expérience raffinée, douce et sécurisante qui réunit ce dont chaque maman rêve secrètement : <strong>des ateliers complices inoubliables avec son enfant</strong>, et <strong>le luxe d’un vrai moment de tranquillité au Spa pendant que nous prenons soin des enfants</strong>.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mc-dual-promise">
          <div className="mc-promise-card">
            <div className="mc-promise-icon"><Heart size={22} /></div>
            <span className="mc-promise-tag">1 · La Connexion Mère-Enfant</span>
            <h3>Des rituels précieux pour créer des souvenirs à deux</h3>
            <p>
              Loin du rythme effréné de la semaine et des écrans, vous partagez avec votre enfant des instants de pure présence guidés avec délicatesse :
            </p>
            <ul className="ticks">
              <li><Check size={15} /> <strong>Atelier Massage Réciproque (Maman ↔ Enfant)</strong> : apprendre à l’enfant à masser sa maman avec douceur, et masser son enfant pour l’apaiser.</li>
              <li><Check size={15} /> <strong>Moment Lecture &amp; Confidences</strong> perchés dans le grand filet suspendu en mezzanine ou au coin bibliothèque.</li>
              <li><Check size={15} /> <strong>Yoga ludique en duo avec Virginie</strong> &amp; météo des émotions guidée par Émilie.</li>
            </ul>
          </div>

          <div className="mc-promise-card highlight">
            <div className="mc-promise-icon"><Waves size={22} /></div>
            <span className="mc-promise-tag">2 · Le Temps Retrouvé des Mamans</span>
            <h3>Vous soufflez en toute quiétude, nous veillons sur vos enfants</h3>
            <p>
              Parce qu’une maman ressourcée est le plus beau des cadeaux : pendant que nous animons les ateliers créatifs et sensoriels réservés aux enfants dans la villa, <strong>vous profitez d’un temps rien que pour vous</strong> :
            </p>
            <ul className="ticks">
              <li><Check size={15} /> <strong>Accès libre au Spa Jacuzzi 7 places &amp; Sauna 4 places</strong> entre mamans, dans le calme absolu.</li>
              <li><Check size={15} /> <strong>Piscine chauffée, salon cathédrale &amp; terrasse en bois</strong> avec tisanes bio et collations saines.</li>
              <li><Check size={15} /> <strong>Enfants choyés en petit groupe</strong> par Émilie &amp; Virginie dans un cadre bienveillant et stimulant.</li>
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="mc-gallery-grid">
        {MOTHER_CHILD_PHOTOS.map((item, idx) => (
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
                <span className="mc-photo-badge">{item.badge}</span>
              </div>
              <div className="mc-photo-body">
                <h4>{item.title}</h4>
                <p>{item.caption}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mc-schedule-box">
          <div className="mc-schedule-intro">
            <span className="eyebrow" style={{ marginBottom: '.3rem' }}>Format à la journée · Bassin d’Arcachon</span>
            <h3>Comment s’articule votre Journée Privilège Mère-Enfant ?</h3>
            <p>Un déroulé fluide et équilibré, pensé pour respecter le rythme des enfants (dès 5 ans) et offrir aux mamans une vraie parenthèse de douceur :</p>
            <div className="mc-cta-group">
              <Link to="/contact" className="btn btn-terra">Réserver ou privatiser une journée Mère-Enfant <ArrowRight size={16} /></Link>
              {!embedded && (
                <Link to="/experiences/arcachon-mere-enfant" className="btn btn-ghost">Voir la fiche complète de l’expérience</Link>
              )}
            </div>
          </div>

          <div className="mc-timeline">
            <div className="mc-step">
              <span className="mc-time"><Sun size={14} /> 10h00 – 12h30 · En Duo</span>
              <strong>Accueil gourmand, Yoga complice &amp; Atelier Massage Maman ↔ Enfant</strong>
              <p>Découverte de la villa, éveil corporel doux avec Virginie, puis grand atelier d’initiation au massage réciproque où l’enfant apprend à masser sa maman et reçoit son massage apaisant.</p>
            </div>
            <div className="mc-step">
              <span className="mc-time"><Sparkles size={14} /> 12h30 – 14h00 · Table d’Hôte</span>
              <strong>Déjeuner sain, raffiné &amp; convivial sous la verrière ou en terrasse</strong>
              <p>Une cuisine fraîche, locale et de saison qui ravit le palais des mamans comme celui des enfants.</p>
            </div>
            <div className="mc-step">
              <span className="mc-time"><Waves size={14} /> 14h00 – 16h00 · Temps séparé</span>
              <strong>Spa, Sauna &amp; Piscine pour les Mamans · Ateliers Créatifs pour les Enfants</strong>
              <p>Les mamans se prélassent au Spa 7 places et au Sauna en toute quiétude pendant qu’Émilie et Virginie animent l’atelier créatif et sensoriel des enfants.</p>
            </div>
            <div className="mc-step">
              <span className="mc-time"><BookOpen size={14} /> 16h00 – 17h30 · Retrouvailles</span>
              <strong>Lecture perchée dans le Filet Suspendu &amp; Goûter Chic de Clôture</strong>
              <p>Retrouvailles tout en douceur dans le filet en mezzanine autour de beaux livres, cercle de gratitude et goûter maison gourmand avant de repartir le cœur léger.</p>
            </div>
          </div>
        </div>
      </Reveal>

      {lightboxIdx !== null && (
        <div
          className="villa-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={MOTHER_CHILD_PHOTOS[lightboxIdx].title}
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
            <img src={MOTHER_CHILD_PHOTOS[lightboxIdx].src} alt={MOTHER_CHILD_PHOTOS[lightboxIdx].title} />
            <div className="villa-lb-caption">
              <strong>{MOTHER_CHILD_PHOTOS[lightboxIdx].title}</strong>
              <p>{MOTHER_CHILD_PHOTOS[lightboxIdx].caption}</p>
              <small>{lightboxIdx + 1} / {MOTHER_CHILD_PHOTOS.length}</small>
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
    return <div className="mc-embedded" id="atelier-mere-enfant">{content}</div>;
  }

  return (
    <section className="section mc-section" id="atelier-mere-enfant">
      <div className="wrap">{content}</div>
    </section>
  );
}
