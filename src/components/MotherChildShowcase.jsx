import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, BookOpen, Waves, Sun, Check, ArrowRight, X, ChevronLeft, ChevronRight, Gift, Compass, Feather } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const SIGNATURE_CREATIVE_WORKSHOPS = [
  {
    tag: 'Confiance en soi & Estime',
    title: 'Le Coffret des Émotions & des Mots Doux',
    goal: 'Apprendre à nommer sa météo intérieure, reconnaître ses forces (« Ce dont je suis fier/fière ») et nourrir son réservoir affectif.',
    craft: 'Personnalisation d’un coffret en bois naturel (peintures minérales douces, lin, fleurs séchées et coquillages du Bassin) et création de cartes-mantras illustrées.',
    takeaway: 'Son Coffret aux Trésors d’Émotions à poser sur sa table de chevet pour tirer une carte de confiance ou y glisser un mot doux chaque soir.',
  },
  {
    tag: 'Gestion des émotions & Calme',
    title: 'Le Flacon de Retour au Calme & Galet d’Ancrage',
    goal: 'Apprivoiser les tempêtes émotionnelles (stress, colère, agitation) grâce à la respiration ludique avec Virginie et à l’ancrage sensoriel.',
    craft: 'Création d’une bouteille sensorielle d’apaisement aux nacres tourbillonnantes et façonnage d’un galet en argile naturelle parfumé à la fleur d’oranger.',
    takeaway: 'Son Flacon d’Apaisement & son Galet Respiratoire : dès qu’une grosse émotion monte à la maison, l’enfant respire le temps que les paillettes se déposent.',
  },
  {
    tag: 'Identité, Racines & Créativité',
    title: 'L’Arbre de Vie & des Rêves en Bois Flotté',
    goal: 'Prendre conscience de ses racines (sa sécurité, sa famille) et oser déployer ses branches (ses talents, ses rêves, son imaginaire) avec Émilie.',
    craft: 'Assemblage artistique autour de bois flotté du Bassin d’Arcachon, fils de coton bio, perles de bois et médaillons d’argile gravés de ses qualités.',
    takeaway: 'Son Arbre de Vie mural (ou Capteur de Confiance) à suspendre dans sa chambre comme rappel quotidien de sa valeur unique.',
  },
  {
    tag: 'Lien Mère-Enfant & Tendresse',
    title: 'Le Carnet Complice & Flacon d’Huile Douce',
    goal: 'Ouvrir un espace de confidence sans jugement entre maman et enfant et ancrer le toucher bienveillant appris lors de l’atelier massage.',
    craft: 'Création d’un carnet secret en papier coton décoré d’un herbier de fleurs pressées + étiquetage personnalisé d’un flacon d’huile de massage bio.',
    takeaway: 'Le Carnet de Liaison Maman ↔ Enfant (à glisser sous l’oreiller à la maison) et son Flacon d’Huile pour prolonger le rituel massage de 5 min au coucher.',
  },
];

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
    badge: 'Yoga, Éveil & Douceur · Enfants & Duo',
    title: 'Yoga Mère-Enfant, Ateliers Créatifs & Goûter Chic',
    caption: 'Séance de yoga ludique et respiration en duo avec Virginie (professeure diplômée), ateliers créatifs, cercle des émotions avec Émilie et grand goûter maison sur la terrasse en bois.',
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
          <span className="mc-badge"><Sparkles size={14} /> Pôle Éveil, Créativité &amp; Lien · Villa avec Spa sur le Bassin d’Arcachon</span>
          <h2>Ateliers Enfants &amp; Journées Privilège Mère-Enfant</h2>
          <p className="script-sub">Développement personnel, créativité, yoga complice &amp; objet-trésor rapporté à la maison</p>
          <p className="mc-lead">
            En plus de nos séjours, nous avons conçu dans notre <strong>villa-loft avec piscine chauffée, Spa 7 places et Sauna 4 places sur le Bassin d’Arcachon</strong> un véritable pôle d’<strong>Ateliers Enfants et Duo Mère-Enfant</strong>. Notre approche professionnelle unit le <strong>développement personnel de l’enfant</strong> (confiance en soi, météo des émotions, retour au calme), l’<strong>expression créative</strong> et une signature forte : <strong>à chaque atelier, l’enfant façonne et repart chez lui avec son propre « Objet-Ancrage »</strong> pour prolonger les bienfaits dans son quotidien à la maison.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mc-dual-promise">
          <div className="mc-promise-card">
            <div className="mc-promise-icon"><Heart size={22} /></div>
            <span className="mc-promise-tag">1 · Yoga &amp; Connexion Mère-Enfant</span>
            <h3>Yoga en duo, massage complice &amp; souvenirs précieux</h3>
            <p>
              Loin du rythme effréné de la semaine et des écrans, vous partagez avec votre enfant des instants de pure présence guidés avec délicatesse :
            </p>
            <ul className="ticks">
              <li><Check size={15} /> <span><strong>Yoga Mère-Enfant &amp; Respiration avec Virginie</strong> : postures douces à deux, yoga ludique et apaisement guidés par notre professeure de yoga diplômée.</span></li>
              <li><Check size={15} /> <span><strong>Atelier Massage Réciproque (Maman ↔ Enfant)</strong> : apprendre à l’enfant à masser sa maman avec douceur, et masser son enfant pour l’apaiser.</span></li>
              <li><Check size={15} /> <span><strong>Moment Lecture &amp; Confidences</strong> perchés dans le grand filet suspendu en mezzanine + météo des émotions avec Émilie.</span></li>
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
              <li><Check size={15} /> <span><strong>Accès libre au Spa Jacuzzi 7 places &amp; Sauna 4 places</strong> entre mamans, dans le calme absolu.</span></li>
              <li><Check size={15} /> <span><strong>Piscine chauffée, salon cathédrale &amp; terrasse en bois</strong> avec tisanes bio et collations saines.</span></li>
              <li><Check size={15} /> <span><strong>Enfants choyés en petit groupe</strong> par Émilie &amp; Virginie dans un cadre bienveillant et stimulant.</span></li>
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

      <Reveal delay={100}>
        <div className="mc-craft-showcase">
          <div className="mc-craft-head">
            <span className="mc-craft-pill"><Gift size={14} /> La Signature Pédagogique Complices d’Ailleurs · Atelier Enfant ou Duo Mère-Enfant</span>
            <h3>Développement Personnel &amp; Créativité : repartir chez soi avec son « Objet-Ancrage »</h3>
            <p>
              En pédagogie positive, un enfant intègre durablement une émotion ou une force intérieure lorsqu’il la matérialise de ses propres mains. Chacun de nos ateliers suit une méthode structurée en <strong>3 temps</strong> (<em>1. Éveil &amp; Météo des émotions · 2. Création manuelle en matières naturelles · 3. Rituel d’ancrage à ramener à la maison</em>) :
            </p>
          </div>

          <div className="mc-craft-grid">
            {SIGNATURE_CREATIVE_WORKSHOPS.map((w) => (
              <div className="mc-craft-card" key={w.title}>
                <div className="mc-craft-card-top">
                  <span className="mc-craft-tag">{w.tag}</span>
                  <h4>{w.title}</h4>
                </div>
                <ul className="mc-craft-steps">
                  <li>
                    <span className="mc-craft-step-ico"><Compass size={14} /></span>
                    <div>
                      <strong>Développement personnel</strong>
                      <span>{w.goal}</span>
                    </div>
                  </li>
                  <li>
                    <span className="mc-craft-step-ico"><Feather size={14} /></span>
                    <div>
                      <strong>Créativité &amp; Matières nobles</strong>
                      <span>{w.craft}</span>
                    </div>
                  </li>
                  <li className="mc-craft-takeaway">
                    <span className="mc-craft-step-ico"><Gift size={14} /></span>
                    <div>
                      <strong>L’Objet-Trésor rapporté à la maison</strong>
                      <span>{w.takeaway}</span>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <div className="mc-formats-bar">
            <div>
              <strong>2 formats au choix selon vos envies :</strong>
              <span><strong>Formule « Atelier Enfant » (Demi-journée)</strong> dédiée au développement personnel et à la création de son objet · ou <strong>Formule « Journée Privilège Mère-Enfant »</strong> incluant Yoga en duo, Massage réciproque et Temps Spa 7 places &amp; Sauna pour les mamans.</span>
            </div>
            <Link to="/contact" className="btn btn-terra btn-sm">Demander le programme des prochains ateliers <ArrowRight size={15} /></Link>
          </div>
        </div>
      </Reveal>

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
        <p className="small muted" style={{ marginTop: '.85rem', fontSize: '.78rem', textAlign: 'right' }}>
          * Photographies d’illustration non contractuelles : selon les dates, la journée peut être organisée dans une autre villa de charme avec jacuzzi/spa sur le Bassin d’Arcachon de confort équivalent.
        </p>
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
