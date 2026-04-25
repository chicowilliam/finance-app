# Tailwind Migration - Etapa 8

## Objetivo

Remover residuos legados e reduzir superficie de manutencao de estilos.

## O que foi feito

- Removidos arquivos nao utilizados:
  - `src/components/Navbar.module.css`
  - `src/components/VisaoGeral.module.css`
  - `src/components/card.tsx` (arquivo vazio)
- Mantido `App.css` por ser dependencia ativa do skeleton loader.

## Resultado pratico

- Menos arquivos mortos no frontend.
- Menor risco de divergencia entre estilos antigos e novos.
- Build segue limpo apos limpeza.
