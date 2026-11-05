# Casos automatizados con Selenium

## CP-SEL-01 - Login inválido

- **Objetivo:** comprobar que las credenciales incorrectas no crean una sesión.
- **Datos:** `user@demo.local` y una contraseña errónea.
- **Resultado esperado:** mensaje genérico `Credenciales incorrectas`, permanencia en `/login` y ausencia de token.
- **Riesgo relacionado:** A07 Identification and Authentication Failures.

## CP-SEL-02 - Ruta protegida sin sesión

- **Objetivo:** impedir el acceso directo al módulo administrativo.
- **Precondición:** almacenamiento de sesión vacío.
- **Acción:** navegar a `/admin`.
- **Resultado esperado:** redirección automática a `/login`.
- **Riesgo relacionado:** A01 Broken Access Control.

## CP-SEL-03 - Entrada potencialmente peligrosa

- **Objetivo:** verificar la validación del formulario en el backend.
- **Datos:** mensaje `<script>alert('xss')</script>`.
- **Resultado esperado:** respuesta controlada que indique contenido no permitido, sin ejecutar el script.
- **Riesgo relacionado:** A03 Injection.

