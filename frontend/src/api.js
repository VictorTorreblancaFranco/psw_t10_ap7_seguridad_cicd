export async function api(path, options = {}) {
  const token = sessionStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || 'No se pudo completar la solicitud.');
    error.status = response.status;
    error.details = payload.errors || [];
    throw error;
  }

  return payload;
}

