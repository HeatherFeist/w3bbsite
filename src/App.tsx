
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
import Mint from "./pages/Mint";
import CertificationPage from "./pages/CertificationPage";
import EnterprisePage from "./pages/EnterprisePage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PartnerServices from "./pages/PartnerServices";
import ChooseYourPath from "./pages/ChooseYourPath";
import Launchpad from "./pages/Launchpad";
import ZeroDollarStartup from "./pages/ZeroDollarStartup";
import AgencyPartnerProgram from "./pages/AgencyPartnerProgram";
import AffiliateProgram from "./pages/AffiliateProgram";
import BusinessServices from "./pages/BusinessServices";
import NotFound from "./pages/NotFound";

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
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/build" element={<Build />} />
                <Route path="/mint" element={<Mint />} />
                <Route path="/certification" element={<CertificationPage />} />
                <Route path="/enterprise" element={<EnterprisePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/partner-services" element={<PartnerServices />} />
                <Route path="/choose-your-path" element={<ChooseYourPath />} />
                <Route path="/launchpad" element={<Launchpad />} />
                <Route path="/zero-dollar-startup" element={<ZeroDollarStartup />} />
                <Route path="/agency-partner-program" element={<AgencyPartnerProgram />} />
                <Route path="/affiliate-program" element={<AffiliateProgram />} />
                <Route path="/business-services" element={<BusinessServices />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </ThemeProvider>
);

export default App;
