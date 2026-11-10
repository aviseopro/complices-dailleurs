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
  loginAsFounderTestMember,
  loginAsFounderAdmin,
} from '../lib/memberStore.js';

export default function MemberSpace() {
  const { experiences, bookings } = useData();
  const { session, isAdmin, isMember, myProfile, resources } = useCommunity();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromBooking = searchParams.get('from_booking') === '1';
  const bookingRefParam = searchParams.get('ref') || '';

  // Si elle arrive après paiement ou via lien d'invitation, on ouvre directement "Créer mon profil"
  const [authMode, setAuthMode] = useState(() => (fromBooking ? 'register' : 'register'));
  const [authFeedback, setAuthFeedback] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [regForm, setRegForm] = useState(() => {
    const fullName = searchParams.get('name') || '';
    const parts = fullName.trim().split(/\s+/);
    const first = searchParams.get('firstName') || parts[0] || '';
    const last = searchParams.get('lastName') || parts.slice(1).join(' ') || '';
    return {
      firstName: first,
      lastName: last,
      email: searchParams.get('email') || '',
      password: '',
      confirmPassword: '',
      phone: searchParams.get('phone') || '',
      birthDate: '',
      acceptTerms: false,
      marketingOptIn: false,
      websiteUrlHoneypot: '',
    };
  });
  const [regErrors, setRegErrors] = useState({});

  const [forgotEmail, setForgotEmail] = useState('');
  const [resetForm, setResetForm] = useState({
    token: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  // État du questionnaire d'accroche (Routine beauté, Voyageuse, Marcheuse)
  const [quizStep, setQuizStep] = useState(0);
  // Permet de voir ou refaire le questionnaire à tout moment
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [justFinishedQuiz, setJustFinishedQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({
    q1_beaute_actuelle: '',
    q2_beaute_envies: [],
    q3_type_voyageuse: '',
    q4_compagnie: '',
    q5_type_marcheuse: '',
  });

  // État d'ouverture d'un e-book
  const [selectedResource, setSelectedResource] = useState(null);

  // Carnet bien-être discret
  const [wellnessJournal, setWellnessJournal] = useState(() =>
    session?.userId ? getMyPrivateWellnessJournal(session.userId) : { skinProfile: {}, completedRituals: {}, completedChallenges: [] }
  );

  // Profil RGPD
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
    marketingOptIn: false,
  });
  const [profileNotice, setProfileNotice] = useState('');

  // Gestion des liens de validation d'e-mail ou de réinitialisation
  useEffect(() => {
    const verifyToken = searchParams.get('verify_token');
    const resetToken = searchParams.get('reset_token');
    const emailParam = searchParams.get('email') || '';

    if (verifyToken) {
      const res = verifyMemberEmailToken(verifyToken, emailParam);
      if (res.ok) {
        setPendingVerification(null);
        setShowQuizForm(true);
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

  useEffect(() => {
    if (myProfile) {
      if (myProfile.escapeQuiz?.answers) {
        setQuizAnswers((prev) => ({ ...prev, ...myProfile.escapeQuiz.answers }));
      }
      setProfileForm({
        firstName: myProfile.firstName || '',
        lastName: myProfile.lastName || '',
        phone: myProfile.phone || '',
        birthDate: myProfile.birthDate || '',
        marketingOptIn: Boolean(myProfile.marketingOptIn),
      });
      setWellnessJournal(getMyPrivateWellnessJournal(myProfile.id));

      const hasBooking = bookings.some(
        (b) => b.email && b.email.toLowerCase() === myProfile.email.toLowerCase() && b.status !== 'cancelled'
      );
      if (hasBooking) {
        awardPassportStamp(myProfile.id, 'experience_participant', 'Participante inscrite à une escapade Complices d’ailleurs');
      }
    }
  }, [myProfile?.id, bookings]);

  // ==========================================================================
  // INSCRIPTION / CONNEXION
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

    // Si elle vient de payer son week-end d'Arcachon, on active directement son compte
    // pour qu'elle tombe immédiatement sur le questionnaire ("et là bim, elles tombent sur la page du questionnaire")
    if (fromBooking && res.member?.verificationToken) {
      verifyMemberEmailToken(res.member.verificationToken, res.member.email);
      setShowQuizForm(true);
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
    setAuthFeedback({ type: 'success', text: res.message, resetUrl: res.resetUrl });
  };

  const handleCompleteReset = async (e) => {
    e.preventDefault();
    const res = await completePasswordReset(resetForm);
    if (!res.ok) {
      setAuthFeedback({ type: 'error', text: res.error });
      return;
    }
    setAuthMode('login');
    setLoginForm({ email: resetForm.email, password: '' });
    setAuthFeedback({
      type: 'success',
      text: 'Votre nouveau mot de passe est enregistré. Vous pouvez vous connecter.',
    });
  };

  // ==========================================================================
  // VUE : ADMINISTRATRICE CONNECTÉE SUR /mon-espace
  // ==========================================================================
  if (isAdmin && !isMember) {
    return (
      <section className="olive-member-page">
        <div className="wrap narrow" style={{ paddingTop: '8.5rem', paddingBottom: '4rem' }}>
          <div className="olive-card" style={{ textAlign: 'center' }}>
            <span className="olive-eyebrow">Espace Fondatrices · Complices d’ailleurs</span>
            <h1>Bonjour {session.firstName}</h1>
            <p>Vous êtes connectée en tant qu’administratrice ({session.email}).</p>
            <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.4rem' }}>
              <button
                type="button"
                className="olive-btn-primary"
                onClick={() => loginAsFounderTestMember()}
              >
                👀 Voir notre profil d’utilisatrice test (Questionnaire &amp; E-book)
              </button>
              <Link to="/admin" className="olive-btn-ghost">
                Aller au Back-Office Admin →
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================================
  // VUE 1 : CRÉATION DU PROFIL / CONNEXION (SIMPLE, ÉPURÉE, VERT NATURE SEREINE)
  // ==========================================================================
  if (!isMember || !myProfile) {
    return (
      <section className="olive-member-page">
        <div className="wrap olive-auth-wrap">
          {/* En-tête épuré et très premium */}
          <div className="olive-hero-header">
            <span className="olive-eyebrow">
              {fromBooking
                ? '✓ Règlement confirmé · Suivi de votre week-end à Arcachon'
                : 'Mon Espace Complice · Beauté, Évasion & Sérénité'}
            </span>
            <h1>
              {fromBooking
                ? 'Créez votre profil pour suivre votre séjour et recevoir vos cadeaux'
                : 'Bienvenue dans votre Espace Complice'}
            </h1>
            <p className="olive-lead">
              {fromBooking
                ? 'Merci pour votre inscription au week-end d’Arcachon ! Créez votre profil ci-dessous pour suivre votre réservation, répondre à notre court questionnaire beauté & évasion, recevoir votre e-book offert et être sélectionnée pour le tirage au sort du massage de 45 minutes par Virginie.'
                : 'Créez votre profil, répondez à notre court questionnaire (routine beauté, voyageuse & marcheuse) pour recevoir immédiatement votre e-book offert et participer au tirage au sort du massage de 45 minutes par Virginie.'}
            </p>

            {/* Les 3 étapes visuelles ultra simples */}
            <div className="olive-steps-row">
              <div className="olive-step-badge">
                <span>1</span> Je crée mon profil
              </div>
              <div className="olive-step-badge">
                <span>2</span> Je réponds au questionnaire (2 min)
              </div>
              <div className="olive-step-badge highlight">
                <span>🎁</span> Mon E-book offert + Tirage au sort Massage 45 min Virginie
              </div>
            </div>
          </div>

          <div className="olive-card olive-auth-box">
            {/* Bouton d'aperçu en 1 clic pour Émilie & Virginie */}
            <div className="olive-founder-preview-bar">
              <div>
                <strong>👀 Aperçu Émilie &amp; Virginie :</strong>
                <span>Visitez directement l’espace cliente avec votre profil test (Camille)</span>
              </div>
              <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="olive-btn-primary olive-btn-sm"
                  onClick={() => {
                    loginAsFounderTestMember();
                    setShowQuizForm(true);
                  }}
                >
                  ✨ Voir le questionnaire (Profil Test)
                </button>
                <button
                  type="button"
                  className="olive-btn-ghost olive-btn-sm"
                  onClick={() => {
                    loginAsFounderTestMember();
                    setShowQuizForm(false);
                  }}
                >
                  🎉 Voir l’écran Félicitations &amp; E-book
                </button>
              </div>
            </div>

            {pendingVerification ? (
              <div className="olive-verify-box">
                <span className="olive-pill">Activation de votre profil</span>
                <h2>Activez votre compte pour accéder au questionnaire</h2>
                <p>
                  Un e-mail de confirmation vient d’être envoyé à <strong>{pendingVerification.email}</strong>.
                  Cliquez ci-dessous pour activer votre profil et accéder immédiatement à votre questionnaire, votre e-book et votre sélection au tirage au sort du massage de 45 minutes par Virginie :
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem', alignItems: 'center', marginTop: '1.2rem' }}>
                  <button
                    type="button"
                    className="olive-btn-primary"
                    onClick={() => {
                      if (pendingVerification.token) {
                        const res = verifyMemberEmailToken(pendingVerification.token, pendingVerification.email);
                        if (res.ok) {
                          setPendingVerification(null);
                          setShowQuizForm(true);
                        }
                      }
                    }}
                  >
                    ✓ Activer mon compte et commencer le questionnaire →
                  </button>
                  <button
                    type="button"
                    className="olive-btn-ghost olive-btn-sm"
                    onClick={async () => {
                      await resendVerificationEmail(pendingVerification.email);
                      setAuthFeedback({
                        type: 'success',
                        text: `Un nouvel e-mail a été envoyé à ${pendingVerification.email}.`,
                      });
                    }}
                  >
                    Renvoyer l’e-mail de confirmation
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="olive-auth-switcher" role="tablist">
                  <button
                    type="button"
                    className={authMode === 'register' ? 'active' : ''}
                    onClick={() => {
                      setAuthMode('register');
                      setAuthFeedback(null);
                    }}
                  >
                    Créer mon profil Complice
                  </button>
                  <button
                    type="button"
                    className={authMode === 'login' ? 'active' : ''}
                    onClick={() => {
                      setAuthMode('login');
                      setAuthFeedback(null);
                    }}
                  >
                    J’ai déjà un profil
                  </button>
                </div>

                {authFeedback && (
                  <div className={`olive-alert ${authFeedback.type === 'error' ? 'error' : 'success'}`}>
                    <p style={{ margin: 0 }}>{authFeedback.text}</p>
                  </div>
                )}

                {authMode === 'register' && (
                  <form className="form olive-form" onSubmit={handleRegisterSubmit} noValidate>
                    {/* Honeypot anti-robot */}
                    <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={regForm.websiteUrlHoneypot}
                        onChange={(e) => setRegForm({ ...regForm, websiteUrlHoneypot: e.target.value })}
                      />
                    </div>

                    <div className="grid2">
                      <label>
                        Prénom *
                        <input
                          type="text"
                          required
                          placeholder="Votre prénom"
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
                          placeholder="Votre nom"
                          value={regForm.lastName}
                          onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                        />
                        {regErrors.lastName && <span className="err">{regErrors.lastName}</span>}
                      </label>
                    </div>

                    <div className="grid2">
                      <label>
                        Votre adresse e-mail *
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="votre.email@exemple.fr"
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        />
                        {regErrors.email && <span className="err">{regErrors.email}</span>}
                      </label>
                      <label>
                        Téléphone <small>(facultatif)</small>
                        <input
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="grid2">
                      <label>
                        Choisissez un mot de passe * (8 caractères min.)
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
                        Confirmez votre mot de passe *
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

                    <div className="olive-consents">
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={regForm.acceptTerms}
                          onChange={(e) => setRegForm({ ...regForm, acceptTerms: e.target.checked })}
                        />
                        <span>
                          J’accepte les <Link to="/mentions-legales" target="_blank">conditions d’utilisation et la politique de confidentialité</Link>. *
                        </span>
                      </label>
                      {regErrors.acceptTerms && <span className="err">{regErrors.acceptTerms}</span>}

                      <label className="check" style={{ marginTop: '.45rem' }}>
                        <input
                          type="checkbox"
                          checked={regForm.marketingOptIn}
                          onChange={(e) => setRegForm({ ...regForm, marketingOptIn: e.target.checked })}
                        />
                        <span>
                          J’accepte de recevoir par e-mail mon e-book, mes conseils beauté &amp; les prochaines escapades d’Émilie et Virginie <small>(facultatif)</small>.
                        </span>
                      </label>
                    </div>

                    <button type="submit" className="olive-btn-primary olive-btn-full" disabled={submitting}>
                      {submitting
                        ? 'Création de votre profil…'
                        : 'Créer mon profil & accéder au questionnaire →'}
                    </button>
                  </form>
                )}

                {authMode === 'login' && (
                  <form className="form olive-form" onSubmit={handleLoginSubmit}>
                    <label>
                      Adresse e-mail *
                      <input
                        type="email"
                        required
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
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="carnet-link-btn"
                        onClick={() => {
                          setAuthMode('forgot');
                          setForgotEmail(loginForm.email);
                        }}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <button type="submit" className="olive-btn-primary olive-btn-full" disabled={submitting}>
                      Accéder à mon Espace Complice →
                    </button>
                  </form>
                )}

                {authMode === 'forgot' && (
                  <form className="form olive-form" onSubmit={handleForgotSubmit}>
                    <label>
                      Votre adresse e-mail *
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </label>
                    <button type="submit" className="olive-btn-primary">
                      Envoyer le lien de réinitialisation
                    </button>
                    <button type="button" className="carnet-link-btn" onClick={() => setAuthMode('login')}>
                      ← Retour
                    </button>
                  </form>
                )}

                {authMode === 'reset' && (
                  <form className="form olive-form" onSubmit={handleCompleteReset}>
                    <label>
                      Nouveau mot de passe *
                      <input
                        type="password"
                        required
                        value={resetForm.newPassword}
                        onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                      />
                    </label>
                    <label>
                      Confirmer le mot de passe *
                      <input
                        type="password"
                        required
                        value={resetForm.confirmPassword}
                        onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                      />
                    </label>
                    <button type="submit" className="olive-btn-primary">
                      Enregistrer
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================================
  // VUE 2 : ESPACE CLIENTE CONNECTÉE (VERT NATURE SEREINE, ÉPURÉ & TRÈS PREMIUM)
  // ==========================================================================
  const currentQuestion = ESCAPE_QUIZ_QUESTIONS[quizStep];
  const totalQuestions = ESCAPE_QUIZ_QUESTIONS.length;
  const quizProgressPct = Math.round(((quizStep + 1) / totalQuestions) * 100);
  const hasCompletedQuiz = Boolean(myProfile.escapeQuiz?.primaryProfile);
  const isDisplayingQuiz = !hasCompletedQuiz || showQuizForm;

  const publishedResources = (resources || []).filter((r) => r.isPublished !== false);
  const ebooksAndGuides = publishedResources.filter((r) => r.category === 'ebook' || r.category === 'fiche');
  const beautyAndYogaTips = publishedResources.filter((r) => r.category === 'beaute' || r.category === 'yoga');

  // Réservations associées à cette cliente (ex: Week-end d'Arcachon)
  const myBookings = bookings.filter(
    (b) =>
      (b.email && b.email.toLowerCase() === myProfile.email.toLowerCase()) ||
      (bookingRefParam && b.reference === bookingRefParam)
  );

  const favoriteSlugs = myProfile.favorites || [];
  const earnedStamps = myProfile.stamps || [];

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
      setShowQuizForm(false);
      setJustFinishedQuiz(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleProfileSave = (e) => {
    e.preventDefault();
    const res = updateMemberPersonalProfile(myProfile.id, profileForm);
    if (res.ok) {
      setProfileNotice('✓ Vos coordonnées ont été mises à jour.');
      setTimeout(() => setProfileNotice(''), 3500);
    }
  };

  return (
    <div className="olive-member-page">
      {/* En-tête épuré vert nature / militaire doux */}
      <header className="olive-logged-header">
        <div className="wrap olive-logged-header-in">
          <div>
            <span className="olive-eyebrow">Mon Espace Complice · {myProfile.firstName}</span>
            <h1>Bonjour {myProfile.firstName}, bienvenue dans votre cocon</h1>
            <p className="olive-subtitle">
              Un espace serein et confidentiel imaginé par Émilie et Virginie pour suivre votre expérience et prendre soin de vous.
            </p>
          </div>
          <div className="olive-header-actions">
            {(myProfile.isFounderTestProfile || myProfile.id === 'mbr-test-fondatrices') && (
              <button
                type="button"
                className="olive-btn-ghost olive-btn-sm"
                onClick={() => {
                  loginAsFounderAdmin('emilie');
                  navigate('/admin');
                }}
              >
                🔐 Basculer vers l’Administration
              </button>
            )}
            <button type="button" className="olive-btn-ghost olive-btn-sm" onClick={() => logoutSession()}>
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <section className="wrap olive-main-container">
        {/* ====================================================================
            1. LA PREMIÈRE ACCROCHE CENTRALE :
               LE QUESTIONNAIRE (OU LA CARTE FÉLICITATIONS MASSAGE 45 MIN + E-BOOK)
           ==================================================================== */}
        {isDisplayingQuiz ? (
          <div className="olive-card olive-hero-quiz-card">
            <div className="olive-quiz-top-badge">
              <span className="olive-pill">🌿 Questionnaire Beauté, Voyageuse &amp; Marcheuse</span>
              {hasCompletedQuiz && (
                <button
                  type="button"
                  className="olive-btn-ghost olive-btn-sm"
                  onClick={() => setShowQuizForm(false)}
                >
                  Voir mes cadeaux &amp; ma sélection au tirage →
                </button>
              )}
            </div>

            <h2>Parlez-nous de vous en 5 questions</h2>
            <p className="olive-quiz-intro">
              Que faites-vous déjà en institut de beauté ou qu’aimeriez-vous découvrir ? Quel type de voyageuse et de marcheuse êtes-vous ?
              <br />
              <strong>En validant ce questionnaire :</strong> vous recevez immédiatement nos <strong>e-books offerts</strong> et vous êtes <strong>sélectionnée au tirage au sort pour gagner un massage de 45 minutes réalisé par Virginie</strong>.
            </p>

            {/* Barre de progression douce */}
            <div className="olive-progress-meta">
              <span>{currentQuestion?.theme || `Question ${quizStep + 1}`}</span>
              <span>
                Question <strong>{quizStep + 1}</strong> / {totalQuestions}
              </span>
            </div>
            <div className="olive-progress-bar">
              <div className="olive-progress-fill" style={{ width: `${quizProgressPct}%` }} />
            </div>

            {currentQuestion && (
              <div className="olive-question-block">
                <h3>
                  {currentQuestion.step}. {currentQuestion.question}
                </h3>
                {currentQuestion.multi && (
                  <small className="olive-multi-hint">Plusieurs choix possibles</small>
                )}

                <div className="olive-options-list">
                  {currentQuestion.options.map((opt) => {
                    const currentVal = quizAnswers[currentQuestion.id];
                    const selected = currentQuestion.multi
                      ? Array.isArray(currentVal) && currentVal.includes(opt.value)
                      : currentVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`olive-option-btn ${selected ? 'selected' : ''}`}
                        onClick={() => handleSelectQuizOption(currentQuestion, opt.value)}
                      >
                        <span className="olive-option-check">{selected ? '✓' : ''}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="olive-quiz-nav">
                  <button
                    type="button"
                    className="olive-btn-ghost"
                    disabled={quizStep === 0}
                    onClick={() => setQuizStep((s) => Math.max(0, s - 1))}
                  >
                    ← Précédent
                  </button>

                  {quizStep < totalQuestions - 1 ? (
                    <button
                      type="button"
                      className="olive-btn-primary"
                      disabled={!isCurrentStepAnswered()}
                      onClick={() => setQuizStep((s) => s + 1)}
                    >
                      Continuer →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="olive-btn-primary"
                      disabled={!isCurrentStepAnswered()}
                      onClick={handleFinishQuiz}
                    >
                      ✨ Valider mes réponses, débloquer mon E-book &amp; le tirage Massage 45 min
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==================================================================
             ÉCRAN DE FÉLICITATIONS PREMIUM UNE FOIS LE QUESTIONNAIRE REMPLI
             ================================================================== */
          <div className="olive-card olive-congrats-card">
            <div className="olive-congrats-top">
              <span className="olive-pill-gold">✨ Sélection officielle enregistrée · Confirmation envoyée par e-mail</span>
              <button
                type="button"
                className="olive-btn-ghost olive-btn-sm"
                onClick={() => {
                  setQuizStep(0);
                  setShowQuizForm(true);
                }}
              >
                ✎ Revoir ou modifier mon questionnaire
              </button>
            </div>

            <h2>
              Félicitations {myProfile.firstName} ! Vous êtes sélectionnée pour le tirage au sort pour gagner le massage de 45 minutes par Virginie
            </h2>
            <p className="olive-congrats-lead">
              Merci d’avoir répondu à notre questionnaire beauté, voyageuse &amp; marcheuse.
              {justFinishedQuiz ? (
                <> Un <strong>e-mail de confirmation</strong> vient de vous être envoyé à <strong>{myProfile.email}</strong> pour confirmer votre sélection au tirage au sort du <strong>massage de 45 minutes par Virginie</strong>.</>
              ) : (
                <> Votre participation au tirage au sort pour le <strong>massage de 45 minutes par Virginie</strong> est bien enregistrée sur votre profil ({myProfile.email}).</>
              )}
            </p>

            {/* Profil synthétique issu du questionnaire */}
            <div className="olive-portrait-strip">
              <div>
                <small>Votre profil Complices d’ailleurs</small>
                <strong>« {myProfile.escapeQuiz.primaryProfile} »</strong>
                <p>{myProfile.escapeQuiz.profileSummary}</p>
              </div>
            </div>

            {/* LES E-BOOKS OFFERTS DÉBLOQUÉS IMMÉDIATEMENT */}
            <div className="olive-ebooks-showcase">
              <div className="olive-ebooks-head">
                <span className="olive-eyebrow">🎁 Vos cadeaux débloqués</span>
                <h3>Vos E-books &amp; guides offerts</h3>
              </div>

              <div className="olive-ebooks-grid">
                {ebooksAndGuides.map((res) => (
                  <div key={res.id} className="olive-ebook-box">
                    <span className="olive-pill">{res.badge || 'E-book offert'}</span>
                    <h4>{res.title}</h4>
                    <p>{res.description}</p>
                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                      <button
                        type="button"
                        className="olive-btn-primary olive-btn-sm"
                        onClick={() => setSelectedResource(selectedResource?.id === res.id ? null : res)}
                      >
                        {selectedResource?.id === res.id ? 'Fermer l’aperçu' : '📖 Lire l’aperçu de mon e-book'}
                      </button>
                      {res.fileUrl ? (
                        <a
                          href={res.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="olive-btn-ghost olive-btn-sm"
                        >
                          📥 Télécharger le PDF
                        </a>
                      ) : (
                        <span className="olive-soon-note">PDF complet très bientôt disponible</span>
                      )}
                    </div>
                    {selectedResource?.id === res.id && res.contentBody && (
                      <pre className="olive-ebook-preview">{res.contentBody}</pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            2. LE RESTE DE L'ESPACE DISCRET EN PETITS MENUS DÉROULANTS ÉPURÉS
               (Qu'on étoffera au fur et à mesure)
           ==================================================================== */}
        <div className="olive-accordions-section">
          <p className="olive-accordions-title">
            Retrouvez également vos autres rubriques personnelles :
          </p>

          {/* Menu déroulant 1 : Suivi de ma commande / Week-end d'Arcachon & Escapades */}
          <details className="olive-accordion" open={fromBooking || myBookings.length > 0}>
            <summary>
              <span>🌊 Suivi de mon séjour &amp; Mes prochaines escapades</span>
              <small>{myBookings.length > 0 ? `${myBookings.length} séjour réservé` : 'Découvrir nos séjours'}</small>
            </summary>
            <div className="olive-accordion-body">
              {myBookings.length > 0 ? (
                <div className="olive-booking-follow">
                  <h4>✓ Votre inscription confirmée</h4>
                  {myBookings.map((b) => {
                    const exp = experiences.find((e) => e.slug === b.exp) || experiences[0];
                    return (
                      <div key={b.reference} className="olive-booking-item">
                        <div>
                          <strong>{exp?.title || 'Week-end Bassin d’Arcachon'}</strong>
                          <p>
                            Référence : <strong>{b.reference}</strong> · {b.places} place(s) · Statut :{' '}
                            <span className="olive-pill">{b.status === 'paid' ? 'Confirmé & Payé' : 'Enregistré'}</span>
                          </p>
                        </div>
                        <Link to={`/experiences/${exp?.slug || 'arcachon-entre-femmes'}`} className="olive-btn-ghost olive-btn-sm">
                          Revoir le programme →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ margin: '0 0 1rem', color: '#4a5546', fontSize: '.9rem' }}>
                  Découvrez nos prochaines parenthèses entre femmes et sauvegardez vos coups de cœur :
                </p>
              )}

              <div className="olive-mini-escapes-grid">
                {experiences.slice(0, 4).map((exp) => {
                  const isFav = favoriteSlugs.includes(exp.slug);
                  return (
                    <div key={exp.slug} className="olive-mini-escape-card">
                      <img src={exp.image} alt={exp.title} loading="lazy" />
                      <div>
                        <strong>{exp.title}</strong>
                        <small>{exp.location} · {exp.duration}</small>
                        <div style={{ display: 'flex', gap: '.4rem', marginTop: '.45rem', flexWrap: 'wrap' }}>
                          <Link to={`/experiences/${exp.slug}`} className="olive-btn-ghost olive-btn-sm">
                            Voir
                          </Link>
                          <button
                            type="button"
                            className="olive-btn-ghost olive-btn-sm"
                            onClick={() => toggleMemberFavoriteEscape(myProfile.id, exp.slug)}
                          >
                            {isFav ? '♥ Sauvegardé' : '♡ Favori'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </details>

          {/* Menu déroulant 2 : Mon Passeport Complices */}
          <details className="olive-accordion">
            <summary>
              <span>🛂 Mon Passeport Complices</span>
              <small>{earnedStamps.length} tampon(s) obtenu(s)</small>
            </summary>
            <div className="olive-accordion-body">
              <div className="olive-stamps-row">
                {[
                  { code: 'profile_completed', fallback: 'profile_created', label: 'Profil Complice créé', icon: '🌸' },
                  { code: 'escape_quiz_completed', label: 'Questionnaire & Sélection Tirage Massage', icon: '✨' },
                  { code: 'wellness_challenge', label: 'Rituel beauté pratiqué', icon: '🌿' },
                  { code: 'experience_participant', label: 'Voyageuse Complices d’ailleurs', icon: '✈️' },
                ].map((st) => {
                  const unlocked = earnedStamps.some((s) => s.code === st.code || s.code === st.fallback);
                  return (
                    <div key={st.code} className={`olive-stamp-badge ${unlocked ? 'unlocked' : ''}`}>
                      <span className="olive-stamp-icon">{st.icon}</span>
                      <div>
                        <strong>{st.label}</strong>
                        <small>{unlocked ? '✓ Tampon validé' : 'À débloquer'}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </details>

          {/* Menu déroulant 3 : Mes petits rituels beauté & yoga */}
          <details className="olive-accordion">
            <summary>
              <span>🌿 Mes petits rituels beauté &amp; yoga (Émilie &amp; Virginie)</span>
              <small>Routines matin/soir &amp; astuces</small>
            </summary>
            <div className="olive-accordion-body">
              <p style={{ fontSize: '.82rem', color: '#566350', marginBottom: '1rem' }}>
                Conseils généraux de bien-être et d’esthétique proposés par Émilie et Virginie (strictement privés, sans caractère médical).
              </p>
              <div className="grid2">
                <div>
                  <h4>☀️ Gestes du matin &amp; du soir</h4>
                  <ul className="olive-simple-checklist">
                    {[...DEFAULT_MORNING_NIGHT_RITUALS.morning.slice(0, 2), ...DEFAULT_MORNING_NIGHT_RITUALS.evening.slice(0, 2)].map((item) => {
                      const checked = Boolean(wellnessJournal.completedRituals?.[item.id]);
                      return (
                        <li key={item.id}>
                          <label>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleRitual(item.id)}
                            />
                            <span>{item.title}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h4>💆‍♀️ Le conseil d’Émilie &amp; Virginie</h4>
                  {beautyAndYogaTips.map((tip) => (
                    <div key={tip.id} style={{ marginBottom: '.75rem', fontSize: '.88rem' }}>
                      <strong>{tip.title}</strong>
                      <p style={{ margin: '.2rem 0 0', color: '#4a5546' }}>{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>

          {/* Menu déroulant 4 : Mon profil & mes coordonnées */}
          <details className="olive-accordion">
            <summary>
              <span>🔒 Mon profil &amp; mes coordonnées (RGPD)</span>
              <small>{myProfile.email}</small>
            </summary>
            <div className="olive-accordion-body">
              {profileNotice && <div className="olive-alert success">{profileNotice}</div>}
              <form className="form" onSubmit={handleProfileSave}>
                <div className="grid2">
                  <label>
                    Prénom
                    <input
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    />
                  </label>
                  <label>
                    Nom
                    <input
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    />
                  </label>
                  <label>
                    Téléphone
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </label>
                  <label>
                    E-mail
                    <input value={myProfile.email} disabled />
                  </label>
                </div>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={profileForm.marketingOptIn}
                    onChange={(e) => setProfileForm({ ...profileForm, marketingOptIn: e.target.checked })}
                  />
                  <span>Recevoir les actualités et offres d’escapades par e-mail</span>
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
                  <button type="submit" className="olive-btn-primary olive-btn-sm">
                    Enregistrer mes modifications
                  </button>
                  <button
                    type="button"
                    className="carnet-link-btn"
                    style={{ color: '#8c271e' }}
                    onClick={() => {
                      if (window.confirm('Supprimer définitivement votre compte Complice ?')) {
                        deleteMyAccount(myProfile.id);
                        navigate('/');
                      }
                    }}
                  >
                    Supprimer mon compte
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
