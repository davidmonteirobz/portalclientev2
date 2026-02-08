
# Plano: Landing Page da Plataforma

## Resumo

Criar uma landing page profissional que apresenta a plataforma para agencias, com demonstracao visual de como funciona o Portal do Cliente e call-to-actions para conversao.

---

## Estrutura da Landing Page

### 1. Hero Section
- Titulo principal: "Centralize a experiencia do seu cliente em um unico lugar."
- Subtitulo: "Um portal com a identidade da sua agencia para organizar materiais, aprovacoes e comunicacao com clientes."
- Botao CTA: "Comecar agora" (direciona para /empresa/clientes)
- Botao secundario: "Ver demonstracao" (scroll para secao de demo)

### 2. Secao de Demonstracao do Portal
- Mockup interativo mostrando o Portal do Cliente
- Screenshots/cards mostrando as principais telas:
  - Dashboard com progresso do onboarding
  - Lista de entregas
  - Tela de aprovacao
  - Arquivos organizados
- Animacoes suaves de entrada

### 3. Secao de Beneficios
Cards com os principais beneficios:
- **Sua marca, seu portal** - Personalize cores e logo
- **Entregas organizadas** - Aprovacoes e feedback em um so lugar
- **Onboarding guiado** - Seus clientes sempre sabem a proxima etapa
- **Arquivos centralizados** - Materiais acessiveis a qualquer momento

### 4. Secao de Como Funciona
Steps visuais:
1. Configure seu portal com sua identidade
2. Cadastre seus clientes
3. Envie entregas e receba aprovacoes
4. Tudo organizado em um so lugar

### 5. CTA Final
- Chamada para acao com botao grande
- Texto de reforco da proposta de valor

### 6. Footer
- Links basicos
- Copyright

---

## Layout Visual

```text
+--------------------------------------------------+
|                     HEADER                        |
|  [Logo]                    [Entrar] [Comecar]    |
+--------------------------------------------------+
|                                                   |
|                   HERO SECTION                    |
|                                                   |
|    Centralize a experiencia do seu cliente        |
|           em um unico lugar.                      |
|                                                   |
|    Um portal com a identidade da sua agencia...   |
|                                                   |
|    [Comecar agora]    [Ver demonstracao]         |
|                                                   |
+--------------------------------------------------+
|                                                   |
|              DEMONSTRACAO DO PORTAL               |
|                                                   |
|  +----------+  +----------+  +----------+        |
|  |Dashboard |  | Entregas |  |Aprovacao |        |
|  |   [img]  |  |   [img]  |  |   [img]  |        |
|  +----------+  +----------+  +----------+        |
|                                                   |
+--------------------------------------------------+
|                                                   |
|                  BENEFICIOS                       |
|                                                   |
|  [icon] Sua marca    [icon] Entregas             |
|  [icon] Onboarding   [icon] Arquivos             |
|                                                   |
+--------------------------------------------------+
|                                                   |
|               COMO FUNCIONA                       |
|                                                   |
|    1 -----> 2 -----> 3 -----> 4                  |
|                                                   |
+--------------------------------------------------+
|                                                   |
|                  CTA FINAL                        |
|                                                   |
|      Pronto para centralizar seus clientes?       |
|            [Comecar agora - Gratis]               |
|                                                   |
+--------------------------------------------------+
|                    FOOTER                         |
+--------------------------------------------------+
```

---

## Detalhes Tecnicos

### Novo Arquivo: `src/pages/LandingPage.tsx`

Pagina completa com todas as secoes:
- Uso de componentes existentes (Card, Button)
- Animacoes com classes Tailwind existentes (animate-fade-in, animate-slide-up)
- Responsivo (mobile-first)
- Scroll suave para secao de demo

```typescript
// Estrutura do componente
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
```

### Secao de Demo - Screenshots do Portal

Usar as proprias telas do sistema como preview:
- Capturas mockadas do Dashboard
- Preview da tela de entregas
- Preview da tela de aprovacao

Alternativa: criar componentes visuais simplificados que representam as telas.

### Modificar: `src/App.tsx`

- Trocar a rota "/" para a nova LandingPage
- Mover o conteudo atual de Index para uma nova rota "/acesso" ou remover

```typescript
<Route path="/" element={<LandingPage />} />
<Route path="/acesso" element={<Index />} /> // opcional
```

### Novo Componente: `src/components/landing/PortalPreview.tsx`

Componente que exibe mockups do portal com:
- Frame de navegador estilizado
- Screenshot ou representacao visual das telas
- Hover effects para destacar funcionalidades

---

## Arquivos a Criar

1. `src/pages/LandingPage.tsx` - Pagina principal da landing

## Arquivos a Modificar

1. `src/App.tsx` - Atualizar rota "/" para LandingPage

---

## Elementos Visuais da Demo

Para a demonstracao do portal, vou criar representacoes visuais das telas:

### Preview do Dashboard
- Card com saudacao "Ola, Maria!"
- Barra de progresso do onboarding
- Cards de proxima acao e reuniao

### Preview das Entregas
- Lista de cards de entregas
- Status badges (Aprovado, Em revisao)

### Preview de Aprovacao
- Imagem de preview
- Botoes de aprovar/solicitar ajuste

Esses previews serao componentes estilizados que imitam as telas reais, dando uma ideia clara de como o portal funciona.

---

## Responsividade

- Mobile: secoes empilhadas verticalmente
- Tablet: grid 2 colunas para beneficios
- Desktop: layout completo com espacamento generoso
