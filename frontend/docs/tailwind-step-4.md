# Tailwind Migration - Etapa 4

## Objetivo

Criar a primeira camada base reutilizavel para interacoes, com foco em botoes e estados de hover, foco e desabilitado.

## O que foi implementado

- Novo componente compartilhado `AppButton` em `src/components/AppButton.tsx`
  - variantes semanticas por `tone`
  - niveis visuais por `appearance`
  - estados consistentes de hover, active, focus-visible e disabled
- Novos tokens globais de interacao em `src/index.css`
  - focus ring
  - superficies solid, soft e outline
  - paletas para brand, neutral e status
- Migracao dos usos comuns de botao para o novo componente em:
  - `src/components/Navbar.tsx`
  - `src/components/NovaContaForm.tsx`
  - `src/pages/Welcome.tsx`
  - `src/pages/Configuracoes.tsx`
  - `src/pages/Contas.tsx`

## Resultado pratico

- O app agora tem uma base consistente para CTA primaria, secundaria e filtros de status.
- As telas deixam de repetir `variant="default"` e combinacoes visuais espalhadas.
- A proxima refatoracao pode seguir a mesma estrategia para `Input`, `Card` e `Loader`.

## Sugestoes para o Passo 5

1. Extrair `AppInput` com estados de erro, foco e placeholder padronizados.
2. Migrar `Welcome` e `NovaContaForm` primeiro, pois ja concentram validacao e feedback visual.
3. Depois disso, consolidar `Card` e superfices antes de mexer em layout estrutural.
