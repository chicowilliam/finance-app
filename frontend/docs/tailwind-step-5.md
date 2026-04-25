# Tailwind Migration - Etapa 5

## Objetivo

Padronizar campos de entrada com um componente compartilhado, garantindo consistencia de foco, erro, placeholder e estado desabilitado.

## O que foi implementado

- Novo componente `AppInput` em `src/components/AppInput.tsx`
  - `AppInput` para campos de texto
  - `AppPasswordInput` para campos de senha
  - estilos unificados para label, input, section, erro e descricao
- Novos tokens semanticos de input em `src/index.css`
  - background e borda
  - placeholder
  - foco
  - erro
  - disabled
- Migracao inicial dos formulários prioritarios:
  - `src/pages/Welcome.tsx`
  - `src/components/NovaContaForm.tsx`

## Resultado pratico

- Formularios de autenticacao e nova conta agora compartilham o mesmo comportamento visual dos campos.
- A consistencia de validacao visual ficou mais previsivel entre light e dark.
- O custo para migrar os demais formulários caiu, pois o padrao ja esta pronto.

## Sugestoes para o proximo passo

1. Migrar campos de Configuracoes para `AppInput` quando houver inputs editaveis.
2. Criar `AppSelect` e `AppNumberInput` para fechar o kit de formularios.
3. Consolidar superfices de Card/Panel para reduzir variacoes de layout.
