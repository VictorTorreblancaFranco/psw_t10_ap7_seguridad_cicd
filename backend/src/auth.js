import jwt from 'jsonwebtoken';
import { users, publicUser } from './users.js';

const jwtSecret = () =>
  process.env.JWT_SECRET || 'laboratorio-local-cambiar-en-produccion';

export function createToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    jwtSecret(),
    { expiresIn: '30m', issuer: 'psw-ap7-security-lab' },
  );
}

export function authenticate(req, res, next) {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Autenticación requerida.' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret(), {
      issuer: 'psw-ap7-security-lab',
    });
    const user = users.find((candidate) => candidate.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Sesión inválida.' });
    }

    req.user = publicUser(user);
    return next();
  } catch {
    return res.status(401).json({ message: 'Sesión inválida o expirada.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'No tienes permisos para este recurso.' });
    }
    return next();
  };
}

