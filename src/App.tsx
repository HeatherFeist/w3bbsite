import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { FounderProvider } from "@/founder/context";
const WalletShell = lazy(() => import("@/components/WalletShell"));

const Index = lazy(() => import("./pages/Index"));
const Build = lazy(() => import("./pages/Build"));
const BuilderStep = lazy(() => import("./pages/BuilderStep"));
const Mint = lazy(() => import("./pages/Mint"));
const AdminMint = lazy(() => import("./pages/AdminMint"));
const CertificationPage = lazy(() => import("./pages/CertificationPage"));
const BusinessPlan = lazy(() => import("./pages/BusinessPlan"));
const EnterprisePage = lazy(() => import("./pages/EnterprisePage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const PartnerServices = lazy(() => import("./pages/PartnerServices"));
const ChooseYourPath = lazy(() => import("./pages/ChooseYourPath"));
const Launchpad = lazy(() => import("./pages/Launchpad"));
const ZeroDollarStartup = lazy(() => import("./pages/ZeroDollarStartup"));
const AgencyPartnerProgram = lazy(() => import("./pages/AgencyPartnerProgram"));
const AffiliateProgram = lazy(() => import("./pages/AffiliateProgram"));
const BusinessServices = lazy(() => import("./pages/BusinessServices"));
const Ecosystem = lazy(() => import("./pages/Ecosystem"));
const BusinessDirectory = lazy(() => import("./pages/BusinessDirectory"));
const BusinessProfile = lazy(() => import("./pages/BusinessProfile"));
const Community = lazy(() => import("./pages/Community"));
const Resources = lazy(() => import("./pages/Resources"));
const PartnerNetwork = lazy(() => import("./pages/PartnerNetwork"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LaunchHome = lazy(() => import("@/founder/pages/LaunchHome"));
const AssessmentPage = lazy(() => import("@/founder/pages/AssessmentPage"));
const ResultsPage = lazy(() => import("@/founder/pages/ResultsPage"));
const LaunchWithAiPage = lazy(() => import("@/founder/pages/LaunchWithAiPage"));
const MatchesPage = lazy(() => import("@/founder/pages/MatchesPage"));
const BlueprintPage = lazy(() => import("@/founder/pages/BlueprintPage"));
const ProfilePage = lazy(() => import("@/founder/pages/ProfilePage"));
const CoachPage = lazy(() => import("@/founder/pages/CoachPage"));
const DashboardPage = lazy(() => import("@/founder/pages/DashboardPage"));
const FundingPage = lazy(() => import("@/founder/pages/FundingPage"));
const CertificationsPage = lazy(() => import("@/founder/pages/CertificationsPage"));
const AccountPage = lazy(() => import("@/founder/pages/AccountPage"));

const queryClient = new QueryClient();

function PageFallback() {
  return <div className="min-h-screen bg-[#07080C]" role="status" aria-live="polite" aria-label="Loading page" />;
}

function WalletPage({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <WalletShell>{children}</WalletShell>
    </Suspense>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FounderProvider>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/build" element={<Build />} />
                <Route path="/build/:category" element={<Build />} />
                <Route path="/builder/:slug" element={<BuilderStep />} />
                <Route path="/mint" element={<WalletPage><Mint /></WalletPage>} />
                <Route path="/admin/mint" element={<WalletPage><AdminMint /></WalletPage>} />
                <Route path="/certification" element={<CertificationPage />} />
                <Route path="/business-plan/:bundleId" element={<BusinessPlan />} />
                <Route path="/enterprise" element={<EnterprisePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/partner-services" element={<PartnerServices />} />
                <Route path="/choose-your-path" element={<ChooseYourPath />} />
                <Route path="/launchpad" element={<Launchpad />} />
                <Route path="/zero-dollar-startup" element={<ZeroDollarStartup />} />
                <Route path="/agency-partner-program" element={<AgencyPartnerProgram />} />
                <Route path="/affiliate-program" element={<AffiliateProgram />} />
                <Route path="/business-services" element={<BusinessServices />} />
                <Route path="/business-services/:service" element={<BusinessServices />} />
                <Route path="/ecosystem" element={<Ecosystem />} />
                <Route path="/businesses" element={<BusinessDirectory />} />
                <Route path="/businesses/:slug" element={<BusinessProfile />} />
                <Route path="/community" element={<Community />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/partner-network" element={<WalletPage><PartnerNetwork /></WalletPage>} />
                <Route path="/launch" element={<LaunchHome />} />
                <Route path="/launch/assess" element={<AssessmentPage />} />
                <Route path="/launch/results" element={<ResultsPage />} />
                <Route path="/launch/with-ai" element={<LaunchWithAiPage />} />
                <Route path="/launch/matches" element={<MatchesPage />} />
                <Route path="/launch/blueprint" element={<BlueprintPage />} />
                <Route path="/launch/profile" element={<ProfilePage />} />
                <Route path="/launch/coach" element={<CoachPage />} />
                <Route path="/launch/dashboard" element={<DashboardPage />} />
                <Route path="/launch/funding" element={<FundingPage />} />
                <Route path="/launch/certifications" element={<CertificationsPage />} />
                <Route path="/launch/account" element={<AccountPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </FounderProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
