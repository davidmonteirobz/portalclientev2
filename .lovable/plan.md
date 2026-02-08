

# Plano: Reduzir Espaço Entre Hero e Demo Section

## Problema Identificado
O espaçamento excessivo entre a seção Hero (com efeito Lamp) e a seção Demo é causado pela configuração do componente `LampContainer`, que tem alturas mínimas muito grandes e o conteúdo (título, subtítulo e botões) posicionado com `translate-y` negativo.

## Solução Proposta
Ajustar o componente `lamp.tsx` para reduzir a altura mínima do container e o deslocamento vertical do conteúdo, mantendo o efeito visual da luz intacto.

---

## Alterações Técnicas

### Arquivo: `src/components/ui/lamp.tsx`

**1. Reduzir altura mínima do container (linha 16)**
- De: `min-h-[600px] md:min-h-[700px] lg:min-h-[800px]`
- Para: `min-h-[500px] md:min-h-[550px] lg:min-h-[600px]`

**2. Reduzir o translate-y negativo do conteúdo (linha 80)**
- De: `-translate-y-60 md:-translate-y-72 lg:-translate-y-80`
- Para: `-translate-y-40 md:-translate-y-48 lg:-translate-y-56`

Estas mudanças vão:
- Manter o efeito de luz conic gradient intacto
- Reduzir o espaço vazio abaixo do conteúdo da hero
- Aproximar visualmente a seção Demo da Hero

---

## Resultado Esperado
O espaço entre as duas seções será significativamente reduzido, criando uma transição mais fluida entre a Hero e a Demo, sem afetar a animação e o brilho do efeito Lamp.

