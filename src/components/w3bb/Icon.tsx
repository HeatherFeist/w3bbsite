import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Store,
  Fingerprint,
  Palette,
  Package,
  Workflow,
  Megaphone,
  Clapperboard,
  Route,
  Coins,
  School,
  Heart,
  Users,
  Landmark,
  Rocket,
  GraduationCap,
  Wrench,
  ScrollText,
  Globe,
  Hexagon,
  Cpu,
  Link2,
  TrendingUp,
  Home,
  Building2,
  Handshake,
  Infinity as InfinityIcon,
  type LucideProps,
} from 'lucide-react';
import type { IconName } from '@/data/site';

const MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  badge: BadgeCheck,
  store: Store,
  fingerprint: Fingerprint,
  palette: Palette,
  package: Package,
  workflow: Workflow,
  megaphone: Megaphone,
  clapperboard: Clapperboard,
  route: Route,
  coins: Coins,
  school: School,
  heart: Heart,
  users: Users,
  landmark: Landmark,
  rocket: Rocket,
  graduation: GraduationCap,
  wrench: Wrench,
  scroll: ScrollText,
  globe: Globe,
  hexagon: Hexagon,
  cpu: Cpu,
  link: Link2,
  trending: TrendingUp,
  home: Home,
  building: Building2,
  handshake: Handshake,
  infinity: InfinityIcon,
};

interface IconProps extends LucideProps {
  name: IconName;
}

/** Renders a line icon from the shared icon set. */
export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp strokeWidth={1.5} aria-hidden="true" {...props} />;
};

export default Icon;
