import { BUILDER_STEP_DETAILS, builderStepTitle } from '@/data/builderSteps';
import { SPONSORED_BUSINESSES, BUSINESS_DIRECTORY } from '@/data/businesses';
import { COMMUNITY } from '@/data/community';
import { ECOSYSTEM } from '@/data/ecosystem';
import { BUSINESS_SERVICES, AGENCY_PARTNER, LAUNCHPAD, ZERO_DOLLAR, CHOOSE_YOUR_PATH } from '@/data/partnerships';
import { RESOURCES } from '@/data/resources';
import { BUILD, SITE } from '@/data/site';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, documentTitle } from '@/seo/siteMeta';

export interface PublicPage {
  path: string;
  /** Final document title. */
  title: string;
  description: string;
}

function page(path: string, pageTitle: string, description: string): PublicPage {
  return { path, title: documentTitle(pageTitle), description };
}

/** Public HTML routes. Admin mint and per-user business plans stay out of the sitemap. */
export function listPublicPages(): PublicPage[] {
  const pages: PublicPage[] = [
    { path: '/', title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
    page('/build', 'Start Building Your Business', 'Kick off the W3BB Business Builder — name your brand, describe what you want to build, and our team sets up your workspace.'),
    page('/mint', 'Mint Your Franchise Bundle', 'Connect your wallet and join the waitlist to mint your W3BB Franchise Bundle NFT.'),
    page('/certification', 'Apply for Trust Certification', 'Apply for the W3BB Trust-Approved badge, backed by the Webb Family Dynasty Trust.'),
    page('/enterprise', 'Enterprise Tools for Organizations', 'Bring W3BB Worldwide to your school, nonprofit, or community program.'),
    page('/privacy', 'Privacy Policy', `How ${SITE.fullName} collects, uses, and protects your information.`),
    page('/terms', 'Terms of Use', `Draft terms for using the ${SITE.fullName} website, founder tools, and related services.`),
    page('/partner-services', 'U.S. Business Partner Services', 'A U.S. mailing address, U.S.-based customer support, returns handling, and marketplace compliance guidance for international sellers.'),
    page('/choose-your-path', 'Choose Your Path', CHOOSE_YOUR_PATH.body),
    page('/launchpad', 'Entrepreneur Launchpad', LAUNCHPAD.body),
    page('/zero-dollar-startup', 'Zero-Dollar Startup Path', ZERO_DOLLAR.body),
    page('/agency-partner-program', 'Agency Partner Program', AGENCY_PARTNER.body),
    page('/affiliate-program', 'Affiliate Partnership Program', 'Apply to become a W3BB Worldwide affiliate and earn recurring commissions for every entrepreneur you refer.'),
    page('/business-services', 'Business Services', BUSINESS_SERVICES.body),
    page('/ecosystem', 'The W3BB Worldwide Ecosystem', ECOSYSTEM.body),
    page('/businesses', 'Sponsored Businesses', BUSINESS_DIRECTORY.intro),
    page('/community', 'Community', COMMUNITY.body),
    page('/resources', 'Resources', RESOURCES.sub),
    page('/partner-network', 'Partner Network', 'Private updates and resources for W3BB Franchise Bundle holders.'),
    page('/launch', 'Start Your Business', 'Take the W3BB founder assessment, match a business model, and carry the plan into the Business Builder.'),
    page('/launch/assess', 'Founder Discovery Assessment', 'A saved, multi-step founder assessment covering skills, capital, time, and how you work.'),
    page('/launch/results', 'Founder scores', 'Transparent founder readiness, business launch, and funding readiness scores.'),
    page('/launch/with-ai', 'Launch With AI', 'A launch draft from the founder assessment: name, domain spellings, logo concepts, landing copy, profile drafts, a first campaign, a business plan, and a funding note.'),
    page('/launch/matches', 'Business matches', 'Rules-based business model recommendations for W3BB founders.'),
    page('/launch/blueprint', 'Business blueprint', 'A saved business blueprint you can carry into the W3BB Business Builder.'),
    page('/launch/profile', 'Founder profile', 'Your W3BB founder profile, story, ventures, and progress.'),
    page('/launch/coach', 'Launch coach', 'A launch coach that uses your W3BB assessment, blueprint, and progress.'),
    page('/launch/dashboard', 'Command Center', 'Your W3BB founder command center: scores, blueprint, pathways, funding, and tasks.'),
    page('/launch/funding', 'Funding and grants', 'Sample funding matches for practice. Not live grants.'),
    page('/launch/certifications', 'Certification pathways', 'New W3BB learning pathways that prepare you for Trust-Approved Certification.'),
    page('/launch/account', 'Founder account', 'Sign in to sync your W3BB founder profile, or keep using demo mode.'),
  ];

  for (const item of BUILD.items) {
    pages.push(page(
      `/build/${item.slug}`,
      `Start Building: ${item.title}`,
      `${item.description} Tell us what you want to build and our team sets up your workspace.`,
    ));
  }

  for (const step of BUILDER_STEP_DETAILS) {
    pages.push(page(`/builder/${step.slug}`, builderStepTitle(step.n), step.summary));
  }

  for (const business of SPONSORED_BUSINESSES) {
    pages.push(page(`/businesses/${business.slug}`, business.name, business.tagline));
  }

  for (const service of BUSINESS_SERVICES.services) {
    pages.push(page(`/business-services/${service.slug}`, service.title, service.description));
  }

  return pages;
}

export function sitemapXml(pages: PublicPage[], origin: string): string {
  const urls = pages.map((entry) => `  <url><loc>${origin}${entry.path === '/' ? '/' : entry.path}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
