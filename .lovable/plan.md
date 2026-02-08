
# Plano: Tema Black & White + Personalização da Empresa

## Resumo

Este plano implementa duas mudanças principais:
1. **Nova paleta padrão preto e branco** para toda a plataforma
2. **Sistema de personalização** onde cada empresa pode definir sua cor primária e logo, que será aplicado automaticamente ao portal do seu cliente

---

## O que será modificado

### 1. Nova Paleta de Cores (Black & White)

Atualização do arquivo `src/index.css` para usar uma paleta monocromática:
- Fundo: branco puro
- Textos: preto/cinza escuro
- Sidebar: preto
- Cor primária padrão: preto
- Accent: cinza escuro

### 2. Sistema de Personalização da Empresa

#### Nova Página de Configurações
Criar `src/pages/empresa/Configuracoes.tsx` com:
- Seletor de cor primária (color picker)
- Upload de logo personalizado
- Preview em tempo real das mudanças

#### Contexto de Tema da Empresa
Criar `src/contexts/EmpresaThemeContext.tsx`:
- Armazena cor primária e URL do logo
- Aplica variáveis CSS dinamicamente via style tag
- Propaga para portal do cliente

#### Atualizações nos Layouts
- `EmpresaLayout.tsx`: Usar logo da empresa em vez do ícone padrão
- `ClienteLayout.tsx`: Herdar cor e logo da empresa

---

## Estrutura Visual

### Área da Empresa - Nova Seção de Configurações

```text
+-------------------------------------------+
|  Configurações da Empresa                 |
+-------------------------------------------+
|                                           |
|  Logo da Empresa                          |
|  +-------+                                |
|  |       |  [Alterar Logo]                |
|  | LOGO  |                                |
|  |       |                                |
|  +-------+                                |
|                                           |
|  Cor Primária                             |
|  [■ #000000] ____________________         |
|                                           |
|  Preview:                                 |
|  +------------------------------------+   |
|  | [LOGO] Menu ativo | Menu inativo  |   |
|  +------------------------------------+   |
|                                           |
|                         [Salvar]          |
+-------------------------------------------+
```

---

## Detalhes Tecnicos

### Arquivo: `src/index.css` (modificar)

Nova paleta padrão monocromatica:

```css
:root {
  --background: 0 0% 100%;        /* branco */
  --foreground: 0 0% 9%;          /* preto */
  --primary: 0 0% 9%;             /* preto */
  --primary-foreground: 0 0% 100%; /* branco */
  --secondary: 0 0% 96%;          /* cinza claro */
  --muted: 0 0% 96%;
  --accent: 0 0% 15%;             /* cinza escuro */
  --sidebar-background: 0 0% 4%; /* preto */
  /* ... demais ajustes */
}
```

### Arquivo: `src/contexts/EmpresaThemeContext.tsx` (novo)

```typescript
interface EmpresaTheme {
  corPrimaria: string;        // hex color
  logoUrl: string | null;     // URL ou null para icone padrao
}

const EmpresaThemeContext = createContext<...>();

function EmpresaThemeProvider({ children }) {
  const [theme, setTheme] = useState<EmpresaTheme>({
    corPrimaria: "#000000",
    logoUrl: null,
  });

  // Aplica cor dinamicamente via CSS variables
  useEffect(() => {
    const hsl = hexToHsl(theme.corPrimaria);
    document.documentElement.style.setProperty("--primary", hsl);
  }, [theme.corPrimaria]);

  return <EmpresaThemeContext.Provider value={{ theme, setTheme }}>
    {children}
  </EmpresaThemeContext.Provider>;
}
```

### Arquivo: `src/pages/empresa/Configuracoes.tsx` (novo)

Pagina com:
- Input type="color" para selecionar cor primaria
- Input type="file" para upload de logo
- Preview visual do tema
- Botao para salvar configuracoes

### Arquivo: `src/components/empresa/EmpresaLayout.tsx` (modificar)

- Importar hook `useEmpresaTheme`
- Substituir icone `LayoutDashboard` por `<img>` quando houver logo
- Manter icone padrao quando nao houver logo personalizado

### Arquivo: `src/components/cliente/ClienteLayout.tsx` (modificar)

- Mesmo comportamento: usar logo da empresa quando disponivel
- Herdar cor primaria do contexto

### Arquivo: `src/App.tsx` (modificar)

- Envolver rotas com `<EmpresaThemeProvider>`

### Novo Item no Menu da Empresa

Adicionar em `EmpresaLayout.tsx`:
```typescript
{ label: "Configurações", icon: Settings, path: "/empresa/configuracoes" }
```

### Funcao Helper: `hexToHsl`

Criar em `src/lib/utils.ts`:
```typescript
export function hexToHsl(hex: string): string {
  // Converte #000000 para "0 0% 0%"
}
```

---

## Arquivos a Criar

1. `src/contexts/EmpresaThemeContext.tsx`
2. `src/pages/empresa/Configuracoes.tsx`

## Arquivos a Modificar

1. `src/index.css` - nova paleta black & white
2. `src/App.tsx` - adicionar provider e rota
3. `src/components/empresa/EmpresaLayout.tsx` - menu + logo dinamico
4. `src/components/cliente/ClienteLayout.tsx` - logo dinamico
5. `src/lib/utils.ts` - funcao hexToHsl

---

## Fluxo de Uso

1. Empresa acessa "Configuracoes" no menu lateral
2. Escolhe cor primaria via color picker
3. Faz upload do logo (opcional)
4. Clica em "Salvar"
5. Toda a area da empresa assume a nova cor
6. O portal do cliente tambem herda a cor e logo automaticamente
