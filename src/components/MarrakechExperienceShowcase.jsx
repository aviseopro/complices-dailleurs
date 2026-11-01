import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  Users,
  Compass,
  Check,
  Flower2,
  Coffee,
  Sun,
  ShieldCheck,
  ArrowRight,
  Info,
  Calendar,
  MessageCircle,
  Phone,
  Flame,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { Reveal, Photo } from './ui.jsx';
import MarrakechFlightModule from './MarrakechFlightModule.jsx';

export const MARRAKECH_GALLERY = [
  {
    src: '/img/marrakech-femmes-net.jpg',
    badge: 'Ambiance Riad & Rooftop',
    title: 'Le calme d’un Riad traditionnel au cœur de la médina',
    caption: 'Un havre de paix intime où l’on se retrouve au calme après l’effervescence des souks, entre bassin rafraîchissant et terrasse baignée de lumière.',
  },
  {
    src: '/img/emilie-virginie-marrakech.jpg',
    badge: 'Vos Hôtes · Émilie & Virginie',
    title: 'Deux amies complices pour vous accompagner',
    caption: 'Émilie (esthéticienne diplômée) et Virginie (professeure de yoga diplômée) réunies pour vous offrir un accueil bienveillant et chaleureux.',
  },
  {
    src: '/img/arcachon-yoga-net.jpg',
    badge: 'Yoga Doux & Reconnexion',
    title: 'Séances de yoga quotidiennes avec Virginie',
    caption: 'Yin Yoga régénérant et Hatha doux adaptés à toutes les participantes pour ouvrir le souffle et délier le corps.',
  },
  {
    src: '/img/arcachon-cercle-net.jpg',
    badge: 'Sororité & Partage',
    title: 'Cercles de parole & méditations avec Émilie',
    caption: 'Des moments suspendus en toute confiance pour déposer les soucis du quotidien, rire ensemble et repartir le cœur plus léger.',
  },
];

export default function MarrakechExperienceShowcase() {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + MARRAKECH_GALLERY.length) % MARRAKECH_GALLERY.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % MARRAKECH_GALLERY.length);
  };

  return (
    <div className="mk-showcase">
      {/* 1. Header & Accroche */}
      <Reveal>
        <div className="mk-hero-intro">
          <span className="mk-pill-badge">
            <Users size={14} /> Expérience à taille humaine · 8 participantes maximum · Départ dès 6
          </span>
          <h2>Marrakech entre femmes : souffler, se reconnecter et vivre la ville ocre autrement</h2>
          <p className="script-sub" style={{ color: '#a8553a' }}>
            Yoga doux, riad de charme, massage bien-être inclus et complicité féminine
          </p>
          <p className="mk-lead-narrative">
            Prendre le temps de respirer, ralentir le rythme et vivre Marrakech loin de l’agitation et des voyages de groupe impersonnels. Nous vous invitons à une parenthèse chaleureuse et sincère, pensée par des femmes pour des femmes : <strong>un groupe intime de 8 voyageuses au maximum</strong>, un hébergement de charme, <strong>des séances de yoga quotidiennes avec Virginie</strong>, <strong>un massage bien-être inclus pour chacune</strong>, et notre présence attentive à vos côtés pour partager les plus beaux moments tout en préservant votre entière liberté.
          </p>
        </div>
      </Reveal>

      {/* 2. Récit de l’expérience : scènes pour se projeter */}
      <Reveal delay={60}>
        <div className="mk-story-section">
          <span className="mk-section-tag">Vivre le séjour</span>
          <h3>Imaginez votre parenthèse marrakchie…</h3>
          <p className="mk-story-subtitle">Des journées au rythme doux, où chaque instant équilibre partage complice et temps pour soi.</p>

          <div className="mk-scenes-grid">
            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Flower2 size={22} /></div>
              <h4>Le réveil &amp; le yoga au matin</h4>
              <p>
                Avant que la médina ne s’éveille, nous nous retrouvons sur le rooftop face aux premiers reflets dorés ou dans le calme feutré du patio. Virginie vous guide dans une séance de <strong>Yin Yoga ressourçant ou de Hatha doux</strong> : étirer le corps sans forcer, apaiser le mental et ouvrir sa journée avec fluidité.
              </p>
            </div>

            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Coffee size={22} /></div>
              <h4>Le petit-déjeuner partagé</h4>
              <p>
                Autour de la grande table du Riad, les parfums de fleur d’oranger et de café chaud vous accueillent : crêpes marocaines dorées, miel parfumé, fruits frais découpés, jus d’oranges pressées et thé à la menthe. Un moment simple et joyeux où les conversations s’installent naturellement.
              </p>
            </div>

            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Compass size={22} /></div>
              <h4>Flâneries complices dans la médina</h4>
              <p>
                Ensemble, nous arpentons les ruelles secrètes et les souks animés. Nous partageons nos adresses coup de cœur : les senteurs des épices, les ateliers d’artisans, les patios discrets. Puis nous nous arrêtons sur une terrasse ombragée pour un thé à la menthe avec vue sur les toits.
              </p>
            </div>

            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Sparkles size={22} /></div>
              <h4>Votre massage bien-être inclus</h4>
              <p>
                Prendre soin de son corps est au cœur de notre séjour : <strong>un massage bien-être individuel est déjà compris pour chaque participante</strong>. Une parenthèse cocooning pour dénouer les tensions musculaires accumulées, lâcher prise et savourer une détente profonde.
              </p>
            </div>

            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Heart size={22} /></div>
              <h4>Méditation &amp; cercles de parole avec Émilie</h4>
              <p>
                En fin de journée, Émilie anime un cercle de femmes bienveillant et une méditation guidée. Un espace doux et confidentiel pour déposer ce qui pèse, poser ses bagages émotionnels et se sentir entourée d’une écoute vraie, sans aucun jugement.
              </p>
            </div>

            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Sun size={22} /></div>
              <h4>Du temps précieux pour soi en liberté</h4>
              <p>
                Parce que votre autonomie est essentielle, vos journées préservent de vrais moments libres : bouquiner au bord du bassin du riad, flâner seule à votre rythme, faire une sieste ou contempler les étoiles le soir. Chacune vit son séjour à sa juste mesure.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 3. Présentation de nous deux : Émilie & Virginie */}
      <Reveal delay={80}>
        <div className="mk-founders-card">
          <div className="mk-founders-media">
            <img src="/img/emilie-virginie-marrakech.jpg" alt="Émilie et Virginie à Marrakech" />
            <span className="mk-founders-media-badge">Émilie &amp; Virginie · Complices d’ailleurs</span>
          </div>
          <div className="mk-founders-body">
            <span className="mk-section-tag">Qui sommes-nous ?</span>
            <h3>Deux organisatrices présentes à vos côtés, avec le cœur</h3>
            <p>
              Entre nous deux, tout est affaire d’évidence et de complémentarité. Nous ne sommes pas une agence impersonnelle : nous sommes <strong>deux professionnelles passionnées</strong> qui vous accompagnent personnellement :
            </p>
            <ul className="mk-founders-list">
              <li>
                <strong>Virginie, professeure de yoga certifiée :</strong> elle adapte chaque séance (Yin doux, Hatha relaxant, réveil énergétique) selon le niveau et les besoins de chacune, avec une infinie délicatesse.
              </li>
              <li>
                <strong>Émilie, esthéticienne diplômée :</strong> attentive au bien-être physique et émotionnel, elle guide les cercles de parole, les moments de recentrage et veille à ce que chacune se sente choyée et écoutée.
              </li>
            </ul>
            <div className="mk-founders-note">
              <Info size={18} className="mk-info-icon" />
              <div>
                <strong>Notre engagement &amp; votre liberté :</strong>
                <p>
                  Nous partageons avec vous les séances de yoga, les découvertes de la médina et les moments de convivialité. Pour autant, nous ne promettons pas une présence permanente ni étouffante : <strong>nous ne dormons pas au Riad (nous logeons chez des proches à Marrakech)</strong>. Ainsi, vous profitez de notre accompagnement chaleureux en journée tout en conservant l’intimité exclusive et paisible de votre Riad le soir entre voyageuses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 4. Pourquoi notre petit groupe change tout (Repère de valeur) */}
      <Reveal delay={90}>
        <div className="mk-value-box">
          <div className="mk-value-head">
            <span className="mk-pill-tag">Notre parti pris</span>
            <h3>Pourquoi 8 participantes maximum ?</h3>
            <p>
              Sur le marché des voyages entre femmes, de nombreux séjours accueillent jusqu’à 25 ou 30 participantes, où tout devient vite anonyme et où les prestations de bien-être sont souvent proposées en suppléments coûteux.
            </p>
          </div>
          <div className="mk-value-grid">
            <div className="mk-val-col">
              <div className="mk-val-check"><Check size={16} /></div>
              <div>
                <strong>Véritable intimité (6 à 8 femmes)</strong>
                <p>Pas d’effet de foule : chaque femme a sa place, sa parole est entendue, et des liens d’amitié profonds se créent tout naturellement.</p>
              </div>
            </div>
            <div className="mk-val-col">
              <div className="mk-val-check"><Check size={16} /></div>
              <div>
                <strong>Deux organisatrices dévouées</strong>
                <p>Un ratio rare d’une accompagnatrice pour 4 participantes, garantissant une présence attentive et rassurante de la préparation jusqu’au retour.</p>
              </div>
            </div>
            <div className="mk-val-col">
              <div className="mk-val-check"><Check size={16} /></div>
              <div>
                <strong>Yoga &amp; Massage déjà inclus</strong>
                <p>Toutes les séances de yoga avec Virginie et 1 massage bien-être individuel sont intégrés directement dans notre formule.</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 5. Galerie photos d'ambiance */}
      <Reveal delay={100}>
        <div className="mk-gallery-section">
          <h3>Instants choisis à Marrakech</h3>
          <p className="mk-story-subtitle">Cliquez sur une photo pour l’agrandir et découvrir son histoire.</p>
          <div className="mk-mosaic">
            {MARRAKECH_GALLERY.map((item, idx) => (
              <button
                type="button"
                key={idx}
                className="mk-mosaic-card"
                onClick={() => setLightboxIdx(idx)}
                aria-label={`Agrandir la photo : ${item.title}`}
              >
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="mk-mosaic-cap">
                  <span className="mk-mosaic-badge">{item.badge}</span>
                  <strong>{item.title}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Lightbox plein écran */}
      {lightboxIdx !== null && (
        <div className="mk-lightbox" onClick={() => setLightboxIdx(null)} role="dialog" aria-modal="true">
          <button className="mk-lb-close" onClick={() => setLightboxIdx(null)} aria-label="Fermer">
            <X size={24} />
          </button>
          <button className="mk-lb-nav prev" onClick={prev} aria-label="Photo précédente">
            <ChevronLeft size={28} />
          </button>
          <button className="mk-lb-nav next" onClick={next} aria-label="Photo suivante">
            <ChevronRight size={28} />
          </button>
          <div className="mk-lb-content" onClick={(e) => e.stopPropagation()}>
            <img src={MARRAKECH_GALLERY[lightboxIdx].src} alt={MARRAKECH_GALLERY[lightboxIdx].title} />
            <div className="mk-lb-caption">
              <span className="mk-mosaic-badge" style={{ display: 'inline-block', marginBottom: '.4rem' }}>
                {MARRAKECH_GALLERY[lightboxIdx].badge}
              </span>
              <strong>{MARRAKECH_GALLERY[lightboxIdx].title}</strong>
              <p>{MARRAKECH_GALLERY[lightboxIdx].caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Les Inclusions clairement identifiées */}
      <Reveal delay={110}>
        <div className="mk-inclusions-grid">
          <div className="mk-incl-card">
            <div className="mk-incl-head">
              <span className="mk-tag-green">Compris dans votre séjour</span>
              <h4>Ce qui est inclus</h4>
            </div>
            <ul className="mk-list-ticks">
              <li><Check size={16} /> <span><strong>Toutes les séances de yoga</strong> avec Virginie (Yin Yoga régénérant, Hatha doux adaptés aux niveaux)</span></li>
              <li><Check size={16} /> <span><strong>1 massage bien-être inclus</strong> par participante</span></li>
              <li><Check size={16} /> <span><strong>Séances de méditation &amp; cercles de parole</strong> animés par Émilie</span></li>
              <li><Check size={16} /> <span><strong>Accompagnement et flâneries partagées</strong> dans les ruelles et souks de la médina</span></li>
              <li><Check size={16} /> <span><strong>Hébergement de charme en Riad</strong> avec petits-déjeuners inclus <em>(sélection en cours selon devis)</em></span></li>
              <li><Check size={16} /> <span><strong>Accueil &amp; coordination de votre transfert</strong> à l’aéroport de Marrakech (RAK)</span></li>
              <li><Check size={16} /> <span><strong>Petit groupe privilégié :</strong> 8 femmes maximum pour préserver l’intimité</span></li>
            </ul>
          </div>

          <div className="mk-excl-card">
            <div className="mk-incl-head">
              <span className="mk-tag-sand">À prévoir de votre côté</span>
              <h4>Non inclus / En option</h4>
            </div>
            <ul className="mk-list-plain">
              <li>
                <strong>Vols aller-retour pour Marrakech :</strong> à réserver directement par vos soins via les compagnies aériennes (liens EasyJet &amp; Royal Air Maroc ci-dessous).
              </li>
              <li>
                <strong>Les déjeuners et dîners au restaurant :</strong> pour laisser à chacune la liberté de choisir ses envies culinaires selon son budget.
              </li>
              <li>
                <strong>Le rituel au hammam traditionnel :</strong> proposé en option facultative sur place (détails ci-dessous).
              </li>
              <li>
                <strong>L’escapade dans le désert d’Agafay :</strong> option facultative séparée (détails ci-dessous).
              </li>
              <li>
                <strong>Dépenses et achats personnels</strong> dans les souks.
              </li>
            </ul>
          </div>
        </div>
      </Reveal>

      {/* 7. Rubrique dédiée Hammam : séparée du prix principal */}
      <Reveal delay={120}>
        <div className="mk-hammam-box" id="hammam">
          <div className="mk-hammam-badge">
            <Sparkles size={14} /> Option bien-être sur place · Règlement direct au spa
          </div>
          <h3>Pour prolonger la douceur : une parenthèse au hammam</h3>
          <p className="mk-hammam-quote">
            « Pour celles qui le souhaitent, nous vous accompagnons jusqu’au hammam pour une parenthèse de douceur au cœur de Marrakech. Le temps de ralentir et de découvrir un rituel marocain, avant de poursuivre notre journée ensemble. »
          </p>

          <div className="mk-hammam-details">
            <div className="mk-hammam-item">
              <strong>Adresse de travail envisagée :</strong>
              <span><em>Mythic Oriental Spa</em> (à confirmer avant publication).</span>
            </div>
            <div className="mk-hammam-item">
              <strong>Budget indicatif :</strong>
              <span>Environ <strong>450 DH par personne (soit ~45 €)</strong> pour le hammam traditionnel seul (tarif et prestation à confirmer auprès du spa).</span>
            </div>
            <div className="mk-hammam-item">
              <strong>Accompagnement inclus :</strong>
              <span>Nous vous accompagnons à pied jusqu’au lieu en toute simplicité (aucun taxi ou transport payant n'est facturé).</span>
            </div>
          </div>

          <div className="mk-hammam-disclaimer">
            <Info size={16} />
            <span>
              <strong>Précision importante :</strong> En option, à régler directement sur place auprès de l’établissement. Tarif indiqué uniquement pour vous aider à prévoir votre budget. Ce hammam facultatif est bien distinct du <strong>massage individuel déjà inclus</strong> dans notre forfait séjour.
            </span>
          </div>
        </div>
      </Reveal>

      {/* 8. Rubrique Option : Le désert d’Agafay */}
      <Reveal delay={130}>
        <div className="mk-agafay-box">
          <div className="mk-agafay-header">
            <span className="mk-agafay-tag">Escapade magique en option</span>
            <h3>Le désert d’Agafay · Entre collines minérales et ciel étoilé</h3>
          </div>
          <p>
            Pour celles qui rêvent de contempler l’immensité du désert de pierres face aux sommets de l’Atlas, une excursion vers le <strong>désert d’Agafay</strong> (situé à environ 45 minutes de Marrakech) pourra être proposée en option séparée : coucher de soleil féerique, dîner sous les tentes berbères et éventuelle nuitée sur place.
          </p>
          <div className="mk-agafay-note">
            <Info size={15} />
            <span>
              Cette escapade, son transport dédié et son éventuel hébergement constituent une option distincte du prix principal. Modalités et tarifs précis communiqués lors de la validation des devis avec nos partenaires locaux.
            </span>
          </div>
        </div>
      </Reveal>

      {/* 9. Prix & Transports : Hypothèse de travail */}
      <Reveal delay={140}>
        <div className="mk-pricing-box">
          <div className="mk-pricing-head">
            <span className="mk-pricing-tag">Budget &amp; Tarification</span>
            <h3>Un tarif clair, sans surprise cachée</h3>
            <div className="mk-pricing-calc">
              <span className="mk-price-label">Hypothèse de travail :</span>
              <strong className="mk-price-amount">790 €</strong>
              <span className="mk-price-sub">/ participante (hors vols)</span>
            </div>
            <p className="mk-pricing-expl">
              Ce montant correspond à notre <strong>base indicative de travail</strong>, incluant le séjour en petit groupe (8 femmes max), l'hébergement en Riad avec petits-déjeuners, les séances de yoga quotidiennes, le massage bien-être inclus et notre accompagnement à deux. Ce montant sera validé et confirmé dès la finalisation des devis et du calendrier exact.
            </p>
          </div>

          <div className="mk-flight-wrap">
            <MarrakechFlightModule />
          </div>
        </div>
      </Reveal>

      {/* 10. Appel chaleureux au contact & Liste d'attente prioritaire */}
      <Reveal delay={150}>
        <div className="mk-cta-box">
          <span className="mk-cta-badge">Restons en contact</span>
          <h3>Envie de faire partie de cette aventure à Marrakech ?</h3>
          <p>
            Vous avez une question sur le rythme du séjour, le yoga ou l’hébergement ? Vous souhaitez échanger directement avec nous ou être informée en avant-première dès l’ouverture officielle des inscriptions ?
          </p>
          <div className="mk-cta-actions">
            <Link to="/contact" className="btn btn-terra">
              <MessageCircle size={17} /> Poser une question à Émilie &amp; Virginie
            </Link>
            <a href="tel:0629849653" className="btn btn-light">
              <Phone size={16} /> Nous appeler (06 29 84 96 53)
            </a>
          </div>
          <p className="mk-cta-subtext">
            Départ maintenu dès 6 participantes · Petit groupe limité à 8 femmes · Inscription sans engagement pour recevoir la fiche finale dès parution.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
