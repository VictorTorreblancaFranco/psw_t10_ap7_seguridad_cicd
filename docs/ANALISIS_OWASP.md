# Análisis OWASP - SecureFlow

## Alcance

Aplicación académica local compuesta por una SPA React y una API Express. El análisis activo no está autorizado; el pipeline ejecuta únicamente el análisis pasivo `zap-baseline.py`.

## Riesgos aplicables

| Riesgo | Aplicación en SecureFlow | Control implementado | Mejora propuesta |
|---|---|---|---|
| A01 Broken Access Control | Acceso directo a `/admin` o `/api/admin/stats` con un usuario sin privilegios. | La SPA redirige y la API valida el rol `ADMIN`. | Incorporar una política centralizada de autorización y pruebas negativas por cada endpoint. |
| A03 Injection | Envío de HTML, JavaScript o patrones SQL mediante el formulario. | La API valida formato, longitud y patrones peligrosos; no interpola datos en consultas. | Sustituir el filtro demostrativo por un esquema de validación formal y codificación contextual de salida. |
| A07 Identification and Authentication Failures | Enumeración de cuentas, contraseñas erróneas o reutilización de sesiones. | Mensaje genérico, hash bcrypt, JWT con expiración y validación de firma. | Añadir rate limiting, cookies HttpOnly/SameSite y revocación de sesiones. |

## Resultados del análisis pasivo

El 5 de noviembre de 2026 se ejecutó `zap-baseline.py` contra la aplicación local. ZAP inspeccionó 6 URL y registró 11 tipos de alerta: 2 de riesgo medio, 6 de riesgo bajo y 3 informativas. No se detectaron alertas de riesgo alto, por lo que el Quality Gate fue aprobado. Para la actividad se seleccionaron estos tres hallazgos reales:

| Hallazgo ZAP | Riesgo | Impacto | Corrección recomendada |
|---|---|---|---|
| Content Security Policy Header Not Set | Medium | Aumenta el impacto potencial de una inyección de contenido. | Definir una política CSP restrictiva con `default-src 'self'`. |
| Missing Anti-clickjacking Header | Medium | Permite que la página sea embebida en un iframe malicioso. | Usar `frame-ancestors 'none'` en CSP o `X-Frame-Options: DENY`. |
| X-Content-Type-Options Header Missing | Low | El navegador podría interpretar un tipo de contenido distinto al declarado. | Añadir `X-Content-Type-Options: nosniff`. |

## Criterio del pipeline

- `High`: bloquea la construcción.
- `Medium`, `Low` e `Informational`: se registran para revisión y mejora.
- Una alerta ZAP es un hallazgo preliminar; debe validarse para descartar falsos positivos.

