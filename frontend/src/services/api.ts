const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim();
const API_BASE = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');

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

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function postAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

export async function del(path: string): Promise<void> {
  const res = await fetch(buildApiUrl(path), {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
}