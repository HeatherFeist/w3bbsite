/** Path patterns for every route registered in App.tsx. */
export const APP_ROUTES = [
  '/',
  '/build',
  '/build/:category',
  '/builder/:slug',
  '/mint',
  '/admin/mint',
  '/certification',
  '/business-plan/:bundleId',
  '/enterprise',
  '/privacy',
  '/partner-services',
  '/choose-your-path',
  '/launchpad',
  '/zero-dollar-startup',
  '/agency-partner-program',
  '/affiliate-program',
  '/business-services',
  '/business-services/:service',
  '/ecosystem',
  '/businesses',
  '/businesses/:slug',
  '/community',
  '/resources',
  '/partner-network',
  '/launch',
  '/launch/assess',
  '/launch/results',
  '/launch/matches',
  '/launch/blueprint',
  '/launch/profile',
  '/launch/coach',
  '/launch/dashboard',
  '/launch/funding',
  '/launch/certifications',
  '/launch/account',
] as const;

export function pathnameOf(href: string): string {
  const withoutHash = href.split('#')[0] ?? '';
  const withoutQuery = withoutHash.split('?')[0] ?? '';
  if (!withoutQuery || withoutQuery === '') return '/';
  return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
}

export function matchesAppRoute(href: string, routes: readonly string[] = APP_ROUTES): boolean {
  if (/^https?:\/\//.test(href) || href.startsWith('mailto:')) return false;
  const path = pathnameOf(href);
  return routes.some((pattern) => {
    const expression = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`);
    return expression.test(path);
  });
}
