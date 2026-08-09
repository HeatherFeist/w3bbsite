import { useState } from 'react';
import { db } from '@/lib/db';

export type LeadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LeadInput {
  name: string;
  email: string;
  interest: string;
  source: string;
  organization?: string;
  message?: string;
  metadata?: Record<string, unknown>;
  /** Honeypot field value — leave the input empty for real users; bots that
   *  auto-fill every field trip it, and we silently no-op instead of hitting
   *  the CRM. */
  honeypot?: string;
}

/**
 * Shared submit path for every lead-capture form on the site (contact,
 * build intake, certification application, enterprise inquiry, mint
 * waitlist). Writes to the CRM RPC and keeps a full copy in
 * w3bb_enquiries, same as the original contact form.
 */
export function useLeadCapture() {
  const [status, setStatus] = useState<LeadStatus>('idle');
  const [error, setError] = useState('');

  const submit = async (input: LeadInput) => {
    setStatus('loading');
    setError('');

    if (input.honeypot) {
      // Bot filled the trap field — pretend success without touching the CRM.
      setStatus('success');
      return true;
    }

    try {
      const { error: crmError } = await db.rpc('crm_submit_contact', {
        p_email: input.email.trim(),
        p_name: input.name.trim(),
        p_phone: null,
        p_sms_opt_in: false,
        p_source: input.source,
        p_metadata: {
          organization: input.organization?.trim() ?? '',
          interest: input.interest,
          message: input.message?.trim() ?? '',
          ...input.metadata,
        },
      });
      if (crmError) throw crmError;

      await db.from('w3bb_enquiries').insert({
        name: input.name.trim(),
        email: input.email.trim(),
        organization: input.organization?.trim() || null,
        interest: input.interest,
        message: input.message?.trim() || null,
      });

      try {
        window.supercool?.track?.('form_submit', { form: input.source, interest: input.interest });
      } catch {
        /* analytics must never break the page */
      }

      setStatus('success');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
      return false;
    }
  };

  const reset = () => {
    setStatus('idle');
    setError('');
  };

  return { status, error, submit, reset };
}
