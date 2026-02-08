
# Plano: Demo Interativa do Portal do Cliente

## Resumo

Transformar a segunda secao da landing page em uma demonstracao interativa e navegavel do Portal do Cliente. O visitante pode clicar nos itens do menu e ver diferentes "telas" do portal, tudo sem sair da landing page.

---

## Como Vai Funcionar

O preview do portal tera uma navegacao funcional:

1. **Menu clicavel** - Os itens de navegacao (Inicio, Onboarding, Entregas, Arquivos) serao botoes que mudam a "tela" exibida
2. **Estado React** - Um state controlara qual tela esta ativa
3. **Transicoes suaves** - Animacoes ao trocar entre telas
4. **Tudo dentro do mockup** - Mantem o frame de navegador, criando a sensacao de estar usando o portal real

---

## Telas Incluidas na Demo

### 1. Inicio (Dashboard)
- Saudacao "Ola, Maria!"
- Card de contexto atual
- Bloco de onboarding com progresso
- Cards de proxima acao e reuniao
- Botoes de acao (entregas e arquivos)

### 2. Onboarding
- Timeline visual das etapas
- Status de cada etapa (concluido, atual, pendente)
- Barra de progresso

### 3. Entregas
- Lista de entregas com status badges
- Cards clicaveis que podem abrir a tela de detalhe

### 4. Arquivos
- Grid de materiais com icones
- Links externos simulados

---

## Estrutura do Componente

```text
DemoSection
├── Titulo e subtitulo
└── Card (Frame do navegador)
    ├── Browser Frame (bolinhas + URL)
    ├── Header do Portal
    │   └── Menu Navegavel ← CLICAVEIS
    └── Conteudo Dinamico
        ├── [activeTab === "inicio"] → DashboardView
        ├── [activeTab === "onboarding"] → OnboardingView
        ├── [activeTab === "entregas"] → EntregasView
        └── [activeTab === "arquivos"] → ArquivosView
```

---

## Layout Visual

```text
+--------------------------------------------------+
|  [●] [●] [●]     meuportal.agencia.com.br        |  ← Browser Frame
+--------------------------------------------------+
|  [Logo]   [Inicio] [Onboarding] [Entregas] [Arq] |  ← Menu Clicavel
+--------------------------------------------------+
|                                                   |
|               CONTEUDO DINAMICO                   |  ← Muda conforme
|                                                   |     o item clicado
|   ┌─────────────────────────────────────────┐    |
|   │                                         │    |
|   │     (Dashboard / Onboarding /           │    |
|   │      Entregas / Arquivos)               │    |
|   │                                         │    |
|   └─────────────────────────────────────────┘    |
|                                                   |
+--------------------------------------------------+
```

---

## Detalhes Tecnicos

### Arquivo a Modificar

**`src/pages/LandingPage.tsx`**

Reestruturar a `DemoSection` para:

1. Adicionar estado para controlar a aba ativa:
```typescript
const [activeTab, setActiveTab] = useState<"inicio" | "onboarding" | "entregas" | "arquivos">("inicio");
```

2. Tornar os itens do menu clicaveis:
```typescript
<button 
  onClick={() => setActiveTab("inicio")}
  className={activeTab === "inicio" ? "bg-foreground text-background" : "text-muted-foreground"}
>
  Inicio
</button>
```

3. Renderizar conteudo dinamico baseado na aba:
```typescript
{activeTab === "inicio" && <DashboardPreview />}
{activeTab === "onboarding" && <OnboardingPreview />}
{activeTab === "entregas" && <EntregasPreview />}
{activeTab === "arquivos" && <ArquivosPreview />}
```

---

## Componentes de Preview (Inline)

Cada "tela" sera um componente inline dentro da DemoSection:

### DashboardPreview
- Saudacao
- Card de contexto atual
- Bloco de onboarding com progresso (60%)
- Cards de proxima acao e reuniao
- Botoes de acao

### OnboardingPreview
- Timeline vertical das etapas
- Icones de status (check, relogio, circulo vazio)
- Cards coloridos por status

### EntregasPreview
- Lista de 3 entregas mockadas
- Status badges (Aprovado, Em revisao)
- Hover effects nos cards

### ArquivosPreview
- Grid 2x2 de materiais
- Icones representativos
- Botoes de acesso externo

---

## Interatividade Adicional

### Cliques Internos
Alguns elementos dentro das telas podem ser clicaveis para navegar entre telas:

- **"Ver detalhes" no onboarding** → Muda para aba Onboarding
- **"Ver entregas" botao** → Muda para aba Entregas
- **"Acessar arquivos" botao** → Muda para aba Arquivos
- **Cards de entrega** → Poderia mostrar preview de detalhe (opcional)

### Animacoes
- Fade in/out ao trocar de aba
- Slide suave entre conteudos

---

## Beneficios

1. **Experiencia imersiva** - Visitante "usa" o portal antes de criar conta
2. **Demonstracao clara** - Mostra todas as funcionalidades principais
3. **Sem redirecionamento** - Tudo acontece na landing page
4. **Engajamento** - Interatividade aumenta tempo na pagina

---

## Resumo das Mudancas

| Arquivo | Acao |
|---------|------|
| `src/pages/LandingPage.tsx` | Reescrever `DemoSection` com estado e navegacao interativa |

---

## Complexidade

- **Estimativa**: Modificacao unica em um arquivo
- **Componentes**: 4 sub-componentes de preview (inline)
- **Estado**: useState simples para controlar aba ativa
- **Animacoes**: Classes Tailwind existentes
