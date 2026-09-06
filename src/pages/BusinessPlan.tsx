import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Loader2, Printer, ShieldCheck } from 'lucide-react';
import PageShell from '@/components/PageShell';
import Reveal from '@/components/w3bb/Reveal';
import { getFranchiseBundle } from '@/lib/franchiseBundle';
import type { FranchiseBundleRecord } from '@/types/franchiseBundle';
import { usePageMeta } from '@/hooks/usePageMeta';

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' });

const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

/**
 * Lender-facing presentation of a Franchise Bundle: the business's operating
 * plan, itemized asset list, and total asset value, laid out for a
 * screen-share with a loan officer or a printout. Read by bundle id only —
 * see supabase/schema.sql for why that's safe without a site-wide auth
 * system.
 *
 * This is a structured RECORD of real assets and an operating plan, in
 * support of a small-business loan application. It is NOT an investment
 * offering, ownership stake, or profit-sharing arrangement — nothing on
 * this page should ever be worded that way.
 */
const BusinessPlan: React.FC = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const [bundle, setBundle] = useState<FranchiseBundleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  usePageMeta(
    bundle ? `${bundle.businessName} — Loan Documentation` : 'Loan Documentation',
    'A structured business plan and itemized asset record prepared for a small-business loan application.',
  );

  useEffect(() => {
    let cancelled = false;
    if (!bundleId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    getFranchiseBundle(bundleId)
      .then((result) => {
        if (!cancelled) setBundle(result);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load this record.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bundleId]);

  if (loading) {
    return (
      <PageShell>
        <section className="flex min-h-[60vh] items-center justify-center py-28 pt-36 sm:pt-40">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" aria-hidden="true" />
        </section>
      </PageShell>
    );
  }

  if (!bundle || loadError) {
    return (
      <PageShell>
        <section className="relative flex min-h-[60vh] items-center py-28 pt-36 sm:pt-40">
          <div className="container">
            <div className="mx-auto max-w-xl text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-gold/80" aria-hidden="true" />
              <h1 className="mt-5 font-display text-3xl font-semibold text-white sm:text-4xl">
                We couldn't find that loan documentation record.
              </h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65">
                {loadError || 'The link may be off, or this business plan may not have been saved yet.'}
              </p>
              <Link
                to="/build"
                className="cta-primary group mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Start the Business Builder
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const money = currencyFormatter(bundle.currency);

  return (
    <PageShell>
      <style>{`
        @media print {
          nav, footer, .print\\:hidden { display: none !important; }
          body, .print-surface { background: #ffffff !important; color: #111319 !important; }
          .print-surface * { color: inherit; }
          .print-surface .print-card { border-color: #d8dae0 !important; background: #ffffff !important; box-shadow: none !important; }
        }
      `}</style>
      <section className="print-surface relative scroll-mt-24 py-28 pt-36 sm:py-32 sm:pt-40">
        <div className="container max-w-4xl">
          <Reveal className="print:hidden">
            <Link
              to="/build"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Business Builder
            </Link>
          </Reveal>

          <Reveal delay={60} className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="micro-label gradient-text">LOAN DOCUMENTATION</span>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {bundle.businessName}
              </h1>
              <p className="mt-2 text-sm text-white/60">
                {bundle.industry} · Prepared {dateFormatter.format(new Date(bundle.createdAt))}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="print:hidden glass-soft inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 font-display text-sm font-semibold text-white/85 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print / Save as PDF
            </button>
          </Reveal>

          <Reveal delay={100} className="print-card glass mt-8 rounded-2xl border border-white/10 p-5 sm:p-6">
            <p className="flex items-start gap-2.5 text-xs leading-relaxed text-white/60 sm:text-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden="true" />
              This document is a structured record of {bundle.businessName}'s real assets, their
              costs, and its operating plan — prepared for review by a bank or loan officer in
              support of a small-business loan application. It is not an investment offering: it
              does not represent a claim on profits, an ownership percentage, or expected
              appreciation.
              {bundle.status === 'minted' ? (
                <> This record is also verified on-chain as W3BB Franchise Bundle #{bundle.tokenId}.</>
              ) : (
                <> It has not yet been minted as a verified Franchise Bundle NFT.</>
              )}
            </p>
          </Reveal>

          <Reveal delay={140} className="print-card glass mt-6 rounded-2xl border border-white/10 p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-white">Operating Plan</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/75 sm:text-base">
              {bundle.description.trim() || 'No operating plan has been added yet.'}
            </p>
          </Reveal>

          <Reveal delay={180} className="print-card glass mt-6 rounded-2xl border border-white/10 p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-white">Itemized Business Assets</h2>
              <p className="font-display text-sm text-white/60">
                {bundle.assets.length} {bundle.assets.length === 1 ? 'asset' : 'assets'}
              </p>
            </div>

            {bundle.assets.length === 0 ? (
              <p className="mt-4 text-sm text-white/55">No itemized assets have been added yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
                      <th className="py-2.5 pr-4 font-medium">Asset</th>
                      <th className="py-2.5 pr-4 font-medium">Description</th>
                      <th className="py-2.5 pl-4 text-right font-medium">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bundle.assets.map((asset) => (
                      <tr key={asset.id} className="border-b border-white/[0.06] last:border-0">
                        <td className="py-3 pr-4 font-medium text-white/90">{asset.name}</td>
                        <td className="py-3 pr-4 text-white/60">{asset.description || '—'}</td>
                        <td className="py-3 pl-4 text-right font-mono text-white/85">
                          {currencyFormatter(asset.currency).format(asset.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className="pt-4 text-right font-display text-sm font-semibold text-white/80">
                        Total Asset Value
                      </td>
                      <td className="pt-4 text-right font-mono text-lg font-semibold text-white">
                        {money.format(bundle.totalAssetValue)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </Reveal>

          <Reveal delay={220} className="print-card glass mt-6 rounded-2xl border border-white/10 p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-white">Prepared By</h2>
            <p className="mt-2 text-sm text-white/70">
              {bundle.contactName} · {bundle.contactEmail}
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
};

export default BusinessPlan;
