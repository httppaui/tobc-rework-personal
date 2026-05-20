import { FormEvent, useEffect, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { updateProfileName } from '../lib/profileApi';

export function ProfilePage() {
  const { user, isLoggedIn, authSessionReady, openAuthModal, navigateTo, toast, updateSessionUser } = useApp();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const result = await updateProfileName(name.trim());
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    updateSessionUser(result.user);
    toast('Profile updated', 'success');
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
            Profile
          </span>
        </nav>
        <h1 className="page-title">Profile</h1>

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
          <form className="account-card" onSubmit={onSubmit}>
            <div className="auth-field">
              <label htmlFor="profileEmail">Email</label>
              <input id="profileEmail" type="email" value={user?.email ?? ''} disabled />
            </div>
            <div className="auth-field">
              <label htmlFor="profileName">Full name</label>
              <input
                id="profileName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="auth-form-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
