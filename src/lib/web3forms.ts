/**
 * Web3Forms (web3forms.com) sends the actual emails for every lead-capture
 * form on the site: a notification to the site owner's inbox for every
 * submission, and (if enabled in the Web3Forms dashboard for this access
 * key) an auto-reply confirmation to whoever submitted the form.
 *
 * The access key is designed to be used directly from the browser — unlike
 * a typical email-provider API key, Web3Forms' key only ever lets someone
 * submit a form through it, never read data back, so it's safe to ship in
 * the frontend bundle.
 */
const WEB3FORMS_ACCESS_KEY = 'e9d03d1b-38f3-4e79-ae9a-d131ffb41090';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export interface Web3FormsSubmission {
  subject: string;
  name: string;
  email: string;
  interest: string;
  source: string;
  organization?: string;
  message?: string;
  /** Anything else worth including in the notification email. */
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget: never throws. A saved database record (see
 * useLeadCapture) is the durable source of truth for a submission — a
 * flaky email send should never block the success state a real visitor
 * sees, the same way analytics failures don't.
 */
export async function sendWeb3FormsNotification(input: Web3FormsSubmission): Promise<void> {
  try {
    await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: input.subject,
        from_name: 'W3BB Worldwide Website',
        name: input.name,
        email: input.email,
        organization: input.organization || 'n/a',
        interest: input.interest,
        source: input.source,
        message: input.message || '(no message)',
        ...(input.metadata && Object.keys(input.metadata).length > 0
          ? { additional_details: JSON.stringify(input.metadata) }
          : {}),
      }),
    });
  } catch {
    /* email must never break the page — the database record already has this submission */
  }
}
