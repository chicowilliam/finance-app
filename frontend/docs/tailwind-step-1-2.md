# Tailwind Migration - Etapas 1 e 2

## Etapa 1 - Diagnostico visual (estado atual)

### Tokens e base global existentes

- Fonte base: Segoe UI / Tahoma / Verdana (definido em `src/index.css`)
- Cores semanticas ja existentes por CSS variables:
  - `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`
  - `--color-brand`, `--color-brand-strong`
  - status: `--status-paid`, `--status-due`, `--status-late`
- Escala de espacamento existente:
  - `--space-1` ate `--space-4`
- Escala de raio e sombra existente:
  - `--radius-sm`, `--radius-md`, `--radius-lg`, `--shadow-sm`

### Componentes e estilos mapeados

- `src/components/Navbar.tsx`
  - Layout e composicao feitos com Mantine
  - Variacoes de estado no header e acoes (nova conta, sair)
- `src/components/Sidebar.tsx`
  - Estilos em props inline + Mantine NavLink
  - Cores e estados ativos repetidos entre links principais e rodape
- `src/components/NovaContaForm.tsx`
  - Formulario com RHF + Zod e componentes Mantine
  - Estilizacao predominante via props Mantine
- `src/pages/Welcome.tsx`
  - Fluxo login/cadastro com Mantine + motion + sonner
  - Estrutura visual de alto impacto para futura migracao parcial
- `src/App.css`
  - Sistema de skeleton e classes utilitarias proprias (`w-12`, `mb-16` etc.)
- `src/components/Navbar.module.css` e `src/components/VisaoGeral.module.css`
  - Modulos CSS legados com padroes de navegacao/cards/listas

### Repeticoes observadas (prioridade de refatoracao)

1. Cores semanticas repetidas entre CSS modules e inline styles.
2. Border radius e padding repetidos em cards/listas/botoes.
3. Estados ativos de navegacao implementados em mais de um ponto.
4. Utilitarios caseiros no `App.css` que podem virar classes Tailwind.

### Ordem sugerida para proximas PRs

1. Button/Input (baixo risco, alto reuso).
2. Card/Loader (convergencia de espacamento/raio/sombra).
3. Navbar/Sidebar (estrutura e navegacao).
4. Welcome/Contas por blocos menores.

## Etapa 2 - Setup Tailwind sem ruptura

### O que foi feito

- Dependencias base adicionadas em devDependencies:
  - `tailwindcss`
  - `postcss`
  - `autoprefixer`
- Arquivo `tailwind.config.ts` criado com:
  - `content` para `index.html` e `src/**/*.{ts,tsx,js,jsx}`
  - extensoes de tema com tokens semanticos do projeto

### Decisao de seguranca nesta fase

- CSS atual foi mantido como fonte principal de estilo.
- Nenhum componente foi alterado para classes Tailwind ainda.
- Objetivo: habilitar base de tokenizacao primeiro e evitar regressao visual.

### Criterio de pronto das etapas 1 e 2

- Diagnostico documentado e priorizado.
- Setup inicial Tailwind criado sem mexer no comportamento das telas.
- Projeto apto para iniciar migracao incremental por componente.
