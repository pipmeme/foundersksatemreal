import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminRoute from "@/components/AdminRoute";
import Layout from "@/components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";

// Eager load homepage
import Index from "./pages/Index";

// Lazy load all other pages
const FounderStories = lazy(() => import("./pages/FounderStories"));
const About = lazy(() => import("./pages/About"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));
const Insights = lazy(() => import("./pages/Insights"));
const InsightDetail = lazy(() => import("./pages/InsightDetail"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ArticleEditor = lazy(() => import("./pages/ArticleEditor"));
const StartupGuide = lazy(() => import("./pages/StartupGuide"));
const MisaLicenseGuide = lazy(() => import("./pages/MisaLicenseGuide"));
const BusinessFAQ = lazy(() => import("./pages/BusinessFAQ"));
const PremiumResidency = lazy(() => import("./pages/PremiumResidency"));
const IncubatorsGuide = lazy(() => import("./pages/IncubatorsGuide"));
const CompanyRegistration = lazy(() => import("./pages/CompanyRegistration"));
const FoundersPlaybook = lazy(() => import("./pages/FoundersPlaybook"));
const RisingFounders = lazy(() => import("./pages/RisingFounders"));
const FreeKickstart = lazy(() => import("./pages/FreeKickstart"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/stories" element={<FounderStories />} />
                  <Route path="/stories/:id" element={<StoryDetail />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/insights/:id" element={<InsightDetail />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/new" element={<AdminRoute><ArticleEditor /></AdminRoute>} />
                  <Route path="/admin/edit/:id" element={<AdminRoute><ArticleEditor /></AdminRoute>} />
                  <Route path="/startup-guide" element={<StartupGuide />} />
                  <Route path="/startup-guide/misa-license" element={<MisaLicenseGuide />} />
                  <Route path="/startup-guide/business-faq" element={<BusinessFAQ />} />
                  <Route path="/startup-guide/premium-residency" element={<PremiumResidency />} />
                  <Route path="/startup-guide/incubators" element={<IncubatorsGuide />} />
                  <Route path="/startup-guide/company-registration" element={<CompanyRegistration />} />
                  <Route path="/founders-playbook" element={<FoundersPlaybook />} />
                  <Route path="/rising-founders" element={<RisingFounders />} />
                  <Route path="/free-kickstart" element={<FreeKickstart />} />
                  <Route path="/about" element={<About />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
