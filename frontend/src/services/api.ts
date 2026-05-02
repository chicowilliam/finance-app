const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim();
const API_BASE = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
const AUTH_EXPIRED_EVENT = 'finance:auth-expired';

function ensureApiConfigured(): void {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) return;

  const isProdHost = !['localhost', '127.0.0.1'].includes(window.location.hostname);
  const pointsToLocalhost = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');

  if (isProdHost && pointsToLocalhost) {
    throw new Error('API não configurada em produção. Defina VITE_API_URL com a URL pública do backend.');
  }
}

function buildApiUrl(path: string): string {
  ensureApiConfigured();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const apiPath = normalizedPath.startsWith('/api/')
    ? normalizedPath
    : `/api${normalizedPath}`;
  return `${API_BASE}${apiPath}`;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleUnauthorized(path: string, res: Response): Error | null {
  const token = localStorage.getItem('token');
  const isAuthScreenRequest = path === '/auth/login' || path === '/auth/register';

  if (res.status !== 401 || !token || isAuthScreenRequest) {
    return null;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
  }

  return new Error('Sessão expirada. Faça login novamente.');
}

async function readErrorMessage(res: Response, fallbackMessage: string): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
  } catch {
    // Ignore invalid/non-JSON error bodies and use the fallback message.
  }

  return fallbackMessage;
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const unauthorizedError = handleUnauthorized(path, res);
    if (unauthorizedError) throw unauthorizedError;
    throw new Error(await readErrorMessage(res, `GET ${path} failed: ${res.status}`));
  }
  return res.json();
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const unauthorizedError = handleUnauthorized(path, res);
    if (unauthorizedError) throw unauthorizedError;
    throw new Error(await readErrorMessage(res, `POST ${path} failed: ${res.status}`));
  }
  return res.json();
}

export async function postAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const unauthorizedError = handleUnauthorized(path, res);
    if (unauthorizedError) throw unauthorizedError;
    throw new Error(await readErrorMessage(res, `POST ${path} failed: ${res.status}`));
  }
  return res.json();
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const unauthorizedError = handleUnauthorized(path, res);
    if (unauthorizedError) throw unauthorizedError;
    throw new Error(await readErrorMessage(res, `PUT ${path} failed: ${res.status}`));
  }
  return res.json();
}

export async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const unauthorizedError = handleUnauthorized(path, res);
    if (unauthorizedError) throw unauthorizedError;
    throw new Error(await readErrorMessage(res, `PATCH ${path} failed: ${res.status}`));
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export async function del(path: string): Promise<void> {
  const res = await fetch(buildApiUrl(path), {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const unauthorizedError = handleUnauthorized(path, res);
    if (unauthorizedError) throw unauthorizedError;
    throw new Error(await readErrorMessage(res, `DELETE ${path} failed: ${res.status}`));
  }
}

export async function delWithBody<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const unauthorizedError = handleUnauthorized(path, res);
    if (unauthorizedError) throw unauthorizedError;
    throw new Error(await readErrorMessage(res, `DELETE ${path} failed: ${res.status}`));
  }
  return res.json();
}

export { AUTH_EXPIRED_EVENT };