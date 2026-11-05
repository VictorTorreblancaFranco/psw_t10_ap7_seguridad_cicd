# SecureFlow - Seguridad Web y CI/CD

Proyecto del Equipo 10 para la actividad AP7 del curso de Pruebas de Software. Integra una SPA React, una API Express, análisis pasivo con OWASP ZAP, tres pruebas Selenium y un pipeline Jenkins reproducible.

## Integrantes

| Integrante | Rol |
|---|---|
| Huaman Conca, Dario Sebastian | QA Lead |
| Palomino Benito, Jhoss Andy | QA Tester |
| Torreblanca Franco, Victor Raul | QA Automation |
| Sanchez Romero, Luis Angel | QA Tester |

## Flujo DevSecOps

```text
GitHub → Build y pruebas unitarias → Aplicación Docker
       → OWASP ZAP pasivo → Selenium headless
       → Quality Gate → Reportes HTML/JUnit
```

## Funcionalidades

- Inicio de sesión con mensaje de error genérico.
- JWT firmado con expiración de 30 minutos.
- Rutas privadas y autorización por roles `USER` y `ADMIN`.
- Validación de datos en el backend.
- Panel administrativo protegido también a nivel de API.
- Configuración inicial auditable mediante ZAP.

## Cuentas de laboratorio

| Rol | Correo | Contraseña |
|---|---|---|
| USER | `user@demo.local` | `User123!` |
| ADMIN | `admin@demo.local` | `Admin123!` |

Estas cuentas son exclusivamente locales y no contienen datos reales.

## Ejecución rápida con Docker

Requisitos: Docker Desktop y Docker Compose.

```bash
docker compose up -d --build app
```

Abrir [http://localhost:3000](http://localhost:3000). Para detenerlo:

```bash
docker compose down
```

## Ejecución para desarrollo

Requisitos: Node.js 20.19 o superior.

```bash
npm install
npm run dev:backend
```

En otra terminal:

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`. API: `http://localhost:3000`.

## Pruebas unitarias

```bash
npm test
```

## Pruebas Selenium

Con la aplicación iniciada en Docker:

```bash
docker build -f tests/selenium/Dockerfile -t psw-ap7-selenium .
docker run --rm \
  -e BASE_URL=http://host.docker.internal:3000 \
  -v "$(pwd)/reports/selenium:/reports" \
  psw-ap7-selenium
```

En macOS y Windows, `host.docker.internal` permite acceder al servicio publicado en el equipo. El Jenkinsfile usa una red Docker interna y no depende de esta opción.

## Análisis OWASP ZAP

Ejecutar únicamente contra esta aplicación local o contra un entorno expresamente autorizado:

```bash
mkdir -p reports/zap
docker run --rm -t \
  -v "$(pwd)/reports/zap:/zap/wrk/:rw" \
  ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
    -t http://host.docker.internal:3000 \
    -m 2 -I \
    -r zap-report.html \
    -J zap-report.json

python3 scripts/validate_zap.py reports/zap/zap-report.json --fail-at High
python3 scripts/summarize_zap.py reports/zap/zap-report.json reports/zap/resumen.md
```

El modo baseline es pasivo. Las alertas `Medium`, `Low` e `Informational` se documentan; una alerta `High` bloquea el pipeline.

## Pipeline Jenkins

El pipeline ejecuta:

1. Checkout desde GitHub.
2. Build y tres pruebas unitarias.
3. Inicio de la aplicación en una red Docker aislada.
4. OWASP ZAP baseline y validación del Quality Gate.
5. Tres pruebas Selenium en Chromium headless.
6. Publicación de reportes ZAP, Selenium y JUnit.

### Jenkins local incluido

```bash
docker compose --profile ci up -d --build jenkins
```

Abrir [http://localhost:8081](http://localhost:8081). Durante la configuración inicial, crear un trabajo de tipo **Pipeline**, seleccionar **Pipeline script from SCM**, indicar este repositorio y usar `Jenkinsfile` como ruta del script.

## Evidencias y documentación

- [Análisis de riesgos OWASP](docs/ANALISIS_OWASP.md)
- [Casos de prueba Selenium](docs/CASOS_SELENIUM.md)
- [Guion para el video grupal](docs/GUION_VIDEO.md)
- `reports/zap/zap-report.html`: generado por ZAP.
- `reports/selenium/selenium-report.html`: generado por pytest/Selenium.
- `docs/Informe_AP7_Seguridad_CICD_Equipo10.pdf`: informe final.

## Uso responsable

Este repositorio es un laboratorio académico. No se deben ejecutar escaneos activos o automatizados contra sistemas de terceros. Las configuraciones de cabeceras pendientes son intencionales, están documentadas y deben corregirse antes de reutilizar el proyecto en producción.
