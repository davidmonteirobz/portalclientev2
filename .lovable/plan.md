
# Plano: Adicionar Seção de Acesso ao Portal (Usuários do Cliente)

## Resumo
Adicionar uma nova seção na página de detalhes do cliente (Área da Empresa) para gerenciar os usuários que terão acesso ao Portal do Cliente. Esta seção permitirá cadastrar, visualizar e remover usuários de login para cada cliente.

## O que será criado

### Nova Seção "Acesso ao Portal"
Uma nova seção (card) na página de detalhes do cliente com:
- Lista de usuários cadastrados mostrando nome e e-mail
- Badge indicando status do convite (pendente, ativo)
- Botão para adicionar novo usuário
- Botão para remover usuário existente

### Modal de Cadastro de Usuário
Um dialog para criar novo acesso contendo:
- Campo para nome do usuário
- Campo para e-mail (será usado como login)
- Botão de confirmar cadastro

## Estrutura Visual

```text
+-------------------------------------------+
|  Acesso ao Portal              [+ Adicionar]|
+-------------------------------------------+
|  +---------------------------------------+ |
|  | Maria Silva                           | |
|  | maria@studiobella.com     [Ativo]  [X]| |
|  +---------------------------------------+ |
|  +---------------------------------------+ |
|  | João Assistente                       | |
|  | joao@studiobella.com   [Pendente]  [X]| |
|  +---------------------------------------+ |
+-------------------------------------------+
```

## Localização
A nova seção será posicionada na **coluna direita**, logo após a seção "Observações Internas", pois se trata de uma configuração administrativa do cliente.

---

## Detalhes Tecnico

### Arquivo a ser modificado
- `src/pages/empresa/ClienteDetalhe.tsx`

### Novos elementos
1. **Interface `UsuarioCliente`**: Define a estrutura de dados do usuario
   - `id`: string
   - `nome`: string
   - `email`: string
   - `status`: "pendente" | "ativo"

2. **Estados novos**:
   - `usuarios`: lista de usuarios mockados
   - `novoUsuarioDialog`: controle do modal
   - `novoUsuario`: dados do formulario (nome, email)

3. **Funcoes novas**:
   - `handleAddUsuario`: adiciona usuario a lista
   - `handleRemoveUsuario`: remove usuario da lista

4. **Novos imports**:
   - Icone `UserPlus` do lucide-react
   - Icone `Mail` do lucide-react

### Dados mockados iniciais
```typescript
const usuariosMock = [
  { id: "1", nome: "Maria Silva", email: "maria@studiobella.com", status: "ativo" },
  { id: "2", nome: "João Assistente", email: "joao@studiobella.com", status: "pendente" },
];
```

### Componente visual
Um novo Card seguindo o padrao existente na pagina, com:
- Header com titulo "Acesso ao Portal" e botao "Adicionar"
- Lista de usuarios com avatar, nome, email, badge de status e botao de remover
- Dialog para cadastro de novo usuario
