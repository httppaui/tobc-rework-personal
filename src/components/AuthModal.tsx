import { FormEvent, useEffect, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { checkApiHealth } from '../lib/authApi';
import { isPasswordValid, PASSWORD_RULES, passwordValidationError } from '../lib/passwordRules';
import type { AuthModalMode } from '../types';

const AUTH_COPY: Record<AuthModalMode, { title: string; body: string }> = {
  login: {
    title: 'Log in to your account',
    body: 'Sign in to access your bookings, saved wishlist, and cart on any device.',
  },
  register: {
    title: 'Create your free account',
    body: 'Register in seconds to book MARINA-accredited courses, save favorites, and check out faster.',
  },
  book: {
    title: 'Sign in to book this course',
    body: 'Log in or create a free account to continue. We will bring you right back to complete your booking.',
  },
};

function PasswordRequirementsPopover({
  password,
  visible,
  popoverId,
}: {
  password: string;
  visible: boolean;
  popoverId: string;
}) {
  if (!visible) return null;

  return (
    <div
      id={popoverId}
      className="auth-password-rules-popover"
      role="status"
      aria-live="polite"
    >
      <p className="auth-password-rules-title">Password must include:</p>
      <ul className="auth-password-rules">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <li key={rule.id} className={met ? 'is-met' : ''}>
              <i className={`bi ${met ? 'bi-check-circle-fill' : 'bi-circle'}`} aria-hidden />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  showRules = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder: string;
  showRules?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const popoverId = `${id}-rules`;

  return (
    <div className="auth-field auth-field-password">
      <label htmlFor={id}>{label}</label>
      <div className="auth-password-input-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => showRules && setRulesOpen(true)}
          onBlur={() => setRulesOpen(false)}
          placeholder={placeholder}
          required
          aria-describedby={showRules && rulesOpen ? popoverId : undefined}
        />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          <i className={`bi ${visible ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden />
        </button>
        {showRules && (
          <PasswordRequirementsPopover
            password={value}
            visible={rulesOpen}
            popoverId={popoverId}
          />
        )}
      </div>
    </div>
  );
}

export function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    openLegalModal,
    loginWithEmail,
    registerWithEmail,
  } = useApp();

  const isRegister = authModalMode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authModalOpen) return;
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAgreedToTerms(false);
    setFieldError(null);
    setSubmitting(false);
    setApiOnline(null);
    void checkApiHealth().then(setApiOnline);
  }, [authModalOpen, authModalMode]);

  if (!authModalOpen) return null;

  const copy = AUTH_COPY[authModalMode];
  const registerPasswordOk = !isRegister || (isPasswordValid(password) && password === confirmPassword);
  const canSubmit = agreedToTerms && apiOnline !== false && !submitting && registerPasswordOk;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (!agreedToTerms) {
      setFieldError('Please agree to the Terms of Use and Privacy Policy to continue.');
      return;
    }

    if (apiOnline === false) {
      setFieldError('Auth server is offline. Run npm run dev in the project folder (starts API on port 3001).');
      return;
    }

    if (isRegister) {
      const passwordErr = passwordValidationError(password);
      if (passwordErr) {
        setFieldError(passwordErr);
        return;
      }
      if (password !== confirmPassword) {
        setFieldError('Passwords do not match.');
        return;
      }
      setSubmitting(true);
      const err = await registerWithEmail(name, email, password);
      setSubmitting(false);
      if (err) setFieldError(err);
      return;
    }

    setSubmitting(true);
    const err = await loginWithEmail(email, password);
    setSubmitting(false);
    if (err) setFieldError(err);
  };

  return (
    <div
      className="auth-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      role="presentation"
    >
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        <div className="auth-modal-head">
          <h3 id="authModalTitle">{copy.title}</h3>
          <button type="button" onClick={closeAuthModal} aria-label="Close">
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div className="auth-modal-body">
          <p>{copy.body}</p>
          {apiOnline === false && (
            <p className="auth-api-status is-error" role="status">
              Cannot reach the auth API. Stop the dev server, then run <strong>npm run dev</strong> again
              (needs both web and api). Check the terminal for <strong>[api]</strong> listening on port 3001.
            </p>
          )}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="authName">Full name</label>
                <input
                  id="authName"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan dela Cruz"
                  required
                />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="authEmail">Email</label>
              <input
                id="authEmail"
                type="email"
                autoComplete={isRegister ? 'email' : 'username'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <PasswordField
              id="authPassword"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder={isRegister ? 'Create a strong password' : 'Your password'}
              showRules={isRegister}
            />
            {isRegister && (
              <PasswordField
                id="authConfirm"
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
                placeholder="Re-enter password"
              />
            )}
            <label className="auth-terms">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (e.target.checked) setFieldError(null);
                }}
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  className="legal-doc-link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLegalModal('terms');
                  }}
                >
                  Terms of Use
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="legal-doc-link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLegalModal('privacy');
                  }}
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>
            {fieldError && (
              <p className="auth-form-error" role="alert">
                {fieldError}
              </p>
            )}
            <button type="submit" className="btn btn-primary auth-submit" disabled={!canSubmit}>
              {submitting
                ? 'Please wait…'
                : isRegister
                  ? 'Create account'
                  : authModalMode === 'book'
                    ? 'Sign in & continue'
                    : 'Log in'}
            </button>
          </form>
          {authModalMode !== 'register' && (
            <p className="auth-modal-switch">
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => openAuthModal('register')}>
                Create account
              </button>
            </p>
          )}
          {authModalMode === 'register' && (
            <p className="auth-modal-switch">
              Already have an account?{' '}
              <button type="button" onClick={() => openAuthModal('login')}>
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
