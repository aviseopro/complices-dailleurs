# Guide de déploiement

## 1. Front (immédiat)
`npm run build` → déployer `dist/` sur Netlify, Vercel ou Cloudflare Pages (règle SPA : toutes les routes → `index.html`). Brancher le nom de domaine, HTTPS automatique.

## 2. Passage en production réelle (à faire avant toute vente)
Aujourd’hui les données sont dans `localStorage` (démo). Il faut :
1. **Back-end + base de données** (ex. Supabase/Postgres ou Firebase) pour : expériences, dates, quotas, inscriptions, journal des statuts, FAQ. Remplacer `load()/update()` de `src/data/store.js` par des appels API, et protéger `/admin` par une vraie authentification (2 comptes).
2. **Paiement** : Stripe Checkout (hébergé, aucune donnée de carte chez vous). Créer la session côté serveur, confirmer via **webhook** (statut `paid`), réserver les places de façon atomique (anti-double-réservation côté base : contrainte/transaction). Remboursements via l’API Stripe depuis l’admin.
3. **Alma** : activer uniquement avec contrat marchand et la méthode officielle de votre plateforme/PSP ; n’afficher aucune mensualité tant que l’éligibilité n’est pas calculée par Alma. Puis `almaActive=true`.
4. **Emails transactionnels** (Resend/Brevo/Postmark) : confirmation avec référence, reçus.
5. **Juridique** : compléter `Legal.jsx` (mentions, CGV, annulation, garantie financière/assurance, immatriculation si requise) — validation par un professionnel.
6. **Analytics** : n’injecter le script (ex. Plausible/Matomo) que si `localStorage['cda-consent']==='accepted'`.
7. **SEO** : remplacer l’image Open Graph, compléter `public/sitemap.xml` avec le vrai domaine, ajouter des pages pré-rendues si besoin (ex. migration Next.js/Astro).
8. Passer `demoMode=false` seulement à la fin.

## 3. Recette
Checklist manuelle : navigation (menu mobile inclus), formulaire (erreurs, consentements), quota atteint → message « complet », doublon email refusé, annulation/remboursement libère la place, export CSV, `prefers-reduced-motion`, Lighthouse mobile ≥ 90.
