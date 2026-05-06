export const STORAGE_KEYS = {
	// Auth
	AUTH_MODE: 'finance.auth.mode',
	AUTH_ROLE: 'finance.auth.role',
	GUEST_CONTAS: 'finance.guest.contas',
	SALDO: 'finance-app:saldo',

	// Preferences
	PREF_HIDE_VALUES:     'finance.pref.hideValuesByDefault',
	PREF_REDUCE_MOTION:   'finance.pref.reduceMotion',
	PREF_HIGH_CONTRAST:   'finance.pref.highContrast',
	PREF_SESSION_TIMEOUT: 'finance.pref.sessionTimeout',
	PREF_NOTIF_BILLS:     'finance.pref.notifBills',
	PREF_NOTIF_WEEKLY:    'finance.pref.notifWeekly',
	PREF_DENSITY:         'finance.pref.density',
	PREF_CURRENCY:        'finance.pref.currency',
	PREF_ACCENT:          'finance.pref.accentColor',

	// Onboarding tour
	TOUR_DONE: 'finance.tour.done',
} as const
