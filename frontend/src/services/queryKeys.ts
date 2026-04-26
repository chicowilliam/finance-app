export const contasKeys = {
  all: ['contas'] as const,
  list: (scope: 'guest' | 'auth') => ['contas', 'list', scope] as const,
}
