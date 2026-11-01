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
  Palette,
  Clock,
  Car,
  GlassWater,
  Moon,
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
    caption: 'Yin Yoga régénérant, Hatha doux et réveils corporels adaptés à toutes les participantes pour ouvrir le souffle et délier le corps.',
  },
  {
    src: '/img/atelier-enfant-mosaique.jpg',
    badge: 'Atelier Mosaïque & Artisanat',
    title: 'Création d’un souvenir personnel en mosaïque',
    caption: 'Un moment créatif immersif où chacune assemble ses tesselles d’émaux et façonne de ses mains son souvenir tangible de Marrakech.',
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

  // Rubrique « Personnalisez votre expérience » — Décochées par défaut
  const [options, setOptions] = useState({
    hammam: false,
    soireeFestive: false,
    agafay: false,
  });

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + MARRAKECH_GALLERY.length) % MARRAKECH_GALLERY.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % MARRAKECH_GALLERY.length);
  };

  const bookingUrl = `/reserver/marrakech-entre-femmes?hammam=${options.hammam ? 1 : 0}&soiree=${options.soireeFestive ? 1 : 0}&agafay=${options.agafay ? 1 : 0}`;
  const hasSelectedOptions = options.hammam || options.soireeFestive || options.agafay;

  return (
    <div className="mk-showcase">
      {/* 1. Header & Accroche */}
      <Reveal>
        <div className="mk-hero-intro">
          <span className="mk-pill-badge">
            <Users size={14} /> 4 jours / 3 nuits · 6 à 8 participantes maximum · Accompagné par Émilie &amp; Virginie
          </span>
          <h2>Marrakech entre femmes : souffler, se reconnecter et vivre la ville ocre à taille humaine</h2>
          <p className="script-sub" style={{ color: '#a8553a' }}>
            Yoga doux, riad de charme, massage bien-être, atelier mosaïque &amp; complicité
          </p>
          <p className="mk-lead-narrative">
            Prendre le temps de respirer, ralentir le rythme et vivre Marrakech loin de l’agitation et des groupes impersonnels. Nous vous invitons à une parenthèse chaleureuse et sincère, pensée par des femmes pour des femmes : <strong>exactement 4 jours et 3 nuits</strong>, <strong>un groupe intime de 6 à 8 participantes maximum</strong>, un hébergement de charme en Riad, <strong>des séances de yoga avec Virginie</strong>, <strong>un massage bien-être inclus</strong>, <strong>un atelier mosaïque pour créer votre propre souvenir personnel</strong>, et notre présence attentive à vos côtés pour partager les plus beaux moments tout en préservant votre entière liberté.
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
                Autour de la grande table du Riad, les parfums de fleur d’oranger et de café chaud vous accueillent : crêpes marocaines dorées (beghrir, msemen), miel parfumé, fruits frais découpés, jus d’oranges pressées et thé à la menthe. Un moment simple et joyeux où les conversations s’installent naturellement.
              </p>
            </div>

            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Compass size={22} /></div>
              <h4>Couleurs des souks &amp; conversations en terrasse</h4>
              <p>
                Ensemble, nous arpentons les ruelles secrètes et les souks animés. Nous partageons nos adresses coup de cœur : les senteurs des épices, les échoppes artisanales, les patios discrets. Puis nous nous arrêtons sur une terrasse ombragée pour un thé à la menthe avec vue sur les toits.
              </p>
            </div>

            <div className="mk-scene-card">
              <div className="mk-scene-icon"><Palette size={22} /></div>
              <h4>Création d’un souvenir en mosaïque</h4>
              <p>
                Un atelier immersif au cœur de l’artisanat : matériel et tesselles d’émaux compris, chacune assemble ses motifs et <strong>compose de ses propres mains une création personnelle</strong>. Un souvenir tangible, authentique et précieux de cette parenthèse à ramener chez soi.
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
                <strong>Virginie, professeure de yoga diplômée :</strong> elle adapte chaque séance (Yin doux, Hatha relaxant, réveil énergétique) selon le niveau et les besoins de chacune, avec une infinie délicatesse.
              </li>
              <li>
                <strong>Émilie, esthéticienne diplômée :</strong> attentive au bien-être physique et émotionnel, elle anime les ateliers créatifs, guide les cercles de parole et veille à ce que chacune se sente choyée et écoutée.
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
            <h3>Pourquoi 6 à 8 participantes maximum ?</h3>
            <p>
              Sur le marché des voyages entre femmes, de nombreux séjours accueillent jusqu’à 25 ou 30 participantes, où tout devient vite impersonnel et où les activités de bien-être sont souvent proposées en suppléments onéreux.
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
                <strong>Deux accompagnatrices dédiées</strong>
                <p>Un ratio rare d’une accompagnatrice pour 3 à 4 participantes, garantissant une présence attentive et rassurante de la préparation jusqu’au retour.</p>
              </div>
            </div>
            <div className="mk-val-col">
              <div className="mk-val-check"><Check size={16} /></div>
              <div>
                <strong>Yoga, Massage &amp; Mosaïque inclus</strong>
                <p>Les séances de yoga avec Virginie, 1 massage bien-être par participante et l’atelier création de mosaïque sont déjà compris dans le tarif.</p>
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
              <li><Check size={16} /> <span><strong>Toutes les séances de yoga</strong> avec Virginie, professeure diplômée (Yin Yoga régénérant, Hatha doux adaptés aux niveaux)</span></li>
              <li><Check size={16} /> <span><strong>1 massage bien-être inclus</strong> par participante</span></li>
              <li><Check size={16} /> <span><strong>L’atelier mosaïque, matériel compris</strong>, avec création de votre souvenir personnel</span></li>
              <li><Check size={16} /> <span><strong>Notre accompagnement et moments de partage</strong> prévus au programme (découvertes dans la médina, cercles de parole avec Émilie)</span></li>
              <li><Check size={16} /> <span><strong>Hébergement de charme en Riad (3 nuits)</strong> avec petits-déjeuners inclus <em>(sélection en cours selon devis)</em></span></li>
              <li><Check size={16} /> <span><strong>Accueil &amp; coordination de votre transfert</strong> à l’aéroport de Marrakech (RAK) jusqu’au Riad</span></li>
              <li><Check size={16} /> <span><strong>Petit groupe privilégié :</strong> 6 à 8 participantes maximum (départ dès 6)</span></li>
            </ul>
          </div>

          <div className="mk-excl-card">
            <div className="mk-incl-head">
              <span className="mk-tag-sand">À prévoir de votre côté</span>
              <h4>Non inclus / En option sur place</h4>
            </div>
            <ul className="mk-list-plain">
              <li>
                <strong>Vols aller-retour pour Marrakech :</strong> à réserver directement par vos soins via les compagnies aériennes (liens EasyJet &amp; Royal Air Maroc ci-dessous).
              </li>
              <li>
                <strong>Les déjeuners et dîners au restaurant :</strong> pour laisser à chacune la liberté de choisir ses envies culinaires selon son budget.
              </li>
              <li>
                <strong>La parenthèse au hammam traditionnel :</strong> proposée en option facultative sur place (détails ci-dessous).
              </li>
              <li>
                <strong>La soirée festive avec le groupe :</strong> proposée en option facultative sur place (détails ci-dessous).
              </li>
              <li>
                <strong>L’échappée dans le désert d’Agafay :</strong> option facultative séparée (détails ci-dessous).
              </li>
              <li>
                <strong>Dépenses et achats personnels</strong> dans les souks.
              </li>
            </ul>
          </div>
        </div>
      </Reveal>

      {/* 7. RUBRIQUE « PERSONNALISEZ VOTRE EXPÉRIENCE » (3 encarts distincts) */}
      <Reveal delay={120}>
        <div className="mk-custom-section" id="personnalisation">
          <div className="mk-custom-header">
            <span className="mk-pill-tag">Sur-mesure &amp; Liberté</span>
            <h3>Personnalisez votre expérience</h3>
            <p className="mk-custom-explain">
              Indiquez vos envies pour nous permettre d’organiser les créneaux et les déplacements. Nous confirmerons ensemble les disponibilités et les tarifs avant toute réservation auprès des prestataires.
            </p>
            <div className="mk-custom-notice">
              <Info size={16} />
              <span>
                <strong>Précision essentielle :</strong> Ces choix expriment un intérêt. Ils ne déclenchent ni paiement ni réservation automatique. Les créneaux sont spécialement pensés pour être compatibles avec les activités incluses et préserver un vrai temps libre pour celles qui ne choisissent pas les options.
              </span>
            </div>
          </div>

          <div className="mk-custom-cards">
            {/* ENCART 1 : HAMMAM */}
            <div className={`mk-option-card ${options.hammam ? 'is-active' : ''}`} id="hammam">
              <div className="mk-option-top">
                <span className="mk-option-badge">Option 1 · Douceur &amp; Rituel</span>
                <h4>1. Une parenthèse au hammam</h4>
              </div>
              <p className="mk-option-mood">
                « Envie de prolonger la douceur ? Nous vous accompagnons jusqu’au hammam pour découvrir un rituel marocain et vous offrir une pause rien qu’à vous. »
              </p>
              <div className="mk-option-grid">
                <div className="mk-option-item">
                  <strong>Adresse envisagée :</strong>
                  <span><em>Mythic Oriental Spa</em> (à confirmer avant publication).</span>
                </div>
                <div className="mk-option-item">
                  <strong>Prestation de référence :</strong>
                  <span>Hammam beldi traditionnel, gommage au savon noir et hydratation (durée du soin : 40 minutes).</span>
                </div>
                <div className="mk-option-item">
                  <strong>Budget indicatif :</strong>
                  <span><strong>450 DH par personne (environ 45 €)</strong>, tarif à confirmer auprès du spa.</span>
                </div>
                <div className="mk-option-item">
                  <strong>Temps à prévoir :</strong>
                  <span>Créneau provisoire de <strong>1 h 30 à 2 h</strong> avec accueil, change et déplacement à pied (ajusté selon le nombre de participantes ; au-delà de 6 personnes, organisation en plusieurs passages).</span>
                </div>
              </div>

              <div className="mk-option-disclaimer">
                <Info size={15} />
                <span>
                  <strong>Mention :</strong> Facultatif — à régler directement au spa sur place. Le massage inclus dans votre séjour reste une prestation distincte. Nous vous accompagnons à pied jusqu’au lieu (aucun transport payant ou taxi n’est facturé sans validation).
                </span>
              </div>

              <label className="mk-option-check-wrap">
                <input
                  type="checkbox"
                  checked={options.hammam}
                  onChange={() => toggleOption('hammam')}
                  className="mk-option-checkbox"
                />
                <span className="mk-option-check-label">
                  <strong>Je souhaite profiter du hammam avec votre accompagnement.</strong>
                  <small>Option sans engagement immédiat — payable sur place au spa (~45 € / 450 DH)</small>
                </span>
              </label>
            </div>

            {/* ENCART 2 : SOIRÉE FESTIVE */}
            <div className={`mk-option-card ${options.soireeFestive ? 'is-active' : ''}`} id="soiree-festive">
              <div className="mk-option-top">
                <span className="mk-option-badge">Option 2 · Nuit &amp; Convivialité</span>
                <h4>2. Une soirée festive à Marrakech</h4>
              </div>
              <p className="mk-option-mood">
                « Et si l’on découvrait aussi Marrakech à la nuit tombée ? Pour celles qui en ont envie, partageons une soirée festive et le plaisir de sortir ensemble. »
              </p>
              <div className="mk-option-grid">
                <div className="mk-option-item">
                  <strong>Lieu &amp; Ambiance :</strong>
                  <span>Sélection d’une belle adresse conviviale marrakchie pour dîner, écouter de la musique et vibrer ensemble.</span>
                </div>
                <div className="mk-option-item">
                  <strong>Budget &amp; Formule :</strong>
                  <span>Proposition et budget communiqués avant confirmation. Dépenses de soirée à régler sur place selon la formule choisie.</span>
                </div>
                <div className="mk-option-item">
                  <strong>Transparence :</strong>
                  <span>Le détail distinguera clairement le repas, les boissons, l’éventuelle entrée et le transport (aucun montant inventé ni promis d’avance).</span>
                </div>
                <div className="mk-option-item">
                  <strong>Temps à prévoir :</strong>
                  <span>Une soirée festive (créneau aménagé pour préserver le rythme reposant du séjour).</span>
                </div>
              </div>

              <div className="mk-option-disclaimer">
                <Info size={15} />
                <span>
                  <strong>Mention :</strong> Facultatif — à régler sur place. Proposition et budget détaillés communiqués à l’avance pour validation collective.
                </span>
              </div>

              <label className="mk-option-check-wrap">
                <input
                  type="checkbox"
                  checked={options.soireeFestive}
                  onChange={() => toggleOption('soireeFestive')}
                  className="mk-option-checkbox"
                />
                <span className="mk-option-check-label">
                  <strong>Je suis intéressée par une soirée festive avec le groupe.</strong>
                  <small>Option sans engagement immédiat — formule et budget transmis avant confirmation</small>
                </span>
              </label>
            </div>

            {/* ENCART 3 : DÉSERT D’AGAFAY */}
            <div className={`mk-option-card ${options.agafay ? 'is-active' : ''}`} id="agafay">
              <div className="mk-option-top">
                <span className="mk-option-badge">Option 3 · Évasion Minérale</span>
                <h4>3. Une échappée dans le désert d’Agafay</h4>
              </div>
              <p className="mk-option-mood">
                « Face aux collines de pierre minérales et sous la voûte céleste, une parenthèse féerique pour contempler le coucher de soleil et respirer le grand calme. »
              </p>
              <div className="mk-option-grid">
                <div className="mk-option-item">
                  <strong>Lieu envisagé :</strong>
                  <span><em>Agafay Pearl Camp</em> (ou adresse de charme équivalente face au mont Atlas, à environ 45 min de Marrakech).</span>
                </div>
                <div className="mk-option-item">
                  <strong>Prestation au camp :</strong>
                  <span>[Tarif et contenu exacts à compléter selon la formule retenue : fin de journée, coucher de soleil, dîner sous tente berbère ou nuitée].</span>
                </div>
                <div className="mk-option-item">
                  <strong>Transport aller-retour :</strong>
                  <span>Estimation de travail de <strong>200 € pour deux véhicules</strong>, sous réserve du devis définitif et de leur capacité.</span>
                </div>
                <div className="mk-option-item">
                  <strong>Part de transport / pers. :</strong>
                  <span>À recalculer selon le nombre réel de participantes à l’option et les personnes accompagnantes (non fixé d’avance à 25 €).</span>
                </div>
              </div>

              <div className="mk-option-disclaimer">
                <Info size={15} />
                <span>
                  <strong>Précision sur la formule &amp; hébergement :</strong> Expérience facultative, à régler directement sur place aux prestataires. Prix indiqués pour préparer votre budget ; tarifs et disponibilités confirmés avant engagement. Si une formule nuit à Agafay est retenue, elle doit s’intégrer aux 3 nuits du séjour (en remplacement d’une nuit au riad pour éviter toute double facturation).
                </span>
              </div>

              <label className="mk-option-check-wrap">
                <input
                  type="checkbox"
                  checked={options.agafay}
                  onChange={() => toggleOption('agafay')}
                  className="mk-option-checkbox"
                />
                <span className="mk-option-check-label">
                  <strong>Je souhaite recevoir les détails de l’escapade à Agafay et y participer si la proposition me convient.</strong>
                  <small>Option sans engagement immédiat — détails, formules et part de transport confirmés ensemble</small>
                </span>
              </label>
            </div>
          </div>

          {/* Barre récapitulative visuelle & bouton d'action */}
          <div className="mk-custom-recap-bar">
            <div className="mk-recap-info">
              <div className="mk-recap-main">
                <span className="mk-recap-label">Séjour de base (4 jours / 3 nuits) :</span>
                <strong>790 € / participante</strong>
                <span className="mk-recap-sub">(hypothèse de travail hors vols · 0 € prélevé aujourd’hui)</span>
              </div>
              <div className="mk-recap-choices">
                <span className="mk-recap-choices-title">Vos envies sélectionnées (payables sur place) :</span>
                {hasSelectedOptions ? (
                  <div className="mk-recap-tags">
                    {options.hammam && <span className="mk-recap-pill">🌿 Hammam (~45 € / 450 DH)</span>}
                    {options.soireeFestive && <span className="mk-recap-pill">✨ Soirée festive</span>}
                    {options.agafay && <span className="mk-recap-pill">🐪 Escapade Agafay</span>}
                  </div>
                ) : (
                  <span className="mk-recap-empty">Aucune option cochée pour l’instant (inclusions seules). Vous pourrez ajuster vos choix dans le formulaire.</span>
                )}
              </div>
            </div>
            <Link to={bookingUrl} className="btn btn-terra btn-lg">
              Transmettre mes envies &amp; réserver ma place <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </Reveal>

      {/* 8. Prix & Transports : Hypothèse de travail */}
      <Reveal delay={130}>
        <div className="mk-pricing-box">
          <div className="mk-pricing-head">
            <span className="mk-pricing-tag">Budget &amp; Tarification</span>
            <h3>Un tarif clair, sans frais cachés</h3>
            <div className="mk-pricing-calc">
              <span className="mk-price-label">Hypothèse de travail :</span>
              <strong className="mk-price-amount">790 €</strong>
              <span className="mk-price-sub">/ participante (hors vol personnel)</span>
            </div>
            <p className="mk-pricing-expl">
              Ce montant correspond à notre <strong>base indicative de travail pour exactement 4 jours et 3 nuits</strong>, incluant le séjour en petit groupe (6 à 8 participantes maximum), l’hébergement de charme en Riad avec petits-déjeuners, les séances de yoga quotidiennes avec Virginie, le massage bien-être individuel, l’atelier mosaïque avec création personnelle et notre accompagnement à deux. Ce montant sera validé et confirmé dès la finalisation du chiffrage complet.
            </p>
          </div>

          <div className="mk-flight-wrap">
            <MarrakechFlightModule />
          </div>
        </div>
      </Reveal>

      {/* 9. Appel chaleureux au contact & Liste d'attente prioritaire */}
      <Reveal delay={140}>
        <div className="mk-cta-box" id="contact-marrakech">
          <span className="mk-cta-badge">Restons en contact</span>
          <h3>Envie de faire partie de cette aventure à Marrakech ?</h3>
          <p>
            Vous avez une question sur le rythme du séjour, le yoga ou l’hébergement ? Vous souhaitez échanger directement avec nous avant de vous décider ?
          </p>
          <div className="mk-cta-actions">
            <Link to={bookingUrl} className="btn btn-terra">
              <Sparkles size={17} /> Transmettre ma demande de réservation
            </Link>
            <Link to="/contact" className="btn btn-light">
              <MessageCircle size={17} /> Poser une question à Émilie &amp; Virginie
            </Link>
            <a href="tel:0629849653" className="btn btn-light">
              <Phone size={16} /> Nous appeler (06 29 84 96 53)
            </a>
          </div>
          <p className="mk-cta-subtext">
            Exactement 4 jours et 3 nuits · Départ maintenu dès 6 participantes · Groupe limité à 8 femmes · Inscription sans engagement pour échanger avec nous.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
