const suspiciousInput = /(<\s*script|javascript:|\bunion\s+select\b|\bor\s+['\"]?1['\"]?\s*=\s*['\"]?1)/i;

export function validateContact({ name, email, message } = {}) {
  const errors = [];
  const normalized = {
    name: String(name || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    message: String(message || '').trim(),
  };

  if (normalized.name.length < 2 || normalized.name.length > 60) {
    errors.push('El nombre debe tener entre 2 y 60 caracteres.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
    errors.push('El correo electrónico no es válido.');
  }
  if (normalized.message.length < 10 || normalized.message.length > 500) {
    errors.push('El mensaje debe tener entre 10 y 500 caracteres.');
  }
  if (Object.values(normalized).some((value) => suspiciousInput.test(value))) {
    errors.push('La entrada contiene contenido no permitido.');
  }

  return { errors, value: normalized };
}

