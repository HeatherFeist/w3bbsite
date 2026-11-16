
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ThemeProvider } from "@/components/theme-provider";
import { wagmiConfig } from "@/lib/wagmi";
import Index from "./pages/Index";
import Build from "./pages/Build";
import BuilderStep from "./pages/BuilderStep";
import Mint from "./pages/Mint";
import AdminMint from "./pages/AdminMint";
import CertificationPage from "./pages/CertificationPage";
import BusinessPlan from "./pages/BusinessPlan";
import EnterprisePage from "./pages/EnterprisePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PartnerServices from "./pages/PartnerServices";
import ChooseYourPath from "./pages/ChooseYourPath";
import Launchpad from "./pages/Launchpad";
import ZeroDollarStartup from "./pages/ZeroDollarStartup";
import AgencyPartnerProgram from "./pages/AgencyPartnerProgram";
import AffiliateProgram from "./pages/AffiliateProgram";
import BusinessServices from "./pages/BusinessServices";
import Ecosystem from "./pages/Ecosystem";
import BusinessDirectory from "./pages/BusinessDirectory";
import BusinessProfile from "./pages/BusinessProfile";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import PartnerNetwork from "./pages/PartnerNetwork";
import NotFound from "./pages/NotFound";
import { FounderProvider } from "@/founder/context";
import LaunchHome from "@/founder/pages/LaunchHome";
import AssessmentPage from "@/founder/pages/AssessmentPage";
import ResultsPage from "@/founder/pages/ResultsPage";
import MatchesPage from "@/founder/pages/MatchesPage";
import BlueprintPage from "@/founder/pages/BlueprintPage";
import ProfilePage from "@/founder/pages/ProfilePage";
import CoachPage from "@/founder/pages/CoachPage";
import DashboardPage from "@/founder/pages/DashboardPage";
import FundingPage from "@/founder/pages/FundingPage";
import CertificationsPage from "@/founder/pages/CertificationsPage";
import AccountPage from "@/founder/pages/AccountPage";

const queryClient = new QueryClient();

const rainbowKitTheme = darkTheme({
  accentColor: "#7C4DFF",
  accentColorForeground: "#FFFFFF",
  borderRadius: "large",
  overlayBlur: "small",
});

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <FounderProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/build" element={<Build />} />
                <Route path="/build/:category" element={<Build />} />
                <Route path="/builder/:slug" element={<BuilderStep />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/admin/mint" element={<AdminMint />} />
                <Route path="/certification" element={<CertificationPage />} />
                <Route path="/business-plan/:bundleId" element={<BusinessPlan />} />
                <Route path="/enterprise" element={<EnterprisePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
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
                <Route path="/partner-network" element={<PartnerNetwork />} />
                <Route path="/launch" element={<LaunchHome />} />
                <Route path="/launch/assess" element={<AssessmentPage />} />
                <Route path="/launch/results" element={<ResultsPage />} />
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
              </FounderProvider>
            </BrowserRouter>
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </ThemeProvider>
);

export default App;
