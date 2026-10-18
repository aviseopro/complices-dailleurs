import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flower2, Leaf, Sun, Users, Shell, Gem, Heart, Sparkles, Waves, Check } from 'lucide-react';
import { Photo, Reveal } from '../components/ui.jsx';
import HeroCinemagraph from '../components/HeroCinemagraph.jsx';
import Faq from '../components/Faq.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useData } from '../data/store.js';

const strip = [
  [Flower2, 'Yoga & méditation', 'professeure diplômée'],
  [Leaf, 'Soin visage expert', 'machines dernier cri'],
  [Sparkles, 'Massage relaxant', 'sur-mesure inclus'],
  [Sun, 'Auto-massage & LED', 'cours & luminothérapie'],
  [Shell, 'Bassin d’Arcachon', 'lieu d’exception'],
  [Gem, '+ de 300 € de soins', 'inclus sur place'],
];

const signature = [
  ['Yoga & méditation', 'Yin Yoga et Hatha Yoga inclus', '/img/arcachon-yoga-net.jpg'],
  ['Soin visage Haute Techno', 'Machines dernier cri : Jeunesse ou Glow', '/img/arcachon-soin-visage-net.jpg'],
  ['Massage relaxant', 'Modelage expert sur-mesure inclus', '/img/spa-massage-net.jpg'],
  ['Bassin d’Arcachon', 'Lieu de charme & balade méditative', '/img/arcachon-balade-net.jpg'],
  ['Auto-massage & LED', 'Atelier visage & luminothérapie pro', '/img/spa-led-net.jpg'],
];

const soins = [
  ['Soin visage Haute Technologie', 'Inclus — Machines dernier cri (Jeunesse ou Glow)', '/img/arcachon-soin-visage-net.jpg'],
  ['Massage relaxant sur-mesure', 'Inclus — Par nos esthéticiennes diplômées', '/img/spa-massage-net.jpg'],
  ['Cours d’auto-massage & LED', 'Inclus — Atelier liftant & luminothérapie pro', '/img/spa-led-net.jpg'],
  ['Technologies esthétiques', 'Sur place — Équipements professionnels de pointe', '/img/spa-cosmetique-net.jpg'],
];

const premiumValues = [
  {
    badge: 'Soin Signature · Inclus',
    title: 'Soin visage Haute Technologie',
    desc: 'Réalisé avec nos machines esthétiques dernier cri transportées sur place : Rituel Jeunesse ou Soin Glow sur-mesure.',
  },
  {
    badge: 'Modelage Expert · Inclus',
    title: 'Massage relaxant sur-mesure',
    desc: 'Un massage complet et profond pratiqué par Émilie et Virginie, esthéticiennes diplômées, pour dénouer toutes les tensions.',
  },
  {
    badge: 'Atelier & Techno · Inclus',
    title: 'Cours d’auto-massage & LED',
    desc: 'Apprenez les gestes liftants d’auto-massage facial combinés à une séance de photomodulation LED professionnelle.',
  },
  {
    badge: 'Pratique Guidée · Inclus',
    title: 'Yoga, respiration & méditation',
    desc: 'Séances de Yin Yoga et Hatha Yoga accessibles à toutes, guidées par Virginie, professeure de yoga diplômée.',
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
        <div className="wrap hero-in">
          <p className="eyebrow light">Bassin d’Arcachon · Séjour Haute Beauté &amp; Yoga</p>
          <h1>Bien plus qu’un week-end <span className="script">bien-être…</span></h1>
          <p className="lead light">Un institut haute technologie privatisé pour vous, du yoga et des soins d’exception inclus autour du Bassin d’Arcachon.</p>
          <p className="sig light">Voyage au cœur du féminin</p>
          <div className="cta-row">
            <Link to="/experiences/arcachon-entre-femmes" className="btn btn-light">Découvrir l’expérience Bassin d’Arcachon <ArrowRight size={16} /></Link>
            <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue">Pré-réserver — {arca?.depositPerPlace || 95} €</Link>
          </div>
        </div>
        <div className="hero-words" aria-hidden="true"><span>Se reconnecter</span><span>Partager</span><span>Se transformer</span></div>
        <a href="#histoire" className="hero-duo">
          <img src="/img/emilie-virginie-marrakech.jpg" alt="Émilie et Virginie, les fondatrices" />
          <span>Émilie &amp; Virginie<small>Vos hôtes</small></span>
        </a>
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
            <p className="script-sub">Deux esthéticiennes, une passion commune : le bien-être des femmes</p>
            <p>Toutes deux esthéticiennes diplômées, nous avons imaginé une expérience unique : <strong>déplacer notre savoir-faire et nos machines esthétiques dernier cri directement dans un lieu d’exception autour du Bassin d’Arcachon</strong>. Virginie est également professeure de yoga diplômée.</p>
            <ul className="ticks">
              <li><Heart size={14} /> Soins haute technologie &amp; massages experts inclus</li>
              <li><Heart size={14} /> Yoga &amp; méditation avec une professeure diplômée</li>
              <li><Heart size={14} /> Lieu de charme sélectionné autour du Bassin d’Arcachon</li>
              <li><Heart size={14} /> Sororité, bienveillance &amp; lâcher-prise total</li>
            </ul>
            <Link to="/notre-histoire" className="btn btn-terra">Découvrir notre histoire <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section arca-bg" id="arcachon">
        <div className="wrap">
          <Reveal className="sig-head">
            <div>
              <p className="eyebrow">Notre expérience signature · Édition Prestige</p>
              <h2>Bassin d’Arcachon<br />Entre femmes</h2>
              <p className="small-caps">Un séjour ultra-complet où tout est inclus pour prendre soin de vous</p>
              <p>{arca.intro}</p>
              <div className="cta-row">
                <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue">Pré-réserver — {arca?.depositPerPlace || 95} €</Link>
                <Link to="/experiences/arcachon-entre-femmes" className="btn btn-ghost">Découvrir le séjour</Link>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="premium-banner">
              <div className="premium-banner-head">
                <span className="premium-tag"><Gem size={15} /> Plus de 300 € de soins &amp; pratiques inclus sur place</span>
                <h3>La valeur d’une véritable cure en Spa &amp; Institut, directement incluse dans votre séjour</h3>
                <p>Contrairement aux retraites classiques où les soins sont en supplément, nous déplaçons notre institut haute technologie sur notre lieu de séjour au Bassin d’Arcachon :</p>
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
                ✨ <strong>Une valeur réelle de plus de 300 € de soins et rituels sur place :</strong> en institut et spa sur le Bassin d’Arcachon, l’ensemble de ce protocole (soin du visage haute technologie avec machines dernier cri, massage relaxant expert, séance de luminothérapie LED professionnelle, cours d’auto-massage facial et séances de yoga) représente à lui seul plus de 300 € de prestations — ici entièrement inclus dans votre week-end avec l’hébergement de charme et la pension complète gourmande.
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

      <section className="section sand" id="soins">
        <div className="wrap exclu">
          <Reveal>
            <p className="eyebrow">Haute beauté &amp; technologies de pointe</p>
            <h2>Nos machines dernier cri, privatisées pour vous</h2>
            <p>Deux esthéticiennes diplômées, des gestes experts et nos <strong>machines esthétiques dernier cri</strong> transportées directement sur notre lieu de séjour au Bassin d’Arcachon :</p>
            <ul className="ticks">
              <li><Check size={15} /> <strong>Soin visage Haute Technologie</strong> : Rituel Jeunesse ou Soin Glow</li>
              <li><Check size={15} /> <strong>Massage relaxant sur-mesure</strong> par nos esthéticiennes diplômées</li>
              <li><Check size={15} /> <strong>Cours d’auto-massage du visage &amp; Luminothérapie LED professionnelle</strong></li>
              <li><Check size={15} /> <strong>Séances de Yoga (Yin &amp; Hatha)</strong>, respiration &amp; méditation</li>
            </ul>
            <p className="small">Soins de bien-être et de beauté : aucune promesse médicale.</p>
            <Link to="/experiences/arcachon-entre-femmes#soins" className="btn btn-terra">Voir le détail des soins</Link>
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
          <Reveal><Waves size={26} strokeWidth={1.2} /><h3>Le yoga pour se reconnecter à soi</h3><p>Yin Yoga et Hatha Yoga, enseignés par Virginie, professeure diplômée. Respiration et méditation, pour ralentir et retrouver l’écoute de soi.</p></Reveal>
          <Reveal delay={100}><Sun size={26} strokeWidth={1.2} /><h3>L’esprit du Bassin d’Arcachon</h3><p>Un lieu d’exception sélectionné autour du Bassin d’Arcachon, balade méditative au bord de l’eau, cuisine végétarienne saine et gourmande.</p></Reveal>
          <Reveal delay={200}><Sparkles size={26} strokeWidth={1.2} /><h3>Se retrouver, se révéler, rayonner</h3><p>Rencontres, cercles de parole, cours d’auto-massage sous LED, partage, intentions et vœux symboliques — dans le respect du choix de chacune.</p></Reveal>
        </div>
      </section>

      <section className="section" id="experiences">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">L’expérience Bassin d’Arcachon</p>
            <h2>Un programme ultra-complet, pensé pour vous</h2>
          </Reveal>
          <div className="incl">
            <Reveal>
              <h3>Tout ce qui est inclus</h3>
              <ul className="ticks">{arca.included.map((x) => <li key={x}><Check size={14} /> {x}</li>)}</ul>
            </Reveal>
            <Reveal delay={100}>
              <h3>Non inclus</h3>
              <ul className="plain">{arca.excluded.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="small">Lieu de charme sélectionné autour du Bassin d’Arcachon selon notre groupe. Séjour maintenu dès {arca.minParticipants} participantes.</p>
              <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue">Pré-réserver ma place — {arca?.depositPerPlace || 95} €</Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section sand" id="marrakech">
        <div className="wrap">
          <Reveal><p className="eyebrow">Nos autres expériences</p><h2>Marrakech, entre femmes ou en duo mère-enfant</h2></Reveal>
          <div className="mk-grid">
            {[
              ['marrakech-entre-femmes', 'Marrakech', 'Entre femmes', 'Yoga rooftop, riad, hammam, souks, moments de partage — et désert d’Agafay en option si confirmé.', '/img/marrakech-femmes-net.jpg'],
              ['marrakech-mere-enfant', 'Marrakech', 'Mère & enfant', 'Ateliers créatifs, activités partagées, temps pour les mamans, découverte. Agafay selon formule. Vacances d’avril envisagées.', '/img/marrakech-mere-enfant-net.jpg'],
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
            <p className="eyebrow">Nouveau · bientôt</p>
            <h2>Trek au féminin<br />Chemin de Compostelle</h2>
            <p>Marcher entre femmes, à son rythme : le souffle, les paysages, les échanges au fil des étapes et la douce fierté d’avancer ensemble.</p>
            <p className="small">Parcours, dates, niveau et tarif communiqués prochainement.</p>
            <Link to="/experiences/trek-compostelle" className="btn btn-light">Découvrir le projet <ArrowRight size={16} /></Link>
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
