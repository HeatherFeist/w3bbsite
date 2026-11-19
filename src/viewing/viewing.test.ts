import { describe, expect, it } from 'vitest';
import { liveView } from './live';

describe('remote viewing', () => {
  it('embeds Jitsi and keeps Zoom, Teams, and Meet as links', () => {
    const jitsi = liveView('jitsi', '', 'abc123xyz');
    expect(jitsi.mode).toBe('frame');
    expect(jitsi.src).toBe('https://meet.jit.si/W3BB-abc123xyz');

    const pasted = liveView('jitsi', 'https://meet.jit.si/FamilyRoom', 'abc');
    expect(pasted.src).toBe('https://meet.jit.si/FamilyRoom');

    for (const provider of ['zoom', 'teams', 'meet'] as const) {
      const view = liveView(provider, 'https://example.com/join', 'abc');
      expect(view.mode).toBe('link');
      expect(view.href).toBe('https://example.com/join');
    }
    expect(liveView('zoom', 'javascript:alert(1)', 'abc').href).toBe('');
  });
});
