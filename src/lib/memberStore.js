import { useSyncExternalStore } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { DEFAULT_GOOGLE_SCRIPT_URL, OFFICIAL_EMAIL, SITE_URL } from './emailTemplate.js';

const MEMBER_STORAGE_KEY = 'cda-community-v1';
const SESSION_STORAGE_KEY = 'cda-member-session-v1';
const PRIVATE_JOURNAL_PREFIX = 'cda-private-journal-v1-';

// ============================================================================
// 1. QUESTIONNAIRE INTERACTIF : « QUELLE ESCAPADE EST FAITE POUR VOUS ? »
// ============================================================================
export const ESCAPE_QUIZ_QUESTIONS = [
  {
    id: 'q1_evasion',
    step: 1,
    question: 'Si vous pouviez vous évader demain, vous choisiriez :',
    multi: false,
    options: [
      { value: 'ocean', label: 'Un week-end au bord de l’océan' },
      { value: 'soleil_marrakech', label: 'Un voyage au soleil, comme Marrakech' },
      { value: 'journee_copines', label: 'Une journée de détente entre copines' },
      { value: 'nature_aventure', label: 'Une escapade nature et aventure' },
    ],
  },
  {
    id: 'q2_plaisir',
    step: 2,
    question: 'Dans une expérience idéale, qu’aimez-vous le plus ?',
    multi: true,
    options: [
      { value: 'soins_relaxation', label: 'Les soins et la relaxation' },
      { value: 'rencontres_echanges', label: 'Les rencontres et les échanges' },
      { value: 'decouvertes_visites', label: 'Les découvertes et les visites' },
      { value: 'activites_creatives', label: 'Les activités créatives' },
      { value: 'yoga_bien_etre', label: 'Le yoga et le bien-être' },
    ],
  },
  {
    id: 'q3_compagnie',
    step: 3,
    question: 'Vous préférez partir :',
    multi: false,
    options: [
      { value: 'seule', label: 'Seule, pour rencontrer d’autres femmes' },
      { value: 'amie', label: 'Avec une amie' },
      { value: 'groupe_copines', label: 'Avec un groupe de copines' },
      { value: 'avec_enfant', label: 'Avec votre enfant' },
    ],
  },
  {
    id: 'q4_besoin',
    step: 4,
    question: 'Quel est votre principal besoin actuellement ?',
    multi: false,
    options: [
      { value: 'reposer', label: 'Me reposer' },
      { value: 'retrouver', label: 'Me retrouver' },
      { value: 'amuser', label: 'M’amuser' },
      { value: 'nouveaux_horizons', label: 'Découvrir de nouveaux horizons' },
      { value: 'rencontrer', label: 'Rencontrer de nouvelles personnes' },
    ],
  },
  {
    id: 'q5_budget',
    step: 5,
    question: 'Quel budget envisageriez-vous pour une escapade ?',
    multi: false,
    options: [
      { value: 'moins_150', label: 'Moins de 150 €' },
      { value: '150_450', label: 'Entre 150 et 450 €' },
      { value: '450_800', label: 'Entre 450 et 800 €' },
      { value: 'plus_800', label: 'Plus de 800 €' },
    ],
  },
  {
    id: 'q6_destinations',
    step: 6,
    question: 'Quels types d’expériences souhaiteriez-vous découvrir prochainement ?',
    multi: true,
    options: [
      { value: 'arcachon', label: 'Arcachon' },
      { value: 'marrakech', label: 'Marrakech' },
      { value: 'journees_copines', label: 'Journées entre copines' },
      { value: 'sejours_nature', label: 'Séjours nature' },
      { value: 'autres', label: 'Autres destinations' },
    ],
  },
];

// Calcule le profil personnalisé et les escapades réellement présentes sur le site
export function computeEscapeRecommendations(answers = {}) {
  const scores = {
    'arcachon-entre-femmes': 2,
    'journee-entre-copines': 1,
    'marrakech-entre-femmes': 1,
    corse: 1,
    'trek-compostelle': 0,
    'arcachon-mere-enfant': 0,
  };

  const q1 = answers.q1_evasion;
  const q2 = Array.isArray(answers.q2_plaisir) ? answers.q2_plaisir : [answers.q2_plaisir].filter(Boolean);
  const q3 = answers.q3_compagnie;
  const q4 = answers.q4_besoin;
  const q5 = answers.q5_budget;
  const q6 = Array.isArray(answers.q6_destinations) ? answers.q6_destinations : [answers.q6_destinations].filter(Boolean);

  if (q1 === 'ocean') scores['arcachon-entre-femmes'] += 5;
  if (q1 === 'soleil_marrakech') scores['marrakech-entre-femmes'] += 5;
  if (q1 === 'journee_copines') scores['journee-entre-copines'] += 6;
  if (q1 === 'nature_aventure') {
    scores.corse += 4;
    scores['trek-compostelle'] += 4;
  }

  if (q2.includes('soins_relaxation')) {
    scores['arcachon-entre-femmes'] += 3;
    scores['journee-entre-copines'] += 3;
  }
  if (q2.includes('activites_creatives')) {
    scores['arcachon-entre-femmes'] += 2;
    scores['journee-entre-copines'] += 3;
    scores['marrakech-entre-femmes'] += 2;
  }
  if (q2.includes('yoga_bien_etre')) {
    scores['arcachon-entre-femmes'] += 2;
    scores.corse += 3;
    scores['trek-compostelle'] += 2;
  }
  if (q2.includes('decouvertes_visites')) {
    scores['marrakech-entre-femmes'] += 3;
    scores.corse += 3;
  }
  if (q2.includes('rencontres_echanges')) {
    scores['arcachon-entre-femmes'] += 2;
    scores['marrakech-entre-femmes'] += 2;
  }

  if (q3 === 'groupe_copines') scores['journee-entre-copines'] += 5;
  if (q3 === 'avec_enfant') scores['arcachon-mere-enfant'] += 8;
  if (q3 === 'seule' || q3 === 'amie') {
    scores['arcachon-entre-femmes'] += 2;
    scores['marrakech-entre-femmes'] += 2;
  }

  if (q4 === 'reposer' || q4 === 'retrouver') scores['arcachon-entre-femmes'] += 2;
  if (q4 === 'amuser') scores['journee-entre-copines'] += 2;
  if (q4 === 'nouveaux_horizons') {
    scores['marrakech-entre-femmes'] += 2;
    scores.corse += 2;
  }

  if (q5 === 'moins_150') scores['journee-entre-copines'] += 4;
  if (q5 === '150_450') {
    scores['arcachon-entre-femmes'] += 4;
    scores['journee-entre-copines'] += 2;
  }
  if (q5 === '450_800' || q5 === 'plus_800') {
    scores['arcachon-entre-femmes'] += 2;
    scores['marrakech-entre-femmes'] += 3;
    scores.corse += 3;
  }

  if (q6.includes('arcachon')) scores['arcachon-entre-femmes'] += 4;
  if (q6.includes('marrakech')) scores['marrakech-entre-femmes'] += 4;
  if (q6.includes('journees_copines')) scores['journee-entre-copines'] += 4;
  if (q6.includes('sejours_nature')) {
    scores.corse += 3;
    scores['trek-compostelle'] += 3;
  }

  const sortedSlugs = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug)
    .slice(0, 3);

  let profileTitle = 'Complice d’Océan & de Douceur';
  let profileSummary =
    'Vous aspirez à une parenthèse enveloppante où les soins esthétiques, le yoga doux, les ateliers créatifs et la chaleur d’un petit groupe entre femmes vous permettent de souffler pleinement.';

  if (sortedSlugs[0] === 'journee-entre-copines') {
    profileTitle = 'Complice des Parenthèses entre Amies';
    profileSummary =
      'Vous aimez partager des moments joyeux et ressourçants entourée de vos proches : soins du visage, massages, yoga avec Virginie, atelier créatif avec Émilie et détente au spa près de Bordeaux.';
  } else if (sortedSlugs[0] === 'marrakech-entre-femmes') {
    profileTitle = 'Complice d’Orient & de Lumière';
    profileSummary =
      'Vous rêvez de soleil, de couleurs et de dépaysement : la douceur d’un Riad intimiste à Marrakech, rythmée par les soins, le yoga et l’artisanat créatif.';
  } else if (sortedSlugs[0] === 'arcachon-mere-enfant') {
    profileTitle = 'Complice en Duo Mère-Enfant';
    profileSummary =
      'Vous souhaitez vivre une parenthèse tendre et privilégiée avec votre enfant, mêlant ateliers créatifs complices et temps de détente rien que pour vous.';
  } else if (sortedSlugs[0] === 'corse' || sortedSlugs[0] === 'trek-compostelle') {
    profileTitle = 'Complice de Nature & d’Évasion';
    profileSummary =
      'Vous ressentez l’appel du grand air, des paysages inspirants et de la reconnexion au corps à travers le yoga, la marche consciente et les soins bien-être.';
  }

  return {
    primaryProfile: profileTitle,
    profileSummary,
    recommendedSlugs: sortedSlugs,
  };
}

// ============================================================================
// 2. RITUELS BIEN-ÊTRE, DÉFIS & CADEAUX PAR DÉFAUT (MODIFIABLES SANS CODER)
// ============================================================================
export const DEFAULT_MORNING_NIGHT_RITUALS = {
  morning: [
    { id: 'm1', title: 'Brume florale ou eau fraîche au réveil', detail: 'Éveiller la peau en douceur sans agresser le film hydrolipidique.' },
    { id: 'm2', title: '3 respirations profondes face à la lumière', detail: 'Inspirer par le nez sur 4 temps, expirer longuement par la bouche.' },
    { id: 'm3', title: 'Sérum & crème hydratante en lissages ascendants', detail: 'Du centre du visage vers l’extérieur, avec une pensée bienveillante pour soi.' },
    { id: 'm4', title: 'Protection solaire quotidienne', detail: 'Le geste essentiel d’Émilie pour préserver l’éclat de la peau toute l’année.' },
  ],
  evening: [
    { id: 'e1', title: 'Double nettoyage doux du soir', detail: 'Huile ou baume démaquillant suivi d’un nettoyant doux pour libérer la peau.' },
    { id: 'e2', title: '2 minutes d’auto-massage facial décontractant', detail: 'Détendre les mâchoires, lisser le front et relâcher les traits de la journée.' },
    { id: 'e3', title: 'Étirement doux de la nuque et des épaules (Virginie)', detail: 'Relâcher le poids de la journée avant de se glisser dans le lit.' },
    { id: 'e4', title: 'Un mot de gratitude dans son carnet', detail: 'Noter une chose simple qui vous a fait sourire aujourd’hui.' },
  ],
};

export const DEFAULT_WELLNESS_CHALLENGES = [
  { id: 'ch1', title: '10 minutes sans écran au réveil', duration: 'Défi douceur · 3 jours', description: 'Commencer la journée par un verre d’eau tiède et quelques étirements avant de regarder son téléphone.' },
  { id: 'ch2', title: 'Rituel d’auto-massage du visage le soir', duration: 'Conseil d’Émilie · 5 min', description: 'Prendre 5 minutes le soir avec quelques gouttes d’huile végétale pour lisser les traits et détendre les mâchoires.' },
  { id: 'ch3', title: 'Pause respiration carrée avec Virginie', duration: 'Pause Yoga · 4 min', description: 'Inspirer 4 secondes, garder 4 secondes, expirer 4 secondes, suspendre 4 secondes pour apaiser le mental.' },
  { id: 'ch4', title: 'Créer quelque chose de ses mains', duration: 'Inspiration d’Émilie · 30 min', description: 'S’accorder une demi-heure pour dessiner, écrire, façonner ou cuisiner sans chercher la perfection.' },
];

export const DEFAULT_MEMBER_RESOURCES = [
  {
    id: 'res-ebook-parenthese',
    category: 'ebook',
    title: 'L’art de s’accorder une parenthèse',
    subtitle: 'Notre premier e-book offert aux membres Complices d’ailleurs',
    author: 'Émilie & Virginie',
    badge: 'E-book offert · Édition Membre',
    description:
      'Un guide chaleureux imaginé par Émilie et Virginie pour ralentir, créer ses rituels de douceur à la maison, respirer et préparer sa prochaine escapade entre femmes.',
    contentBody:
      'Chapitre 1 : Pourquoi s’accorder une vraie pause n’est pas un luxe.\nChapitre 2 : Les rituels visage & auto-massage d’Émilie pour rayonner.\nChapitre 3 : Les 3 respirations et postures douces de Virginie pour relâcher la pression.\nChapitre 4 : Retrouver le plaisir de créer de ses mains.\nChapitre 5 : Préparer sa valise légère pour une parenthèse entre femmes.',
    fileUrl: '', // Emplacement prêt : le PDF définitif pourra être ajouté en 1 clic depuis le back-office
    isPublished: true,
    createdAt: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'res-beaute-automassage',
    category: 'beaute',
    title: 'Les 4 gestes d’auto-massage coup d’éclat',
    subtitle: 'Astuce beauté par Émilie, esthéticienne diplômée',
    author: 'Émilie',
    badge: 'Astuce Beauté · Émilie',
    description:
      'Chauffer 3 gouttes d’huile entre vos paumes, lisser de l’ovale du visage vers les tempes, puis effectuer de légères pressions sous les pommettes et les sourcils pour relancer la microcirculation.',
    contentBody:
      '1. Défroisser le front par des lissages alternés du bas vers le haut.\n2. Drainer le contour des yeux par de doux tapotements du coin interne vers les tempes.\n3. Détendre les masséters (mâchoires) avec la pulpe des doigts en petits cercles.\n4. Terminer par un lissage enveloppant du cou jusqu’aux clavicules.',
    fileUrl: '',
    isPublished: true,
    createdAt: '2026-11-02T10:00:00.000Z',
  },
  {
    id: 'res-yoga-papillon',
    category: 'yoga',
    title: 'La pause Yin du soir : Le Papillon allongé (Supta Baddha Konasana)',
    subtitle: 'Pause yoga & respiration par Virginie, professeure de yoga diplômée',
    author: 'Virginie',
    badge: 'Pause Yoga · Virginie',
    description:
      'Allongée sur le dos, plantes de pieds jointes et genoux déposés sur deux coussins, une main sur le cœur et une main sur le ventre pendant 5 minutes de respiration lente.',
    contentBody:
      'Cette posture d’ouverture douce relâche le bassin, apaise le système nerveux et invite au sommeil. Ne cherchez aucune tension : laissez simplement le poids du corps se déposer dans le tapis.',
    fileUrl: '',
    isPublished: true,
    createdAt: '2026-11-03T10:00:00.000Z',
  },
  {
    id: 'res-fiche-valise',
    category: 'fiche',
    title: 'Ma valise idéale pour un week-end sur le Bassin d’Arcachon',
    subtitle: 'Fiche pratique Complices d’ailleurs',
    author: 'Émilie & Virginie',
    badge: 'Fiche Pratique',
    description:
      'Les indispensables tout doux à glisser dans votre sac pour profiter pleinement du loft, du spa, des séances de yoga et des balades sous les pins.',
    contentBody:
      '• Une tenue souple et confortable pour le Yin & Hatha Yoga avec Virginie\n• Votre maillot de bain pour le spa 7 places, le sauna et la piscine chauffée\n• Une paire de baskets ou chaussures douces pour le sentier du littoral\n• Un gilet chaud et doux pour les soirées cocooning au loft\n• Votre trousse de toilette habituelle (nous nous occupons de tous les produits de soins professionnels !)',
    fileUrl: '',
    isPublished: true,
    createdAt: '2026-11-04T10:00:00.000Z',
  },
];

export const DEFAULT_CONTEST = {
  id: 'concours-instagram-1',
  slug: 'parenthese-complices',
  title: 'Concours Instagram — Gagnez votre parenthèse bien-être Complices d’ailleurs',
  prize: 'Une invitation privilégiée ou un soin haute beauté & l’e-book « L’art de s’accorder une parenthèse » offert à chaque participante',
  startDate: '2026-11-15',
  endDate: '2026-12-15',
  rulesText:
    'Jeu-concours gratuit sans obligation d’achat ni d’abonnement commercial, ouvert à toute femme majeure résidant en France métropolitaine. Une seule participation par personne (adresse e-mail vérifiée). Le tirage au sort est effectué de manière aléatoire et horodatée depuis l’interface d’administration de Complices d’ailleurs.',
  isActive: false, // Désactivé par défaut tant que le règlement et les dates ne sont pas validés par Émilie et Virginie
  winnerUserId: null,
  drawHistory: [],
};

// ============================================================================
// 3. DEUX COMPTES ADMINISTRATEURS NOMINATIFS (ÉMILIE & VIRGINIE)
// ============================================================================
// Aucun mot de passe partagé : chaque fondatrice possède son propre identifiant
// nominatif avec le rôle 'admin', accédant au même tableau de bord commun.
const NOMINATIVE_ADMINS = [
  {
    id: 'admin-emilie',
    email: 'emilie@complicesdailleurs.fr',
    aliasEmail: 'complicesdailleurs@gmail.com',
    firstName: 'Émilie',
    lastName: 'Complices d’ailleurs',
    role: 'admin',
    title: 'Co-fondatrice · Esthéticienne diplômée & Ateliers créatifs',
    // Hash SHA-256 par défaut pour 'EmilieComplices2026!' (modifiable dans l'espace admin / Supabase Auth)
    defaultPassHash: '8b559877a4743511621d46d7a55e65694711907072006d591f007827d037a84a',
  },
  {
    id: 'admin-virginie',
    email: 'virginie@complicesdailleurs.fr',
    aliasEmail: '',
    firstName: 'Virginie',
    lastName: 'Complices d’ailleurs',
    role: 'admin',
    title: 'Co-fondatrice · Esthéticienne diplômée & Professeure de yoga',
    // Hash SHA-256 par défaut pour 'VirginieComplices2026!' (modifiable dans l'espace admin / Supabase Auth)
    defaultPassHash: 'd6833c616931f5f72753b794162c65256737846c2f3f02a46f95f97e1b179307',
  },
];

// ============================================================================
// 4. HACHAGE CRYPTOGRAPHIQUE SHA-256 (JAMAIS DE MOT DE PASSE EN CLAIR)
// ============================================================================
export async function hashPassword(password, emailSalt = '') {
  const normalized = `${String(emailSalt).trim().toLowerCase()}::cda-salt-2026::${String(password)}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = new TextEncoder().encode(normalized);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback déterministe hors navigateur
  let h = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    h ^= normalized.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv-${(h >>> 0).toString(16)}`;
}

function generateSecureToken() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// Protection anti-robot / limitation des tentatives abusives
const authRateLimiter = {
  attempts: [],
  checkAllowed() {
    const now = Date.now();
    this.attempts = this.attempts.filter((t) => now - t < 60_000);
    if (this.attempts.length >= 6) {
      return {
        allowed: false,
        error: 'Par mesure de sécurité, veuillez patienter une minute avant une nouvelle tentative.',
      };
    }
    this.attempts.push(now);
    return { allowed: true };
  },
};

// ============================================================================
// 5. ÉTAT PERSISTANT & SYNCHRONISATION SUPABASE
// ============================================================================
function createInitialState() {
  return {
    members: [], // Aucun faux compte en production : seules les vraies inscrites apparaissent
    resources: DEFAULT_MEMBER_RESOURCES,
    contests: [DEFAULT_CONTEST],
    contestEntries: [],
    auditLogs: [],
    adminCustomHashes: {},
  };
}

function loadCommunityState() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(MEMBER_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...createInitialState(),
        ...parsed,
        members: Array.isArray(parsed.members) ? parsed.members : [],
        resources: Array.isArray(parsed.resources) && parsed.resources.length ? parsed.resources : DEFAULT_MEMBER_RESOURCES,
        contests: Array.isArray(parsed.contests) && parsed.contests.length ? parsed.contests : [DEFAULT_CONTEST],
        contestEntries: Array.isArray(parsed.contestEntries) ? parsed.contestEntries : [],
        auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
        adminCustomHashes: parsed.adminCustomHashes || {},
      };
    }
  } catch (_) {}
  return createInitialState();
}

function loadCurrentSession() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(SESSION_STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

let communityState = loadCommunityState();
let currentSession = loadCurrentSession();
const listeners = new Set();

function notify() {
  listeners.forEach((cb) => cb());
}

function saveCommunityState(next) {
  communityState = next;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(communityState));
    }
  } catch (_) {}
  notify();
}

function saveCurrentSession(sess) {
  currentSession = sess;
  try {
    if (typeof localStorage !== 'undefined') {
      if (sess) localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sess));
      else localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (_) {}
  notify();
}

let snapshotCache = {
  community: communityState,
  session: currentSession,
};

function getSnapshot() {
  if (snapshotCache.community !== communityState || snapshotCache.session !== currentSession) {
    snapshotCache = {
      community: communityState,
      session: currentSession,
    };
  }
  return snapshotCache;
}

export function useCommunity() {
  const snap = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getSnapshot
  );

  // Sécurité : une utilisatrice 'member' ne reçoit jamais la liste des autres membres
  const isAdmin = snap.session?.role === 'admin';
  const myProfile =
    snap.session?.role === 'member'
      ? snap.community.members.find((m) => m.id === snap.session.userId) || null
      : null;

  return {
    session: snap.session,
    isAdmin,
    isMember: snap.session?.role === 'member',
    myProfile,
    // Seules Émilie et Virginie (rôle 'admin') ont accès au répertoire 'members'
    members: isAdmin ? snap.community.members : [],
    resources: snap.community.resources,
    contests: snap.community.contests,
    contestEntries: isAdmin
      ? snap.community.contestEntries
      : snap.community.contestEntries.filter((e) => e.userId === snap.session?.userId),
    auditLogs: isAdmin ? snap.community.auditLogs : [],
    isSupabaseConfigured,
  };
}

// ============================================================================
// 6. CARNET BIEN-ÊTRE PERSONNEL (STRICTEMENT PRIVÉ — STOCKÉ À PART PAR MEMBRE)
// ============================================================================
export function getMyPrivateWellnessJournal(userId) {
  if (!userId || !currentSession || currentSession.userId !== userId) {
    return { skinProfile: {}, completedRituals: {}, completedChallenges: [] };
  }
  try {
    const raw = localStorage.getItem(`${PRIVATE_JOURNAL_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    skinProfile: {
      skinType: '',
      concerns: [],
      preferences: [],
    },
    completedRituals: {},
    completedChallenges: [],
  };
}

export function saveMyPrivateWellnessJournal(userId, journalData) {
  if (!userId || !currentSession || currentSession.userId !== userId) return false;
  const updated = {
    ...journalData,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(`${PRIVATE_JOURNAL_PREFIX}${userId}`, JSON.stringify(updated));
  } catch (_) {}

  // Si un défi bien-être est coché, débloque le tampon correspondant sur le Passeport Complices
  if (Array.isArray(updated.completedChallenges) && updated.completedChallenges.length > 0) {
    awardPassportStamp(userId, 'wellness_challenge', 'Premier défi bien-être accompli');
  }

  if (isSupabaseConfigured && supabase) {
    supabase
      .from('private_wellness_journal')
      .upsert({
        user_id: userId,
        skin_profile: updated.skinProfile || {},
        completed_rituals: updated.completedRituals || {},
        completed_challenges: updated.completedChallenges || [],
        updated_at: updated.updatedAt,
      })
      .then(() => {});
  }
  notify();
  return true;
}

// ============================================================================
// 7. ENVOI DES E-MAILS TRANSACTIONNELS (CONFIRMATION DE COMPTE & MOT DE PASSE OUBLIÉ)
// ============================================================================
async function sendMemberTransactionalEmail({ to, firstName, subject, heading, bodyHtml, ctaLabel, ctaUrl }) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background-color:#f4ece1;font-family:'Jost',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2a2420;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4ece1;padding:32px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#faf6ef;border-radius:22px;overflow:hidden;border:1px solid #e2d3be;box-shadow:0 14px 36px rgba(42,36,32,0.08);">
          <tr>
            <td align="center" style="padding:26px 24px 18px;background:linear-gradient(180deg,#fffaf3 0%,#f5ebdc 100%);border-bottom:1px solid #e8d8c3;">
              <div style="font-family:Georgia,'Cormorant Garamond',serif;font-size:27px;font-weight:600;color:#2a2420;">
                Complice<span style="font-size:29px;">S</span> <span style="font-family:'Brush Script MT',cursive;color:#a8553a;font-weight:400;font-size:30px;">d’ailleurs</span>
              </div>
              <div style="font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:#6d625a;margin-top:5px;">
                Mon Carnet d’Ailleurs · Espace Membre
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 24px;">
              <h1 style="font-family:Georgia,'Cormorant Garamond',serif;font-size:25px;font-weight:500;color:#2a2420;margin:0 0 14px;">
                ${heading}
              </h1>
              <div style="font-size:15px;line-height:1.68;color:#3d332c;margin:0 0 22px;">
                ${bodyHtml}
              </div>
              ${
                ctaUrl
                  ? `<div style="text-align:center;margin:24px 0;">
                      <a href="${ctaUrl}" style="display:inline-block;background-color:#a8553a;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 26px;border-radius:999px;">
                        ${ctaLabel}
                      </a>
                    </div>
                    <p style="font-size:12px;color:#6d625a;line-height:1.5;margin-top:16px;">
                      Si le bouton ne s’ouvre pas, copiez ce lien sécurisé dans votre navigateur :<br />
                      <a href="${ctaUrl}" style="color:#a8553a;word-break:break-all;">${ctaUrl}</a>
                    </p>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px;background-color:#f1e7d8;border-top:1px solid #e2d3be;text-align:center;font-size:12.5px;color:#4a3f38;">
              Avec toute notre complicité, <strong>Émilie &amp; Virginie</strong><br />
              <a href="mailto:${OFFICIAL_EMAIL}" style="color:#a8553a;">${OFFICIAL_EMAIL}</a> · <a href="${SITE_URL}" style="color:#2a2420;">complices-dailleurs.vercel.app</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${heading}\n\nBonjour ${firstName || ''},\n\n${ctaLabel ? `${ctaLabel} : ${ctaUrl}\n\n` : ''}Avec toute notre complicité,\nÉmilie & Virginie — Complices d'ailleurs (${OFFICIAL_EMAIL})`;

  try {
    const res = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking: {
          reference: 'MEMBRE',
          name: firstName || 'Complice',
          email: to,
          paymentMethod: 'member_account',
        },
        experienceTitle: subject,
        html,
        text,
        officialEmail: OFFICIAL_EMAIL,
        googleScriptUrl: DEFAULT_GOOGLE_SCRIPT_URL,
      }),
    });
    if (res.ok) return true;
  } catch (_) {}

  try {
    await fetch(DEFAULT_GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        to,
        bcc: OFFICIAL_EMAIL,
        replyTo: OFFICIAL_EMAIL,
        subject,
        text,
        html,
      }),
    });
    return true;
  } catch (_) {
    return false;
  }
}

// ============================================================================
// 8. INSCRIPTION, VALIDATION D'E-MAIL, CONNEXION & MOT DE PASSE OUBLIÉ
// ============================================================================
export async function registerMember(form) {
  // Protection anti-robot (champ honeypot invisible)
  if (form.websiteUrlHoneypot) {
    return { ok: false, error: 'Inscription refusée.' };
  }

  const rate = authRateLimiter.checkAllowed();
  if (!rate.allowed) return { ok: false, error: rate.error };

  const firstName = (form.firstName || '').trim();
  const lastName = (form.lastName || '').trim();
  const email = (form.email || '').trim().toLowerCase();
  const password = form.password || '';
  const confirmPassword = form.confirmPassword || '';
  const phone = (form.phone || '').trim();
  const birthDate = (form.birthDate || '').trim();
  const acceptTerms = Boolean(form.acceptTerms);
  const marketingOptIn = Boolean(form.marketingOptIn);

  const errors = {};
  if (firstName.length < 2) errors.firstName = 'Merci d’indiquer votre prénom.';
  if (lastName.length < 2) errors.lastName = 'Merci d’indiquer votre nom.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Merci d’indiquer une adresse e-mail valide.';
  if (password.length < 8) errors.password = 'Votre mot de passe doit contenir au moins 8 caractères.';
  if (password !== confirmPassword) errors.confirmPassword = 'La confirmation du mot de passe ne correspond pas.';
  if (!acceptTerms) {
    errors.acceptTerms =
      'Vous devez accepter les conditions d’utilisation et confirmer avoir pris connaissance de la politique de confidentialité.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // Vérifie si l'e-mail existe déjà
  const existing = communityState.members.find((m) => m.email.toLowerCase() === email);
  if (existing) {
    return {
      ok: false,
      error: 'Un compte Complice existe déjà avec cette adresse e-mail. Vous pouvez vous connecter ou réinitialiser votre mot de passe.',
    };
  }

  const now = new Date().toISOString();
  const passwordHash = await hashPassword(password, email);
  const verificationToken = generateSecureToken();
  const userId = `mbr-${generateSecureToken().slice(0, 12)}`;

  // Si Supabase Auth est configuré, inscrit également dans Supabase
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : SITE_URL}/mon-espace?verified=1`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          birth_date: birthDate || null,
          marketing_opt_in: marketingOptIn,
        },
      },
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    if (data?.user?.id) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        birth_date: birthDate || null,
        role: 'member',
        email_verified: false,
        marketing_opt_in: marketingOptIn,
        terms_accepted_at: now,
      });
    }
  }

  const newMember = {
    id: userId,
    firstName,
    lastName,
    email,
    phone,
    birthDate,
    role: 'member',
    passwordHash, // Jamais de mot de passe en clair
    emailVerified: false,
    verificationToken,
    resetToken: null,
    resetTokenExpiresAt: null,
    marketingOptIn,
    termsAcceptedAt: now,
    createdAt: now,
    updatedAt: now,
    escapeQuiz: null, // Réponses au questionnaire « Quelle escapade est faite pour vous ? »
    favorites: [],
    stamps: [
      {
        code: 'profile_created',
        label: 'Profil Complice créé',
        earnedAt: now,
      },
    ],
    consentHistory: [
      { type: 'terms_privacy', granted: true, at: now },
      { type: 'marketing_email', granted: marketingOptIn, at: now },
    ],
  };

  const nextState = {
    ...communityState,
    members: [newMember, ...communityState.members],
  };
  saveCommunityState(nextState);

  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const verifyUrl = `${origin}/mon-espace?verify_token=${verificationToken}&email=${encodeURIComponent(email)}`;

  await sendMemberTransactionalEmail({
    to: email,
    firstName,
    subject: 'Activez votre Carnet d’Ailleurs — Complices d’ailleurs',
    heading: `Bienvenue ${firstName} dans votre Carnet d’Ailleurs !`,
    bodyHtml: `<p>Quel bonheur de vous accueillir dans la communauté <strong>Complices d’ailleurs</strong>.</p>
      <p>Pour confirmer votre adresse e-mail et activer votre espace personnel (votre questionnaire d’escapade, votre Passeport Complices et votre e-book offert <em>« L’art de s’accorder une parenthèse »</em>), cliquez sur le bouton ci-dessous :</p>`,
    ctaLabel: 'Valider mon adresse e-mail & activer mon Carnet',
    ctaUrl: verifyUrl,
  });

  return {
    ok: true,
    member: newMember,
    verifyUrl,
  };
}

export function verifyMemberEmailToken(token, emailParam = '') {
  if (!token) return { ok: false, error: 'Lien de validation manquant.' };
  const idx = communityState.members.findIndex(
    (m) =>
      m.verificationToken === token &&
      (!emailParam || m.email.toLowerCase() === String(emailParam).trim().toLowerCase())
  );
  if (idx < 0) {
    return { ok: false, error: 'Ce lien de confirmation a déjà été utilisé ou n’est plus valide.' };
  }

  const now = new Date().toISOString();
  const updatedMember = {
    ...communityState.members[idx],
    emailVerified: true,
    verificationToken: null,
    updatedAt: now,
  };

  const nextMembers = [...communityState.members];
  nextMembers[idx] = updatedMember;
  saveCommunityState({
    ...communityState,
    members: nextMembers,
  });

  saveCurrentSession({
    userId: updatedMember.id,
    email: updatedMember.email,
    firstName: updatedMember.firstName,
    lastName: updatedMember.lastName,
    role: 'member',
    loginAt: now,
  });

  return { ok: true, member: updatedMember };
}

export async function loginMemberOrAdmin({ email, password }) {
  const rate = authRateLimiter.checkAllowed();
  if (!rate.allowed) return { ok: false, error: rate.error };

  const cleanEmail = (email || '').trim().toLowerCase();
  const rawPass = password || '';

  if (!cleanEmail || !rawPass) {
    return { ok: false, error: 'Merci de renseigner votre adresse e-mail et votre mot de passe.' };
  }

  // 1. Vérifie s'il s'agit d'un des 2 comptes administrateurs nominatifs (Émilie ou Virginie)
  const adminMatch = NOMINATIVE_ADMINS.find(
    (a) => a.email.toLowerCase() === cleanEmail || (a.aliasEmail && a.aliasEmail.toLowerCase() === cleanEmail)
  );
  if (adminMatch) {
    const candidateHash = await hashPassword(rawPass, adminMatch.email);
    const expectedHash = communityState.adminCustomHashes?.[adminMatch.id] || adminMatch.defaultPassHash;
    if (candidateHash === expectedHash) {
      const now = new Date().toISOString();
      const sess = {
        userId: adminMatch.id,
        email: adminMatch.email,
        firstName: adminMatch.firstName,
        lastName: adminMatch.lastName,
        title: adminMatch.title,
        role: 'admin',
        loginAt: now,
      };
      saveCurrentSession(sess);
      saveCommunityState({
        ...communityState,
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            adminEmail: adminMatch.email,
            adminName: adminMatch.firstName,
            action: 'Connexion à l’administration',
            at: now,
          },
          ...communityState.auditLogs,
        ],
      });
      return { ok: true, session: sess, role: 'admin' };
    }
    return { ok: false, error: 'Identifiants administratrice incorrects.' };
  }

  // 2. Connexion d'une utilisatrice membre
  const member = communityState.members.find((m) => m.email.toLowerCase() === cleanEmail);
  if (!member) {
    return { ok: false, error: 'Aucun compte Complice trouvé avec cette adresse e-mail.' };
  }

  const candidateHash = await hashPassword(rawPass, member.email);
  if (candidateHash !== member.passwordHash) {
    return { ok: false, error: 'Mot de passe incorrect.' };
  }

  if (!member.emailVerified) {
    return {
      ok: false,
      needsVerification: true,
      email: member.email,
      verificationToken: member.verificationToken,
      error:
        'Votre adresse e-mail n’a pas encore été validée. Cliquez sur le lien reçu par e-mail pour activer votre compte.',
    };
  }

  const sess = {
    userId: member.id,
    email: member.email,
    firstName: member.firstName,
    lastName: member.lastName,
    role: 'member',
    loginAt: new Date().toISOString(),
  };
  saveCurrentSession(sess);
  return { ok: true, session: sess, role: 'member' };
}

export function logoutSession() {
  if (isSupabaseConfigured && supabase) {
    supabase.auth.signOut().catch(() => {});
  }
  saveCurrentSession(null);
}

export async function requestPasswordReset(email) {
  const rate = authRateLimiter.checkAllowed();
  if (!rate.allowed) return { ok: false, error: rate.error };

  const cleanEmail = (email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { ok: false, error: 'Merci d’indiquer une adresse e-mail valide.' };
  }

  const idx = communityState.members.findIndex((m) => m.email.toLowerCase() === cleanEmail);
  if (idx < 0) {
    // Réponse neutre pour ne pas divulguer les comptes existants
    return {
      ok: true,
      message: 'Si un compte Complice est associé à cette adresse, un lien de réinitialisation vient de vous être envoyé.',
    };
  }

  const resetToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 heure
  const member = communityState.members[idx];

  const nextMembers = [...communityState.members];
  nextMembers[idx] = {
    ...member,
    resetToken,
    resetTokenExpiresAt: expiresAt,
  };
  saveCommunityState({
    ...communityState,
    members: nextMembers,
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const resetUrl = `${origin}/mon-espace?reset_token=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

  await sendMemberTransactionalEmail({
    to: cleanEmail,
    firstName: member.firstName,
    subject: 'Réinitialisation de votre mot de passe — Complices d’ailleurs',
    heading: 'Choisissez un nouveau mot de passe',
    bodyHtml: `<p>Bonjour ${member.firstName},</p>
      <p>Vous avez demandé à réinitialiser le mot de passe de votre espace <strong>Mon Carnet d’Ailleurs</strong>. Cliquez sur le bouton ci-dessous (valable 1 heure) :</p>`,
    ctaLabel: 'Réinitialiser mon mot de passe',
    ctaUrl: resetUrl,
  });

  return {
    ok: true,
    resetUrl,
    message: 'Un e-mail de réinitialisation vient de vous être envoyé.',
  };
}

export async function completePasswordReset({ token, email, newPassword, confirmPassword }) {
  if (!token) return { ok: false, error: 'Jeton de sécurité manquant.' };
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, error: 'Les deux mots de passe ne correspondent pas.' };
  }

  const idx = communityState.members.findIndex(
    (m) =>
      m.resetToken === token &&
      (!email || m.email.toLowerCase() === String(email).trim().toLowerCase())
  );
  if (idx < 0) {
    return { ok: false, error: 'Ce lien de réinitialisation est invalide ou a expiré.' };
  }

  const member = communityState.members[idx];
  if (member.resetTokenExpiresAt && new Date(member.resetTokenExpiresAt) < new Date()) {
    return { ok: false, error: 'Ce lien de réinitialisation a expiré. Merci d’en demander un nouveau.' };
  }

  const passwordHash = await hashPassword(newPassword, member.email);
  const nextMembers = [...communityState.members];
  nextMembers[idx] = {
    ...member,
    passwordHash,
    emailVerified: true,
    resetToken: null,
    resetTokenExpiresAt: null,
    updatedAt: new Date().toISOString(),
  };
  saveCommunityState({
    ...communityState,
    members: nextMembers,
  });

  return { ok: true };
}

// ============================================================================
// 9. ACTIONS MEMBRE : QUESTIONNAIRE, PASSEPORT, FAVORIS, PROFIL & RGPD
// ============================================================================
export function awardPassportStamp(userId, code, label) {
  const idx = communityState.members.findIndex((m) => m.id === userId);
  if (idx < 0) return;
  const member = communityState.members[idx];
  const stamps = Array.isArray(member.stamps) ? member.stamps : [];
  if (stamps.some((s) => s.code === code)) return;

  const nextMembers = [...communityState.members];
  nextMembers[idx] = {
    ...member,
    stamps: [...stamps, { code, label, earnedAt: new Date().toISOString() }],
    updatedAt: new Date().toISOString(),
  };
  saveCommunityState({
    ...communityState,
    members: nextMembers,
  });
}

export function saveMemberEscapeQuiz(userId, answers) {
  if (!currentSession || currentSession.userId !== userId) {
    return { ok: false, error: 'Non autorisé.' };
  }
  const idx = communityState.members.findIndex((m) => m.id === userId);
  if (idx < 0) return { ok: false, error: 'Profil introuvable.' };

  const result = computeEscapeRecommendations(answers);
  const now = new Date().toISOString();
  const member = communityState.members[idx];
  const stamps = Array.isArray(member.stamps) ? [...member.stamps] : [];
  if (!stamps.some((s) => s.code === 'escape_quiz_completed')) {
    stamps.push({
      code: 'escape_quiz_completed',
      label: 'Portrait d’escapade découvert',
      earnedAt: now,
    });
  }

  const nextMembers = [...communityState.members];
  nextMembers[idx] = {
    ...member,
    escapeQuiz: {
      answers,
      primaryProfile: result.primaryProfile,
      profileSummary: result.profileSummary,
      recommendedSlugs: result.recommendedSlugs,
      updatedAt: now,
    },
    stamps,
    updatedAt: now,
  };
  saveCommunityState({
    ...communityState,
    members: nextMembers,
  });

  return { ok: true, result: nextMembers[idx].escapeQuiz };
}

export function toggleMemberFavoriteEscape(userId, experienceSlug) {
  if (!currentSession || currentSession.userId !== userId) return;
  const idx = communityState.members.findIndex((m) => m.id === userId);
  if (idx < 0) return;
  const member = communityState.members[idx];
  const favs = Array.isArray(member.favorites) ? member.favorites : [];
  const exists = favs.includes(experienceSlug);
  const nextFavs = exists ? favs.filter((s) => s !== experienceSlug) : [...favs, experienceSlug];

  const nextMembers = [...communityState.members];
  nextMembers[idx] = {
    ...member,
    favorites: nextFavs,
    updatedAt: new Date().toISOString(),
  };
  saveCommunityState({
    ...communityState,
    members: nextMembers,
  });
}

export function updateMemberPersonalProfile(userId, updates) {
  if (!currentSession || currentSession.userId !== userId) return { ok: false };
  const idx = communityState.members.findIndex((m) => m.id === userId);
  if (idx < 0) return { ok: false };

  const member = communityState.members[idx];
  const now = new Date().toISOString();
  const marketingChanged =
    typeof updates.marketingOptIn === 'boolean' && updates.marketingOptIn !== member.marketingOptIn;

  const consentHistory = Array.isArray(member.consentHistory) ? [...member.consentHistory] : [];
  if (marketingChanged) {
    consentHistory.push({
      type: 'marketing_email',
      granted: updates.marketingOptIn,
      at: now,
    });
  }

  const stamps = Array.isArray(member.stamps) ? [...member.stamps] : [];
  if ((updates.phone || member.phone) && (updates.birthDate || member.birthDate)) {
    if (!stamps.some((s) => s.code === 'profile_completed')) {
      stamps.push({
        code: 'profile_completed',
        label: 'Profil Complice complet',
        earnedAt: now,
      });
    }
  }

  const nextMembers = [...communityState.members];
  nextMembers[idx] = {
    ...member,
    firstName: (updates.firstName ?? member.firstName).trim(),
    lastName: (updates.lastName ?? member.lastName).trim(),
    phone: (updates.phone ?? member.phone ?? '').trim(),
    birthDate: updates.birthDate ?? member.birthDate ?? '',
    marketingOptIn: typeof updates.marketingOptIn === 'boolean' ? updates.marketingOptIn : member.marketingOptIn,
    consentHistory,
    stamps,
    updatedAt: now,
  };

  saveCommunityState({
    ...communityState,
    members: nextMembers,
  });
  return { ok: true };
}

export function deleteMyAccount(userId) {
  if (!currentSession || currentSession.userId !== userId) return { ok: false };
  try {
    localStorage.removeItem(`${PRIVATE_JOURNAL_PREFIX}${userId}`);
  } catch (_) {}

  saveCommunityState({
    ...communityState,
    members: communityState.members.filter((m) => m.id !== userId),
    contestEntries: communityState.contestEntries.filter((e) => e.userId !== userId),
  });
  saveCurrentSession(null);
  return { ok: true };
}

// ============================================================================
// 10. CONCOURS INSTAGRAM : PARTICIPATION & TIRAGE AU SORT VÉRIFIABLE
// ============================================================================
export function enterActiveContest(userId, contestId) {
  if (!currentSession || currentSession.userId !== userId) {
    return { ok: false, error: 'Veuillez vous connecter à votre compte Complice pour participer.' };
  }
  const member = communityState.members.find((m) => m.id === userId);
  if (!member) return { ok: false, error: 'Profil introuvable.' };
  if (!member.emailVerified) {
    return { ok: false, error: 'Merci de valider d’abord votre adresse e-mail pour confirmer votre participation.' };
  }

  const contest = communityState.contests.find((c) => c.id === contestId);
  if (!contest || !contest.isActive) {
    return { ok: false, error: 'Ce concours n’est pas ouvert actuellement.' };
  }

  const already = communityState.contestEntries.find(
    (e) => e.contestId === contestId && e.userId === userId
  );
  if (already) {
    return { ok: true, alreadyEntered: true, entry: already };
  }

  const now = new Date().toISOString();
  const entry = {
    id: `ce-${generateSecureToken().slice(0, 10)}`,
    contestId,
    userId,
    createdAt: now,
  };

  const idx = communityState.members.findIndex((m) => m.id === userId);
  const nextMembers = [...communityState.members];
  if (idx >= 0) {
    nextMembers[idx] = {
      ...member,
      consentHistory: [
        ...(member.consentHistory || []),
        { type: 'contest_rules', contestId, granted: true, at: now },
      ],
    };
  }

  saveCommunityState({
    ...communityState,
    members: nextMembers,
    contestEntries: [entry, ...communityState.contestEntries],
  });

  return { ok: true, entry };
}

// ============================================================================
// 11. FONCTIONS RÉSERVÉES AUX ADMINISTRATRICES (ÉMILIE & VIRGINIE)
// ============================================================================
function requireAdmin() {
  if (!currentSession || currentSession.role !== 'admin') {
    throw new Error('Accès réservé aux administratrices Émilie et Virginie.');
  }
}

export function adminSaveResource(resource) {
  requireAdmin();
  const now = new Date().toISOString();
  const existingIdx = communityState.resources.findIndex((r) => r.id === resource.id);
  const nextResources = [...communityState.resources];
  if (existingIdx >= 0) {
    nextResources[existingIdx] = { ...nextResources[existingIdx], ...resource };
  } else {
    nextResources.unshift({
      ...resource,
      id: `res-${Date.now()}`,
      isPublished: resource.isPublished ?? true,
      createdAt: now,
    });
  }

  saveCommunityState({
    ...communityState,
    resources: nextResources,
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        adminEmail: currentSession.email,
        adminName: currentSession.firstName,
        action: `Contenu mis à jour : ${resource.title}`,
        at: now,
      },
      ...communityState.auditLogs,
    ],
  });
}

export function adminDeleteResource(resourceId) {
  requireAdmin();
  saveCommunityState({
    ...communityState,
    resources: communityState.resources.filter((r) => r.id !== resourceId),
  });
}

export function adminUpdateContest(contestUpdates) {
  requireAdmin();
  const now = new Date().toISOString();
  const current = communityState.contests[0] || DEFAULT_CONTEST;
  const updated = { ...current, ...contestUpdates };

  saveCommunityState({
    ...communityState,
    contests: [updated],
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        adminEmail: currentSession.email,
        adminName: currentSession.firstName,
        action: `Mise à jour du concours « ${updated.title} » (actif : ${updated.isActive ? 'oui' : 'non'})`,
        at: now,
      },
      ...communityState.auditLogs,
    ],
  });
}

export function adminPerformContestDraw(contestId) {
  requireAdmin();
  const contest = communityState.contests.find((c) => c.id === contestId);
  if (!contest) return { ok: false, error: 'Concours introuvable.' };

  // Participantes éligibles : inscrites au concours ET ayant un compte validé
  const entries = communityState.contestEntries.filter((e) => e.contestId === contestId);
  const eligibleMembers = entries
    .map((e) => communityState.members.find((m) => m.id === e.userId && m.emailVerified))
    .filter(Boolean);

  if (eligibleMembers.length === 0) {
    return { ok: false, error: 'Aucune participante éligible (avec e-mail vérifié) pour ce concours.' };
  }

  const randBuf = new Uint32Array(1);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randBuf);
  } else {
    randBuf[0] = Math.floor(Math.random() * 1000000);
  }
  const winningIndex = randBuf[0] % eligibleMembers.length;
  const winner = eligibleMembers[winningIndex];
  const now = new Date().toISOString();

  const drawRecord = {
    id: `draw-${Date.now()}`,
    at: now,
    adminName: currentSession.firstName,
    adminEmail: currentSession.email,
    eligibleCount: eligibleMembers.length,
    winnerId: winner.id,
    winnerName: `${winner.firstName} ${winner.lastName}`,
    winnerEmail: winner.email,
  };

  const updatedContest = {
    ...contest,
    winnerUserId: winner.id,
    drawHistory: [drawRecord, ...(contest.drawHistory || [])],
  };

  saveCommunityState({
    ...communityState,
    contests: [updatedContest],
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        adminEmail: currentSession.email,
        adminName: currentSession.firstName,
        action: `Tirage au sort du concours : gagnante ${winner.firstName} ${winner.lastName} (${eligibleMembers.length} participantes éligibles)`,
        at: now,
      },
      ...communityState.auditLogs,
    ],
  });

  return { ok: true, drawRecord, winner };
}

export function exportMembersCsv(filteredMembers, contestEntries = []) {
  requireAdmin();
  const headers = [
    'prenom',
    'nom',
    'email',
    'telephone',
    'date_inscription',
    'email_verifie',
    'consentement_marketing',
    'questionnaire_complete',
    'profil_escapade',
    'budget_envisage',
    'destinations_souhaitees',
    'participe_concours',
  ];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const rows = filteredMembers.map((m) => {
    const q = m.escapeQuiz?.answers || {};
    const dests = Array.isArray(q.q6_destinations) ? q.q6_destinations.join(', ') : q.q6_destinations || '';
    const inContest = contestEntries.some((e) => e.userId === m.id);
    return [
      m.firstName,
      m.lastName,
      m.email,
      m.phone || '',
      m.createdAt ? m.createdAt.slice(0, 10) : '',
      m.emailVerified ? 'Oui' : 'Non',
      m.marketingOptIn ? 'Oui' : 'Non',
      m.escapeQuiz ? 'Oui' : 'Non',
      m.escapeQuiz?.primaryProfile || '',
      q.q5_budget || '',
      dests,
      inContest ? 'Oui' : 'Non',
    ];
  });

  return [headers, ...rows].map((r) => r.map(esc).join(';')).join('\n');
}

export async function resendVerificationEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const member = communityState.members.find((m) => m.email.toLowerCase() === cleanEmail);
  if (!member) return { ok: false, error: 'Aucun compte trouvé avec cette adresse e-mail.' };
  if (member.emailVerified) return { ok: true, alreadyVerified: true };

  const token = member.verificationToken || generateSecureToken();
  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const verifyUrl = `${origin}/mon-espace?verify_token=${token}&email=${encodeURIComponent(member.email)}`;

  await sendMemberTransactionalEmail({
    to: member.email,
    firstName: member.firstName,
    subject: 'Activez votre Carnet d’Ailleurs — Complices d’ailleurs',
    heading: `Bienvenue ${member.firstName} dans votre Carnet d’Ailleurs !`,
    bodyHtml: `<p>Voici votre lien sécurisé pour confirmer votre adresse e-mail et activer votre espace personnel <strong>Mon Carnet d’Ailleurs</strong> :</p>`,
    ctaLabel: 'Valider mon adresse e-mail & activer mon Carnet',
    ctaUrl: verifyUrl,
  });

  return { ok: true, verifyUrl };
}

export async function adminChangeOwnPassword(newPassword) {
  requireAdmin();
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' };
  }
  const newHash = await hashPassword(newPassword, currentSession.email);
  const now = new Date().toISOString();
  saveCommunityState({
    ...communityState,
    adminCustomHashes: {
      ...(communityState.adminCustomHashes || {}),
      [currentSession.userId]: newHash,
    },
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        adminEmail: currentSession.email,
        adminName: currentSession.firstName,
        action: 'Modification de son mot de passe administratrice',
        at: now,
      },
      ...communityState.auditLogs,
    ],
  });
  return { ok: true };
}

