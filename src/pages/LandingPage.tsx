import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  CheckCircle, 
  ListChecks, 
  FolderOpen, 
  ArrowRight,
  Settings,
  UserPlus,
  Send,
  LayoutDashboard,
  ChevronRight,
  Rocket,
  Clock
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

// Demo Section - Dual View Preview
function DemoSection() {
  return (
    <section id="demo" className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Veja por dentro da plataforma
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Clique para explorar as duas visões: Empresa e Cliente
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Área da Empresa */}
          <Link to="/empresa/clientes" className="group block">
            <Card className="overflow-hidden border-border/50 bg-card shadow-lg transition-all hover:shadow-xl hover:-translate-y-2 hover:border-primary/30">
              <div className="bg-primary/5 px-4 py-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-destructive/60" />
                      <div className="h-3 w-3 rounded-full bg-warning/60" />
                      <div className="h-3 w-3 rounded-full bg-success/60" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-foreground">Área da Empresa</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <CardContent className="p-5">
                <div className="space-y-3">
                  {/* Header da tela */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-foreground">Clientes</p>
                      <p className="text-xs text-muted-foreground">Gerencie seus clientes e acesse seus portais</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">Importar</div>
                      <div className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">+ Novo cliente</div>
                    </div>
                  </div>
                  
                  {/* Lista de clientes */}
                  <div className="space-y-2">
                    {[
                      { nome: "Maria Silva", negocio: "Studio Bella", servico: "Design Mensal" },
                      { nome: "João Santos", negocio: "TechStart", servico: "Site Institucional" },
                      { nome: "Ana Costa", negocio: "", servico: "Criativos para Redes" },
                    ].map((cliente, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-background p-3 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-xs font-medium text-primary">{cliente.nome.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{cliente.nome}</p>
                            {cliente.negocio && <p className="text-xs text-muted-foreground">{cliente.negocio}</p>}
                            <span className="inline-block mt-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {cliente.servico}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary">
                  <span>Explorar área da empresa</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Portal do Cliente */}
          <Link to="/cliente/dashboard" className="group block">
            <Card className="overflow-hidden border-border/50 bg-card shadow-lg transition-all hover:shadow-xl hover:-translate-y-2 hover:border-primary/30">
              <div className="bg-primary/5 px-4 py-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-destructive/60" />
                      <div className="h-3 w-3 rounded-full bg-warning/60" />
                      <div className="h-3 w-3 rounded-full bg-success/60" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-foreground">Portal do Cliente</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <CardContent className="p-5">
                <div className="space-y-3">
                  {/* Welcome */}
                  <div>
                    <p className="text-lg font-bold text-foreground">Olá, Maria! 👋</p>
                    <p className="text-xs text-muted-foreground">Bem-vindo(a) ao seu portal.</p>
                  </div>

                  {/* Contexto atual */}
                  <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
                    <p className="text-xs text-muted-foreground">Agora estamos em</p>
                    <p className="text-sm font-semibold text-foreground">Setup inicial</p>
                  </div>
                  
                  {/* Onboarding progress */}
                  <div className="rounded-lg bg-background p-3 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-foreground flex items-center gap-1">
                        <Rocket className="h-3 w-3 text-primary" />
                        Onboarding do Serviço
                      </p>
                      <span className="text-xs text-muted-foreground">60%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 w-3/5 rounded-full bg-primary" />
                    </div>
                    <div className="mt-2 space-y-1">
                      {[
                        { nome: "Reunião inicial", done: true },
                        { nome: "Briefing", done: true },
                        { nome: "Envio de materiais", done: true },
                        { nome: "Setup inicial", current: true },
                        { nome: "Aprovação final", pending: true },
                      ].map((etapa, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px]">
                          {etapa.done ? (
                            <CheckCircle className="h-3 w-3 text-success" />
                          ) : etapa.current ? (
                            <Clock className="h-3 w-3 text-primary" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                          )}
                          <span className={etapa.pending ? "text-muted-foreground" : "text-foreground"}>
                            {etapa.nome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cards de ação */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-warning/10 p-2 border border-warning/20">
                      <p className="text-[10px] text-muted-foreground">Sua próxima ação</p>
                      <p className="text-xs font-medium text-foreground">Revisar protótipo</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 border border-border">
                      <p className="text-[10px] text-muted-foreground">Próxima reunião</p>
                      <p className="text-xs font-medium text-foreground">05 de Fev, 14:00</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary">
                  <span>Explorar portal do cliente</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
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
