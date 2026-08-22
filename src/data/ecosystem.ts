/**
 * Content for the /ecosystem page — the public explanation of the
 * CDI → W3BB → Sponsored Business pipeline.
 */
import { Heart, Cpu, Store, type LucideIcon } from 'lucide-react';

export interface EcosystemLayer {
  n: string;
  name: string;
  title: string;
  icon: LucideIcon;
  description: string;
  provides: string[];
  tagline: string;
}

export const ECOSYSTEM = {
  eyebrow: 'THE W3BB WORLDWIDE ECOSYSTEM',
  heading: 'One Ecosystem. Three Layers.',
  sub: 'A self-sustaining entrepreneurial ecosystem built on community, technology, and trust.',
  body: 'W3BB Worldwide is a digital business ecosystem designed to help creators, entrepreneurs, and small businesses build, certify, launch, and scale their ventures — all within a supportive community backed by nonprofit resources. The ecosystem has three layers, each with a unique role.',
  layers: [
    {
      n: '01',
      name: 'CDI',
      title: 'The Nonprofit Backbone',
      icon: Heart,
      description: 'CDI empowers people who want to start businesses but need guidance, resources, or support.',
      provides: [
        'Community support',
        'Volunteer programs',
        'Training',
        'Youth development',
        'Nonprofit legitimacy',
        'Access to grants and community funding',
      ],
      tagline: 'CDI is the heart of the ecosystem.',
    },
    {
      n: '02',
      name: 'W3BB Worldwide',
      title: 'The Digital Hub',
      icon: Cpu,
      description: 'W3BB is the platform where businesses are built, packaged, certified, launched, showcased, sold, and scaled.',
      provides: [
        'The Business Builder',
        'The Franchise Bundle system',
        'The Certification layer',
        'The Marketplace',
        'The digital infrastructure',
        'The community network',
      ],
      tagline: 'W3BB is the brain of the ecosystem.',
    },
    {
      n: '03',
      name: 'Sponsored Businesses',
      title: 'The Network',
      icon: Store,
      description: 'These are the ventures built inside the ecosystem, each with its own brand, website, and revenue stream.',
      provides: [
        'Supported by CDI',
        'Powered by W3BB',
        'Can be certified',
        'Can sell Franchise Bundles',
        'Can earn royalties',
        'Can grow independently',
      ],
      tagline: 'Sponsored businesses are the hands of the ecosystem.',
    },
  ] satisfies EcosystemLayer[],
  flowHeading: 'How It All Works Together',
  flow: [
    'A creator joins CDI',
    "They use W3BB's Business Builder to create a full business",
    'They launch their business through W3BB',
    'They can get Trust-Approved Certification',
    'They can mint and sell Franchise Bundles',
    'They earn royalties every time their bundle is resold',
    'Their business becomes part of the W3BB Sponsored Network',
    'CDI continues supporting them with training, volunteers, and community programs',
  ],
  outcomeHeading: 'This Creates a Self-Sustaining Entrepreneurial Ecosystem',
  outcomes: [
    'Creators thrive',
    'Communities grow',
    'Businesses multiply',
    'Knowledge circulates',
    'Revenue flows',
    'Everyone benefits',
  ],
};
