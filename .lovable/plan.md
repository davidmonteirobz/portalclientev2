
# Fluxo Completo de Convite com Token Seguro para Cliente Final

## Problema Atual
O sistema atual usa `inviteUserByEmail` do Supabase Auth, que envia um e-mail generico do Supabase com link que nem sempre funciona corretamente. O fluxo precisa ser substituido por um sistema proprio de convites com token, pagina de criacao de senha e controle total do ciclo de vida.

## Arquitetura Proposta

### 1. Nova tabela `invites`
Criar tabela para gerenciar convites com token seguro, expiracao e status.

Campos:
- `id` (UUID, PK)
- `portal_client_id` (UUID, FK para portal_clients)
- `empresa_id` (UUID, FK para empresas)
- `email` (TEXT)
- `nome` (TEXT)
- `token` (TEXT, UNIQUE) - token criptografico seguro
- `status` (TEXT) - `pending`, `accepted`, `expired`, `canceled`
- `expires_at` (TIMESTAMPTZ) - expiracao em 48h
- `created_at` (TIMESTAMPTZ)
- `accepted_at` (TIMESTAMPTZ, nullable)

RLS: Empresa owner pode ver/inserir/atualizar convites dos seus proprios clientes.

### 2. Edge Function `send-invite` (substituir `invite-portal-user`)
Nova edge function que:
1. Valida permissao do caller (empresa owner)
2. Gera token seguro (`crypto.randomUUID()`)
3. Cria registro na tabela `invites` com status `pending` e `expires_at = now() + 48h`
4. Cria registro em `portal_client_users` com status `pendente`
5. Envia e-mail via Supabase Auth `admin.generateLink` (tipo `magiclink`) OU usa o servico de e-mail do Supabase com template customizado
6. Retorna sucesso

O e-mail contera link: `https://portalclientev2.lovable.app/accept-invite?token=XXXX`

### 3. Edge Function `validate-invite`
Endpoint GET que:
1. Recebe `token` como query param
2. Verifica se token existe, nao expirou, status = `pending`
3. Retorna dados do convite (nome, email, empresa) ou erro

### 4. Edge Function `accept-invite`
Endpoint POST que:
1. Recebe `token` e `password`
2. Valida token (existe, nao expirou, status = `pending`)
3. Cria usuario no Supabase Auth via `admin.createUser` com email confirmado
4. Atualiza `invites.status` para `accepted`
5. Atualiza `portal_client_users.status` para `ativo`
6. Atualiza `portal_clients.user_id` e `status`
7. Retorna sessao para login automatico

### 5. Pagina `/accept-invite`
Nova pagina React que:
1. Le `token` da URL
2. Chama `validate-invite` para verificar token
3. Se valido: mostra formulario "Criar sua senha" com nome/email (readonly) e campos de senha
4. Se invalido/expirado: mostra mensagem de erro com opcao de contatar a empresa
5. Ao submeter: chama `accept-invite`, faz login e redireciona para `/cliente/dashboard`

### 6. Atualizacoes no Frontend

**ClienteDetalhe.tsx - Secao "Acesso ao Portal":**
- Alterar `handleAddUsuario` para chamar a nova edge function `send-invite`
- Adicionar botao "Reenviar convite" ao lado de usuarios com status `pendente`
- Mostrar status do convite (Pendente, Aceito, Expirado) com data

**App.tsx:**
- Adicionar rota publica `/accept-invite` (sem ProtectedRoute)

### 7. Rota no App.tsx
```
<Route path="/accept-invite" element={<AcceptInvite />} />
```

## Detalhes Tecnicos

### Migracao SQL
```sql
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_client_id UUID NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '48 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Empresa owners podem ver/criar/atualizar convites dos seus clientes
CREATE POLICY "Empresa owners can manage invites"
  ON public.invites FOR ALL
  USING (empresa_id IN (SELECT id FROM empresas WHERE owner_id = auth.uid()))
  WITH CHECK (empresa_id IN (SELECT id FROM empresas WHERE owner_id = auth.uid()));
```

### Edge Function `accept-invite` (logica principal)
```typescript
// 1. Validar token
const { data: invite } = await supabaseAdmin
  .from("invites")
  .select("*")
  .eq("token", token)
  .eq("status", "pending")
  .gt("expires_at", new Date().toISOString())
  .single();

// 2. Criar usuario com senha definida
const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
  email: invite.email,
  password,
  email_confirm: true,
  user_metadata: { nome: invite.nome, role: "cliente" }
});

// 3. Atualizar registros
await supabaseAdmin.from("invites").update({ status: "accepted", accepted_at: new Date().toISOString() }).eq("id", invite.id);
await supabaseAdmin.from("portal_client_users").update({ status: "ativo" }).eq("email", invite.email).eq("portal_client_id", invite.portal_client_id);
```

### Envio de e-mail
Usaremos `supabaseAdmin.auth.admin.generateLink({ type: 'invite', email })` para gerar um magic link, mas substituiremos a URL pelo nosso link customizado com token. Alternativamente, como o Supabase envia e-mails automaticamente via `inviteUserByEmail`, vamos usar uma abordagem hibrida:
- Gerar o token proprio e salvar na tabela `invites`
- Usar `auth.admin.inviteUserByEmail` com `redirectTo` apontando para `/accept-invite?token=XXXX`
- Quando o usuario clicar, a pagina `/accept-invite` valida o token e permite criar senha

### Reenvio de convite
- Cancela convite anterior (status = `canceled`)
- Cria novo convite com novo token e nova expiracao
- Reenvia e-mail

## Arquivos a criar/modificar
1. **Criar:** Migracao SQL para tabela `invites`
2. **Criar:** `supabase/functions/send-invite/index.ts`
3. **Criar:** `supabase/functions/validate-invite/index.ts`
4. **Criar:** `supabase/functions/accept-invite/index.ts`
5. **Criar:** `src/pages/AcceptInvite.tsx`
6. **Modificar:** `src/App.tsx` - adicionar rota `/accept-invite`
7. **Modificar:** `src/pages/empresa/ClienteDetalhe.tsx` - usar nova edge function e adicionar reenvio
8. **Remover:** `supabase/functions/invite-portal-user/` (substituida por `send-invite`)
