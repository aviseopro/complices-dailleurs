// Contenu par défaut — TOUT est modifiable depuis /admin (prix, dates, quotas, textes).
// Aucune donnée non confirmée n'est inventée : null = « à confirmer ».

export const defaultData = {
  settings: {
    demoMode: true, // aucune transaction réelle tant que false n'est pas validé
    salesEnabled: false, // vente officielle Marrakech désactivée tant que le cadre légal n'est pas validé
    almaActive: false, // Alma affiché « bientôt disponible » tant que false
    heroImage: '/img/hero-arcachon-net.jpg',
    heroVideo: '/videos/hero-arcachon.mp4?v=2',
    contactEmail: 'contact@exemple.fr',
    instagram: 'https://www.instagram.com/',
    adminPassword: 'demo',
    cancellationPolicy:
      'Politique d’annulation à rédiger et faire valider par les organisatrices avant mise en production.',
  },
  experiences: [
    {
      slug: 'arcachon-entre-femmes',
      theme: 'arcachon',
      title: 'Arcachon — Entre femmes',
      short: 'Un week-end pour revenir à soi',
      image: '/img/hero-arcachon-net.jpg',
      status: 'open', // open | waitlist | soon
      kind: 'preorder', // preorder | booking | future
      minParticipants: 8,
      depositPerPlace: 100,
      paymentLink: '', // Lien de paiement Stripe (ex: https://buy.stripe.com/...)
      pricePerPerson: null,
      capacity: null,
      dates: [],
      duration: 'Un week-end (durée exacte à confirmer)',
      lodging: null,
      location: 'Bassin d’Arcachon — lieu à confirmer',
      intro:
        'Un lieu intime, la douceur des pins et cette sensation précieuse de n’avoir, pour une fois, rien d’autre à faire que prendre soin de vous.',
      conditions: {
        imputation: null,
        remboursement: null,
        garantiePlace: null,
        dates: null,
        capacite: null,
      },
      included: [
        'Massage relaxant',
        'Soin du visage au choix : rituel jeunesse ou soin Glow',
        'Luminothérapie LED et soins ciblés',
        'Séances de yoga (Yin Yoga & Hatha Yoga) et méditation',
        'Balade méditative au bord de l’océan',
        'Cuisine végétarienne saine et gourmande',
        'Cercle de parole et atelier créatif',
      ],
      excluded: ['Transport jusqu’au Bassin d’Arcachon', 'Dépenses personnelles', 'Jacuzzi : selon le lieu confirmé'],
      program: [
        { day: 'Jour 1', title: 'Arrivée & ouverture', items: ['Accueil', 'Yin Yoga', 'Dîner végétarien', 'Cercle de parole'] },
        { day: 'Jour 2', title: 'Rituels & océan', items: ['Hatha Yoga', 'Soins esthétiques', 'Balade méditative', 'Atelier créatif', 'Intentions & vœux'] },
        { day: 'Jour 3', title: 'Départ en douceur', items: ['Temps libre', 'Brunch', 'Clôture'] },
      ],
      gallery: [
        { label: 'Yoga & méditation', src: '/img/arcachon-yoga-net.jpg' },
        { label: 'Soins du visage', src: '/img/arcachon-soin-visage-net.jpg' },
        { label: 'Jacuzzi & détente', src: '/img/arcachon-jacuzzi-net.jpg' },
        { label: 'Balade méditative', src: '/img/arcachon-balade-net.jpg' },
        { label: 'Cercle de parole', src: '/img/arcachon-cercle-net.jpg' },
        { label: 'Massage relaxant', src: '/img/spa-massage-net.jpg' },
      ],
    },
    {
      slug: 'marrakech-entre-femmes',
      theme: 'marrakech',
      title: 'Marrakech — Entre femmes',
      short: 'Yoga rooftop, hammam, souks',
      image: '/img/marrakech-femmes-net.jpg',
      status: 'soon',
      kind: 'booking',
      minParticipants: 8,
      depositPerPlace: null,
      pricePerPerson: null,
      capacity: null,
      dates: [],
      duration: 'À confirmer',
      lodging: 'Riad — à confirmer',
      location: 'Marrakech',
      intro: 'Yoga sur les toits, riad d’exception, hammam, souks et moments de partage. Désert d’Agafay en option si confirmé.',
      conditions: {},
      included: ['Yoga rooftop', 'Hammam', 'Découverte des souks'],
      excluded: ['Vols', 'Agafay (option, si confirmé)'],
      program: [{ day: 'Jour 1', title: 'Programme à venir', items: ['À compléter dans l’administration'] }],
      gallery: [
        { label: 'Rooftop & Riad', src: '/img/marrakech-femmes-net.jpg' },
      ],
    },
    {
      slug: 'marrakech-mere-enfant',
      theme: 'marrakech',
      title: 'Marrakech — Mère & enfant',
      short: 'Un voyage pour se retrouver, partager et créer',
      image: '/img/marrakech-mere-enfant-net.jpg',
      status: 'soon',
      kind: 'booking',
      minParticipants: 8,
      depositPerPlace: null,
      pricePerPerson: null,
      capacity: null,
      dates: [],
      duration: 'Vacances d’avril envisagées — dates à confirmer',
      lodging: 'À confirmer',
      location: 'Marrakech',
      intro: 'Ateliers créatifs, activités partagées, temps pour les mamans et découverte. Agafay selon formule.',
      conditions: { trancheAge: null, encadrement: null },
      included: ['Ateliers créatifs', 'Activités partagées', 'Temps pour les mamans'],
      excluded: ['Vols', 'Agafay selon formule'],
      program: [{ day: 'Jour 1', title: 'Programme à venir', items: ['À compléter dans l’administration'] }],
      gallery: [
        { label: 'Ateliers & Riad', src: '/img/marrakech-mere-enfant-net.jpg' },
      ],
    },
    {
      slug: 'trek-compostelle',
      theme: 'pine',
      title: 'Trek au féminin — Chemin de Compostelle',
      short: 'Marcher entre femmes, à son rythme',
      image: '/img/trek-compostelle-net.jpg',
      status: 'soon',
      kind: 'future',
      intro:
        'Un trek entre femmes sur le Chemin de Compostelle : marcher, respirer, partager et se retrouver, à son rythme. Parcours, dates, niveau et tarif seront communiqués prochainement.',
      included: [],
      excluded: [],
      program: [],
      gallery: [
        { label: 'Chemin de Compostelle', src: '/img/trek-compostelle-net.jpg' },
      ],
      dates: [],
    },
    { slug: 'arcachon-mere-enfant', theme: 'arcachon', title: 'Arcachon — Mère & enfant', short: 'Prochainement', status: 'soon', kind: 'future', included: [], excluded: [], program: [], gallery: [], dates: [] },
    { slug: 'corse', theme: 'neutral', title: 'Corse', short: 'Prochainement', status: 'soon', kind: 'future', included: [], excluded: [], program: [], gallery: [], dates: [] },
    { slug: 'pyrenees', theme: 'neutral', title: 'Pyrénées', short: 'Prochainement', status: 'soon', kind: 'future', included: [], excluded: [], program: [], gallery: [], dates: [] },
  ],
  faq: [
    { q: 'À qui s’adressent ces séjours ?', a: 'À toutes les femmes qui ont envie de prendre du temps pour elles, dans le respect du choix de chacune.' },
    { q: 'Les soins sont-ils réalisés par des professionnelles ?', a: 'Oui : Émilie et Virginie sont toutes deux esthéticiennes diplômées. Les soins sont des soins de bien-être et de beauté, sans promesse médicale.' },
    { q: 'Qui enseigne le yoga ?', a: 'Virginie, professeure de yoga diplômée : Yin Yoga et Hatha Yoga, respiration et méditation.' },
    { q: 'Que garantit la pré-réservation à 100 € ?', a: 'Les conditions (imputation sur le prix final, remboursement, garantie de place) sont en cours de validation et seront affichées avant tout paiement.' },
    { q: 'Puis-je payer en plusieurs fois ?', a: 'Pour Marrakech, le paiement en plusieurs fois via Alma sera proposé si vous êtes éligible, dès l’activation du service.' },
  ],
  testimonials: [], // uniquement des avis authentiques, ajoutés depuis l'admin
  bookings: [],
};
