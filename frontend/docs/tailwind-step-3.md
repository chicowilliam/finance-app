# Tailwind Migration - Etapa 3

## Objetivo

Consolidar tokens base do projeto em uma unica fonte semantica para preparar a migracao incremental dos componentes.

## O que foi implementado

- Tokens globais expandidos em `src/index.css` com:
  - paleta light e dark
  - tipografia base (`--font-sans`)
  - superfices, bordas e sidebar
  - status com foreground e background
  - escalas de radius e shadows
- Sincronizacao do tema da aplicacao em `src/context/ThemeContext.tsx`
  - `data-theme="light|dark"` aplicado no `documentElement`
  - `color-scheme` alinhado ao tema ativo
- Tema do Mantine alinhado aos mesmos tokens em `src/main.tsx`
  - brand palette
  - radius
  - shadows
  - font family
- `tailwind.config.ts` apontando para CSS variables semanticas em vez de hex fixo.

## Resultado pratico

- O projeto agora tem um contrato de design mais estavel antes da migracao visual.
- Mantine, CSS global e futuro uso de Tailwind passam a compartilhar a mesma linguagem de tokens.
- A proxima etapa pode focar em componentes pequenos sem redesenhar valores toda vez.

## Sugestao para o proximo PR

1. Criar uma primeira migracao controlada em um componente de baixo risco.
2. Comecar por `Button` ou por uma variacao isolada de CTA na tela `Welcome`.
3. Medir regressao visual com comparacao simples desktop/mobile antes de seguir para `Navbar` e `Sidebar`.
