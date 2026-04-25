# Tailwind Migration - Etapa 6

## Objetivo

Fechar o kit de formularios compartilhados com campos de selecao e numero, reduzindo divergencias visuais em controles de entrada.

## O que foi implementado

- Extensao do componente `AppInput` com:
  - `AppSelect`
  - `AppNumberInput`
- Migracao do formulario `NovaContaForm` para os novos wrappers.
- Migracao do seletor de paginacao em `Contas` para `AppSelect`.

## Resultado pratico

- Controles de formulario passam a compartilhar foco, borda, erro e placeholder no mesmo padrao.
- Menos repeticao de estilo em componentes de dominio.
- Base pronta para evoluir para um kit completo (`AppTextarea`, `AppDateInput`, etc.).

## Proximo passo sugerido

1. Consolidar superfices (`Card`, `Paper`, secoes) em um wrapper unico.
2. Migrar `Navbar` e `Sidebar` para tokens semanticos, removendo cores inline.
3. Revisar contraste e acessibilidade de todos os estados interativos.
