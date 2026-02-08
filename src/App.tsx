import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmpresaThemeProvider } from "@/contexts/EmpresaThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Empresa
import EmpresaClientes from "./pages/empresa/Clientes";
import EmpresaClienteDetalhe from "./pages/empresa/ClienteDetalhe";
import EmpresaConfiguracoes from "./pages/empresa/Configuracoes";

// Cliente
import ClienteDashboard from "./pages/cliente/Dashboard";
import ClienteOnboarding from "./pages/cliente/Onboarding";
import ClienteEntregas from "./pages/cliente/Entregas";
import ClienteEntregaDetalhe from "./pages/cliente/EntregaDetalhe";
import ClienteMateriais from "./pages/cliente/Materiais";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EmpresaThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Área da Empresa */}
            <Route path="/empresa/clientes" element={<EmpresaClientes />} />
            <Route path="/empresa/cliente-detalhe" element={<EmpresaClienteDetalhe />} />
            <Route path="/empresa/configuracoes" element={<EmpresaConfiguracoes />} />
            
            {/* Portal do Cliente */}
            <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
            <Route path="/cliente/onboarding" element={<ClienteOnboarding />} />
            <Route path="/cliente/entregas" element={<ClienteEntregas />} />
            <Route path="/cliente/entrega-detalhe" element={<ClienteEntregaDetalhe />} />
            <Route path="/cliente/materiais" element={<ClienteMateriais />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </EmpresaThemeProvider>
  </QueryClientProvider>
);

export default App;
