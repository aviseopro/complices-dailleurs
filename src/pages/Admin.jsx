import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData, update, resetData } from '../data/store.js';
import { setStatus, toCsv, seatsLeft } from '../lib/booking.js';
import {
  buildConfirmationEmailHtml,
  buildGmailComposeUrl,
  sendBookingConfirmationEmail,
  GOOGLE_APPS_SCRIPT_SNIPPET,
  OFFICIAL_EMAIL,
} from '../lib/emailTemplate.js';
import {
  useCommunity,
  ESCAPE_QUIZ_QUESTIONS,
  loginMemberOrAdmin,
  logoutSession,
  adminSaveResource,
  adminDeleteResource,
  adminUpdateContest,
  adminPerformContestDraw,
  exportMembersCsv,
  adminChangeOwnPassword,
  loginAsFounderTestMember,
  loginAsFounderAdmin,
} from '../lib/memberStore.js';

const num = (v) => (v === '' ? null : Number(v));
const lines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);

// Aide pour afficher les libellés lisibles des réponses au questionnaire
function formatQuizAnswer(questionId, rawValue) {
  const q = ESCAPE_QUIZ_QUESTIONS.find((item) => item.id === questionId);
  if (!q || !rawValue) return 'Non renseigné';
  const values = Array.isArray(rawValue) ? rawValue : [rawValue];
  if (values.length === 0) return 'Non renseigné';
  return values
    .map((v) => q.options.find((o) => o.value === v)?.label || v)
    .join(', ');
}

// ============================================================================
// A. TABLEAU DE BORD GÉNÉRAL
// ============================================================================
function OverviewDashboard({ onOpenTab, onSelectMember }) {
  const { members, contests, contestEntries, auditLogs, isSupabaseConfigured } = useCommunity();
  const { bookings } = useData();

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const totalMembers = members.length;
  const last7Days = members.filter((m) => m.createdAt && now - new Date(m.createdAt).getTime() <= 7 * dayMs).length;
  const last30Days = members.filter((m) => m.createdAt && now - new Date(m.createdAt).getTime() <= 30 * dayMs).length;
  const completedQuizzes = members.filter((m) => Boolean(m.escapeQuiz?.primaryProfile)).length;

  const activeContest = contests?.[0];
  const activeContestParticipants = activeContest
    ? contestEntries.filter((e) => e.contestId === activeContest.id).length
    : 0;

  const latestMembers = [...members]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  return (
    <div className="adm-overview">
      <div className="adm-kpi-grid">
        <div className="adm-kpi-card">
          <span className="adm-kpi-label">Utilisatrices inscrites</span>
          <strong className="adm-kpi-value">{totalMembers}</strong>
          <small>Base « Nos Complices »</small>
        </div>

        <div className="adm-kpi-card">
          <span className="adm-kpi-label">Nouvelles (7 derniers jours)</span>
          <strong className="adm-kpi-value">{last7Days}</strong>
          <small>Inscriptions récentes</small>
        </div>

        <div className="adm-kpi-card">
          <span className="adm-kpi-label">Nouvelles (30 derniers jours)</span>
          <strong className="adm-kpi-value">{last30Days}</strong>
          <small>Croissance mensuelle</small>
        </div>

        <div className="adm-kpi-card">
          <span className="adm-kpi-label">Questionnaires d’escapade</span>
          <strong className="adm-kpi-value">{completedQuizzes}</strong>
          <small>Profils ayant terminé le test</small>
        </div>

        <div className="adm-kpi-card">
          <span className="adm-kpi-label">
            Participantes concours {activeContest?.isActive ? '(Actif)' : '(Inactif)'}
          </span>
          <strong className="adm-kpi-value">{activeContestParticipants}</strong>
          <small>{activeContest?.title || 'Concours Instagram'}</small>
        </div>

        <div className="adm-kpi-card">
          <span className="adm-kpi-label">Réservations séjours</span>
          <strong className="adm-kpi-value">{bookings.length}</strong>
          <small>Dossiers enregistrés</small>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: '1.5rem' }}>
        <div className="adm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
            <h3 style={{ margin: 0 }}>Dernières inscriptions « Nos Complices »</h3>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => onOpenTab('members')}>
              Voir tout le répertoire →
            </button>
          </div>

          {latestMembers.length === 0 ? (
            <p className="muted-note" style={{ marginTop: '.8rem' }}>
              Aucune utilisatrice inscrite pour le moment. Dès qu’une visiteuse crée son compte dans « Mon espace Complice », elle apparaît automatiquement ici.
            </p>
          ) : (
            <div className="table-wrap" style={{ marginTop: '.8rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>Complice</th>
                    <th>Inscription</th>
                    <th>Statut</th>
                    <th>Profil d’escapade</th>
                    <th>Fiche</th>
                  </tr>
                </thead>
                <tbody>
                  {latestMembers.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.firstName} {m.lastName}</strong>
                        <br />
                        <small>{m.email}</small>
                      </td>
                      <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('fr-FR') : '—'}</td>
                      <td>
                        <span className={`pill ${m.emailVerified ? 'open' : 'waitlist'}`}>
                          {m.emailVerified ? 'Vérifié' : 'En attente'}
                        </span>
                      </td>
                      <td>{m.escapeQuiz?.primaryProfile || '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            onSelectMember(m.id);
                            onOpenTab('members');
                          }}
                        >
                          Ouvrir →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="adm-card">
          <h3 style={{ margin: 0 }}>Accès rapides &amp; Journal de sécurité</h3>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.8rem' }}>
            <button type="button" className="btn btn-sm btn-terra" onClick={() => onOpenTab('members')}>
              👩 Répertoire « Nos Complices »
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => onOpenTab('resources')}>
              🎁 E-book &amp; Cadeaux membres
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => onOpenTab('contest')}>
              ✨ Concours Instagram &amp; Tirage
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => onOpenTab('bookings')}>
              💳 Réservations séjours
            </button>
          </div>

          <p style={{ fontSize: '.84rem', color: 'var(--muted)', marginTop: '.9rem' }}>
            Base de données Supabase :{' '}
            <strong>
              {isSupabaseConfigured
                ? '✓ Connectée (Supabase Auth + PostgreSQL RLS)'
                : 'Mode local prêt pour branchement Supabase (voir supabase/schema.sql)'}
            </strong>
          </p>

          {auditLogs.length > 0 && (
            <div style={{ marginTop: '.6rem' }}>
              <strong style={{ fontSize: '.85rem' }}>Dernières actions administratrices :</strong>
              <ul style={{ paddingLeft: '1.1rem', fontSize: '.82rem', color: 'var(--muted)', marginTop: '.35rem' }}>
                {auditLogs.slice(0, 5).map((log) => (
                  <li key={log.id}>
                    {new Date(log.at).toLocaleString('fr-FR')} — <strong>{log.adminName}</strong> : {log.action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// B, C, D, E. RÉPERTOIRE « NOS COMPLICES », FILTRES MARKETING, FICHE & EXPORT CSV
// ============================================================================
function MembersDirectory({ selectedMemberId, setSelectedMemberId }) {
  const { members, contestEntries } = useCommunity();
  const { experiences, bookings } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    destination: '', // 'marrakech' | 'arcachon' | 'journees_copines' | 'sejours_nature'
    compagnie: '', // 'seule' | 'amie' | 'groupe_copines' | 'avec_enfant'
    interet: '', // 'soins_relaxation' | 'activites_creatives' | 'yoga_bien_etre'
    budget: '', // 'moins_150' | '150_450' | '450_800' | 'plus_800'
    onlyMarketingOptIn: false,
    onlyQuizCompleted: false,
    onlyContestParticipants: false,
  });

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchText =
          (m.firstName || '').toLowerCase().includes(q) ||
          (m.lastName || '').toLowerCase().includes(q) ||
          (m.email || '').toLowerCase().includes(q) ||
          (m.phone || '').toLowerCase().includes(q);
        if (!matchText) return false;
      }

      if (filters.onlyMarketingOptIn && !m.marketingOptIn) return false;
      if (filters.onlyQuizCompleted && !m.escapeQuiz) return false;
      if (filters.onlyContestParticipants && !contestEntries.some((e) => e.userId === m.id)) return false;

      const ans = m.escapeQuiz?.answers || {};

      if (filters.destination) {
        const dests = Array.isArray(ans.q6_destinations) ? ans.q6_destinations : [ans.q6_destinations].filter(Boolean);
        const matchDest =
          dests.includes(filters.destination) ||
          (filters.destination === 'marrakech' && ans.q1_evasion === 'soleil_marrakech') ||
          (filters.destination === 'arcachon' && ans.q1_evasion === 'ocean') ||
          (filters.destination === 'journees_copines' && ans.q1_evasion === 'journee_copines');
        if (!matchDest) return false;
      }

      if (filters.compagnie && ans.q3_compagnie !== filters.compagnie) return false;

      if (filters.interet) {
        const plaisirs = Array.isArray(ans.q2_plaisir) ? ans.q2_plaisir : [ans.q2_plaisir].filter(Boolean);
        if (!plaisirs.includes(filters.interet)) return false;
      }

      if (filters.budget && ans.q5_budget !== filters.budget) return false;

      return true;
    });
  }, [members, contestEntries, searchQuery, filters]);

  const selectedMember = members.find((m) => m.id === selectedMemberId) || null;

  const handleExportCsv = () => {
    const csvContent = exportMembersCsv(filteredMembers, contestEntries);
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nos-complices-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      destination: '',
      compagnie: '',
      interet: '',
      budget: '',
      onlyMarketingOptIn: false,
      onlyQuizCompleted: false,
      onlyContestParticipants: false,
    });
  };

  return (
    <div>
      {/* D. Recherche et filtres marketing */}
      <div className="adm-card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.6rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Répertoire « Nos Complices » &amp; Filtres marketing</h3>
            <small style={{ color: 'var(--muted)' }}>
              {filteredMembers.length} utilisatrice(s) affichée(s) sur {members.length} inscrite(s)
            </small>
          </div>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-sm btn-ghost" onClick={resetFilters}>
              Réinitialiser les filtres
            </button>
            <button type="button" className="btn btn-sm btn-terra" onClick={handleExportCsv}>
              📥 Exporter la sélection en CSV (RGPD)
            </button>
          </div>
        </div>

        <div className="grid3" style={{ marginTop: '.9rem' }}>
          <label>
            Rechercher (prénom, nom, e-mail)
            <input
              type="search"
              placeholder="Ex. Sophie, sophie@..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>

          <label>
            Destination / Expérience souhaitée
            <select
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            >
              <option value="">Toutes les destinations</option>
              <option value="arcachon">Intérêt pour Arcachon</option>
              <option value="marrakech">Intérêt pour Marrakech</option>
              <option value="journees_copines">Intérêt pour les Journées entre copines</option>
              <option value="sejours_nature">Intérêt pour les Séjours nature</option>
            </select>
          </label>

          <label>
            Façon de voyager
            <select
              value={filters.compagnie}
              onChange={(e) => setFilters({ ...filters, compagnie: e.target.value })}
            >
              <option value="">Toutes</option>
              <option value="seule">Envie de voyager seule</option>
              <option value="amie">Avec une amie</option>
              <option value="groupe_copines">Avec un groupe de copines</option>
              <option value="avec_enfant">Envie de venir avec son enfant</option>
            </select>
          </label>

          <label>
            Centre d’intérêt principal
            <select
              value={filters.interet}
              onChange={(e) => setFilters({ ...filters, interet: e.target.value })}
            >
              <option value="">Tous les intérêts</option>
              <option value="soins_relaxation">Intérêt pour les soins &amp; relaxation</option>
              <option value="activites_creatives">Intérêt pour les ateliers créatifs</option>
              <option value="yoga_bien_etre">Intérêt pour le yoga &amp; bien-être</option>
              <option value="rencontres_echanges">Rencontres &amp; échanges</option>
            </select>
          </label>

          <label>
            Budget envisagé
            <select
              value={filters.budget}
              onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
            >
              <option value="">Tous les budgets</option>
              <option value="moins_150">Moins de 150 €</option>
              <option value="150_450">Entre 150 et 450 €</option>
              <option value="450_800">Entre 450 et 800 €</option>
              <option value="plus_800">Plus de 800 €</option>
            </select>
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '.35rem', paddingTop: '.4rem' }}>
            <label className="check">
              <input
                type="checkbox"
                checked={filters.onlyMarketingOptIn}
                onChange={(e) => setFilters({ ...filters, onlyMarketingOptIn: e.target.checked })}
              />
              Consentement e-mail marketing valide uniquement
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={filters.onlyQuizCompleted}
                onChange={(e) => setFilters({ ...filters, onlyQuizCompleted: e.target.checked })}
              />
              Questionnaire d’escapade complété
            </label>
          </div>
        </div>
      </div>

      {/* C. Fiche individuelle d'une Complice lorsqu'on clique dessus */}
      {selectedMember && (
        <div className="adm-card adm-member-detail" style={{ borderLeft: '4px solid var(--terra)', marginBottom: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.5rem' }}>
            <div>
              <span className="eyebrow">Fiche individuelle d’une Complice</span>
              <h3 style={{ margin: '.2rem 0' }}>
                {selectedMember.firstName} {selectedMember.lastName}
              </h3>
              <p style={{ margin: 0, fontSize: '.9rem', color: 'var(--muted)' }}>
                📧 <a href={`mailto:${selectedMember.email}`}>{selectedMember.email}</a>
                {selectedMember.phone && <> · 📞 <strong>{selectedMember.phone}</strong></>}
                {selectedMember.birthDate && <> · 🎂 Date de naissance : {selectedMember.birthDate}</>}
              </p>
            </div>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSelectedMemberId(null)}>
              ✕ Fermer la fiche
            </button>
          </div>

          <div className="grid2" style={{ marginTop: '1rem' }}>
            <div>
              <h4>🧭 Réponses au questionnaire « Mes envies d’ailleurs »</h4>
              {selectedMember.escapeQuiz ? (
                <ul className="adm-detail-list">
                  <li>
                    <strong>Résultat principal :</strong>{' '}
                    <span className="pill open">{selectedMember.escapeQuiz.primaryProfile}</span>
                  </li>
                  <li>
                    <strong>1. Évasion idéale demain :</strong>{' '}
                    {formatQuizAnswer('q1_evasion', selectedMember.escapeQuiz.answers?.q1_evasion)}
                  </li>
                  <li>
                    <strong>2. Ce qu’elle aime le plus :</strong>{' '}
                    {formatQuizAnswer('q2_plaisir', selectedMember.escapeQuiz.answers?.q2_plaisir)}
                  </li>
                  <li>
                    <strong>3. Préférence de voyage :</strong>{' '}
                    {formatQuizAnswer('q3_compagnie', selectedMember.escapeQuiz.answers?.q3_compagnie)}
                  </li>
                  <li>
                    <strong>4. Besoin actuel :</strong>{' '}
                    {formatQuizAnswer('q4_besoin', selectedMember.escapeQuiz.answers?.q4_besoin)}
                  </li>
                  <li>
                    <strong>5. Budget envisagé :</strong>{' '}
                    {formatQuizAnswer('q5_budget', selectedMember.escapeQuiz.answers?.q5_budget)}
                  </li>
                  <li>
                    <strong>6. Destinations souhaitées :</strong>{' '}
                    {formatQuizAnswer('q6_destinations', selectedMember.escapeQuiz.answers?.q6_destinations)}
                  </li>
                </ul>
              ) : (
                <p className="muted-note">Cette utilisatrice n’a pas encore complété le questionnaire d’escapade.</p>
              )}
            </div>

            <div>
              <h4>♥ Favoris, Concours, Réservations &amp; RGPD</h4>
              <ul className="adm-detail-list">
                <li>
                  <strong>Statut du compte :</strong>{' '}
                  {selectedMember.emailVerified ? '✓ Adresse e-mail vérifiée' : '⏳ En attente de validation e-mail'}
                </li>
                <li>
                  <strong>Consentement e-mail marketing (RGPD) :</strong>{' '}
                  {selectedMember.marketingOptIn ? '✓ Oui (Opt-in actif)' : 'Non'}
                </li>
                <li>
                  <strong>Escapades sauvegardées en favoris :</strong>{' '}
                  {(selectedMember.favorites || []).length > 0
                    ? selectedMember.favorites
                        .map((slug) => experiences.find((e) => e.slug === slug)?.title || slug)
                        .join(', ')
                    : 'Aucun favori enregistré'}
                </li>
                <li>
                  <strong>Participation aux concours :</strong>{' '}
                  {contestEntries.some((e) => e.userId === selectedMember.id)
                    ? '✓ Oui (inscrite au concours)'
                    : 'Non'}
                </li>
                <li>
                  <strong>Réservations de séjours associées :</strong>{' '}
                  {(() => {
                    const memberBookings = bookings.filter(
                      (b) => b.email && b.email.toLowerCase() === selectedMember.email.toLowerCase()
                    );
                    if (memberBookings.length === 0) return 'Aucune réservation enregistrée';
                    return memberBookings.map((b) => `${b.reference} (${b.status})`).join(', ');
                  })()}
                </li>
                <li>
                  <strong>Tampons Passeport Complices :</strong>{' '}
                  {(selectedMember.stamps || []).map((s) => s.label).join(' · ') || '—'}
                </li>
              </ul>

              <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '.6rem' }}>
                🔒 Conformément à votre charte de confidentialité, le carnet bien-être personnel (« Mes rituels pour moi ») demeure strictement privé pour l’utilisatrice.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* B. Tableau récapitulatif « Nos Complices » */}
      {filteredMembers.length === 0 ? (
        <div className="adm-card">
          <p style={{ margin: 0 }}>Aucune utilisatrice ne correspond aux critères sélectionnés.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Prénom &amp; Nom</th>
                <th>E-mail &amp; Téléphone</th>
                <th>Date d’inscription</th>
                <th>Statut compte</th>
                <th>Marketing</th>
                <th>Questionnaire</th>
                <th>Résultat principal</th>
                <th>Concours</th>
                <th>Fiche</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => {
                const inContest = contestEntries.some((e) => e.userId === m.id);
                return (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.firstName} {m.lastName}</strong>
                    </td>
                    <td>
                      <a href={`mailto:${m.email}`}>{m.email}</a>
                      {m.phone && (
                        <>
                          <br />
                          <small>📞 {m.phone}</small>
                        </>
                      )}
                    </td>
                    <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('fr-FR') : '—'}</td>
                    <td>
                      <span className={`pill ${m.emailVerified ? 'open' : 'waitlist'}`}>
                        {m.emailVerified ? 'Vérifié' : 'Non vérifié'}
                      </span>
                    </td>
                    <td>{m.marketingOptIn ? '✓ Oui' : 'Non'}</td>
                    <td>{m.escapeQuiz ? '✓ Oui' : 'Non'}</td>
                    <td>{m.escapeQuiz?.primaryProfile || '—'}</td>
                    <td>{inContest ? '✓ Oui' : 'Non'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-terra"
                        onClick={() => setSelectedMemberId(m.id)}
                      >
                        Voir la fiche
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// F. GESTION DES CONTENUS (E-BOOKS, CADEAUX MEMBRES, ASTUCES ÉMILIE & YOGA VIRGINIE)
// ============================================================================
function MemberResourcesManager() {
  const { resources } = useCommunity();
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const startNew = (category = 'ebook') => {
    setEditing({
      id: '',
      category,
      title: '',
      subtitle: '',
      author: category === 'beaute' ? 'Émilie' : category === 'yoga' ? 'Virginie' : 'Émilie & Virginie',
      badge:
        category === 'ebook'
          ? 'E-book offert · Édition Membre'
          : category === 'beaute'
          ? 'Astuce Beauté · Émilie'
          : category === 'yoga'
          ? 'Pause Yoga · Virginie'
          : 'Fiche Pratique',
      description: '',
      contentBody: '',
      fileUrl: '',
      isPublished: true,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    adminSaveResource(editing);
    setEditing(null);
    setNotice('✓ Contenu enregistré et mis à jour dans l’espace membre.');
    setTimeout(() => setNotice(''), 3500);
  };

  return (
    <div>
      <div className="adm-card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.6rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Bibliothèque « Mes cadeaux Complices » &amp; Conseils</h3>
            <small style={{ color: 'var(--muted)' }}>
              Ajoutez ou modifiez vos e-books (dont « L’art de s’accorder une parenthèse »), fiches pratiques, astuces beauté d’Émilie et pauses yoga de Virginie sans toucher au code.
            </small>
          </div>
          <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-sm btn-terra" onClick={() => startNew('ebook')}>
              + Nouvel e-book / PDF
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => startNew('fiche')}>
              + Fiche pratique
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => startNew('beaute')}>
              + Astuce beauté d’Émilie
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => startNew('yoga')}>
              + Pause yoga de Virginie
            </button>
          </div>
        </div>
        {notice && <p style={{ color: '#1d5e3a', fontWeight: 600, marginTop: '.6rem', marginBottom: 0 }}>{notice}</p>}
      </div>

      {editing && (
        <form className="adm-card form" onSubmit={handleSave} style={{ borderLeft: '4px solid var(--terra)', marginBottom: '1.4rem' }}>
          <h3>{editing.id ? `Modifier : ${editing.title}` : 'Ajouter un nouveau contenu membre'}</h3>
          <div className="grid2">
            <label>
              Catégorie
              <select
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                <option value="ebook">E-book offert</option>
                <option value="fiche">Fiche pratique / Guide</option>
                <option value="beaute">Astuce beauté d’Émilie</option>
                <option value="yoga">Pause yoga &amp; respiration de Virginie</option>
              </select>
            </label>
            <label>
              Auteure(s)
              <input
                value={editing.author}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
              />
            </label>
            <label>
              Titre *
              <input
                required
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </label>
            <label>
              Sous-titre / Étiquette
              <input
                value={editing.subtitle || ''}
                onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
              />
            </label>
          </div>

          <label>
            Présentation courte
            <textarea
              rows="2"
              value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </label>

          <label>
            Contenu détaillé / Sommaire lisible directement dans le Carnet
            <textarea
              rows="5"
              value={editing.contentBody || ''}
              onChange={(e) => setEditing({ ...editing, contentBody: e.target.value })}
            />
          </label>

          <label>
            Lien du fichier PDF à télécharger (ex. /docs/l-art-de-s-accorder-une-parenthese.pdf ou lien Drive/Supabase Storage)
            <input
              type="text"
              placeholder="Laissez vide tant que le PDF est en cours de finalisation"
              value={editing.fileUrl || ''}
              onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
            />
          </label>

          <label className="check">
            <input
              type="checkbox"
              checked={editing.isPublished !== false}
              onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
            />
            Contenu actif et visible dans l’espace membre
          </label>

          <div style={{ display: 'flex', gap: '.6rem' }}>
            <button type="submit" className="btn btn-terra">
              Enregistrer le contenu
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="grid2">
        {resources.map((res) => (
          <div key={res.id} className="adm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`pill ${res.isPublished !== false ? 'open' : 'waitlist'}`}>
                {res.isPublished !== false ? 'Publié' : 'Masqué'} · {res.category.toUpperCase()}
              </span>
              <small>{res.author}</small>
            </div>
            <h4 style={{ margin: '.4rem 0 .2rem' }}>{res.title}</h4>
            <p style={{ fontSize: '.88rem', color: 'var(--muted)', margin: '.2rem 0 .6rem' }}>{res.description}</p>
            {res.fileUrl ? (
              <p style={{ fontSize: '.8rem', margin: '.2rem 0' }}>
                📎 PDF configuré : <code>{res.fileUrl}</code>
              </p>
            ) : (
              res.category === 'ebook' && (
                <p style={{ fontSize: '.8rem', color: 'var(--terra)', margin: '.2rem 0' }}>
                  📌 Emplacement prêt : cliquez sur « Modifier » pour ajouter le lien PDF dès que votre e-book est prêt.
                </p>
              )
            )}
            <div style={{ display: 'flex', gap: '.45rem', marginTop: '.6rem' }}>
              <button type="button" className="btn btn-sm btn-terra" onClick={() => setEditing(res)}>
                Modifier
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => adminSaveResource({ ...res, isPublished: res.isPublished === false })}
              >
                {res.isPublished === false ? 'Activer' : 'Désactiver'}
              </button>
              {res.id !== 'res-ebook-parenthese' && (
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => window.confirm('Supprimer ce contenu ?') && adminDeleteResource(res.id)}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// G. MODULE CONCOURS INSTAGRAM & TIRAGE AU SORT VÉRIFIABLE
// ============================================================================
function ContestManager() {
  const { contests, contestEntries, members } = useCommunity();
  const currentContest = contests?.[0];
  const [form, setForm] = useState(() => ({
    ...currentContest,
  }));
  const [saveMsg, setSaveMsg] = useState('');
  const [drawFeedback, setDrawFeedback] = useState(null);

  const entriesForContest = contestEntries.filter((e) => e.contestId === currentContest?.id);
  const participantRows = entriesForContest.map((entry) => {
    const member = members.find((m) => m.id === entry.userId);
    return {
      entryId: entry.id,
      enteredAt: entry.createdAt,
      member,
    };
  });
  const eligibleCount = participantRows.filter((r) => r.member?.emailVerified).length;

  const handleSaveContest = (e) => {
    e.preventDefault();
    adminUpdateContest(form);
    setSaveMsg('✓ Paramètres du concours enregistrés.');
    setTimeout(() => setSaveMsg(''), 3500);
  };

  const handleDrawWinner = () => {
    if (!window.confirm(`Lancer le tirage au sort officiel parmi les ${eligibleCount} participante(s) éligible(s) ?`)) {
      return;
    }
    const res = adminPerformContestDraw(currentContest.id);
    if (!res.ok) {
      setDrawFeedback({ type: 'error', text: res.error });
    } else {
      setDrawFeedback({
        type: 'success',
        text: `🎉 Gagnante tirée au sort : ${res.drawRecord.winnerName} (${res.drawRecord.winnerEmail}) parmi ${res.drawRecord.eligibleCount} participante(s) éligible(s).`,
      });
    }
  };

  const contestUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://complices-dailleurs.vercel.app'}/concours`;

  return (
    <div>
      <div className="adm-card" style={{ borderLeft: '4px solid var(--terra)', marginBottom: '1.2rem' }}>
        <strong>📲 Lien de la page dédiée « Concours Complices d’ailleurs » (pour votre bio Instagram) :</strong>
        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '.4rem' }}>
          <code style={{ background: 'var(--cream)', padding: '.4rem .75rem', borderRadius: '8px' }}>{contestUrl}</code>
          <Link to="/concours" className="btn btn-sm btn-ghost">
            Voir la page publique du concours →
          </Link>
        </div>
        <small style={{ color: 'var(--muted)', display: 'block', marginTop: '.35rem' }}>
          Statut actuel :{' '}
          <strong>
            {currentContest?.isActive
              ? '🟢 Concours ACTIF (les inscriptions sont ouvertes)'
              : '⏸️ Concours DÉSACTIVÉ par défaut (en attente de validation des dates et du règlement)'}
          </strong>
        </small>
      </div>

      <div className="grid2">
        <form className="adm-card form" onSubmit={handleSaveContest}>
          <h3>Paramétrer le Concours Instagram</h3>
          <label className="check" style={{ background: 'var(--cream)', padding: '.6rem .8rem', borderRadius: '10px' }}>
            <input
              type="checkbox"
              checked={Boolean(form.isActive)}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <strong>Activer et ouvrir officiellement le concours au public</strong>
          </label>

          <label>
            Titre du concours
            <input
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label>
            Lot mis en jeu &amp; cadeau offert
            <textarea
              rows="2"
              value={form.prize || ''}
              onChange={(e) => setForm({ ...form, prize: e.target.value })}
            />
          </label>

          <div className="grid2">
            <label>
              Date de début
              <input
                type="date"
                value={form.startDate || ''}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </label>
            <label>
              Date de fin
              <input
                type="date"
                value={form.endDate || ''}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </label>
          </div>

          <label>
            Règlement officiel du concours
            <textarea
              rows="4"
              value={form.rulesText || ''}
              onChange={(e) => setForm({ ...form, rulesText: e.target.value })}
            />
          </label>

          <button type="submit" className="btn btn-terra">
            Enregistrer les paramètres du concours
          </button>
          {saveMsg && <small style={{ color: '#1d5e3a', fontWeight: 600 }}>{saveMsg}</small>}
        </form>

        <div className="adm-card">
          <h3>Tirage au sort aléatoire &amp; vérifiable</h3>
          <p style={{ fontSize: '.9rem', color: 'var(--muted)' }}>
            Seules les participantes ayant un compte unique et une adresse e-mail vérifiée sont retenues pour le tirage au sort.
          </p>

          <div className="adm-kpi-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
            <div className="adm-kpi-card">
              <span className="adm-kpi-label">Participations totales</span>
              <strong className="adm-kpi-value">{participantRows.length}</strong>
            </div>
            <div className="adm-kpi-card">
              <span className="adm-kpi-label">Participantes éligibles (e-mail vérifié)</span>
              <strong className="adm-kpi-value">{eligibleCount}</strong>
            </div>
          </div>

          {drawFeedback && (
            <div className={`carnet-alert ${drawFeedback.type === 'error' ? 'carnet-alert-error' : 'carnet-alert-success'}`} style={{ marginBottom: '1rem' }}>
              {drawFeedback.text}
            </div>
          )}

          <button
            type="button"
            className="btn btn-terra"
            disabled={eligibleCount === 0}
            onClick={handleDrawWinner}
          >
            🎲 Lancer un tirage au sort aléatoire officiel
          </button>

          {(currentContest?.drawHistory || []).length > 0 && (
            <div style={{ marginTop: '1.2rem' }}>
              <h4>Historique horodaté des tirages au sort :</h4>
              <ul className="adm-detail-list">
                {currentContest.drawHistory.map((d) => (
                  <li key={d.id}>
                    <strong>{new Date(d.at).toLocaleString('fr-FR')}</strong> — Gagnante :{' '}
                    <span className="pill open">{d.winnerName} ({d.winnerEmail})</span> · Tirée au sort par{' '}
                    <strong>{d.adminName}</strong> parmi {d.eligibleCount} participante(s) éligible(s).
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h4 style={{ marginTop: '1.4rem' }}>Liste des participantes inscrites :</h4>
          {participantRows.length === 0 ? (
            <p className="muted-note">Aucune participante inscrite pour le moment.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Participante</th>
                    <th>Date</th>
                    <th>E-mail vérifié</th>
                    <th>Questionnaire</th>
                  </tr>
                </thead>
                <tbody>
                  {participantRows.map((row) => (
                    <tr key={row.entryId}>
                      <td>
                        <strong>{row.member ? `${row.member.firstName} ${row.member.lastName}` : 'Compte supprimé'}</strong>
                        <br />
                        <small>{row.member?.email}</small>
                      </td>
                      <td>{new Date(row.enteredAt).toLocaleDateString('fr-FR')}</td>
                      <td>{row.member?.emailVerified ? '✓ Éligible' : '⏳ Non vérifié'}</td>
                      <td>{row.member?.escapeQuiz ? '✓ Complété' : 'Non'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ONGLETS EXISTANTS CONSERVÉS À 100 % : RÉSERVATIONS, EXPÉRIENCES, FAQ, RÉGLAGES
// ============================================================================
function Bookings() {
  const { bookings, experiences, settings } = useData();
  const [copied, setCopied] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState('');
  const directUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://complices-dailleurs.vercel.app'}/paiement`;
  const setSetting = (k, v) => update((s) => { s.settings[k] = v; return s; });

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SNIPPET);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    } catch (_) {}
  };

  const testSendMail = async () => {
    setTestEmailStatus('Envoi du mail de test en cours…');
    const res = await sendBookingConfirmationEmail({
      booking: {
        reference: 'CDA-TEST01',
        name: 'Émilie & Virginie (Test)',
        email: OFFICIAL_EMAIL,
        phone: '06 29 84 96 53',
        places: 1,
        amount: 450,
        paymentMethod: 'full_450',
      },
      experience: experiences[0],
      settings,
    });
    if (res.sent) {
      setTestEmailStatus(`✓ Mail HTML envoyé avec succès (${res.provider}) vers ${OFFICIAL_EMAIL} !`);
    } else {
      setTestEmailStatus('⚠️ Renseignez ci-dessous le Mot de passe d’application Gmail ou l’URL Google Script pour activer l’envoi automatique.');
    }
  };

  const csv = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + toCsv(bookings)], { type: 'text/csv;charset=utf-8' }));
    a.download = 'inscriptions.csv';
    a.click();
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(directUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };
  const openEmailPreview = (b) => {
    const exp = experiences.find((e) => e.slug === b.exp) || experiences[0];
    const html = buildConfirmationEmailHtml({ booking: b, experience: exp, origin: window.location.origin });
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };
  const act = (ref, status, note) => update((s) => { s.bookings = setStatus(s.bookings, ref, status, note); return s; });
  return (
    <>
      <div className="adm-card" style={{ borderLeft: '4px solid var(--terra)', marginBottom: '1.2rem' }}>
        <strong>🔗 Lien direct d’inscription &amp; paiement (participantes confirmées) :</strong>
        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <code style={{ background: 'var(--cream)', padding: '.4rem .75rem', borderRadius: '8px', fontSize: '.9rem' }}>{directUrl}</code>
          <button type="button" className="btn btn-sm btn-terra" onClick={copyLink}>
            {copied ? '✓ Lien copié !' : 'Copier le lien à envoyer'}
          </button>
          <Link to="/paiement" className="btn btn-sm btn-ghost">Voir la page participante →</Link>
        </div>
        <small style={{ color: 'var(--muted)' }}>
          Email officiel configuré : <strong>{OFFICIAL_EMAIL}</strong> — 2 encarts proposés : <strong>1. Je paye en une fois (450 €) par Carte bancaire (sans Klarna)</strong> et <strong>2. Je paye en 3 fois sans frais avec Klarna (3 × 150 €)</strong>.
        </small>
      </div>

      <div className="adm-card" style={{ borderLeft: '4px solid #1d5e3a', marginBottom: '1.2rem' }}>
        <strong>📧 Connexion de la boîte Gmail ({OFFICIAL_EMAIL}) pour l’envoi automatique aux clientes :</strong>
        <p style={{ margin: '.25rem 0 .6rem', fontSize: '.86rem', color: 'var(--muted)' }}>
          Pour que Gmail autorise l’envoi automatique du beau mail HTML (avec votre photo et logo) directement dans la boîte de chaque cliente dès qu’elle valide son inscription, renseignez <strong>l’une des deux options</strong> ci-dessous :
        </p>
        <div className="grid2">
          <label>
            Option A — Mot de passe d’application Gmail (16 lettres du compte {OFFICIAL_EMAIL})
            <input
              type="password"
              placeholder="xxxx xxxx xxxx xxxx"
              value={settings.gmailAppPassword || ''}
              onChange={(ev) => setSetting('gmailAppPassword', ev.target.value)}
            />
          </label>
          <label>
            Option B — URL Google Apps Script (gratuit, sans mot de passe sur script.google.com)
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={settings.googleScriptUrl || ''}
              onChange={(ev) => setSetting('googleScriptUrl', ev.target.value)}
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '.4rem' }}>
          <button type="button" className="btn btn-sm btn-ghost" onClick={copyScript}>
            {copiedScript ? '✓ Code Google Script copié !' : 'Copier le code Google Script (10 lignes)'}
          </button>
          <button type="button" className="btn btn-sm btn-terra" onClick={testSendMail}>
            Tester l’envoi d’un mail maintenant
          </button>
          {testEmailStatus && <small style={{ fontWeight: 600 }}>{testEmailStatus}</small>}
        </div>
      </div>
      <p><button className="btn btn-sm btn-terra" onClick={csv}>Exporter en CSV</button></p>
      {bookings.length === 0 && <p>Aucune inscription pour le moment.</p>}
      <div className="table-wrap"><table>
        <thead><tr><th>Réf.</th><th>Séjour</th><th>Participante (Email &amp; Tél.)</th><th>Places</th><th>Règlement</th><th>Envies / Options</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>{bookings.map((b) => (
          <tr key={b.reference}>
            <td><strong>{b.reference}</strong></td>
            <td>{experiences.find((e) => e.slug === b.exp)?.title}</td>
            <td>
              <strong>{b.name}</strong><br />
              <small>📧 {b.email}</small><br />
              {b.phone && <small>📞 <strong>{b.phone}</strong></small>}
            </td>
            <td>{b.places}</td>
            <td>
              {b.paymentMethod === 'klarna' || b.paymentMethod === 'alma' ? (
                <span className="pill waitlist" style={{ fontSize: '.72rem' }}>🩷 Klarna (3 fois sans frais)</span>
              ) : (
                <span className="pill soon" style={{ fontSize: '.72rem' }}>💳 Payé en 1 fois ({b.amount || 450} € CB)</span>
              )}
            </td>
            <td>
              {b.options ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                  {b.options.hammam && <span className="pill soon" style={{ fontSize: '.7rem', padding: '.12rem .45rem' }}>🌿 Hammam (~45€)</span>}
                  {b.options.soireeFestive && <span className="pill open" style={{ fontSize: '.7rem', padding: '.12rem .45rem' }}>✨ Soirée festive</span>}
                  {b.options.agafay && <span className="pill waitlist" style={{ fontSize: '.7rem', padding: '.12rem .45rem' }}>🐪 Agafay</span>}
                  {!b.options.hammam && !b.options.soireeFestive && !b.options.agafay && <small style={{ color: 'var(--muted)' }}>Standard (inclusions seules)</small>}
                </div>
              ) : '—'}
            </td>
            <td>{b.status}<details><summary>journal</summary>{b.log.map((l, i) => <div key={i}><small>{l.at.slice(0, 16)} · {l.status} {l.note}</small></div>)}</details></td>
            <td>
              <button onClick={() => openEmailPreview(b)}>Voir le mail (Photo &amp; Logo)</button>{' '}
              <a
                href={buildGmailComposeUrl({ booking: b, experience: experiences.find((e) => e.slug === b.exp) || experiences[0] })}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '.82rem', textDecoration: 'underline', marginRight: '.35rem' }}
              >
                Envoyer via Gmail
              </a>{' '}
              <button onClick={() => act(b.reference, 'paid', 'Marqué payé')}>Payé</button>{' '}
              <button onClick={() => act(b.reference, 'cancelled', 'Annulé')}>Annuler</button>{' '}
              <button onClick={() => confirm('Marquer comme remboursé ? (le remboursement réel se fait chez le prestataire de paiement)') && act(b.reference, 'refunded', 'Remboursement')}>Rembourser</button>
            </td>
          </tr>))}</tbody>
      </table></div>
    </>
  );
}

function Experiences() {
  const { experiences, bookings } = useData();
  const edit = (slug, fn) => update((s) => { fn(s.experiences.find((e) => e.slug === slug)); return s; });
  return experiences.map((e) => (
    <details key={e.slug} className="adm-card">
      <summary><strong>{e.title}</strong> — {e.status}</summary>
      <div className="grid2">
        <label>Statut<select value={e.status} onChange={(ev) => edit(e.slug, (x) => (x.status = ev.target.value))}><option value="open">Ouverte</option><option value="waitlist">Liste d’attente</option><option value="soon">Bientôt</option></select></label>
        <label>Titre<input value={e.title} onChange={(ev) => edit(e.slug, (x) => (x.title = ev.target.value))} /></label>
        <label>Tarif / personne (€)<input type="number" value={e.pricePerPerson ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.pricePerPerson = num(ev.target.value)))} /></label>
        {e.kind === 'preorder' && <label>Pré-réservation / place (€)<input type="number" value={e.depositPerPlace ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.depositPerPlace = num(ev.target.value)))} /></label>}
        <label>1. Lien Stripe — Je paye en une fois (450 €) par Carte bancaire (sans Klarna)<input value={e.fullPaymentLink || e.paymentLink || ''} placeholder="https://buy.stripe.com/..." onChange={(ev) => edit(e.slug, (x) => { x.fullPaymentLink = ev.target.value; x.paymentLink = ev.target.value; })} /></label>
        <label>2. Lien Stripe — Je paye en 3 fois sans frais avec Klarna (3 × 150 €)<input value={e.almaPaymentLink || ''} placeholder="https://buy.stripe.com/..." onChange={(ev) => edit(e.slug, (x) => (x.almaPaymentLink = ev.target.value))} /></label>
        <label>Capacité globale (vide = non communiquée)<input type="number" value={e.capacity ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.capacity = num(ev.target.value)))} /></label>
        <label>Participantes minimum pour maintenir le séjour<input type="number" value={e.minParticipants ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.minParticipants = num(ev.target.value)))} /></label>
        <label>Durée<input value={e.duration || ''} onChange={(ev) => edit(e.slug, (x) => (x.duration = ev.target.value))} /></label>
        <label>Hébergement<input value={e.lodging || ''} onChange={(ev) => edit(e.slug, (x) => (x.lodging = ev.target.value || null))} /></label>
        <label>Lieu<input value={e.location || ''} onChange={(ev) => edit(e.slug, (x) => (x.location = ev.target.value))} /></label>
      </div>
      <label>Présentation<textarea rows="3" value={e.intro || ''} onChange={(ev) => edit(e.slug, (x) => (x.intro = ev.target.value))} /></label>
      <div className="grid2">
        <label>Inclus (1 par ligne)<textarea rows="5" defaultValue={e.included.join('\n')} onBlur={(ev) => edit(e.slug, (x) => (x.included = lines(ev.target.value)))} /></label>
        <label>Non inclus (1 par ligne)<textarea rows="5" defaultValue={e.excluded.join('\n')} onBlur={(ev) => edit(e.slug, (x) => (x.excluded = lines(ev.target.value)))} /></label>
      </div>
      <h4>Programme jour par jour</h4>
      {e.program.map((d, i) => (
        <div key={i} className="grid2">
          <label>Jour / titre<input value={`${d.day} | ${d.title}`} onChange={(ev) => edit(e.slug, (x) => { const [a, ...b] = ev.target.value.split('|'); x.program[i].day = a.trim(); x.program[i].title = b.join('|').trim(); })} /></label>
          <label>Activités (1 par ligne)<textarea rows="3" defaultValue={d.items.join('\n')} onBlur={(ev) => edit(e.slug, (x) => (x.program[i].items = lines(ev.target.value)))} /></label>
        </div>
      ))}
      <button onClick={() => edit(e.slug, (x) => x.program.push({ day: `Jour ${x.program.length + 1}`, title: 'Titre', items: [] }))}>+ Ajouter un jour</button>
      {e.conditions && Object.keys(e.conditions).length > 0 && <>
        <h4>Conditions (vide = « à confirmer »)</h4>
        {Object.keys(e.conditions).map((k) => <label key={k}>{k}<input value={e.conditions[k] ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.conditions[k] = ev.target.value || null))} /></label>)}
      </>}
      <h4>Dates &amp; quotas</h4>
      {e.dates.map((d, i) => (
        <div key={d.id} className="grid2">
          <label>Libellé<input value={d.label} onChange={(ev) => edit(e.slug, (x) => (x.dates[i].label = ev.target.value))} /></label>
          <label>Capacité (restantes : {seatsLeft(e, bookings, d.id) ?? '—'})<input type="number" value={d.capacity ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.dates[i].capacity = num(ev.target.value)))} /></label>
          <button onClick={() => edit(e.slug, (x) => x.dates.splice(i, 1))}>Supprimer la date</button>
        </div>
      ))}
      <button onClick={() => edit(e.slug, (x) => x.dates.push({ id: `d${Date.now()}`, label: 'Nouvelle date', capacity: null }))}>+ Ajouter une date</button>
    </details>
  ));
}

function Faq() {
  const { faq, testimonials } = useData();
  return (
    <>
      <h3>FAQ</h3>
      {faq.map((f, i) => (
        <div key={i} className="adm-card">
          <input value={f.q} onChange={(ev) => update((s) => { s.faq[i].q = ev.target.value; return s; })} aria-label="Question" />
          <textarea rows="2" value={f.a} onChange={(ev) => update((s) => { s.faq[i].a = ev.target.value; return s; })} aria-label="Réponse" />
          <button onClick={() => update((s) => { s.faq.splice(i, 1); return s; })}>Supprimer</button>
        </div>
      ))}
      <button onClick={() => update((s) => { s.faq.push({ q: 'Nouvelle question', a: 'Réponse' }); return s; })}>+ Question</button>
      <h3>Témoignages (authentiques uniquement)</h3>
      {testimonials.map((t, i) => (
        <div key={i} className="adm-card">
          <textarea rows="2" value={t.text} onChange={(ev) => update((s) => { s.testimonials[i].text = ev.target.value; return s; })} />
          <input value={t.author} onChange={(ev) => update((s) => { s.testimonials[i].author = ev.target.value; return s; })} />
          <button onClick={() => update((s) => { s.testimonials.splice(i, 1); return s; })}>Supprimer</button>
        </div>
      ))}
      <button onClick={() => update((s) => { s.testimonials.push({ text: '', author: '' }); return s; })}>+ Témoignage</button>
    </>
  );
}

function Settings() {
  const { settings } = useData();
  const { session } = useCommunity();
  const [newAdminPass, setNewAdminPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const set = (k, v) => update((s) => { s.settings[k] = v; return s; });
  const T = ({ k, label }) => <label className="check"><input type="checkbox" checked={settings[k]} onChange={(e) => set(k, e.target.checked)} /> {label}</label>;
  const I = ({ k, label, type = 'text' }) => <label>{label}<input type={type} value={settings[k]} onChange={(e) => set(k, e.target.value)} /></label>;

  const handlePassUpdate = async (e) => {
    e.preventDefault();
    const res = await adminChangeOwnPassword(newAdminPass);
    if (res.ok) {
      setNewAdminPass('');
      setPassMsg('✓ Votre mot de passe personnel administratrice a bien été mis à jour.');
    } else {
      setPassMsg(res.error);
    }
  };

  return (
    <>
      <div className="adm-card" style={{ borderLeft: '4px solid var(--terra)', marginBottom: '1.2rem' }}>
        <h3>🔐 Mon compte administratrice nominatif ({session?.firstName})</h3>
        <p style={{ fontSize: '.88rem', color: 'var(--muted)' }}>
          Connectée en tant que <strong>{session?.firstName}</strong> ({session?.email}). Émilie et Virginie disposent chacune de leur propre identifiant nominatif sans mot de passe partagé, tout en accédant au même tableau de bord commun.
        </p>
        <form onSubmit={handlePassUpdate} style={{ display: 'flex', gap: '.6rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 240px', marginBottom: 0 }}>
            Modifier mon mot de passe personnel ({session?.firstName})
            <input
              type="password"
              placeholder="Nouveau mot de passe (8 caractères min.)"
              value={newAdminPass}
              onChange={(e) => setNewAdminPass(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-sm btn-terra">
            Mettre à jour mon mot de passe
          </button>
        </form>
        {passMsg && <p style={{ marginTop: '.5rem', marginBottom: 0, fontWeight: 600 }}>{passMsg}</p>}
      </div>

      <div className="adm-card form">
        <h3>Réglages généraux du site &amp; Paiements</h3>
        <T k="demoMode" label="Mode démo (aucune transaction réelle)" />
        <T k="salesEnabled" label="Vente officielle Marrakech activée (uniquement après validation légale)" />
        <T k="almaActive" label="Klarna actif (Je paye en 3 fois sans frais avec Klarna)" />
        <I k="fullPaymentUrl" label="1. Lien Stripe — Je paye en une fois (450 €) par Carte bancaire (sans Klarna)" />
        <I k="almaPaymentUrl" label="2. Lien Stripe — Je paye en 3 fois sans frais avec Klarna (3 × 150 €)" />
        <I k="heroImage" label="Image du hero (chemin ou URL)" />
        <I k="heroVideo" label="Vidéo du hero (optionnelle : chemin .mp4 ou URL — sinon tableau vivant cinemagraph)" />
        <I k="whatsapp" label="Numéro WhatsApp (ex: 0629849653)" />
        <I k="instagram" label="Lien Instagram" />
        <I k="contactEmail" label="Email de contact" />
        <label>Politique d’annulation<textarea rows="4" value={settings.cancellationPolicy} onChange={(e) => set('cancellationPolicy', e.target.value)} /></label>
        <button type="button" onClick={() => confirm('Réinitialiser toutes les données de démo ?') && resetData()}>
          Réinitialiser les données des séjours par défaut
        </button>
      </div>
    </>
  );
}

// ============================================================================
// COMPOSANT PRINCIPAL : « ADMINISTRATION — COMPLICES D’AILLEURS »
// ============================================================================
export default function Admin() {
  const { session, isAdmin, isMember } = useCommunity();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('overview');
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Sécurité : si une cliente (rôle 'member') tente d'accéder à /admin, accès refusé
  // Mais on propose un bouton rapide aux fondatrices si elles visitent avec leur profil test
  if (isMember && !isAdmin) {
    return (
      <section className="section">
        <div className="wrap narrow">
          <div className="carnet-auth-card" style={{ textAlign: 'center' }}>
            <span className="pill waitlist">Vous êtes actuellement sur votre profil d’utilisatrice test</span>
            <h1>Administration — Complices d’ailleurs</h1>
            <p>
              Vous naviguez actuellement avec le compte membre <strong>{session?.firstName}</strong>.
              Basculez en 1 clic sur votre compte administratrice nominatif :
            </p>
            <div className="cta-row" style={{ justifyContent: 'center', marginTop: '1.2rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-terra"
                onClick={() => loginAsFounderAdmin('emilie')}
              >
                🔐 Entrer en Admin (Émilie)
              </button>
              <button
                type="button"
                className="btn btn-terra"
                onClick={() => loginAsFounderAdmin('virginie')}
              >
                🔐 Entrer en Admin (Virginie)
              </button>
              <Link to="/mon-espace" className="btn btn-ghost">
                ← Retourner dans Mon Carnet d’Ailleurs
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Connexion nominative pour Émilie et Virginie (aucun mot de passe partagé)
  if (!isAdmin) {
    const handleAdminLogin = async (e) => {
      e.preventDefault();
      setLoginError('');
      const res = await loginMemberOrAdmin({ email, password });
      if (!res.ok) {
        setLoginError(res.error);
        return;
      }
      if (res.role !== 'admin') {
        logoutSession();
        setLoginError('Cet identifiant correspond à un compte membre et ne dispose pas des droits administratrice.');
      }
    };

    return (
      <section className="section carnet-auth-section">
        <div className="wrap narrow">
          <div className="carnet-auth-card">
            <span className="eyebrow">Espace privé réservé aux gérantes</span>
            <h1>Administration — Complices d’ailleurs</h1>
            <p className="muted-note">
              Connectez-vous avec votre identifiant nominatif (<strong>Émilie</strong> ou <strong>Virginie</strong>) pour accéder à votre tableau de bord commun et à la base « Nos Complices ».
            </p>

            {/* Encart d'accès rapide en 1 clic pour Émilie & Virginie */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fff8f0 0%, #f4e6d4 100%)',
                border: '1.5px solid var(--terra)',
                borderRadius: '16px',
                padding: '1rem 1.15rem',
                marginBottom: '1.35rem',
              }}
            >
              <strong style={{ fontSize: '.9rem', color: 'var(--terra-dark)', display: 'block', marginBottom: '.4rem' }}>
                👀 Accès rapide Fondatrices (Test &amp; Prévisualisation en 1 clic) :
              </strong>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-terra"
                  onClick={() => loginAsFounderAdmin('emilie')}
                >
                  Entrer en Admin — Émilie
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-terra"
                  onClick={() => loginAsFounderAdmin('virginie')}
                >
                  Entrer en Admin — Virginie
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    loginAsFounderTestMember();
                    navigate('/mon-espace');
                  }}
                >
                  ✨ Voir notre profil d’utilisatrice test (Carnet d’Ailleurs)
                </button>
              </div>
            </div>

            {loginError && (
              <div className="carnet-alert carnet-alert-error" style={{ marginBottom: '1rem' }}>
                {loginError}
              </div>
            )}

            <form className="form" onSubmit={handleAdminLogin}>
              <label>
                Adresse e-mail administratrice (Émilie ou Virginie) *
                <input
                  type="email"
                  required
                  placeholder="emilie@complicesdailleurs.fr ou virginie@complicesdailleurs.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Mot de passe personnel *
                <input
                  type="password"
                  required
                  placeholder="Votre mot de passe nominatif"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button type="submit" className="btn btn-terra" style={{ width: '100%', justifyContent: 'center' }}>
                Accéder à l’Administration →
              </button>
            </form>

            <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', fontSize: '.85rem' }}>
              <Link to="/">← Retour au site public</Link>
              <Link to="/mon-espace">Aller vers « Mon espace Complice »</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const tabs = {
    overview: ['📊 Tableau de bord', () => <OverviewDashboard onOpenTab={setTab} onSelectMember={setSelectedMemberId} />],
    members: ['👩 Nos Complices', () => <MembersDirectory selectedMemberId={selectedMemberId} setSelectedMemberId={setSelectedMemberId} />],
    resources: ['🎁 Contenus & Cadeaux', MemberResourcesManager],
    contest: ['✨ Concours Instagram', ContestManager],
    bookings: ['💳 Réservations séjours', Bookings],
    exps: ['🌊 Expériences & Tarifs', Experiences],
    faq: ['💬 FAQ & avis', Faq],
    settings: ['⚙️ Réglages', Settings],
  };

  const Cur = tabs[tab][1];

  return (
    <div className="admin wrap">
      <div className="adm-top-bar">
        <div>
          <span className="eyebrow">Espace de gestion commun · Émilie &amp; Virginie</span>
          <h1 style={{ margin: '.15rem 0' }}>Administration — Complices d’ailleurs</h1>
          <small style={{ color: 'var(--muted)' }}>
            Connectée en tant que <strong>{session.firstName}</strong> ({session.email}) · Rôle : <code>admin</code>
          </small>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-sm btn-terra"
            onClick={() => {
              loginAsFounderTestMember();
              navigate('/mon-espace');
            }}
          >
            👀 Voir notre profil d’utilisatrice test (Mon Carnet d’Ailleurs)
          </button>
          <Link to="/" className="btn btn-sm btn-ghost">
            Voir le site
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => logoutSession()}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {Object.entries(tabs).map(([k, [label]]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <Cur />
    </div>
  );
}
