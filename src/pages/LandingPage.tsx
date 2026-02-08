import { Link } from "react-router-dom";
import { InteractivePortalDemo } from "@/components/landing/InteractivePortalDemo";
import { 
  Palette, 
  CheckCircle, 
  ListChecks, 
  FolderOpen, 
  ArrowRight,
  Settings,
  UserPlus,
  Send,
  LayoutDashboard
} from "lucide-react";

// Glass Button Component
function GlassButton({ 
  children, 
  variant = "default", 
  className = "",
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "primary";
  className?: string;
  onClick?: () => void;
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border";
  const variants = {
    default: "bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]",
    primary: "bg-white/15 border-white/25 text-white hover:bg-white/20 hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Glass Link Button Component
function GlassLinkButton({ 
  children, 
  to,
  variant = "default", 
  className = "" 
}: { 
  children: React.ReactNode; 
  to: string;
  variant?: "default" | "primary";
  className?: string;
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-md border";
  const variants = {
    default: "bg-white/10 border-white/20 text-white hover:bg-white/15 hover:border-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]",
    primary: "bg-white/15 border-white/25 text-white hover:bg-white/20 hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
  };
  
  return (
    <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

// Header
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
        <Link to="/" className="text-lg md:text-xl font-bold text-white">
          Portal
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <GlassLinkButton to="/empresa/clientes" className="hidden sm:flex h-9 px-4 text-sm">
            Entrar
          </GlassLinkButton>
          <GlassLinkButton to="/empresa/clientes" variant="primary" className="h-9 px-4 text-xs md:text-sm">
            Começar agora
          </GlassLinkButton>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 xl:py-40">
      <div className="container mx-auto px-4 text-center">
        {/* Título em duas linhas */}
        <h1 className="mx-auto max-w-5xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] text-white animate-fade-in">
          Centralize a experiência do seu
          <br />
          cliente em um único lugar.
        </h1>
        
        {/* Subtítulo */}
        <p className="mx-auto mt-6 md:mt-8 max-w-2xl text-base md:text-lg lg:text-xl text-white/40 animate-fade-in">
          Um portal com a identidade da sua agência para organizar materiais,
          <br className="hidden sm:block" />
          aprovações e comunicação com clientes.
        </p>

        {/* Botões */}
        <div className="mt-8 md:mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in">
          <GlassLinkButton to="/empresa/clientes" variant="primary" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base">
            Começar agora
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </GlassLinkButton>
          <GlassButton className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base" onClick={scrollToDemo}>
            Ver demonstração
          </GlassButton>
        </div>
      </div>

      {/* Background gradient sutil */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] md:h-[800px] w-[600px] md:w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-white/[0.03] to-transparent blur-3xl" />
      </div>
    </section>
  );
}

// Demo Section - Portal do Cliente Overview (mantém fundo branco no preview)
function DemoSection() {
  return (
    <section id="demo" className="py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Veja como seu cliente vai visualizar
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-white/60">
            Um portal completo com a identidade da sua agência — clique nos menus para explorar
          </p>
        </div>

        {/* Interactive Portal Demo - mantém tema claro */}
        <InteractivePortalDemo />
      </div>
    </section>
  );
}

// Benefits Section
function BenefitsSection() {
  const benefits = [
    {
      icon: Palette,
      title: "Sua marca, seu portal",
      description: "Personalize cores e logo para criar uma experiência única com a identidade da sua agência."
    },
    {
      icon: ListChecks,
      title: "Entregas organizadas",
      description: "Aprovações e feedback centralizados em um só lugar. Nada mais de e-mails perdidos."
    },
    {
      icon: CheckCircle,
      title: "Onboarding guiado",
      description: "Seus clientes sempre sabem qual é a próxima etapa e o que precisam fazer."
    },
    {
      icon: FolderOpen,
      title: "Arquivos centralizados",
      description: "Materiais organizados e acessíveis a qualquer momento para você e seus clientes."
    }
  ];

  return (
    <section className="py-12 md:py-20 lg:py-28 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Tudo que você precisa para gerenciar clientes
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-white/60">
            Funcionalidades pensadas para agências que querem profissionalizar seu atendimento
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-6 transition-all hover:bg-white/10 hover:border-white/20"
            >
              <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-white/10">
                <benefit.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <h3 className="mb-1 md:mb-2 text-base md:text-lg font-semibold text-white">{benefit.title}</h3>
              <p className="text-xs md:text-sm text-white/60">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      icon: Settings,
      step: "1",
      title: "Configure seu portal",
      description: "Adicione sua logo e personalize as cores"
    },
    {
      icon: UserPlus,
      step: "2",
      title: "Cadastre seus clientes",
      description: "Convide clientes para acessar o portal"
    },
    {
      icon: Send,
      step: "3",
      title: "Envie entregas",
      description: "Faça uploads e receba aprovações"
    },
    {
      icon: LayoutDashboard,
      step: "4",
      title: "Tudo organizado",
      description: "Acompanhe projetos em um só lugar"
    }
  ];

  return (
    <section className="py-12 md:py-20 lg:py-28 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Simples de começar
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-white/60">
            Em poucos minutos seu portal está pronto para receber clientes
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Connection line - desktop only */}
          <div className="absolute left-0 right-0 top-[60px] hidden h-0.5 bg-white/10 lg:block" />
          
          <div className="grid gap-6 md:gap-8 grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-3 md:mb-4 flex h-20 w-20 md:h-[100px] md:w-[100px] lg:h-[120px] lg:w-[120px] flex-col items-center justify-center rounded-xl md:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <span className="mb-0.5 md:mb-1 text-lg md:text-xl lg:text-2xl font-bold text-white">{item.step}</span>
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white/60" />
                </div>
                <h3 className="mb-0.5 md:mb-1 text-sm md:text-base font-semibold text-white">{item.title}</h3>
                <p className="text-xs md:text-sm text-white/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-12 md:py-20 lg:py-28 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 lg:p-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Pronto para centralizar seus clientes?
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-white/60">
            Crie seu portal personalizado e transforme a experiência dos seus clientes.
          </p>
          <GlassLinkButton to="/empresa/clientes" variant="primary" className="mt-6 md:mt-8 w-full sm:w-auto h-12 md:h-14 px-6 md:px-10 text-sm md:text-base lg:text-lg">
            Começar agora — Grátis
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </GlassLinkButton>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-white/10 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="text-lg md:text-xl font-bold text-white">Portal</div>
          <p className="text-xs md:text-sm text-white/40 order-3 md:order-2">
            © {new Date().getFullYear()} Portal. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 md:gap-6 order-2 md:order-3">
            <Link to="/empresa/clientes" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Área da Empresa
            </Link>
            <Link to="/cliente/dashboard" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
              Portal do Cliente
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <DemoSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
