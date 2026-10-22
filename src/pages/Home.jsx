import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flower2, Leaf, Sun, Users, Shell, Gem, Heart, Sparkles, Waves, Check } from 'lucide-react';
import { Photo, Reveal } from '../components/ui.jsx';
import HeroCinemagraph from '../components/HeroCinemagraph.jsx';
import VillaShowcase from '../components/VillaShowcase.jsx';
import MotherChildShowcase from '../components/MotherChildShowcase.jsx';
import KidsWorkshopShowcase from '../components/KidsWorkshopShowcase.jsx';
import CorsicaShowcase from '../components/CorsicaShowcase.jsx';
import Faq from '../components/Faq.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useData } from '../data/store.js';

const strip = [
  [Users, 'Entre femmes', 'sororité & partage'],
  [Flower2, 'Yoga plein air & salle', 'avec Virginie'],
  [Sparkles, 'Méditation & cercle', 'guidés par Émilie'],
  [Leaf, 'Haute beauté & LED', 'machines dernier cri'],
  [Shell, 'Bassin d’Arcachon', 'balades à l’ombre des pins'],
  [Gem, '+ de 300 € de soins', 'inclus sur place'],
];

const signature = [
  ['Yoga intérieur & plein air', 'Yin & Hatha Yoga avec Virginie', '/img/arcachon-yoga-net.jpg'],
  ['Soin visage & LED', 'Machines dernier cri : Jeunesse ou Glow', '/img/arcachon-soin-visage-net.jpg'],
  ['Spa 7 places & Sauna', 'Pièce détente & piscine chauffée au loft', '/img/villa-jacuzzi.jpg'],
  ['Sentier du littoral', 'À 10 min à pied du Bassin, sous les pins', '/img/arcachon-balade-net.jpg'],
  ['Cercle & méditation', 'Guidés par Émilie pour repartir légère', '/img/arcachon-cercle-net.jpg'],
];

const soins = [
  ['Soin visage Haute Technologie', 'Inclus — Machines dernier cri (Jeunesse ou Glow)', '/img/arcachon-soin-visage-net.jpg'],
  ['Massage relaxant sur-mesure', 'Inclus — Par nos esthéticiennes diplômées', '/img/spa-massage-net.jpg'],
  ['Spa 7 places & Sauna 4 places', 'Inclus — Pièce de détente privative au loft', '/img/villa-jacuzzi.jpg'],
  ['Cours d’auto-massage & LED', 'Inclus — Atelier liftant & luminothérapie pro', '/img/spa-led-net.jpg'],
  ['Technologies esthétiques', 'Sur place — Équipements professionnels de pointe', '/img/spa-cosmetique-net.jpg'],
];

const premiumValues = [
  {
    badge: 'Soin Signature · Inclus',
    title: 'Soin visage Haute Technologie',
    desc: 'Réalisé avec nos machines esthétiques dernier cri transportées sur place : Rituel Jeunesse ou Soin Glow pour révéler votre éclat.',
  },
  {
    badge: 'Modelage Expert · Inclus',
    title: 'Massage relaxant sur-mesure',
    desc: 'Un massage enveloppant pratiqué par Émilie et Virginie, esthéticiennes diplômées, pour déposer la fatigue et lâcher prise.',
  },
  {
    badge: 'Atelier Féminin · Inclus',
    title: 'Cours d’auto-massage & LED',
    desc: 'Un moment complice entre femmes pour apprendre les gestes liftants du visage, suivi d’une séance de luminothérapie LED professionnelle.',
  },
  {
    badge: 'Reconnexion · Inclus',
    title: 'Yoga, méditation & cercle de femmes',
    desc: 'Yin & Hatha Yoga (en salle ou en extérieur) enseignés par Virginie, professeure diplômée ; méditation, cercles de parole et ateliers guidés par Émilie.',
  },
];

function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf;
    const f = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate3d(0,${Math.min(window.scrollY, 800) * 0.12}px,0) scale(1.08)`;
      });
    };
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return ref;
}

export default function Home() {
  const { settings, experiences, testimonials } = useData();
  const arca = experiences.find((e) => e.slug === 'arcachon-entre-femmes');
  const px = useParallax();
  const [slide, setSlide] = useState(0);
  const future = experiences.filter((e) => e.kind === 'future');

  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <HeroCinemagraph
            containerRef={px}
            src={settings.heroImage}
            videoSrc={settings.heroVideo}
            alt="Bassin d’Arcachon, Dune du Pilat et pinasses en bois"
          />
        </div>
        <div className="hero-shade" />
        <div className="wrap hero-in hero-split">
          <div className="hero-left">
            <span className="hero-badge"><span className="hero-dot" /> Expérience Phare · Bassin d’Arcachon — Entre femmes</span>
            <h1>Bien plus qu’un week-end <span className="script">bien-être…</span></h1>
            <p className="sig light">Voyage au cœur du féminin sur le Bassin d’Arcachon</p>

            <div className="hero-privilege-plaque" aria-label="Offre privilège de lancement">
              <div className="hpp-col">
                <span className="hpp-eyebrow">Offre de départ exclusive</span>
                <strong className="hpp-title">Tarif Privilège Première Édition</strong>
              </div>
              <div className="hpp-divider" aria-hidden="true" />
              <div className="hpp-col hpp-price-col">
                <div className="hpp-price-row">
                  <span className="hpp-old">{arca?.originalPrice || 550} €</span>
                  <strong className="hpp-new">{arca?.pricePerPerson || 450} €</strong>
                </div>
                <span className="hpp-sub">par personne · soins &amp; pension inclus</span>
              </div>
              <div className="hpp-divider" aria-hidden="true" />
              <div className="hpp-col">
                <span className="hpp-eyebrow">Règlement échelonné</span>
                <span className="hpp-alma">Paiement en plusieurs fois <em className="alma-pill">Alma</em></span>
              </div>
            </div>

            <div className="cta-row">
              <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue">Pré-réserver ma place — {arca?.depositPerPlace || 95} € d’acompte</Link>
              <a href="#arcachon" className="btn btn-light">Découvrir tout le séjour <ArrowRight size={16} /></a>
            </div>
          </div>

          <div className="hero-card-glass">
            <p className="lead light">
              Portées par notre complicité, notre harmonie et notre simplicité, nous vous accueillons à 10 minutes à pied du Bassin d’Arcachon dans un loft d’exception (piscine chauffée, Spa 7 places, Sauna 4 places) : yoga en intérieur ou en plein air, balades sur le sentier du littoral à l’ombre des pins, soins haute technologie sur place, et un cocon bienveillant où déposer vos soucis pour repartir plus légère.
            </p>
            <a href="#histoire" className="hero-duo-inline">
              <img src="/img/emilie-virginie-marrakech.jpg" alt="Émilie et Virginie, les fondatrices" />
              <div>
                <strong>Émilie &amp; Virginie</strong>
                <small>Vos hôtes · Esthéticiennes &amp; Professeure de yoga</small>
              </div>
            </a>
          </div>
        </div>
      </section>

      <div className="strip wrap" aria-label="Points forts">
        {strip.map(([I, a, b]) => (
          <div key={a}><I size={22} strokeWidth={1.3} /><span>{a}<br />{b}</span></div>
        ))}
      </div>

      <section className="section" id="histoire">
        <div className="wrap founders">
          <Reveal>
            <Photo src="/img/emilie-virginie-marrakech.jpg" label="Émilie et Virginie à Marrakech" theme="sand" className="portrait zoom" />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Les visages derrière Complices d’ailleurs</p>
            <h2>Nous, Émilie &amp; Virginie</h2>
            <p className="script-sub">Deux femmes simples et complices, unies par une belle harmonie</p>
            <p>Entre nous, tout est affaire d’évidence, de simplicité et d’harmonie. Toutes deux esthéticiennes diplômées, nous nous complétons naturellement : <strong>Virginie, professeure de yoga diplômée, enseigne le Yin Yoga et le Hatha Yoga</strong>, tandis qu’<strong>Émilie guide la méditation, les cercles de femmes et les ateliers</strong> pour vous permettre de livrer vos soucis en toute confiance et repartir le cœur plus léger.</p>
            <ul className="ticks">
              <li><Heart size={14} /> Simplicité, écoute sincère &amp; harmonie à deux</li>
              <li><Heart size={14} /> Déposer ses soucis pour repartir plus légère</li>
              <li><Heart size={14} /> Yoga avec Virginie &amp; Méditation / Cercles de parole avec Émilie</li>
              <li><Heart size={14} /> Soins haute technologie &amp; massages experts par vos deux esthéticiennes</li>
            </ul>
            <Link to="/notre-histoire" className="btn btn-terra">Découvrir notre histoire <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section arca-bg" id="arcachon">
        <div className="wrap">
          <Reveal className="sig-head" style={{ maxWidth: '760px' }}>
            <div>
              <p className="eyebrow">Notre expérience phare · Tout le détail du séjour</p>
              <h2>Bassin d’Arcachon — Entre femmes</h2>
              <p className="small-caps">Une expérience ultra-premium au cœur des pins : déposer ce qui pèse, se laisser choyer et repartir plus légère</p>
              <p>{arca.intro}</p>
              <p>
                Selon la météo et l’énergie du groupe, <strong>les séances de yoga peuvent se pratiquer en extérieur</strong> pour respirer l’air du Bassin, et nous partons ensemble pour de <strong>douces balades à l’ombre des pins et au bord de l’eau</strong>.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="premium-banner">
              <div className="premium-banner-head">
                <span className="premium-tag"><Gem size={15} /> Plus de 300 € de soins &amp; rituels inclus sur place</span>
                <h3>La simplicité d’un accueil du cœur, alliée à la valeur d’une véritable cure en Spa &amp; Institut</h3>
                <p>Avec nous, pas de chichis : juste de la douceur, une écoute vraie pour vous alléger l’esprit, et toute l’excellence de nos soins d’institut transportés directement sur notre lieu de séjour au Bassin d’Arcachon :</p>
              </div>
              <div className="premium-grid">
                {premiumValues.map((item) => (
                  <div key={item.title} className="premium-card">
                    <span className="premium-badge">{item.badge}</span>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="premium-summary">
                ✨ <strong>Une valeur réelle de plus de 300 € de soins et rituels sur place :</strong> en institut et spa sur le Bassin d’Arcachon, l’ensemble de ce protocole (soin du visage haute technologie avec machines dernier cri, massage relaxant expert, séance de luminothérapie LED professionnelle, cours d’auto-massage facial, yoga et méditation) représente à lui seul plus de 300 € de prestations — ici entièrement inclus dans votre week-end entre femmes avec l’hébergement de charme et la pension complète gourmande.
              </p>
            </div>
          </Reveal>

          <div className="cards5">
            {signature.map(([t, s, img], i) => (
              <Reveal key={t} delay={i * 80}>
                <Photo label={t} theme="arcachon" className="tall zoom" src={img}>
                  <div className="cap"><strong>{t}</strong><span>{s}</span></div>
                </Photo>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <VillaShowcase />

      <section className="section sand" id="soins">
        <div className="wrap exclu">
          <Reveal>
            <p className="eyebrow">Célébrer sa féminité &amp; rayonner</p>
            <h2>La beauté, comme un véritable rituel entre femmes</h2>
            <p>Deux esthéticiennes diplômées, une écoute bienveillante et nos <strong>machines esthétiques dernier cri</strong> transportées directement sur notre lieu de séjour au Bassin d’Arcachon, pour créer un cocon intime dédié à votre féminité :</p>
            <ul className="ticks">
              <li><Check size={15} /> <span><strong>Soin visage Haute Technologie</strong> : Rituel Jeunesse ou Soin Glow</span></li>
              <li><Check size={15} /> <span><strong>Massage relaxant sur-mesure</strong> par nos esthéticiennes diplômées</span></li>
              <li><Check size={15} /> <span><strong>Cours d’auto-massage du visage &amp; Luminothérapie LED professionnelle</strong></span></li>
              <li><Check size={15} /> <span><strong>Yoga (Yin &amp; Hatha) avec Virginie</strong> &amp; <strong>Méditation / Cercle de femmes avec Émilie</strong></span></li>
            </ul>
            <p className="small">Soins de bien-être et de beauté : aucune promesse médicale.</p>
            <Link to="/reserver/arcachon-entre-femmes" className="btn btn-terra">Pré-réserver mon séjour — {arca?.depositPerPlace || 95} € d’acompte</Link>
          </Reveal>
          <div className="carousel" aria-roledescription="carrousel">
            <div className="car-track" style={{ transform: `translateX(calc(${-slide} * (var(--cw) + 12px)))` }}>
              {soins.map(([t, s, img]) => (
                <figure key={t}><Photo src={img} label={t} theme="sand" className="zoom sq" /><figcaption><strong>{t}</strong><span>{s}</span></figcaption></figure>
              ))}
            </div>
            <div className="car-ctrl">
              <button aria-label="Précédent" onClick={() => setSlide(Math.max(0, slide - 1))}>‹</button>
              <button aria-label="Suivant" onClick={() => setSlide(Math.min(soins.length - 2, slide + 1))}>›</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap three">
          <Reveal><Waves size={26} strokeWidth={1.2} /><h3>Le yoga avec Virginie, dedans ou dehors</h3><p>Yin Yoga et Hatha Yoga enseignés par Virginie, professeure de yoga diplômée — pratiqués en salle cocooning ou en plein air sous la douceur du Bassin d’Arcachon.</p></Reveal>
          <Reveal delay={100}><Sun size={26} strokeWidth={1.2} /><h3>Balades à l’ombre des pins &amp; Bassin</h3><p>Un lieu d’exception sélectionné autour du Bassin d’Arcachon, des balades ressourçantes à l’ombre des pins et au bord de l’eau, et une cuisine végétarienne saine et gourmande.</p></Reveal>
          <Reveal delay={200}><Sparkles size={26} strokeWidth={1.2} /><h3>Méditation &amp; cercle de femmes avec Émilie</h3><p>Guidées par Émilie dans la simplicité et la bienveillance de la méditation et des cercles de parole, chacune peut livrer ses soucis, poser ses bagages et repartir plus légère.</p></Reveal>
        </div>
      </section>

      <section className="section arca-bg" id="experiences">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Le déroulé complet · Bassin d’Arcachon</p>
            <h2>Votre programme jour par jour &amp; tout ce qui est inclus</h2>
            <p style={{ maxWidth: '68ch' }}>Un rythme doux et modulable, pensé pour vous laisser le temps de respirer, de profiter des soins haute technologie, de marcher sous les pins et de savourer chaque instant entre femmes.</p>
          </Reveal>

          <div className="prog-grid">
            {arca.program.map((d, i) => (
              <Reveal key={d.day} delay={i * 90}>
                <div className="prog-card">
                  <span className="prog-day">{d.day}</span>
                  <h3>{d.title}</h3>
                  <ul className="ticks">
                    {d.items.map((it) => (
                      <li key={it}><Check size={14} /> <span>{it}</span></li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="home-detail-grid">
            <Reveal className="incl-box">
              <div>
                <h3>Tout ce qui est inclus dans votre séjour</h3>
                <ul className="ticks">{arca.included.map((x) => <li key={x}><Check size={14} /> <span>{x}</span></li>)}</ul>
                <h3 style={{ marginTop: '1.8rem' }}>Non inclus</h3>
                <ul className="plain">{arca.excluded.map((x) => <li key={x}>• {x}</li>)}</ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <aside className="booking-card" aria-label="Réservation Bassin d'Arcachon" style={{ position: 'static' }}>
                <span className="pill open" style={{ marginBottom: '.6rem' }}>Pré-réservations ouvertes</span>
                <h3 style={{ margin: '.2rem 0 .8rem' }}>Bassin d’Arcachon — Entre femmes</h3>
                <dl>
                  <dt>Lieu</dt><dd>{arca.location}</dd>
                  <dt>Hébergement</dt><dd>{arca.lodging}</dd>
                  <dt>Durée</dt><dd>{arca.duration}</dd>
                  <dt>Offre de départ exclusive</dt>
                  <dd className="bk-privilege-row">
                    <span className="bk-old-price">{arca?.originalPrice || 550} €</span>
                    <strong className="bk-new-price">{arca?.pricePerPerson || 450} €</strong>
                    <span className="bk-per-pers">/ personne</span>
                  </dd>
                  <dt>Facilités de paiement</dt>
                  <dd className="bk-alma-row">
                    Paiement en plusieurs fois avec <span className="alma-badge-inline">Alma</span>
                  </dd>
                  <dt>Soins &amp; rituels sur place</dt><dd><strong>+ de 300 € de prestations incluses</strong></dd>
                  <dt>Maintien du séjour</dt><dd>Dès {arca.minParticipants} participantes</dd>
                  <dt>Pré-réservation</dt><dd><strong>{arca?.depositPerPlace || 95} € d’acompte</strong> (paiement sécurisé Stripe)</dd>
                </dl>
                <div style={{ marginTop: '1.4rem', display: 'grid', gap: '.6rem' }}>
                  <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue block">Pré-réserver ma place — {arca?.depositPerPlace || 95} € d’acompte</Link>
                  <Link to="/contact" className="btn btn-ghost block">Poser une question à Émilie &amp; Virginie</Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <MotherChildShowcase />

      <KidsWorkshopShowcase />

      <CorsicaShowcase />

      <section className="section sand" id="marrakech">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Nos autres expériences</p>
            <h2>Marrakech, entre femmes ou en duo mère-enfant</h2>
            <p style={{ maxWidth: '72ch', marginBottom: '1.6rem', color: 'var(--muted)' }}>
              Pour nos séjours à Marrakech (comme pour la Corse), <strong>le transport aérien est à votre charge</strong>, mais vous n’êtes jamais seules : <strong>nous vous aidons et vous conseillons personnellement, et nous faisons la réservation des billets ensemble afin de vous faire bénéficier de remises</strong>.
            </p>
          </Reveal>
          <div className="mk-grid">
            {[
              ['marrakech-entre-femmes', 'Marrakech', 'Entre femmes', 'Yoga rooftop, riad, hammam, souks, moments de partage — et désert d’Agafay en option si confirmé. Transport à votre charge (réservation accompagnée ensemble avec remises).', '/img/marrakech-femmes-net.jpg'],
              ['marrakech-mere-enfant', 'Marrakech', 'Mère & enfant', 'Ateliers créatifs, activités partagées, temps pour les mamans, découverte. Agafay selon formule. Transport à votre charge (réservation accompagnée ensemble avec remises).', '/img/marrakech-mere-enfant-net.jpg'],
            ].map(([slug, a, b, d, img], i) => (
              <Reveal key={slug} delay={i * 120}>
                <Photo src={img} label={`${a} ${b}`} theme="marrakech" className="mk zoom">
                  <div className="mk-txt">
                    <h3>{a}<br />{b}</h3>
                    <p>{d}</p>
                    <div className="cta-row">
                      <Link to={`/experiences/${slug}`} className="btn btn-light btn-sm">Découvrir le séjour</Link>
                      <Link to={`/reserver/${slug}`} className="btn btn-terra btn-sm">Réserver{settings.almaActive ? ' avec Alma' : ''}</Link>
                    </div>
                    {!settings.almaActive && <small>Alma : bientôt disponible</small>}
                  </div>
                </Photo>
              </Reveal>
            ))}
          </div>
          <p className="small center soon">Bientôt : {future.filter((f) => f.slug !== 'trek-compostelle').map((f) => f.title).join(' · ')} — non réservables pour le moment.</p>
        </div>
      </section>

      <section className="section trek" id="trek">
        <div className="wrap trek-in">
          <Reveal>
            <p className="eyebrow">Parenthèse Exclusive · 2 à 3 jours en pleine nature</p>
            <h2>Trek au féminin<br />Chemin de Compostelle &amp; Bivouac</h2>
            <p className="script-sub" style={{ color: '#3f5a3e', marginBottom: '.8rem' }}>
              La philosophie de la marche : du rire partagé au silence habité, jusqu’aux confidences autour du feu
            </p>
            <p>
              Beaucoup de femmes rêvent secrètement de randonnée mais pensent que <em>« le trekking n’est pas fait pour elles »</em>, que c’est trop difficile, ou n’osent pas se lancer faute de trouver quelqu’un avec qui partir. Sur <strong>2 à 3 jours accessibles et bienveillants</strong>, nous réunissons des femmes qui ne se connaissent pas au départ pour vivre la magie organique de la marche :
            </p>
            <p>
              Parfois nous avançons <strong>à 5 ou 6 en même temps</strong> dans la joie des échanges ; parfois le rythme s’étire et <strong>chacune marche seule avec elle-même</strong>, dans cette présence à soi où l’esprit s’allège ; puis les pas s’accordent <strong>deux par deux</strong>, côte à côte, là où la parole se libère avec une sincérité rare.
            </p>
            <ul className="ticks trek-ticks">
              <li><Check size={15} /> <span><strong>Yoga du matin (Éveil articulaire &amp; Pranayama)</strong> avec Virginie : déverrouiller chevilles, hanches et dos, et caler sa respiration consciente avant de partir marcher.</span></li>
              <li><Check size={15} /> <span><strong>Yin Yoga de récupération le soir (avant le repas)</strong> : étirement profond des muscles sollicités (psoas, mollets, ischio-jambiers, lombaires) pour repartir sans courbatures le lendemain.</span></li>
              <li><Check size={15} /> <span><strong>Bivouac en montagne, cuisine au feu de camp &amp; listes fournies</strong> : veillées avec Émilie et listes complètes (courses &amp; matériel) remises avant le départ.</span></li>
            </ul>
            <Link to="/experiences/trek-compostelle" className="btn btn-light">Découvrir toute l’expérience Trek (2–3 jours) <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal delay={120}><Photo src="/img/trek-compostelle-net.jpg" label="Chemin de Compostelle" theme="pine" className="sq zoom" /></Reveal>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section">
          <div className="wrap">
            <h2>Elles en parlent</h2>
            <div className="three">{testimonials.map((t, i) => <blockquote key={i}>« {t.text} » <cite>— {t.author}</cite></blockquote>)}</div>
          </div>
        </section>
      )}

      <section className="section" id="faq"><div className="wrap narrow"><h2>Questions fréquentes</h2><Faq /></div></section>
      <section className="section sand"><div className="wrap narrow center"><Newsletter /></div></section>
    </>
  );
}
