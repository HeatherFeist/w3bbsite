import React, { useState } from 'react';
import { fieldClass, FounderFrame, labelClass } from '../components';
import { useFounder } from '../useFounder';

const AccountPage: React.FC = () => {
  const { supabaseConfigured, userEmail, signIn, signUp } = useFounder();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = mode === 'in' ? await signIn(email, password) : await signUp(email, password, name);
    setBusy(false);
    setMessage(result ?? (mode === 'in' ? 'Signed in.' : 'Account ready.'));
  };

  return (
    <FounderFrame title="Founder account" description="Sign in to sync your W3BB founder profile, or keep using demo mode.">
      <h1 className="font-display text-4xl font-semibold text-white">Founder account</h1>
      {userEmail ? <p className="mt-4 text-white/80">You are signed in as {userEmail}.</p> : null}
      {!supabaseConfigured ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
          Demo mode is active because VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set. The assessment, blueprint, coach, and dashboard still work. Progress stays in this browser. The existing W3BB lead forms are unchanged and use their own database client.
        </p>
      ) : (
        <form className="mt-8 max-w-md space-y-4" onSubmit={submit}>
          <div className="flex gap-2" role="group" aria-label="Account action">
            <button type="button" className={`rounded-full px-4 py-2 text-sm ${mode === 'in' ? 'bg-white text-[#07080C]' : 'border border-white/15 text-white/80'}`} onClick={() => setMode('in')}>Sign in</button>
            <button type="button" className={`rounded-full px-4 py-2 text-sm ${mode === 'up' ? 'bg-white text-[#07080C]' : 'border border-white/15 text-white/80'}`} onClick={() => setMode('up')}>Create account</button>
          </div>
          {mode === 'up' ? (
            <div>
              <label htmlFor="account-name" className={labelClass}>Name</label>
              <input id="account-name" className={fieldClass} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
          ) : null}
          <div>
            <label htmlFor="account-email" className={labelClass}>Email</label>
            <input id="account-email" type="email" autoComplete="email" required className={fieldClass} value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label htmlFor="account-password" className={labelClass}>Password</label>
            <input
              id="account-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
              className={fieldClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button type="submit" className="cta-primary rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-50" disabled={busy}>
            {busy ? 'Working…' : mode === 'in' ? 'Sign in' : 'Create account'}
          </button>
          {message ? <p className="text-sm text-white/85" role="status">{message}</p> : null}
        </form>
      )}
    </FounderFrame>
  );
};

export default AccountPage;
