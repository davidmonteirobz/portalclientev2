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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold gradient-text">
          Portal
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/empresa/clientes">Entrar</Link>
          </Button>
          <Button asChild>
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
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-fade-in">
          Centralize a experiência do seu cliente em um único lugar.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in">
          Um portal com a identidade da sua agência para organizar materiais, aprovações e comunicação com clientes.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link to="/empresa/clientes">
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={scrollToDemo}>
            Ver demonstração
          </Button>
        </div>
      </div>
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  );
}

// Demo Section - Portal do Cliente Overview
function DemoSection() {
  return (
    <section id="demo" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Veja como seu cliente vai visualizar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
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
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Tudo que você precisa para gerenciar clientes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Funcionalidades pensadas para agências que querem profissionalizar seu atendimento
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
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
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Simples de começar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Em poucos minutos seu portal está pronto para receber clientes
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Connection line - desktop */}
          <div className="absolute left-0 right-0 top-[60px] hidden h-0.5 bg-border lg:block" />
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                  <span className="mb-1 text-2xl font-bold text-primary">{item.step}</span>
                  <item.icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
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
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl bg-primary/5 p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Pronto para centralizar seus clientes?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Crie seu portal personalizado e transforme a experiência dos seus clientes.
          </p>
          <Button size="lg" className="mt-8 h-14 px-10 text-lg" asChild>
            <Link to="/empresa/clientes">
              Começar agora — Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
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
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-xl font-bold gradient-text">Portal</div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portal. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/empresa/clientes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Área da Empresa
            </Link>
            <Link to="/cliente/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
