

# Adicionar Status do Contrato nos Cards de Clientes

## Resumo

Adicionar um campo de status do contrato em cada card de cliente na listagem, com tres opcoes possiveis: **Contrato ativo**, **Contrato pausado** e **Contrato rescindido**, cada um com uma cor diferente.

## Mudancas

### 1. `src/pages/empresa/Clientes.tsx`

- Adicionar campo `status` na interface `Cliente` com tipo `"ativo" | "pausado" | "rescindido"`
- Adicionar status nos dados mock (Maria e Joao com "ativo", Ana com "pausado")
- Exibir um `StatusBadge` ao lado do badge de servico em cada card, usando as variantes:
  - **Contrato ativo** → variante `success` (verde)
  - **Contrato pausado** → variante `warning` (amarelo)
  - **Contrato rescindido** → variante `destructive` (nova variante vermelha, ou usar estilo inline)
- Adicionar campo de status no formulario de cadastro de novo cliente (select/radio)
- Adicionar coluna de status no modelo CSV de importacao

### 2. `src/components/ui/status-badge.tsx`

- Adicionar variante `destructive` (vermelho) para representar "Contrato rescindido"

### Layout do Card (atualizado)

```text
┌──────────────────────────────────────────────┐
│  [Icon]  Maria Silva                     [>] │
│          Studio Bella                        │
│          [Design Mensal] [Contrato ativo]    │
└──────────────────────────────────────────────┘
```

Os dois badges ficam lado a lado na terceira linha: servico + status do contrato.

