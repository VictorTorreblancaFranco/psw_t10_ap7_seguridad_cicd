import bcrypt from 'bcryptjs';

export const users = [
  {
    id: 'usr-1001',
    name: 'Usuario Demo',
    email: 'user@demo.local',
    role: 'USER',
    passwordHash: bcrypt.hashSync('User123!', 10),
  },
  {
    id: 'adm-1001',
    name: 'Administrador Demo',
    email: 'admin@demo.local',
    role: 'ADMIN',
    passwordHash: bcrypt.hashSync('Admin123!', 10),
  },
];

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

