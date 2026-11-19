import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';
import { useFounder } from './useFounder';
import type { Factor } from './types';

const LINKS = [
  ['/launch', 'Overview'],
  ['/launch/assess', 'Assessment'],
  ['/launch/results', 'Results'],
  ['/launch/with-ai', 'Launch With AI'],
  ['/launch/matches', 'Matches'],
  ['/launch/blueprint', 'Blueprint'],
  ['/launch/dashboard', 'Command Center'],
  ['/launch/coach', 'Coach'],
  ['/launch/funding', 'Funding'],
  ['/launch/certifications', 'Pathways'],
  ['/launch/profile', 'Profile'],
] as const;

export const fieldClass =
  'mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-white/45 transition-colors hover:border-white/25 focus:border-cyan focus:bg-white/[0.06] focus:outline-none';

export const labelClass = 'block text-sm font-medium text-white/85';

export function ModeBanner() {
  const { supabaseConfigured, userEmail, syncNote, signOut } = useFounder();
  let message = 'Demo mode. Progress is saved in this browser only. Connect Supabase to sync an account, and add a server-side AI key for the hosted coach. The on-device advisor works either way.';
  if (supabaseConfigured && userEmail) {
    message = `Signed in as ${userEmail}. ${syncNote ?? 'Your founder account is connected.'}`;
  } else if (supabaseConfigured) {
    message = 'Supabase is configured. You can keep going in this browser, or sign in to sync. The hosted coach still needs a server-side AI key.';
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/[0.08] px-4 py-3 text-sm leading-relaxed text-white/85" role="status">
      <p>{message}</p>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/launch/account" className="font-medium text-gold underline decoration-gold/40 underline-offset-4">
          {userEmail ? 'Account' : 'Founder account'}
        </Link>
        {userEmail ? (
          <button type="button" onClick={() => void signOut()} className="font-medium text-white/80 underline decoration-white/30 underline-offset-4">
            Sign out
          </button>
        ) : null}
      </p>
    </div>
  );
}

export function FounderNav() {
  return (
    <nav aria-label="Launch sections" className="mt-6 -mx-1 flex gap-2 overflow-x-auto pb-1">
      {LINKS.map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/launch'}
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-white text-[#16141a]' : 'border border-white/10 text-white/75 hover:border-white/25 hover:text-white',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function FounderFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  usePageMeta(title, description);
  return (
    <PageShell>
      <div className="container pb-24 pt-28">
        <ModeBanner />
        <FounderNav />
        <div className="mt-10">{children}</div>
      </div>
    </PageShell>
  );
}

export function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const gradientId = `score-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col items-center text-center">
      <svg viewBox="0 0 120 120" className="h-28 w-28" role="img" aria-label={`${label}: ${score} out of 100`}>
        <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="66" textAnchor="middle" fill="#ffffff" fontSize="28" fontFamily="Space Grotesk, sans-serif">
          {score}
        </text>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6b4e9e" />
            <stop offset="55%" stopColor="#f0c674" />
            <stop offset="100%" stopColor="#d4a24a" />
          </linearGradient>
        </defs>
      </svg>
      <p className="mt-2 max-w-[9rem] text-sm font-medium text-white/85">{label}</p>
    </div>
  );
}

export function FactorList({ factors }: { factors: Factor[] }) {
  return (
    <ul className="space-y-4">
      {factors.map((factor) => (
        <li key={factor.id}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-white/85">{factor.label}</span>
            <span className="font-mono text-xs text-white/70">
              {factor.points.toFixed(1)} / {factor.weight}
            </span>
          </div>
          <div
            className="mt-1.5 h-1.5 rounded-full bg-white/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={factor.percent}
            aria-label={`${factor.label} signal`}
          >
            <div className="h-full rounded-full bg-gradient-to-r from-violet to-cyan" style={{ width: `${factor.percent}%` }} />
          </div>
          <p className="mt-1 text-xs text-white/70">Weight {factor.weight}. Your signal is {factor.percent}% of that weight.</p>
        </li>
      ))}
    </ul>
  );
}

export function Meter({ value, label }: { value: number; label: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-white/85">{label}</span>
        <span className="font-mono text-xs text-white/70">{safe}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe} aria-label={label}>
        <div className="h-full rounded-full bg-gradient-to-r from-violet via-cyan to-gold" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

export function PrimaryLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="cta-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold text-white">
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export function QuietLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="glass-soft inline-flex items-center justify-center rounded-full px-6 py-3 font-display text-sm font-semibold text-white/85 hover:text-white">
      {children}
    </Link>
  );
}
