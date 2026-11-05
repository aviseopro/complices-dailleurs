import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  HeartHandshake,
  Palette,
  Waves,
  Calendar,
  Users,
  Check,
  Send,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Photo, Reveal } from './ui.jsx';
import { useData, update } from '../data/store.js';
import { formatWhatsAppUrl } from './WhatsAppButton.jsx';

const FOUR_BLOCKS = [
  {
    icon: Sparkles,
    title: 'Soins du visage et massages avec Émilie et Virginie.',
    text: 'Offrez-vous un soin du visage adapté à votre peau ou un massage bien-être. Émilie et Virginie réalisent toutes les deux les soins. Le soin hydrafacial peut être proposé selon la formule choisie.',
    img: '/img/arcachon-soin-visage-net.jpg',
  },
  {
    icon: HeartHandshake,
    title: 'Yoga avec Virginie.',
    text: 'Professeure de yoga diplômée, Virginie vous guide dans une séance douce ou plus dynamique, adaptée aux envies du groupe.',
    img: '/img/arcachon-yoga-net.jpg',
  },
  {
    icon: Palette,
    title: 'Atelier créatif avec Émilie.',
    text: 'Si vous en avez envie, ajoutez un moment pour créer de vos mains, laisser libre cours à votre imagination et partager le plaisir de fabriquer quelque chose ensemble.',
    img: '/img/atelier-enfant-argile.jpg',
  },
  {
    icon: Waves,
    title: 'Détente entre copines.',
    text: 'Selon le loft retenu, profitez d’un jacuzzi ou d’un sauna. La journée laisse aussi du temps libre pour discuter et profiter du lieu à votre rythme.',
    img: '/img/villa-jacuzzi.jpg',
    highlightBold: 'jacuzzi ou d’un sauna',
  },
];

const LOFTS_GALLERY = [
  {
    id: 'loft-bassin-bordeaux',
    name: 'Loft 1 · Loft de charme entre Bordeaux et le Bassin d’Arcachon',
    subtitle: 'Un grand volume chaleureux en pierre et bois, privatisé pour votre groupe de copines.',
    equipments: [
      'Jacuzzi 7 places',
      'Sauna 4 places',
      'Piscine chauffée (selon saison)',
      'Grand salon cathédrale & filet suspendu',
      'Espace soins & table de massage',
      'Grande terrasse bois & salle à manger conviviale',
    ],
    photos: [
      {
        src: '/img/villa-jacuzzi.jpg',
        title: 'Espace bien-être intérieur : Jacuzzi 7 places & Sauna 4 places',
      },
      {
        src: '/img/villa-salon-cathedrale.png',
        title: 'Salon cathédrale, poutres apparentes & filet suspendu',
      },
      {
        src: '/img/villa-terrasse-piscine.jpg',
        title: 'Patio en bois, piscine chauffée & espace détente',
      },
      {
        src: '/img/villa-salle-a-manger.png',
        title: 'Grande table en pierre & verrière pour déjeuner entre copines',
      },
      {
        src: '/img/villa-filet-mezzanine.png',
        title: 'Filet suspendu en mezzanine pour papoter et se reposer',
      },
      {
        src: '/img/villa-verriere-terrasse.jpg',
        title: 'Verrière d’atelier ouverte sur la terrasse',
      },
    ],
  },
  {
    id: 'lofts-bordeaux-environs',
    name: 'Autres lofts partenaires · Bordeaux & environs',
    subtitle:
      'Nous sélectionnons le loft le plus adapté à la taille de votre groupe, à la saison et aux activités choisies.',
    equipments: [
      'Jacuzzi ou sauna selon le loft retenu',
      'Salon lumineux pour le yoga et l’atelier créatif',
      'Espace cocooning dédié aux soins du visage et massages',
      'Table conviviale pour partager un repas ou un goûter',
    ],
    photos: [],
    comingSoonNote:
      'Les photos des nouveaux lofts partenaires à Bordeaux et dans les environs seront regroupées ici par lieu avec le détail des équipements confirmés pour chacun.',
  },
];

const ACTIVITY_OPTIONS = [
  { id: 'soins-visage', label: 'Soins du visage avec Émilie et Virginie (dont soin hydrafacial selon formule)' },
  { id: 'massages', label: 'Massages bien-être avec Émilie et Virginie' },
  { id: 'yoga', label: 'Séance de yoga avec Virginie (douce ou plus dynamique)' },
  { id: 'atelier-creatif', label: 'Atelier créatif avec Émilie' },
  { id: 'jacuzzi-sauna', label: 'Temps de détente au jacuzzi ou au sauna' },
  { id: 'repas-partage', label: 'Déjeuner gourmand, brunch ou goûter entre copines' },
];

export default function FriendsDayShowcase() {
  const { settings } = useData();
  const [lightbox, setLightbox] = useState(null); // { photos, index }

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    desiredDate: '',
    participants: '6',
    activities: ['soins-visage', 'massages', 'yoga', 'jacuzzi-sauna'],
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleActivity = (id) => {
    setForm((prev) => ({
      ...prev,
      activities: prev.activities.includes(id)
        ? prev.activities.filter((x) => x !== id)
        : [...prev.activities, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedLabels = ACTIVITY_OPTIONS.filter((a) => form.activities.includes(a.id)).map((a) => a.label);

    update((s) => {
      s.messages = s.messages || [];
      s.messages.unshift({
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        type: 'journee-entre-copines',
        name: form.name,
        email: form.email,
        phone: form.phone,
        desiredDate: form.desiredDate,
        participants: form.participants,
        activities: selectedLabels,
        notes: form.notes,
      });
      return s;
    });

    setSubmitted(true);
  };

  const selectedLabels = ACTIVITY_OPTIONS.filter((a) => form.activities.includes(a.id)).map((a) => a.label);
  const waMessage = `Bonjour Émilie et Virginie,\nNous aimerions organiser « Une journée entre copines » !\n- Date souhaitée : ${form.desiredDate || 'À définir'}\n- Nombre de personnes : ${form.participants}\n- Activités qui nous tentent : ${selectedLabels.join(', ') || 'À définir ensemble'}\n${form.notes ? `- Précisions : ${form.notes}\n` : ''}- Contact : ${form.name} (${form.email} / ${form.phone})`;
  const waUrl = `${formatWhatsAppUrl(settings.whatsapp || '0629849653')}?text=${encodeURIComponent(waMessage)}`;

  return (
    <article className="page friends-day-page">
      {/* PREMIER ÉCRAN DE LA PAGE DÉDIÉE */}
      <header className="friends-hero">
        <div className="wrap home-wrap friends-hero-grid">
          <Reveal className="friends-hero-text">
            <p className="eyebrow">Soins, yoga et détente à la carte près de Bordeaux</p>
            <h1>Une journée entre copines</h1>
            <p className="friends-hero-hook">
              <strong>Enfin une journée où l’on prend le temps de se retrouver.</strong>
            </p>
            <p className="friends-hero-lead">
              Réunissez vos copines pour une journée à Bordeaux ou dans les environs. Envie de commencer par un yoga doux, de vous offrir un massage ou de papoter dans le jacuzzi ? Émilie et Virginie, toutes deux esthéticiennes diplômées, vous accueillent et réalisent les soins. Ensemble, vous choisissez les activités et le rythme de votre journée.
            </p>
            <div className="cta-row" style={{ marginTop: '1.5rem' }}>
              <a href="#organiser" className="btn btn-terra">
                Organiser notre journée
              </a>
              <a href="#lieux" className="btn btn-ghost">
                Voir les lieux possibles
              </a>
            </div>
          </Reveal>

          <Reveal delay={90} className="friends-hero-visual">
            <div className="friends-hero-img-card">
              <img
                src="/img/villa-jacuzzi.jpg"
                alt="Une journée entre copines — détente au jacuzzi, soins et yoga près de Bordeaux"
              />
              <span className="friends-hero-badge">
                <MapPin size={14} /> Bordeaux &amp; environs · Journée sur-mesure
              </span>
            </div>
          </Reveal>
        </div>
      </header>

      {/* QUATRE BLOCS COURTS : SOINS, YOGA, ATELIER CRÉATIF, DÉTENTE */}
      <section className="section">
        <div className="wrap home-wrap">
          <Reveal className="section-head-clean">
            <p className="eyebrow">Votre programme à la carte</p>
            <h2>Composez votre journée selon vos envies</h2>
          </Reveal>

          <div className="friends-four-grid">
            {FOUR_BLOCKS.map((b, i) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.title} delay={i * 70}>
                  <div className="friends-block-card">
                    <div className="friends-block-img">
                      <img src={b.img} alt={b.title} loading="lazy" />
                      <span className="friends-block-icon">
                        <Icon size={17} />
                      </span>
                    </div>
                    <div className="friends-block-body">
                      <h3>{b.title}</h3>
                      {b.highlightBold ? (
                        <p>
                          Selon le loft retenu, profitez d’un <strong>jacuzzi ou d’un sauna</strong>. La journée laisse aussi du temps libre pour discuter et profiter du lieu à votre rythme.
                        </p>
                      ) : (
                        <p>{b.text}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRÉSENTATION HARMONISÉE D'ÉMILIE ET VIRGINIE */}
      <section className="section sand">
        <div className="wrap home-wrap">
          <Reveal>
            <div className="exp-founders-harmonized" style={{ margin: 0, background: '#fff' }}>
              <div className="exp-founders-photo-col">
                <img
                  src="/img/emilie-virginie-marrakech.jpg"
                  alt="Émilie et Virginie — Esthéticiennes diplômées"
                  className="exp-founders-avatar"
                />
                <strong>Émilie &amp; Virginie</strong>
                <span>Toutes deux esthéticiennes diplômées</span>
              </div>
              <div className="exp-founders-voices">
                <p className="founders-common-lead">
                  <strong>Émilie et Virginie sont toutes les deux esthéticiennes diplômées et réalisent vos soins du visage et vos massages.</strong> Elles vous accompagnent ensuite chacune avec leur spécialité complémentaire : le yoga avec Virginie et les ateliers créatifs avec Émilie.
                </p>
                <div className="founder-voice-card">
                  <h3>Émilie · Esthéticienne diplômée &amp; ateliers créatifs</h3>
                  <p>
                    « Je suis esthéticienne diplômée. Avec Virginie, nous réalisons les soins du visage — dont les soins hydrafacial selon l’expérience — et les massages bien-être. J’anime également les ateliers créatifs : j’aime proposer des moments où l’on prend le temps de faire quelque chose de ses mains, de laisser aller son imagination et de retrouver le plaisir de créer. »
                  </p>
                </div>
                <div className="founder-voice-card">
                  <h3>Virginie · Esthéticienne diplômée &amp; professeure de yoga</h3>
                  <p>
                    « Je suis moi aussi esthéticienne diplômée et je réalise les soins du visage et les massages à vos côtés. Je suis également professeure de yoga diplômée : je vous guide dans des séances de Yin et de Hatha Yoga, douces ou plus dynamiques, avec une attention au rythme de chacune. »
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GALERIE : LES LIEUX POSSIBLES POUR VOTRE JOURNÉE (REGROUPÉS PAR LOFT AVEC ÉQUIPEMENTS CONFIRMÉS) */}
      <section className="section" id="lieux">
        <div className="wrap home-wrap">
          <Reveal className="section-head-clean">
            <p className="eyebrow">Lofts &amp; équipements confirmés</p>
            <h2>Les lieux possibles pour votre journée</h2>
            <p className="section-sub-clean">
              Chaque lieu est sélectionné pour son confort et son atmosphère chaleureuse. Retrouvez ci-dessous nos lofts regroupés avec leurs équipements confirmés.
            </p>
          </Reveal>

          <div className="lofts-stack">
            {LOFTS_GALLERY.map((loft) => (
              <Reveal key={loft.id}>
                <div className="loft-group-card">
                  <div className="loft-group-head">
                    <div>
                      <h3>{loft.name}</h3>
                      <p>{loft.subtitle}</p>
                    </div>
                  </div>

                  <div className="loft-equipments-wrap">
                    <span className="loft-eq-label">Équipements confirmés :</span>
                    <div className="loft-eq-pills">
                      {loft.equipments.map((eq) => (
                        <span key={eq} className="loft-eq-pill">
                          <Check size={13} /> {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {loft.photos.length > 0 ? (
                    <div className="loft-photos-grid">
                      {loft.photos.map((ph, idx) => (
                        <button
                          key={ph.src}
                          type="button"
                          className="loft-photo-item"
                          onClick={() => setLightbox({ photos: loft.photos, index: idx })}
                        >
                          <img src={ph.src} alt={ph.title} loading="lazy" />
                          <span>{ph.title}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="loft-coming-soon-box">
                      <p>{loft.comingSoonNote}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DEMANDE PERSONNALISÉE : ORGANISER NOTRE JOURNÉE */}
      <section className="section sand" id="organiser">
        <div className="wrap home-wrap">
          <div className="friends-request-card">
            <div className="friends-request-head">
              <p className="eyebrow">Demande personnalisée</p>
              <h2>Organiser notre journée</h2>
              <p className="friends-closing-promise">
                Dites-nous ce qui vous ferait plaisir. On vous proposera un lieu, un déroulé et un tarif adaptés à votre groupe.
              </p>
            </div>

            {submitted ? (
              <div className="friends-request-done" role="status">
                <div className="frd-badge">
                  <Check size={20} /> Demande bien enregistrée
                </div>
                <h3>Merci {form.name} !</h3>
                <p>
                  Nous avons bien noté vos envies pour votre journée entre copines ({form.participants} personnes
                  {form.desiredDate ? ` · ${form.desiredDate}` : ''}). Émilie et Virginie reviennent très vite vers vous avec une proposition de lieu, de déroulé et de tarif sur-mesure.
                </p>
                <div className="cta-row" style={{ justifyContent: 'center', marginTop: '1.2rem' }}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-terra"
                  >
                    Nous envoyer aussi le récapitulatif sur WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSubmitted(false)}
                  >
                    Modifier ma demande
                  </button>
                </div>
              </div>
            ) : (
              <form className="friends-request-form" onSubmit={handleSubmit}>
                <div className="frf-grid2">
                  <label className="frf-field">
                    <span>
                      <Calendar size={15} /> Date ou période souhaitée
                    </span>
                    <input
                      type="text"
                      placeholder="Ex. : Samedi 15 mai, un samedi de juin…"
                      value={form.desiredDate}
                      onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
                      required
                    />
                  </label>

                  <label className="frf-field">
                    <span>
                      <Users size={15} /> Nombre de personnes
                    </span>
                    <input
                      type="number"
                      min="2"
                      max="16"
                      value={form.participants}
                      onChange={(e) => setForm({ ...form, participants: e.target.value })}
                      required
                    />
                  </label>
                </div>

                <div className="frf-activities-group">
                  <span className="frf-group-label">Les activités qui vous tentent :</span>
                  <div className="frf-activities-grid">
                    {ACTIVITY_OPTIONS.map((act) => {
                      const checked = form.activities.includes(act.id);
                      return (
                        <label
                          key={act.id}
                          className={`frf-activity-choice ${checked ? 'is-checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleActivity(act.id)}
                          />
                          <span className="frf-check-box">
                            {checked && <Check size={13} />}
                          </span>
                          <span>{act.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="frf-grid3">
                  <label className="frf-field">
                    <span>Votre prénom &amp; nom</span>
                    <input
                      type="text"
                      placeholder="Camille Martin"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </label>

                  <label className="frf-field">
                    <span>Votre email</span>
                    <input
                      type="email"
                      placeholder="camille@exemple.fr"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </label>

                  <label className="frf-field">
                    <span>Votre téléphone</span>
                    <input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </label>
                </div>

                <label className="frf-field">
                  <span>Vos envies pour la journée (ambiance, secteur autour de Bordeaux, occasion…)</span>
                  <textarea
                    rows="3"
                    placeholder="Dites-nous comment vous imaginez votre journée entre copines…"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </label>

                <p className="frf-closing-line">
                  <strong>
                    Dites-nous ce qui vous ferait plaisir. On vous proposera un lieu, un déroulé et un tarif adaptés à votre groupe.
                  </strong>
                </p>

                <div className="frf-actions">
                  <button type="submit" className="btn btn-terra">
                    <Send size={16} /> Envoyer notre demande personnalisée
                  </button>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    Ou échanger directement sur WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="villa-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="vlb-close"
            aria-label="Fermer"
            onClick={() => setLightbox(null)}
          >
            <X size={26} />
          </button>
          <button
            type="button"
            className="vlb-nav prev"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) => ({
                ...lb,
                index: (lb.index - 1 + lb.photos.length) % lb.photos.length,
              }));
            }}
          >
            <ChevronLeft size={30} />
          </button>
          <div className="vlb-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.photos[lightbox.index].src}
              alt={lightbox.photos[lightbox.index].title}
            />
            <div className="vlb-caption">
              <strong>{lightbox.photos[lightbox.index].title}</strong>
            </div>
          </div>
          <button
            type="button"
            className="vlb-nav next"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) => ({
                ...lb,
                index: (lb.index + 1) % lb.photos.length,
              }));
            }}
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </article>
  );
}
