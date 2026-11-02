import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flower2, Leaf, Sun, Users, Shell, Gem, Heart, Sparkles, Waves, Check, ShieldCheck, Clock } from 'lucide-react';
import { Photo, Reveal, AlmaLogo } from '../components/ui.jsx';
import ArcachonCommercialPlaque from '../components/ArcachonCommercialPlaque.jsx';
import MarrakechFlightModule from '../components/MarrakechFlightModule.jsx';
import HeroCinemagraph from '../components/HeroCinemagraph.jsx';
import VillaShowcase from '../components/VillaShowcase.jsx';
import MotherChildShowcase from '../components/MotherChildShowcase.jsx';
import KidsWorkshopShowcase from '../components/KidsWorkshopShowcase.jsx';
import CorsicaShowcase from '../components/CorsicaShowcase.jsx';
import Faq from '../components/Faq.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useData } from '../data/store.js';

const strip = [
  [Gem, 'Exclusif & Inédit', '+300 € de soins esthétiques & yoga inclus'],
  [Flower2, 'Yoga plein air & Aérien', 'tissus (Corse) & Yin/Hatha'],
  [Sparkles, 'Méditation & cercle', 'guidés par Émilie'],
  [Leaf, 'Haute beauté & LED', 'machines dernier cri'],
  [Shell, 'Bassin d’Arcachon & Corse', 'villas de charme & mer'],
  [Users, 'Entre femmes', '8 participantes max'],
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
            <span className="hero-badge"><span className="hero-dot" /> EXCLUSIF &amp; INÉDIT · + de 300 € de Soins Esthétiques &amp; Cours de Yoga INCLUS</span>
            <h1>Bien plus qu’un week-end <span className="script">bien-être…</span></h1>
            <p className="sig light">Déposer ce qui pèse, se faire choyer et repartir le cœur léger</p>

            <p className="hero-lead-text">
              Une parenthèse rare et inédite entre femmes : <strong>plus de 300 € de soins esthétiques et de cours de yoga inclus</strong> dans nos séjours (au Bassin d’Arcachon dans notre loft avec spa et sauna privatisés, en Corse avec du <strong>Yoga Aérien dans les tissus</strong>, ou à Marrakech).
            </p>

            <div className="hero-highlights-pills">
              <span>💎 EXCLUSIF : + de 300 € de soins esthétiques &amp; yoga INCLUS</span>
              <span>🏡 Spa 7 places &amp; Sauna</span>
              <span>🧘‍♀️ Yin, Hatha &amp; Yoga Aérien (Corse)</span>
              <span>🤍 8 femmes max</span>
            </div>

            <div className="cta-row" style={{ marginTop: '1rem' }}>
              <a href="#arcachon" className="btn btn-light">
                Découvrir la villa &amp; tout le programme <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="hero-sales-box" aria-label="Offre privilège de départ Bassin d'Arcachon">
            <div className="hsb-top">
              <span className="hsb-urgent-pill">
                <Sparkles size={13} className="hsb-spark" /> EXCLUSIF &amp; INÉDIT · +300 € de soins &amp; yoga inclus
              </span>
              <span className="hsb-alma-tag">
                <span>Facilité Alma</span>
                <AlmaLogo height={14} />
              </span>
            </div>

            <div className="hsb-main">
              <div className="hsb-hook-lead">
                Réservez votre place pour <strong className="hsb-deposit-highlight">{arca?.depositPerPlace || 95} €</strong> seulement
              </div>

              <div className="hsb-pricing-row">
                <div className="hsb-price-tag">
                  <span className="hsb-old-price">{arca?.originalPrice || 550} €</span>
                  <strong className="hsb-new-price">{arca?.pricePerPerson || 450} €</strong>
                  <span className="hsb-per-person">tout compris / pers.</span>
                </div>
                <span className="hsb-save-badge">Économisez 100 €</span>
              </div>

              <ul className="hsb-value-stack">
                <li>
                  <Check size={15} className="hsb-check" />
                  <span><strong>EXCLUSIF &amp; INÉDIT — + de 300 € de soins esthétiques &amp; cours de yoga inclus</strong> : Soin visage Haute Technologie, massage expert, LED, auto-massage &amp; yoga</span>
                </li>
                <li>
                  <Check size={15} className="hsb-check" />
                  <span><strong>Loft d’exception privatisé</strong> à 10 min du Bassin (Spa 7 places, Sauna 4 places, piscine chauffée)</span>
                </li>
                <li>
                  <Check size={15} className="hsb-check" />
                  <span><strong>Yoga avec Virginie &amp; Méditation avec Émilie</strong> + pension complète végétarienne saine &amp; gourmande</span>
                </li>
              </ul>
            </div>

            <div className="hsb-action">
              <Link to="/reserver/arcachon-entre-femmes" className="hsb-btn-cta">
                <span className="hsb-btn-title">JE RÉSERVE MA PLACE — {arca?.depositPerPlace || 95} € D’ACOMPTE</span>
                <span className="hsb-btn-sub">Bloquez votre chambre dès aujourd’hui · Solde plus tard</span>
                <ArrowRight size={19} className="hsb-btn-arrow" />
              </Link>
              <div className="hsb-reassurance">
                <span><ShieldCheck size={13} /> Paiement 100% sécurisé Stripe</span>
                <span><Clock size={13} /> Annulation sereine</span>
                <span><Users size={13} /> 8 participantes max</span>
              </div>
            </div>

            <a href="#histoire" className="hsb-founders-footer">
              <img src="/img/emilie-virginie-marrakech.jpg" alt="Émilie et Virginie" className="hsb-founders-avatar" />
              <div className="hsb-founders-quote">
                <em>« Nous vous accueillons personnellement comme des amies pour un week-end inoubliable. »</em>
                <small>Émilie &amp; Virginie · Vos hôtes esthéticiennes &amp; prof de yoga</small>
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
            <ArcachonCommercialPlaque e={arca} variant="section" className="arca-inpage-banner" />
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
            <Link to="/reserver/arcachon-entre-femmes" className="btn btn-terra btn-commercial-glow">Je réserve mon séjour — {arca?.depositPerPlace || 95} € d’acompte (Tarif privilège 450 €)</Link>
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
                    Paiement en plusieurs fois avec <AlmaLogo height={15} />
                  </dd>
                  <dt>Soins &amp; rituels sur place</dt><dd><strong>+ de 300 € de prestations incluses</strong></dd>
                  <dt>Maintien du séjour</dt><dd>Dès {arca.minParticipants} participantes</dd>
                  <dt>Réservation de la place</dt><dd><strong>{arca?.depositPerPlace || 95} € d’acompte</strong> (paiement sécurisé Stripe)</dd>
                </dl>
                <div style={{ marginTop: '1.4rem', display: 'grid', gap: '.6rem' }}>
                  <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue block btn-commercial-glow">Je m’inscris — {arca?.depositPerPlace || 95} € d’acompte</Link>
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
            <p style={{ maxWidth: '76ch', marginBottom: '1.6rem', color: 'var(--muted)', fontSize: '.96rem', lineHeight: 1.6 }}>
              Pour nos séjours à Marrakech, <strong>vous réservez vos vols en direct et en toute autonomie</strong> sur le site officiel de votre choix (via <strong>EasyJet</strong> ou <strong>Royal Air Maroc</strong>) pour choisir votre ville de départ et vos options bagages au meilleur prix. Dès vos billets pris, communiquez-nous vos horaires : <strong>nous coordonnons votre transfert direct jusqu’au Riad !</strong>
            </p>
          </Reveal>
          <div className="mk-grid">
            {[
              ['marrakech-entre-femmes', 'Marrakech', 'Entre femmes', 'Yoga rooftop, riad d’exception, hammam, souks, moments de partage — et désert d’Agafay en option. Vols en direct via EasyJet ou Royal Air Maroc (liens d’accès rapide ci-dessous).', '/img/marrakech-femmes-net.jpg'],
              ['marrakech-mere-enfant', 'Marrakech', 'Mère & enfant', 'Ateliers créatifs, activités partagées, temps pour les mamans, souks et émerveillement. Vols en direct via EasyJet ou Royal Air Maroc (liens d’accès rapide ci-dessous).', '/img/marrakech-mere-enfant-net.jpg'],
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

          <MarrakechFlightModule />

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
