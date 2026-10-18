import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flower2, Leaf, Sun, Users, Shell, Gem, Heart, Sparkles, Waves, Check } from 'lucide-react';
import { Photo, Reveal } from '../components/ui.jsx';
import HeroCinemagraph from '../components/HeroCinemagraph.jsx';
import Faq from '../components/Faq.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useData } from '../data/store.js';

const strip = [
  [Flower2, 'Yoga &', 'méditation'],
  [Leaf, 'Soins esthétiques', 'haut de gamme'],
  [Sun, 'Lieu d’exception', 'face à l’océan'],
  [Users, 'Sisterhood', '& partage'],
  [Shell, 'Nature &', 'évasion'],
  [Gem, 'Expériences exclusives', 'signées Complices d’ailleurs'],
];

const signature = [
  ['Yoga & méditation', 'Yin Yoga et Hatha Yoga', '/img/arcachon-yoga-net.jpg'],
  ['Soins visage', 'Rituel jeunesse ou Glow', '/img/arcachon-soin-visage-net.jpg'],
  ['Jacuzzi & détente', 'selon le lieu confirmé', '/img/arcachon-jacuzzi-net.jpg'],
  ['Balade méditative', 'au bord de l’océan', '/img/arcachon-balade-net.jpg'],
  ['Cercle de parole', '& développement personnel', '/img/arcachon-cercle-net.jpg'],
];

const soins = [
  ['Massage relaxant', 'inclus', '/img/spa-massage-net.jpg'],
  ['Luminothérapie LED', 'et soins ciblés', '/img/spa-led-net.jpg'],
  ['Soin du visage', 'Jeunesse ou Glow', '/img/arcachon-soin-visage-net.jpg'],
  ['Technologies esthétiques', 'haut de gamme, sur place', '/img/spa-cosmetique-net.jpg'],
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
          <p className="eyebrow light">Bassin d’Arcachon</p>
          <h1>Bien plus qu’un week-end <span className="script">bien-être…</span></h1>
          <p className="lead light">Une expérience rare, imaginée par des femmes, pour des femmes.</p>
          <p className="sig light">Voyage au cœur du féminin</p>
          <div className="cta-row">
            <Link to="/experiences/arcachon-entre-femmes" className="btn btn-light">Découvrir l’expérience Arcachon <ArrowRight size={16} /></Link>
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
            <p>Toutes deux esthéticiennes diplômées, nous imaginons des expériences pour vous permettre de vous reconnecter et de prendre soin de vous. Virginie est également professeure de yoga diplômée.</p>
            <ul className="ticks">
              <li><Heart size={14} /> Esthétique &amp; soins experts</li>
              <li><Heart size={14} /> Yoga avec une professeure diplômée</li>
              <li><Heart size={14} /> Voyages et expériences au féminin</li>
              <li><Heart size={14} /> Sororité &amp; partage</li>
            </ul>
            <Link to="/notre-histoire" className="btn btn-terra">Découvrir notre histoire <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section arca-bg" id="arcachon">
        <div className="wrap">
          <Reveal className="sig-head">
            <div>
              <p className="eyebrow">Notre expérience signature</p>
              <h2>Arcachon<br />Entre femmes</h2>
              <p className="small-caps">Un week-end pour revenir à soi</p>
              <p>{arca.intro}</p>
              <div className="cta-row">
                <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue">Pré-réserver — {arca?.depositPerPlace || 95} €</Link>
                <Link to="/experiences/arcachon-entre-femmes" className="btn btn-ghost">Découvrir le séjour</Link>
              </div>
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
            <p className="eyebrow">Notre différence</p>
            <h2>La beauté, comme un véritable rituel</h2>
            <p>Deux esthéticiennes diplômées, des gestes experts et des technologies esthétiques haut de gamme transportées sur place, pour un véritable cocon dédié à votre bien-être. Massage inclus, soin du visage au choix : rituel jeunesse ou soin Glow, luminothérapie LED, soins ciblés.</p>
            <p className="small">Soins de bien-être et de beauté : aucune promesse médicale.</p>
            <Link to="/experiences/arcachon-entre-femmes#soins" className="btn btn-terra">En savoir plus</Link>
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
          <Reveal><Waves size={26} strokeWidth={1.2} /><h3>Le yoga pour se reconnecter à soi</h3><p>Yin Yoga et Hatha Yoga, enseignés par une professeure diplômée. Respiration et méditation, pour ralentir et retrouver l’écoute de soi.</p></Reveal>
          <Reveal delay={100}><Sun size={26} strokeWidth={1.2} /><h3>L’art de prendre le temps</h3><p>Balade méditative au bord de l’océan, cuisine végétarienne saine et gourmande, temps libre et détente.</p></Reveal>
          <Reveal delay={200}><Sparkles size={26} strokeWidth={1.2} /><h3>Se retrouver, se révéler, rayonner</h3><p>Rencontres, cercles de parole, développement personnel, partage, intentions et vœux symboliques — dans le respect du choix de chacune.</p></Reveal>
        </div>
      </section>

      <section className="section" id="experiences">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">L’expérience Arcachon</p>
            <h2>Un programme modulable, pensé pour vous</h2>
          </Reveal>
          <div className="incl">
            <Reveal>
              <h3>Inclus</h3>
              <ul className="ticks">{arca.included.map((x) => <li key={x}><Check size={14} /> {x}</li>)}</ul>
            </Reveal>
            <Reveal delay={100}>
              <h3>Non inclus</h3>
              <ul className="plain">{arca.excluded.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="small">Séjour maintenu dès {arca.minParticipants} participantes. Nombre de places, dates et conditions : communiqués dès confirmation.</p>
              <Link to="/reserver/arcachon-entre-femmes" className="btn btn-blue">Pré-réserver — {arca?.depositPerPlace || 95} €</Link>
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
