import type { LucideIcon } from 'lucide-react';
import { Youtube } from 'lucide-react';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Only URLs that resolved when checked on 16 Nov 2026.
 * Hidden until Heather confirms a live profile:
 * - X: https://x.com/w3bbworldwide (404)
 * - GitHub: https://github.com/w3bbworldwide (404)
 * - LinkedIn: https://www.linkedin.com/company/w3bbworldwide (404 to a crawler)
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'W3BB Worldwide on YouTube',
    href: 'https://www.youtube.com/@w3bbworldwide',
    icon: Youtube,
  },
];
