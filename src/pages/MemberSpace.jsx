import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useData } from '../data/store.js';
import {
  useCommunity,
  ESCAPE_QUIZ_QUESTIONS,
  DEFAULT_MORNING_NIGHT_RITUALS,
  DEFAULT_WELLNESS_CHALLENGES,
  registerMember,
  verifyMemberEmailToken,
  resendVerificationEmail,
  loginMemberOrAdmin,
  logoutSession,
  requestPasswordReset,
  completePasswordReset,
  saveMemberEscapeQuiz,
  getMyPrivateWellnessJournal,
  saveMyPrivateWellnessJournal,
  toggleMemberFavoriteEscape,
  updateMemberPersonalProfile,
  deleteMyAccount,
  awardPassportStamp,
} from '../lib/memberStore.js';

const SKIN_TYPES = [
  'Peau normale à mixte',
  'Peau sèche ou déshydratée',
  'Peau sensible ou réactive',
  'Peau mature en quête d’éclat et de fermeté',
  'Je ne sais pas encore',
];

const SKIN_CONCERNS = [
  'Manque d’éclat et traits tirés',
  'Sécheresse et tiraillements',
  'Tensions au niveau des mâchoires et du front',
  'Sensibilité et rougeurs',
  'Contour des yeux fatigué',
  'Besoin de lâcher-prise global',
];

const CARE_PREFERENCES = [
  'Huiles végétales & massages du visage',
  'Textures fraîches et légères',
  'Rituels courts (moins de 5 minutes)',
  'Soins cocooning du soir',
  'Respiration & auto-massage combinés',
];

export default function MemberSpace() {
  const { experiences, bookings } = useData();
  const { session, isAdmin, isMember, myProfile, resources, contests } = useCommunity();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode d'authentification si non connectée : 'login' | 'register' | 'forgot' | 'reset'
  const [authMode, setAuthMode] = useState('login');
  const [authFeedback, setAuthFeedback] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulaire de connexion
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Formulaire d'inscription (avec tous les champs obligatoires/facultatifs et les 2 cases RGPD)
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    acceptTerms: false,
    marketingOptIn: false, // Facultative et non précochée
    websiteUrlHoneypot: '', // Anti-robot invisible
  });
  const [regErrors, setRegErrors] = useState({});

  // Formulaire mot de passe oublié / réinitialisation
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetForm, setResetForm] = useState({
    token: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Onglet actif du Carnet d'Ailleurs
  const [activeTab, setActiveTab] = useState('envies');

  // État du questionnaire « Quelle escapade est faite pour vous ? »
  const [quizStep, setQuizStep] = useState(0);
  const [quizEditing, setQuizEditing] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({
    q1_evasion: '',
    q2_plaisir: [],
    q3_compagnie: '',
    q4_besoin: '',
    q5_budget: '',
    q6_destinations: [],
  });
  const [quizSavedNotice, setQuizSavedNotice] = useState('');

  // État du carnet bien-être privé (« Mes rituels pour moi »)
  const [wellnessJournal, setWellnessJournal] = useState(() =>
    session?.userId ? getMyPrivateWellnessJournal(session.userId) : { skinProfile: {}, completedRituals: {}, completedChallenges: [] }
  );
  const [journalSavedNotice, setJournalSavedNotice] = useState('');

  // État d'ouverture d'un cadeau / e-book
  const [selectedResource, setSelectedResource] = useState(null);

  // État de mise à jour du profil personnel (RGPD)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    marketingOptIn: false,
  });
  const [profileNotice, setProfileNotice] = useState('');

  // Gestion des liens sécurisés reçus par e-mail (?verify_token=... ou ?reset_token=...)
  useEffect(() => {
    const verifyToken = searchParams.get('verify_token');
    const resetToken = searchParams.get('reset_token');
    const emailParam = searchParams.get('email') || '';
    const tabParam = searchParams.get('tab');

    if (tabParam && ['envies', 'rituels', 'passeport', 'escapades', 'cadeaux', 'profil'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (verifyToken) {
      const res = verifyMemberEmailToken(verifyToken, emailParam);
      if (res.ok) {
        setAuthFeedback({
          type: 'success',
          text: `Merci ${res.member.firstName} ! Votre adresse e-mail est confirmée et votre Carnet d’Ailleurs est désormais actif.`,
        });
        setPendingVerification(null);
      } else {
        setAuthFeedback({ type: 'error', text: res.error });
      }
      searchParams.delete('verify_token');
      setSearchParams(searchParams, { replace: true });
    } else if (resetToken) {
      setAuthMode('reset');
      setResetForm((prev) => ({ ...prev, token: resetToken, email: emailParam }));
    }
  }, [searchParams, setSearchParams]);

  // Synchronise les réponses du questionnaire et du profil lorsque l'utilisatrice se connecte
  useEffect(() => {
    if (myProfile) {
      if (myProfile.escapeQuiz?.answers) {
        setQuizAnswers(myProfile.escapeQuiz.answers);
      }
      setProfileForm({
        firstName: myProfile.firstName || '',
        lastName: myProfile.lastName || '',
        phone: myProfile.phone || '',
        birthDate: myProfile.birthDate || '',
        marketingOptIn: Boolean(myProfile.marketingOptIn),
      });
      setWellnessJournal(getMyPrivateWellnessJournal(myProfile.id));

      // Vérifie si l'utilisatrice a déjà participé ou réservé une expérience Complices d'ailleurs
      const hasBooking = bookings.some(
        (b) => b.email && b.email.toLowerCase() === myProfile.email.toLowerCase() && b.status !== 'cancelled'
      );
      if (hasBooking) {
        awardPassportStamp(myProfile.id, 'experience_participant', 'Participante à une escapade Complices d’ailleurs');
      }
    }
  }, [myProfile?.id, bookings]);

  // ==========================================================================
  // GESTIONNAIRES D'AUTHENTIFICATION
  // ==========================================================================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegErrors({});
    setAuthFeedback(null);
    setSubmitting(true);
    const res = await registerMember(regForm);
    setSubmitting(false);

    if (!res.ok) {
      if (res.errors) setRegErrors(res.errors);
      if (res.error) setAuthFeedback({ type: 'error', text: res.error });
      return;
    }

    setPendingVerification({
      email: res.member.email,
      firstName: res.member.firstName,
      verifyUrl: res.verifyUrl,
      token: res.member.verificationToken,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthFeedback(null);
    setSubmitting(true);
    const res = await loginMemberOrAdmin(loginForm);
    setSubmitting(false);

    if (!res.ok) {
      if (res.needsVerification) {
        setPendingVerification({
          email: res.email,
          firstName: '',
          token: res.verificationToken,
        });
      }
      setAuthFeedback({ type: 'error', text: res.error });
      return;
    }

    if (res.role === 'admin') {
      navigate('/admin');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setAuthFeedback(null);
    setSubmitting(true);
    const res = await requestPasswordReset(forgotEmail);
    setSubmitting(false);

    if (!res.ok) {
      setAuthFeedback({ type: 'error', text: res.error });
      return;
    }
    setAuthFeedback({
      type: 'success',
      text: res.message,
      resetUrl: res.resetUrl,
    });
  };

  const handleCompleteReset = async (e) => {
    e.preventDefault();
    setAuthFeedback(null);
    const res = await completePasswordReset(resetForm);
    if (!res.ok) {
      setAuthFeedback({ type: 'error', text: res.error });
      return;
    }
    setAuthMode('login');
    setLoginForm({ email: resetForm.email, password: '' });
    setAuthFeedback({
      type: 'success',
      text: 'Votre nouveau mot de passe a bien été enregistré. Vous pouvez maintenant vous connecter.',
    });
  };

  // ==========================================================================
  // VUE : SI UNE ADMINISTRATRICE EST CONNECTÉE SUR /mon-espace
  // ==========================================================================
  if (isAdmin && !isMember) {
    return (
      <section className="section carnet-section">
        <div className="wrap narrow">
          <div className="carnet-auth-card" style={{ textAlign: 'center' }}>
            <span className="eyebrow">Espace Fondatrices · Complices d’ailleurs</span>
            <h1>Bonjour {session.firstName}</h1>
            <p>
              Vous êtes connectée avec votre compte administratrice nominatif (<strong>{session.email}</strong>).
            </p>
            <div className="cta-row" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link to="/admin" className="btn btn-terra">
                Accéder à l’Administration — Complices d’ailleurs →
              </Link>
              <button type="button" className="btn btn-ghost" onClick={() => logoutSession()}>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================================
  // VUE : VISITEUSE NON CONNECTÉE (INSCRIPTION / CONNEXION / MOT DE PASSE OUBLIÉ)
  // ==========================================================================
  if (!isMember || !myProfile) {
    const activeContest = contests?.find((c) => c.isActive);

    return (
      <section className="section carnet-auth-section">
        <div className="wrap">
          <div className="carnet-auth-hero">
            <span className="eyebrow">Mon espace Complice</span>
            <h1>Mon Carnet d’Ailleurs</h1>
            <p className="lead">
              Un espace rien qu’à vous, pour rêver d’ailleurs, prendre soin de vous et préparer vos prochaines parenthèses entre femmes.
            </p>
          </div>

          <div className="carnet-auth-grid">
            {/* Colonne gauche : présentation chaleureuse des avantages membres */}
            <aside className="carnet-auth-benefits">
              <div className="carnet-benefit-photo">
                <img
                  src="/img/emilie-virginie-portrait.jpg"
                  alt="Émilie et Virginie — Fondatrices de Complices d’ailleurs"
                  loading="lazy"
                />
                <div className="carnet-benefit-caption">
                  <strong>Émilie &amp; Virginie</strong>
                  <span>« Nous avons imaginé ce Carnet comme un cocon doux et inspirant, prolongement de nos escapades. »</span>
                </div>
              </div>

              <h3>Ce qui vous attend dans votre Carnet :</h3>
              <ul className="carnet-benefit-list">
                <li>
                  <span className="carnet-benefit-icon">🧭</span>
                  <div>
                    <strong>Mes envies d’ailleurs</strong>
                    <p>Découvrez quelle escapade Complices d’ailleurs est faite pour vous grâce à notre questionnaire personnalisé.</p>
                  </div>
                </li>
                <li>
                  <span className="carnet-benefit-icon">🌿</span>
                  <div>
                    <strong>Mes rituels pour moi</strong>
                    <p>Votre carnet bien-être privé : routine visage matin &amp; soir, astuces beauté d’Émilie et pauses yoga de Virginie.</p>
                  </div>
                </li>
                <li>
                  <span className="carnet-benefit-icon">🛂</span>
                  <div>
                    <strong>Mon Passeport Complices</strong>
                    <p>Collectionnez vos tampons de voyageuse au fil de vos défis bien-être et de vos escapades.</p>
                  </div>
                </li>
                <li>
                  <span className="carnet-benefit-icon">🎁</span>
                  <div>
                    <strong>Mes cadeaux Complices</strong>
                    <p>Accédez gratuitement à notre premier e-book <em>« L’art de s’accorder une parenthèse »</em> et à nos fiches pratiques.</p>
                  </div>
                </li>
              </ul>

              {activeContest && (
                <div className="carnet-contest-banner">
                  <span className="pill open">✨ Concours en cours</span>
                  <h4>{activeContest.title}</h4>
                  <p>{activeContest.prize}</p>
                  <Link to="/concours" className="btn btn-sm btn-terra">
                    Découvrir le concours →
                  </Link>
                </div>
              )}
            </aside>

            {/* Colonne droite : formulaires d'authentification */}
            <div className="carnet-auth-card">
              {pendingVerification ? (
                <div className="carnet-verify-box">
                  <span className="pill open">Vérification de votre adresse e-mail</span>
                  <h2>Plus qu’une étape pour ouvrir votre Carnet !</h2>
                  <p>
                    Nous venons d’envoyer un e-mail de confirmation à{' '}
                    <strong>{pendingVerification.email}</strong>.
                  </p>
                  <p>
                    Cliquez sur le lien sécurisé contenu dans cet e-mail pour valider votre adresse et activer votre compte Complice.
                  </p>
                  <div className="carnet-verify-actions">
                    <button
                      type="button"
                      className="btn btn-terra"
                      onClick={() => {
                        if (pendingVerification.token) {
                          const res = verifyMemberEmailToken(pendingVerification.token, pendingVerification.email);
                          if (res.ok) {
                            setPendingVerification(null);
                          }
                        }
                      }}
                    >
                      ✓ Valider mon adresse e-mail et ouvrir mon Carnet maintenant
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={async () => {
                        await resendVerificationEmail(pendingVerification.email);
                        setAuthFeedback({
                          type: 'success',
                          text: `Un nouvel e-mail de confirmation vient d’être envoyé à ${pendingVerification.email}.`,
                        });
                      }}
                    >
                      Renvoyer l’e-mail de confirmation
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setPendingVerification(null);
                        setAuthMode('login');
                      }}
                    >
                      Retour à la connexion
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="carnet-auth-tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMode === 'login'}
                      className={authMode === 'login' ? 'active' : ''}
                      onClick={() => {
                        setAuthMode('login');
                        setAuthFeedback(null);
                      }}
                    >
                      Me connecter
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMode === 'register'}
                      className={authMode === 'register' ? 'active' : ''}
                      onClick={() => {
                        setAuthMode('register');
                        setAuthFeedback(null);
                      }}
                    >
                      Créer mon compte
                    </button>
                  </div>

                  {authFeedback && (
                    <div className={`carnet-alert ${authFeedback.type === 'error' ? 'carnet-alert-error' : 'carnet-alert-success'}`}>
                      <p style={{ margin: 0 }}>{authFeedback.text}</p>
                      {authFeedback.resetUrl && (
                        <p style={{ marginTop: '.5rem', marginBottom: 0 }}>
                          <a href={authFeedback.resetUrl} className="btn btn-sm btn-terra">
                            Choisir mon nouveau mot de passe →
                          </a>
                        </p>
                      )}
                    </div>
                  )}

                  {authMode === 'login' && (
                    <form className="form carnet-form" onSubmit={handleLoginSubmit}>
                      <h2>Ravie de vous retrouver</h2>
                      <p className="muted-note">
                        Connectez-vous pour retrouver votre Carnet d’Ailleurs, vos favoris et vos cadeaux Complices.
                      </p>

                      <label>
                        Adresse e-mail *
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="votre.email@exemple.fr"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        />
                      </label>

                      <label>
                        Mot de passe *
                        <input
                          type="password"
                          required
                          autoComplete="current-password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />
                      </label>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
                        <button
                          type="button"
                          className="carnet-link-btn"
                          onClick={() => {
                            setAuthMode('forgot');
                            setForgotEmail(loginForm.email);
                            setAuthFeedback(null);
                          }}
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>

                      <button type="submit" className="btn btn-terra" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                        {submitting ? 'Connexion en cours…' : 'Entrer dans mon Carnet d’Ailleurs →'}
                      </button>

                      <p className="carnet-switch-prompt">
                        Pas encore membre ?{' '}
                        <button type="button" className="carnet-link-btn" onClick={() => setAuthMode('register')}>
                          Créer mon compte Complice gratuitement
                        </button>
                      </p>
                    </form>
                  )}

                  {authMode === 'register' && (
                    <form className="form carnet-form" onSubmit={handleRegisterSubmit} noValidate>
                      <h2>Créer mon espace Complice</h2>
                      <p className="muted-note">
                        Inscrivez-vous gratuitement pour accéder à votre questionnaire d’escapade, votre carnet bien-être et votre e-book offert.
                      </p>

                      {/* Champ anti-robot invisible (honeypot) */}
                      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                        <label>
                          Ne pas remplir ce champ
                          <input
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={regForm.websiteUrlHoneypot}
                            onChange={(e) => setRegForm({ ...regForm, websiteUrlHoneypot: e.target.value })}
                          />
                        </label>
                      </div>

                      <div className="grid2">
                        <label>
                          Prénom *
                          <input
                            type="text"
                            required
                            placeholder="Ex. Sophie"
                            value={regForm.firstName}
                            onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                          />
                          {regErrors.firstName && <span className="err">{regErrors.firstName}</span>}
                        </label>
                        <label>
                          Nom *
                          <input
                            type="text"
                            required
                            placeholder="Ex. Martin"
                            value={regForm.lastName}
                            onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                          />
                          {regErrors.lastName && <span className="err">{regErrors.lastName}</span>}
                        </label>
                      </div>

                      <label>
                        Adresse e-mail *
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="sophie.martin@exemple.fr"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        />
                        {regErrors.email && <span className="err">{regErrors.email}</span>}
                      </label>

                      <div className="grid2">
                        <label>
                          Mot de passe * (8 caractères min.)
                          <input
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Minimum 8 caractères"
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          />
                          {regErrors.password && <span className="err">{regErrors.password}</span>}
                        </label>
                        <label>
                          Confirmation du mot de passe *
                          <input
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Confirmez votre mot de passe"
                            value={regForm.confirmPassword}
                            onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                          />
                          {regErrors.confirmPassword && <span className="err">{regErrors.confirmPassword}</span>}
                        </label>
                      </div>

                      <div className="grid2">
                        <label>
                          Numéro de téléphone <small>(facultatif)</small>
                          <input
                            type="tel"
                            placeholder="06 12 34 56 78"
                            value={regForm.phone}
                            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          />
                        </label>
                        <label>
                          Date de naissance <small>(facultative)</small>
                          <input
                            type="date"
                            value={regForm.birthDate}
                            onChange={(e) => setRegForm({ ...regForm, birthDate: e.target.value })}
                          />
                        </label>
                      </div>

                      <div className="carnet-consents-box">
                        <label className="check">
                          <input
                            type="checkbox"
                            checked={regForm.acceptTerms}
                            onChange={(e) => setRegForm({ ...regForm, acceptTerms: e.target.checked })}
                          />
                          <span>
                            J’accepte les <Link to="/mentions-legales" target="_blank">conditions d’utilisation</Link> et je confirme avoir pris connaissance de la <Link to="/mentions-legales" target="_blank">politique de confidentialité</Link>. *
                          </span>
                        </label>
                        {regErrors.acceptTerms && <span className="err">{regErrors.acceptTerms}</span>}

                        <label className="check" style={{ marginTop: '.55rem' }}>
                          <input
                            type="checkbox"
                            checked={regForm.marketingOptIn}
                            onChange={(e) => setRegForm({ ...regForm, marketingOptIn: e.target.checked })}
                          />
                          <span>
                            J’accepte de recevoir les actualités, offres d’escapades, invitations et conseils bien-être d’Émilie et Virginie par e-mail <small>(facultatif — désinscription en 1 clic à tout moment)</small>.
                          </span>
                        </label>
                      </div>

                      <button type="submit" className="btn btn-terra" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                        {submitting ? 'Création de votre Carnet…' : 'Créer mon Carnet d’Ailleurs →'}
                      </button>

                      <p className="carnet-privacy-footnote">
                        🔒 Vos données sont strictement confidentielles et ne sont jamais partagées avec d’autres membres ni revendues.
                      </p>
                    </form>
                  )}

                  {authMode === 'forgot' && (
                    <form className="form carnet-form" onSubmit={handleForgotSubmit}>
                      <h2>Réinitialiser votre mot de passe</h2>
                      <p className="muted-note">
                        Indiquez l’adresse e-mail de votre compte Complice. Nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.
                      </p>
                      <label>
                        Votre adresse e-mail *
                        <input
                          type="email"
                          required
                          placeholder="votre.email@exemple.fr"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                        />
                      </label>
                      <button type="submit" className="btn btn-terra" disabled={submitting}>
                        Envoyer le lien de réinitialisation
                      </button>
                      <button type="button" className="carnet-link-btn" onClick={() => setAuthMode('login')}>
                        ← Retour à la connexion
                      </button>
                    </form>
                  )}

                  {authMode === 'reset' && (
                    <form className="form carnet-form" onSubmit={handleCompleteReset}>
                      <h2>Choisir un nouveau mot de passe</h2>
                      <label>
                        Nouveau mot de passe * (8 caractères min.)
                        <input
                          type="password"
                          required
                          value={resetForm.newPassword}
                          onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                        />
                      </label>
                      <label>
                        Confirmer le nouveau mot de passe *
                        <input
                          type="password"
                          required
                          value={resetForm.confirmPassword}
                          onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                        />
                      </label>
                      <button type="submit" className="btn btn-terra">
                        Enregistrer mon nouveau mot de passe
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================================
  // VUE : ESPACE PERSONNEL CONNECTÉ — « MON CARNET D’AILLEURS »
  // ==========================================================================
  const currentQuestion = ESCAPE_QUIZ_QUESTIONS[quizStep];
  const totalQuestions = ESCAPE_QUIZ_QUESTIONS.length;
  const quizProgressPct = Math.round(((quizStep + 1) / totalQuestions) * 100);
  const hasCompletedQuiz = Boolean(myProfile.escapeQuiz?.primaryProfile);
  const recommendedExperiences = (myProfile.escapeQuiz?.recommendedSlugs || [])
    .map((slug) => experiences.find((e) => e.slug === slug))
    .filter(Boolean);

  const favoriteSlugs = myProfile.favorites || [];
  const favoriteExperiences = experiences.filter((e) => favoriteSlugs.includes(e.slug));
  const publishedResources = (resources || []).filter((r) => r.isPublished !== false);
  const beautyTips = publishedResources.filter((r) => r.category === 'beaute');
  const yogaTips = publishedResources.filter((r) => r.category === 'yoga');

  const handleSelectQuizOption = (question, optionValue) => {
    setQuizAnswers((prev) => {
      if (question.multi) {
        const current = Array.isArray(prev[question.id]) ? prev[question.id] : [];
        const exists = current.includes(optionValue);
        const next = exists ? current.filter((v) => v !== optionValue) : [...current, optionValue];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: optionValue };
    });
  };

  const isCurrentStepAnswered = () => {
    if (!currentQuestion) return false;
    const val = quizAnswers[currentQuestion.id];
    return currentQuestion.multi ? Array.isArray(val) && val.length > 0 : Boolean(val);
  };

  const handleFinishQuiz = () => {
    const res = saveMemberEscapeQuiz(myProfile.id, quizAnswers);
    if (res.ok) {
      setQuizEditing(false);
      setQuizSavedNotice('✨ Vos envies d’ailleurs ont bien été enregistrées dans votre Carnet !');
      setTimeout(() => setQuizSavedNotice(''), 4000);
    }
  };

  const handleToggleRitual = (ritualId) => {
    const nextRituals = {
      ...(wellnessJournal.completedRituals || {}),
      [ritualId]: !wellnessJournal.completedRituals?.[ritualId],
    };
    const nextJournal = { ...wellnessJournal, completedRituals: nextRituals };
    setWellnessJournal(nextJournal);
    saveMyPrivateWellnessJournal(myProfile.id, nextJournal);
  };

  const handleToggleChallenge = (challengeId) => {
    const current = Array.isArray(wellnessJournal.completedChallenges) ? wellnessJournal.completedChallenges : [];
    const exists = current.includes(challengeId);
    const nextChallenges = exists ? current.filter((id) => id !== challengeId) : [...current, challengeId];
    const nextJournal = { ...wellnessJournal, completedChallenges: nextChallenges };
    setWellnessJournal(nextJournal);
    saveMyPrivateWellnessJournal(myProfile.id, nextJournal);
  };

  const handleUpdateSkinProfile = (field, value, isMulti = false) => {
    const currentSkin = wellnessJournal.skinProfile || {};
    let nextValue = value;
    if (isMulti) {
      const arr = Array.isArray(currentSkin[field]) ? currentSkin[field] : [];
      nextValue = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    }
    const nextJournal = {
      ...wellnessJournal,
      skinProfile: {
        ...currentSkin,
        [field]: nextValue,
      },
    };
    setWellnessJournal(nextJournal);
    saveMyPrivateWellnessJournal(myProfile.id, nextJournal);
    setJournalSavedNotice('✓ Enregistré dans votre carnet privé');
    setTimeout(() => setJournalSavedNotice(''), 2500);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const res = updateMemberPersonalProfile(myProfile.id, profileForm);
    if (res.ok) {
      setProfileNotice('✓ Vos informations personnelles et préférences ont été mises à jour.');
      setTimeout(() => setProfileNotice(''), 4000);
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Souhaitez-vous vraiment supprimer définitivement votre compte Complice et toutes vos données personnelles ? Cette action est irréversible.'
    );
    if (confirmed) {
      deleteMyAccount(myProfile.id);
      navigate('/');
    }
  };

  // Définition des 4 tampons officiels du Passeport Complices
  const ALL_PASSPORT_STAMPS = [
    {
      code: 'profile_completed',
      fallbackCode: 'profile_created',
      title: 'Escale Bienvenue',
      subtitle: 'Profil Complice complété',
      icon: '🌸',
      hint: 'Complétez votre profil (téléphone et date de naissance) dans l’onglet « Mon profil ».',
    },
    {
      code: 'escape_quiz_completed',
      title: 'Boussole d’Ailleurs',
      subtitle: 'Résultat d’escapade découvert',
      icon: '🧭',
      hint: 'Répondez au questionnaire « Quelle escapade est faite pour vous ? ».',
    },
    {
      code: 'wellness_challenge',
      title: 'Parenthèse Douceur',
      subtitle: 'Défi bien-être accompli',
      icon: '🌿',
      hint: 'Réalisez et cochez un défi bien-être dans « Mes rituels pour moi ».',
    },
    {
      code: 'experience_participant',
      title: 'Voyageuse Complice',
      subtitle: 'Participation à une expérience Complices d’ailleurs',
      icon: '✈️',
      hint: 'Participez à l’une de nos escapades ou journées entre femmes.',
    },
  ];

  const earnedStamps = myProfile.stamps || [];

  return (
    <div className="carnet-page">
      {/* En-tête du Carnet d'Ailleurs */}
      <header className="carnet-hero">
        <div className="wrap carnet-hero-inner">
          <div>
            <span className="eyebrow">Mon Carnet d’Ailleurs · {myProfile.firstName} {myProfile.lastName}</span>
            <h1>Bienvenue dans votre Carnet d’Ailleurs</h1>
            <p className="carnet-subtitle">
              Un espace rien qu’à vous, pour rêver d’ailleurs, prendre soin de vous et préparer vos prochaines parenthèses.
            </p>
          </div>
          <div className="carnet-hero-actions">
            {myProfile.escapeQuiz?.primaryProfile && (
              <span className="carnet-profile-badge">
                ✨ {myProfile.escapeQuiz.primaryProfile}
              </span>
            )}
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => logoutSession()}>
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      {/* Barre de navigation des 5 rubriques + Profil RGPD */}
      <div className="carnet-nav-bar">
        <div className="wrap">
          <nav className="carnet-tabs" aria-label="Rubriques de votre Carnet d’Ailleurs">
            <button
              type="button"
              className={activeTab === 'envies' ? 'active' : ''}
              onClick={() => setActiveTab('envies')}
            >
              <span>🧭</span> Mes envies d’ailleurs
            </button>
            <button
              type="button"
              className={activeTab === 'rituels' ? 'active' : ''}
              onClick={() => setActiveTab('rituels')}
            >
              <span>🌿</span> Mes rituels pour moi
            </button>
            <button
              type="button"
              className={activeTab === 'passeport' ? 'active' : ''}
              onClick={() => setActiveTab('passeport')}
            >
              <span>🛂</span> Mon Passeport Complices
            </button>
            <button
              type="button"
              className={activeTab === 'escapades' ? 'active' : ''}
              onClick={() => setActiveTab('escapades')}
            >
              <span>🌊</span> Mes prochaines escapades
              {favoriteSlugs.length > 0 && <small className="carnet-tab-count">{favoriteSlugs.length}</small>}
            </button>
            <button
              type="button"
              className={activeTab === 'cadeaux' ? 'active' : ''}
              onClick={() => setActiveTab('cadeaux')}
            >
              <span>🎁</span> Mes cadeaux Complices
            </button>
            <button
              type="button"
              className={activeTab === 'profil' ? 'active' : ''}
              onClick={() => setActiveTab('profil')}
            >
              <span>🔒</span> Mon profil &amp; RGPD
            </button>
          </nav>
        </div>
      </div>

      <section className="section carnet-body">
        <div className="wrap">
          {/* ================================================================
              RUBRIQUE A : MES ENVIES D’AILLEURS (QUESTIONNAIRE INTERACTIF)
             ================================================================ */}
          {activeTab === 'envies' && (
            <div className="carnet-panel">
              <div className="carnet-panel-head">
                <div>
                  <span className="eyebrow">A. Mes envies d’ailleurs</span>
                  <h2>Quelle escapade est faite pour vous ?</h2>
                  <p>
                    Répondez à ces 6 questions pour découvrir votre profil d’évasion et les expériences Complices d’ailleurs qui résonnent avec vos envies du moment.
                  </p>
                </div>
                {hasCompletedQuiz && !quizEditing && (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      setQuizStep(0);
                      setQuizEditing(true);
                    }}
                  >
                    ✎ Modifier mes réponses
                  </button>
                )}
              </div>

              {quizSavedNotice && <div className="carnet-alert carnet-alert-success">{quizSavedNotice}</div>}

              {!hasCompletedQuiz || quizEditing ? (
                <div className="carnet-quiz-card">
                  <div className="carnet-quiz-progress-head">
                    <span>
                      Question <strong>{quizStep + 1}</strong> sur {totalQuestions}
                    </span>
                    <span>{quizProgressPct} %</span>
                  </div>
                  <div className="carnet-quiz-progress-bar" role="progressbar" aria-valuenow={quizProgressPct} aria-valuemin={0} aria-valuemax={100}>
                    <div className="carnet-quiz-progress-fill" style={{ width: `${quizProgressPct}%` }} />
                  </div>

                  {currentQuestion && (
                    <div className="carnet-quiz-question-box">
                      <h3>
                        {currentQuestion.step}. {currentQuestion.question}
                      </h3>
                      {currentQuestion.multi && (
                        <p className="muted-note" style={{ marginTop: '-.3rem' }}>
                          Vous pouvez sélectionner une ou plusieurs réponses.
                        </p>
                      )}

                      <div className="carnet-quiz-options">
                        {currentQuestion.options.map((opt) => {
                          const currentVal = quizAnswers[currentQuestion.id];
                          const selected = currentQuestion.multi
                            ? Array.isArray(currentVal) && currentVal.includes(opt.value)
                            : currentVal === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              className={`carnet-quiz-option ${selected ? 'selected' : ''}`}
                              onClick={() => handleSelectQuizOption(currentQuestion, opt.value)}
                            >
                              <span className="carnet-quiz-check">{selected ? '✓' : ''}</span>
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="carnet-quiz-footer">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          disabled={quizStep === 0}
                          onClick={() => setQuizStep((s) => Math.max(0, s - 1))}
                        >
                          ← Question précédente
                        </button>

                        {quizStep < totalQuestions - 1 ? (
                          <button
                            type="button"
                            className="btn btn-terra"
                            disabled={!isCurrentStepAnswered()}
                            onClick={() => setQuizStep((s) => s + 1)}
                          >
                            Question suivante →
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-terra"
                            disabled={!isCurrentStepAnswered()}
                            onClick={handleFinishQuiz}
                          >
                            Découvrir mon résultat personnalisé ✨
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="carnet-quiz-result">
                  <div className="carnet-result-banner">
                    <span className="eyebrow">Votre portrait d’évasion</span>
                    <h3>« {myProfile.escapeQuiz.primaryProfile} »</h3>
                    <p>{myProfile.escapeQuiz.profileSummary}</p>
                  </div>

                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                    Les expériences Complices d’ailleurs adaptées à vos réponses :
                  </h3>

                  <div className="cards">
                    {recommendedExperiences.map((exp) => {
                      const isFav = favoriteSlugs.includes(exp.slug);
                      return (
                        <article key={exp.slug} className="card">
                          <div className="card-img">
                            <img src={exp.image} alt={exp.title} loading="lazy" />
                            <span className={`pill ${exp.status}`}>
                              {exp.status === 'open'
                                ? 'Réservations ouvertes'
                                : exp.status === 'waitlist'
                                ? 'Pré-inscription ouverte'
                                : 'Bientôt'}
                            </span>
                          </div>
                          <div className="card-body">
                            <small>{exp.location} · {exp.duration}</small>
                            <h3>{exp.title}</h3>
                            <p>{exp.subtitle}</p>
                            <div className="card-foot" style={{ flexWrap: 'wrap', gap: '.5rem' }}>
                              <span className="price">
                                {exp.pricePerPerson ? `${exp.pricePerPerson} € / pers.` : 'Tarif en cours de finalisation'}
                              </span>
                              <div style={{ display: 'flex', gap: '.45rem', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  className={`carnet-fav-btn ${isFav ? 'active' : ''}`}
                                  onClick={() => toggleMemberFavoriteEscape(myProfile.id, exp.slug)}
                                  title={isFav ? 'Retirer de mes favoris' : 'Sauvegarder dans mes favoris'}
                                >
                                  {isFav ? '♥ Favori' : '♡ Sauvegarder'}
                                </button>
                                <Link to={`/experiences/${exp.slug}`} className="btn btn-sm btn-terra">
                                  Découvrir →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              RUBRIQUE B : MES RITUELS POUR MOI (CARNET BIEN-ÊTRE PRIVÉ)
             ================================================================ */}
          {activeTab === 'rituels' && (
            <div className="carnet-panel">
              <div className="carnet-panel-head">
                <div>
                  <span className="eyebrow">B. Mes rituels pour moi · Carnet strictement personnel</span>
                  <h2>Mon carnet de bien-être &amp; de douceur</h2>
                  <p>
                    Retrouvez ici votre routine visage matin et soir, les astuces beauté d’Émilie, les pauses yoga et respiration de Virginie et vos défis bien-être.
                  </p>
                </div>
                {journalSavedNotice && <span className="pill open">{journalSavedNotice}</span>}
              </div>

              <div className="carnet-medical-disclaimer">
                <strong>🌿 Note de bienveillance &amp; de confidentialité :</strong> Les conseils proposés par Émilie et Virginie sont des rituels généraux de bien-être et d’esthétique, sans caractère médical, et ne constituent pas un diagnostic dermatologique. Vos réponses dans ce carnet bien-être restent <strong>strictement privées</strong> (elles ne sont jamais visibles dans l’administration).
              </div>

              <div className="grid2" style={{ marginTop: '1.5rem' }}>
                {/* Routine visage Matin */}
                <div className="carnet-ritual-card">
                  <span className="eyebrow">☀️ Rituel du Matin</span>
                  <h3>Éveiller et protéger ma peau</h3>
                  <ul className="carnet-checklist">
                    {DEFAULT_MORNING_NIGHT_RITUALS.morning.map((item) => {
                      const checked = Boolean(wellnessJournal.completedRituals?.[item.id]);
                      return (
                        <li key={item.id} className={checked ? 'done' : ''}>
                          <label>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleRitual(item.id)}
                            />
                            <div>
                              <strong>{item.title}</strong>
                              <p>{item.detail}</p>
                            </div>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Routine visage Soir */}
                <div className="carnet-ritual-card">
                  <span className="eyebrow">🌙 Rituel du Soir</span>
                  <h3>Démaquiller, masser et relâcher</h3>
                  <ul className="carnet-checklist">
                    {DEFAULT_MORNING_NIGHT_RITUALS.evening.map((item) => {
                      const checked = Boolean(wellnessJournal.completedRituals?.[item.id]);
                      return (
                        <li key={item.id} className={checked ? 'done' : ''}>
                          <label>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleRitual(item.id)}
                            />
                            <div>
                              <strong>{item.title}</strong>
                              <p>{item.detail}</p>
                            </div>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Défis bien-être accessibles à cocher */}
              <div className="carnet-ritual-card" style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
                  <div>
                    <span className="eyebrow">✨ Petits pas vers soi</span>
                    <h3>Mes défis bien-être Complices</h3>
                  </div>
                  <span className="pill soon">
                    {(wellnessJournal.completedChallenges || []).length} / {DEFAULT_WELLNESS_CHALLENGES.length} réalisés
                  </span>
                </div>
                <div className="grid2" style={{ marginTop: '1rem' }}>
                  {DEFAULT_WELLNESS_CHALLENGES.map((ch) => {
                    const done = (wellnessJournal.completedChallenges || []).includes(ch.id);
                    return (
                      <div key={ch.id} className={`carnet-challenge-item ${done ? 'done' : ''}`}>
                        <label>
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => handleToggleChallenge(ch.id)}
                          />
                          <div>
                            <small className="eyebrow">{ch.duration}</small>
                            <h4>{ch.title}</h4>
                            <p>{ch.description}</p>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Astuces beauté d'Émilie & Pauses yoga de Virginie */}
              <div className="grid2" style={{ marginTop: '1.5rem' }}>
                <div className="carnet-ritual-card">
                  <span className="eyebrow">💆‍♀️ Par Émilie · Esthéticienne diplômée</span>
                  <h3>Les astuces beauté d’Émilie</h3>
                  {beautyTips.map((tip) => (
                    <div key={tip.id} className="carnet-tip-block">
                      <h4>{tip.title}</h4>
                      <p>{tip.description}</p>
                      {tip.contentBody && <pre className="carnet-tip-steps">{tip.contentBody}</pre>}
                    </div>
                  ))}
                </div>

                <div className="carnet-ritual-card">
                  <span className="eyebrow">🧘‍♀️ Par Virginie · Professeure de yoga</span>
                  <h3>Les pauses yoga &amp; respiration de Virginie</h3>
                  {yogaTips.map((tip) => (
                    <div key={tip.id} className="carnet-tip-block">
                      <h4>{tip.title}</h4>
                      <p>{tip.description}</p>
                      {tip.contentBody && <pre className="carnet-tip-steps">{tip.contentBody}</pre>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Profil beauté facultatif */}
              <div className="carnet-ritual-card" style={{ marginTop: '1.5rem' }}>
                <span className="eyebrow">🌸 Mon profil beauté facultatif (100 % privé)</span>
                <h3>Mes préférences de soins &amp; besoins du moment</h3>
                <p className="muted-note">
                  Ce mémo personnel vous permet de noter les besoins de votre peau au fil des saisons. Il est enregistré uniquement dans votre carnet privé.
                </p>

                <div style={{ marginTop: '1rem' }}>
                  <strong>1. Comment ressentez-vous votre peau en ce moment ?</strong>
                  <div className="carnet-tag-group">
                    {SKIN_TYPES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`carnet-tag-btn ${wellnessJournal.skinProfile?.skinType === st ? 'active' : ''}`}
                        onClick={() => handleUpdateSkinProfile('skinType', st, false)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1.2rem' }}>
                  <strong>2. Quelles sont vos préoccupations principales ?</strong>
                  <div className="carnet-tag-group">
                    {SKIN_CONCERNS.map((c) => {
                      const active = (wellnessJournal.skinProfile?.concerns || []).includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          className={`carnet-tag-btn ${active ? 'active' : ''}`}
                          onClick={() => handleUpdateSkinProfile('concerns', c, true)}
                        >
                          {active ? '✓ ' : ''}{c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginTop: '1.2rem' }}>
                  <strong>3. Quelles textures ou rituels préférez-vous ?</strong>
                  <div className="carnet-tag-group">
                    {CARE_PREFERENCES.map((p) => {
                      const active = (wellnessJournal.skinProfile?.preferences || []).includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          className={`carnet-tag-btn ${active ? 'active' : ''}`}
                          onClick={() => handleUpdateSkinProfile('preferences', p, true)}
                        >
                          {active ? '✓ ' : ''}{p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              RUBRIQUE C : MON PASSEPORT COMPLICES
             ================================================================ */}
          {activeTab === 'passeport' && (
            <div className="carnet-panel">
              <div className="carnet-panel-head">
                <div>
                  <span className="eyebrow">C. Mon Passeport Complices</span>
                  <h2>Votre passeport de voyageuse Complices d’ailleurs</h2>
                  <p>
                    Au fil de vos découvertes et de vos parenthèses, votre Passeport Complices s’enrichit de tampons souvenirs.
                  </p>
                </div>
              </div>

              <div className="passport-book">
                <div className="passport-cover-header">
                  <div>
                    <span className="passport-code">PASSEPORT N° {myProfile.id.slice(-6).toUpperCase()}</span>
                    <h3>Complices d’ailleurs — Édition Voyageuse</h3>
                    <p>Titulaire : <strong>{myProfile.firstName} {myProfile.lastName}</strong> · Membre depuis le {new Date(myProfile.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="passport-crest">
                    <span>✦</span>
                    <small>COMPLICES D’AILLEURS</small>
                  </div>
                </div>

                <div className="passport-stamps-grid">
                  {ALL_PASSPORT_STAMPS.map((st) => {
                    const match = earnedStamps.find(
                      (s) => s.code === st.code || (st.fallbackCode && s.code === st.fallbackCode)
                    );
                    const unlocked = Boolean(match);
                    return (
                      <div key={st.code} className={`passport-stamp-slot ${unlocked ? 'unlocked' : 'locked'}`}>
                        <div className="passport-stamp-circle">
                          <span className="passport-stamp-icon">{st.icon}</span>
                          <span className="passport-stamp-status">{unlocked ? 'VALIDÉ' : 'À DÉCOUVRIR'}</span>
                        </div>
                        <div className="passport-stamp-info">
                          <h4>{st.title}</h4>
                          <p>{st.subtitle}</p>
                          {unlocked ? (
                            <small className="passport-date">
                              Tampon obtenu le {new Date(match.earnedAt).toLocaleDateString('fr-FR')}
                            </small>
                          ) : (
                            <small className="passport-hint">{st.hint}</small>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              RUBRIQUE D : MES PROCHAINES ESCAPADES
             ================================================================ */}
          {activeTab === 'escapades' && (
            <div className="carnet-panel">
              <div className="carnet-panel-head">
                <div>
                  <span className="eyebrow">D. Mes prochaines escapades</span>
                  <h2>Vos parenthèses sauvegardées &amp; nos séjours actuels</h2>
                  <p>
                    Retrouvez ici vos escapades coups de cœur et accédez directement aux pages de présentation et de réservation.
                  </p>
                </div>
              </div>

              {favoriteExperiences.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3>♥ Mes escapades sauvegardées ({favoriteExperiences.length})</h3>
                  <div className="cards">
                    {favoriteExperiences.map((exp) => (
                      <article key={exp.slug} className="card">
                        <div className="card-img">
                          <img src={exp.image} alt={exp.title} loading="lazy" />
                          <span className={`pill ${exp.status}`}>
                            {exp.status === 'open' ? 'Ouvert' : exp.status === 'waitlist' ? 'Pré-inscription' : 'Bientôt'}
                          </span>
                        </div>
                        <div className="card-body">
                          <small>{exp.location} · {exp.duration}</small>
                          <h3>{exp.title}</h3>
                          <p>{exp.subtitle}</p>
                          <div className="card-foot" style={{ flexWrap: 'wrap', gap: '.5rem' }}>
                            <span className="price">
                              {exp.pricePerPerson ? `${exp.pricePerPerson} € / pers.` : 'Sur pré-inscription'}
                            </span>
                            <div style={{ display: 'flex', gap: '.4rem' }}>
                              <button
                                type="button"
                                className="carnet-fav-btn active"
                                onClick={() => toggleMemberFavoriteEscape(myProfile.id, exp.slug)}
                              >
                                ♥ Retirer
                              </button>
                              <Link to={`/experiences/${exp.slug}`} className="btn btn-sm btn-ghost">
                                Détails
                              </Link>
                              <Link to={`/reserver/${exp.slug}`} className="btn btn-sm btn-terra">
                                Réserver →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <h3>Toutes les expériences Complices d’ailleurs</h3>
              <div className="cards">
                {experiences.map((exp) => {
                  const isFav = favoriteSlugs.includes(exp.slug);
                  return (
                    <article key={exp.slug} className="card">
                      <div className="card-img">
                        <img src={exp.image} alt={exp.title} loading="lazy" />
                        <span className={`pill ${exp.status}`}>
                          {exp.status === 'open'
                            ? 'Réservations ouvertes'
                            : exp.status === 'waitlist'
                            ? 'Liste d’intérêt ouverte'
                            : 'Prochainement'}
                        </span>
                      </div>
                      <div className="card-body">
                        <small>{exp.location} · {exp.duration}</small>
                        <h3>{exp.title}</h3>
                        <p>{exp.subtitle}</p>
                        <div className="card-foot" style={{ flexWrap: 'wrap', gap: '.5rem' }}>
                          <span className="price">
                            {exp.pricePerPerson ? `${exp.pricePerPerson} € / pers.` : 'Tarif à venir'}
                          </span>
                          <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              className={`carnet-fav-btn ${isFav ? 'active' : ''}`}
                              onClick={() => toggleMemberFavoriteEscape(myProfile.id, exp.slug)}
                            >
                              {isFav ? '♥ Favori' : '♡ Favori'}
                            </button>
                            <Link to={`/experiences/${exp.slug}`} className="btn btn-sm btn-ghost">
                              Voir
                            </Link>
                            <Link to={`/reserver/${exp.slug}`} className="btn btn-sm btn-terra">
                              {exp.status === 'open' ? 'Réserver' : 'Me pré-inscrire'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================
              RUBRIQUE E : MES CADEAUX COMPLICES (E-BOOK & FICHES PRATIQUES)
             ================================================================ */}
          {activeTab === 'cadeaux' && (
            <div className="carnet-panel">
              <div className="carnet-panel-head">
                <div>
                  <span className="eyebrow">E. Mes cadeaux Complices</span>
                  <h2>Votre bibliothèque de cadeaux &amp; guides réservés aux membres</h2>
                  <p>
                    Retrouvez ici notre premier e-book offert ainsi que les fiches pratiques, routines et guides préparés par Émilie et Virginie.
                  </p>
                </div>
              </div>

              <div className="carnet-gifts-grid">
                {publishedResources.map((res) => (
                  <article key={res.id} className={`carnet-gift-card ${res.category === 'ebook' ? 'featured-ebook' : ''}`}>
                    <div className="carnet-gift-top">
                      <span className="pill open">{res.badge || 'Cadeau Membre'}</span>
                      <small>Par {res.author || 'Émilie & Virginie'}</small>
                    </div>
                    <h3>{res.title}</h3>
                    {res.subtitle && <p className="carnet-gift-sub">{res.subtitle}</p>}
                    <p>{res.description}</p>

                    <div className="carnet-gift-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => setSelectedResource(selectedResource?.id === res.id ? null : res)}
                      >
                        {selectedResource?.id === res.id ? 'Fermer l’aperçu' : 'Lire dans mon Carnet'}
                      </button>

                      {res.fileUrl ? (
                        <a
                          href={res.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="btn btn-sm btn-terra"
                        >
                          📥 Télécharger le PDF
                        </a>
                      ) : (
                        res.category === 'ebook' && (
                          <span className="pill soon" style={{ fontSize: '.76rem' }}>
                            📖 E-book complet bientôt disponible en téléchargement PDF
                          </span>
                        )
                      )}
                    </div>

                    {selectedResource?.id === res.id && res.contentBody && (
                      <div className="carnet-gift-reader">
                        <h4>Aperçu &amp; Sommaire — {res.title}</h4>
                        <pre className="carnet-tip-steps">{res.contentBody}</pre>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================
              RUBRIQUE F : MON PROFIL & MES DROITS RGPD
             ================================================================ */}
          {activeTab === 'profil' && (
            <div className="carnet-panel">
              <div className="carnet-panel-head">
                <div>
                  <span className="eyebrow">Mon profil &amp; Confidentialité (RGPD)</span>
                  <h2>Gérer mes informations personnelles et mes préférences</h2>
                  <p>
                    Conformément au RGPD, vous pouvez à tout moment consulter, rectifier vos informations, modifier votre choix de recevoir nos actualités ou supprimer votre compte.
                  </p>
                </div>
              </div>

              {profileNotice && <div className="carnet-alert carnet-alert-success">{profileNotice}</div>}

              <div className="grid2">
                <form className="form carnet-ritual-card" onSubmit={handleProfileSave}>
                  <h3>Mes coordonnées</h3>
                  <label>
                    Prénom
                    <input
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    />
                  </label>
                  <label>
                    Nom
                    <input
                      type="text"
                      required
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    />
                  </label>
                  <label>
                    Adresse e-mail (vérifiée ✓)
                    <input type="email" value={myProfile.email} disabled />
                  </label>
                  <label>
                    Numéro de téléphone <small>(facultatif)</small>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </label>
                  <label>
                    Date de naissance <small>(facultative)</small>
                    <input
                      type="date"
                      value={profileForm.birthDate}
                      onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                    />
                  </label>

                  <label className="check" style={{ marginTop: '.5rem' }}>
                    <input
                      type="checkbox"
                      checked={profileForm.marketingOptIn}
                      onChange={(e) => setProfileForm({ ...profileForm, marketingOptIn: e.target.checked })}
                    />
                    <span>
                      J’accepte de recevoir les actualités, invitations et offres d’escapades Complices d’ailleurs par e-mail.
                    </span>
                  </label>

                  <button type="submit" className="btn btn-terra">
                    Enregistrer mes modifications
                  </button>
                </form>

                <div className="carnet-ritual-card">
                  <h3>Confidentialité &amp; Droits RGPD</h3>
                  <p>
                    <strong>Responsables du traitement :</strong> Émilie et Virginie — Complices d’ailleurs (<a href="mailto:complicesdailleurs@gmail.com">complicesdailleurs@gmail.com</a>).
                  </p>
                  <ul style={{ paddingLeft: '1.1rem', lineHeight: 1.65 }}>
                    <li>Vos données personnelles ne sont jamais visibles par les autres membres.</li>
                    <li>Votre carnet bien-être (« Mes rituels pour moi ») est strictement privé et n’est pas consultable depuis l’administration.</li>
                    <li>
                      Statut de votre consentement e-mail marketing :{' '}
                      <strong>{myProfile.marketingOptIn ? 'Accepté (Opt-in actif)' : 'Non souscrit'}</strong>.
                    </li>
                  </ul>

                  <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '1.5rem 0' }} />

                  <h4>Suppression de mon compte</h4>
                  <p className="muted-note">
                    Vous pouvez supprimer définitivement votre compte Complice, votre carnet bien-être et l’ensemble de vos réponses en un clic :
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    style={{ borderColor: '#a43025', color: '#a43025' }}
                    onClick={handleDeleteAccount}
                  >
                    Supprimer définitivement mon compte Complice
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
