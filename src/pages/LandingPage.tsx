import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

// Header
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
        <Link to="/" className="text-lg md:text-xl font-bold gradient-text">
          Portal
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <Link to="/empresa/clientes">Entrar</Link>
          </Button>
          <Button size="sm" className="text-xs md:text-sm" asChild>
            <Link to="/empresa/clientes">Começar agora</Link>
          </Button>
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
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mx-auto max-w-4xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground animate-fade-in">
          Centralize a experiência do seu cliente em um único lugar.
        </h1>
        <p className="mx-auto mt-4 md:mt-6 max-w-2xl text-base md:text-lg lg:text-xl text-muted-foreground animate-fade-in">
          Um portal com a identidade da sua agência para organizar materiais, aprovações e comunicação com clientes.
        </p>
        <div className="mt-6 md:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in">
          <Button size="lg" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base" asChild>
            <Link to="/empresa/clientes">
              Começar agora
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-sm md:text-base" onClick={scrollToDemo}>
            Ver demonstração
          </Button>
        </div>
      </div>
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[400px] md:h-[600px] w-[400px] md:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  );
}

// Demo Section - Portal do Cliente Overview
function DemoSection() {
  return (
    <section id="demo" className="bg-muted/30 py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Veja como seu cliente vai visualizar
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-muted-foreground">
            Um portal completo com a identidade da sua agência — clique nos menus para explorar
          </p>
        </div>

        {/* Interactive Portal Demo */}
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
    <section className="py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Tudo que você precisa para gerenciar clientes
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-muted-foreground">
            Funcionalidades pensadas para agências que querem profissionalizar seu atendimento
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="p-4 md:p-6">
                <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10">
                  <benefit.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-1 md:mb-2 text-base md:text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
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
    <section className="bg-muted/30 py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Simples de começar
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-muted-foreground">
            Em poucos minutos seu portal está pronto para receber clientes
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Connection line - desktop only */}
          <div className="absolute left-0 right-0 top-[60px] hidden h-0.5 bg-border lg:block" />
          
          <div className="grid gap-6 md:gap-8 grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-3 md:mb-4 flex h-20 w-20 md:h-[100px] md:w-[100px] lg:h-[120px] lg:w-[120px] flex-col items-center justify-center rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">
                  <span className="mb-0.5 md:mb-1 text-lg md:text-xl lg:text-2xl font-bold text-primary">{item.step}</span>
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-0.5 md:mb-1 text-sm md:text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
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
    <section className="py-12 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl md:rounded-3xl bg-primary/5 p-6 md:p-8 lg:p-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Pronto para centralizar seus clientes?
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base lg:text-lg text-muted-foreground">
            Crie seu portal personalizado e transforme a experiência dos seus clientes.
          </p>
          <Button size="lg" className="mt-6 md:mt-8 w-full sm:w-auto h-12 md:h-14 px-6 md:px-10 text-sm md:text-base lg:text-lg" asChild>
            <Link to="/empresa/clientes">
              Começar agora — Grátis
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="text-lg md:text-xl font-bold gradient-text">Portal</div>
          <p className="text-xs md:text-sm text-muted-foreground order-3 md:order-2">
            © {new Date().getFullYear()} Portal. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 md:gap-6 order-2 md:order-3">
            <Link to="/empresa/clientes" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Área da Empresa
            </Link>
            <Link to="/cliente/dashboard" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
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
    <div className="min-h-screen bg-background">
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
