import { useSyncExternalStore } from 'react';
import { defaultData } from './defaults.js';

// Démo : persistance dans le navigateur (localStorage).
// Production : remplacer load()/save() par des appels à l'API/back-end (voir docs/DEPLOIEMENT.md).
const KEY = 'cda-data-v1';
let state;
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Mise à jour de l'image de hero si elle était sur l'ancienne image basse résolution
      if (!saved.settings?.heroImage || saved.settings?.heroImage === '/img/arcachon-baie.jpg') {
        saved.settings = { ...saved.settings, heroImage: defaultData.settings.heroImage };
      }
      if (!saved.settings?.heroVideo || saved.settings?.heroVideo === '/videos/hero-arcachon.mp4') {
        saved.settings = { ...saved.settings, heroVideo: defaultData.settings.heroVideo };
      }
      if (!saved.settings?.stripePaymentUrl) {
        saved.settings = { ...saved.settings, stripePaymentUrl: defaultData.settings.stripePaymentUrl };
      }
      if (!saved.settings?.whatsapp) {
        saved.settings = { ...saved.settings, whatsapp: defaultData.settings.whatsapp };
      }
      const have = new Map((saved.experiences || []).map((e) => [e.slug, e]));
      const exps = defaultData.experiences.map((def) => {
        const cur = have.get(def.slug);
        if (!cur) return def;
        const isLegacyArca = def.slug === 'arcachon-entre-femmes' && (!cur.intro?.includes('charge mentale') || cur.included?.[0]?.includes('90 €'));
        const isLegacyArcaMe = def.slug === 'arcachon-mere-enfant' && cur.title === 'Arcachon — Mère & enfant';
        return {
          ...def,
          ...cur,
          title: (isLegacyArca || isLegacyArcaMe) ? def.title : cur.title,
          short: isLegacyArca ? def.short : cur.short,
          location: isLegacyArca ? def.location : cur.location,
          lodging: isLegacyArca ? def.lodging : cur.lodging,
          intro: isLegacyArca ? def.intro : cur.intro,
          included: isLegacyArca ? def.included : cur.included,
          excluded: isLegacyArca ? def.excluded : cur.excluded,
          program: isLegacyArca ? def.program : cur.program,
          gallery: isLegacyArca ? def.gallery : ((cur.gallery && cur.gallery[0]?.src) ? cur.gallery : def.gallery),
          depositPerPlace: (!cur.depositPerPlace || cur.depositPerPlace === 35 || cur.depositPerPlace === 100) ? def.depositPerPlace : cur.depositPerPlace,
          paymentLink: (cur.paymentLink && cur.paymentLink.length > 5) ? cur.paymentLink : def.paymentLink,
          image: cur.image || def.image,
        };
      });
      const faq = (!saved.faq || !saved.faq[0]?.a?.includes('300 €')) ? defaultData.faq : saved.faq;
      return { ...defaultData, ...saved, experiences: exps, faq };
    }
  } catch {
    /* ignore */
  }
  return structuredClone(defaultData);
}

state = load();

export function getState() {
  return state;
}

export function update(fn) {
  state = fn(structuredClone(state));
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function resetData() {
  localStorage.removeItem(KEY);
  state = structuredClone(defaultData);
  listeners.forEach((l) => l());
}

export function useData() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

export const euro = (n) => (n == null ? 'À confirmer' : `${n.toLocaleString('fr-FR')} €`);
