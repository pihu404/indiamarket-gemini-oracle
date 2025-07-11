
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { mockAnalyzeStock } from "./utils/mockApi";

const queryClient = new QueryClient();

// Mock API endpoint for stock analysis
(globalThis as any).fetch = new Proxy((globalThis as any).fetch, {
  apply: async (target, thisArg, args) => {
    const [url, options] = args;
    
    // Intercept our stock analysis API calls
    if (url === '/api/analyze-stock' && options?.method === 'POST') {
      try {
        const body = JSON.parse(options.body);
        const result = await mockAnalyzeStock(body.symbol);
        
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Analysis failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // For all other requests, use the original fetch
    return target.apply(thisArg, args);
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
