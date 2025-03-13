
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import { Footer } from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          {/* Ad banner container - left side */}
          <div className="fixed left-0 top-0 bottom-0 w-[160px] hidden lg:block z-[60]">
            <div className="h-full flex items-center justify-center pt-[100px]">
              <div data-banner-id="305011" data-ad-format="vertical"></div>
            </div>
          </div>
          
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <Toaster />
          </div>
          
          {/* Ad banner container - right side */}
          <div className="fixed right-0 top-0 bottom-0 w-[160px] hidden lg:block z-[60]">
            <div className="h-full flex items-center justify-center pt-[100px]">
              <div data-banner-id="305011" data-ad-format="vertical"></div>
            </div>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
