import { FormEvent, useEffect, useState } from 'react';
import { useApp } from '../context/AppProvider';
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

export function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    loginWithEmail,
    registerWithEmail,
  } = useApp();

  const isRegister = authModalMode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authModalOpen) return;
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFieldError(null);
    setSubmitting(false);
  }, [authModalOpen, authModalMode]);

  if (!authModalOpen) return null;

  const copy = AUTH_COPY[authModalMode];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    if (isRegister) {
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
            <div className="auth-field">
              <label htmlFor="authPassword">Password</label>
              <input
                id="authPassword"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'At least 6 characters' : 'Your password'}
                minLength={isRegister ? 6 : undefined}
                required
              />
            </div>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="authConfirm">Confirm password</label>
                <input
                  id="authConfirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  minLength={6}
                  required
                />
              </div>
            )}
            {fieldError && (
              <p className="auth-form-error" role="alert">
                {fieldError}
              </p>
            )}
            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
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
          <p className="auth-modal-note">
            By continuing, you agree to our Terms of Use and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
