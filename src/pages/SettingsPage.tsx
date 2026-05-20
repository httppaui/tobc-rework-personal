import { FormEvent, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { changePassword } from '../lib/profileApi';
import { isPasswordValid, PASSWORD_RULES, passwordValidationError } from '../lib/passwordRules';

export function SettingsPage() {
  const { isLoggedIn, authSessionReady, openAuthModal, navigateTo, openLegalModal, openAccessibilityPanel, toast } =
    useApp();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const passwordErr = passwordValidationError(newPassword);
    if (passwordErr) {
      setError(passwordErr);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    const result = await changePassword(currentPassword, newPassword);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast('Password updated', 'success');
  };

  return (
    <section className="section account-page">
      <div className="container account-page-inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>
            Home
          </button>
          <span className="sep">/</span>
          <span className="current" aria-current="page">
            Settings
          </span>
        </nav>
        <h1 className="page-title">Settings &amp; privacy</h1>

        {!authSessionReady ? (
          <p className="page-lede">Loading…</p>
        ) : !isLoggedIn ? (
          <div className="empty-shelf">
            <h2>Sign in required</h2>
            <button type="button" className="btn btn-primary" onClick={() => openAuthModal('login')}>
              Log in
            </button>
          </div>
        ) : (
          <>
            <div className="account-card">
              <h2 className="account-card-title">Change password</h2>
              <form onSubmit={onSubmit}>
                <div className="auth-field">
                  <label htmlFor="currentPassword">Current password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <ul className="auth-password-rules auth-password-rules--static">
                  {PASSWORD_RULES.map((rule) => (
                    <li key={rule.id} className={rule.test(newPassword) ? 'is-met' : ''}>
                      <i
                        className={`bi ${rule.test(newPassword) ? 'bi-check-circle-fill' : 'bi-circle'}`}
                        aria-hidden
                      />
                      {rule.label}
                    </li>
                  ))}
                </ul>
                <div className="auth-field">
                  <label htmlFor="confirmNewPassword">Confirm new password</label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="auth-form-error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || !isPasswordValid(newPassword)}
                >
                  {saving ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </div>

            <div className="account-card">
              <h2 className="account-card-title">Display &amp; accessibility</h2>
              <p className="page-lede" style={{ marginBottom: 12 }}>
                Adjust text size and motion preferences for this device.
              </p>
              <button type="button" className="btn btn-secondary" onClick={openAccessibilityPanel}>
                Open display settings
              </button>
            </div>

            <div className="account-card">
              <h2 className="account-card-title">Legal</h2>
              <p className="page-lede" style={{ marginBottom: 12 }}>
                Review how we handle your data and platform terms.
              </p>
              <div className="account-link-row">
                <button type="button" className="btn btn-secondary" onClick={() => openLegalModal('terms')}>
                  Terms of Use
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => openLegalModal('privacy')}>
                  Privacy Policy
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
