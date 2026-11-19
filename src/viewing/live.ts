import type { LiveProvider } from './types';

export interface LiveView {
  mode: 'frame' | 'link';
  src: string;
  href: string;
  note: string;
}

function safeHttp(url: string): string {
  const trimmed = url.trim();
  if (!/^https:\/\//i.test(trimmed)) return '';
  return trimmed;
}

/** Jitsi can sit inside the page. Zoom, Teams, and Meet open in their own window. */
export function liveView(provider: LiveProvider, liveUrl: string, code: string): LiveView {
  const given = safeHttp(liveUrl);
  if (provider === 'jitsi') {
    const room = given
      ? given.replace(/\/$/, '')
      : `https://meet.jit.si/W3BB-${code}`;
    return {
      mode: 'frame',
      src: room,
      href: room,
      note: 'The service plays in this page. Anyone with the private link can join.',
    };
  }
  const labels: Record<Exclude<LiveProvider, 'jitsi'>, string> = {
    zoom: 'Zoom',
    teams: 'Microsoft Teams',
    meet: 'Google Meet',
  };
  return {
    mode: 'link',
    src: '',
    href: given,
    note: `${labels[provider]} does not allow the meeting to be embedded. The button opens it in a new window.`,
  };
}
