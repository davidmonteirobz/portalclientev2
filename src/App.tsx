import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmpresaThemeProvider } from "@/contexts/EmpresaThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";
import AcceptInvite from "./pages/AcceptInvite";

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
    <AuthProvider>
      <EmpresaThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              
              {/* Área da Empresa - Protegida */}
              <Route path="/empresa/clientes" element={<ProtectedRoute requiredRole="empresa"><EmpresaClientes /></ProtectedRoute>} />
              <Route path="/empresa/cliente-detalhe" element={<ProtectedRoute requiredRole="empresa"><EmpresaClienteDetalhe /></ProtectedRoute>} />
              <Route path="/empresa/configuracoes" element={<ProtectedRoute requiredRole="empresa"><EmpresaConfiguracoes /></ProtectedRoute>} />
              
              {/* Portal do Cliente - Protegido */}
              <Route path="/cliente/dashboard" element={<ProtectedRoute requiredRole="cliente"><ClienteDashboard /></ProtectedRoute>} />
              <Route path="/cliente/onboarding" element={<ProtectedRoute requiredRole="cliente"><ClienteOnboarding /></ProtectedRoute>} />
              <Route path="/cliente/entregas" element={<ProtectedRoute requiredRole="cliente"><ClienteEntregas /></ProtectedRoute>} />
              <Route path="/cliente/entrega-detalhe" element={<ProtectedRoute requiredRole="cliente"><ClienteEntregaDetalhe /></ProtectedRoute>} />
              <Route path="/cliente/materiais" element={<ProtectedRoute requiredRole="cliente"><ClienteMateriais /></ProtectedRoute>} />
              
              <Route path="/accept-invite" element={<AcceptInvite />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </EmpresaThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
