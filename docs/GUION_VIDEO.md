# Guion de video - AP7 Seguridad y CI/CD

Duración objetivo: 4 minutos. Todos los integrantes deben aparecer y participar.

## 0:00-0:50 - Dario Sebastian Huaman Conca, QA Lead

> Somos el Equipo 10 y presentamos SecureFlow, un laboratorio controlado para integrar seguridad web en CI/CD. Analizamos tres riesgos OWASP: control de acceso deficiente, inyección y fallos de autenticación. La aplicación cuenta con login, roles, rutas privadas y un formulario validado desde el backend.

Mostrar: pantalla de login y tabla de riesgos en `docs/ANALISIS_OWASP.md`.

## 0:50-1:40 - Jhoss Andy Palomino Benito, QA Tester

> Ejecutamos OWASP ZAP en modo pasivo contra nuestra aplicación local. Este modo inspecciona las respuestas sin realizar ataques activos. El reporte identifica configuraciones de cabeceras pendientes, como CSP, protección contra clickjacking y `X-Content-Type-Options`. Cada hallazgo incluye impacto y recomendación de mejora.

Mostrar: reporte HTML de ZAP y tres alertas.

## 1:40-2:35 - Luis Angel Sanchez Romero, QA Tester

> Diseñamos tres escenarios funcionales de seguridad: rechazo de credenciales inválidas, redirección de una ruta protegida sin sesión y rechazo de contenido potencialmente inyectable. Los casos validan el comportamiento visible y también comprueban que no se cree una sesión indebida.

Mostrar: `test_security_ui.py` y el reporte Selenium con tres pruebas aprobadas.

## 2:35-3:35 - Victor Raul Torreblanca Franco, QA Automation

> El Jenkinsfile automatiza el checkout, la construcción del proyecto, las pruebas unitarias, el inicio de la aplicación, el análisis pasivo con ZAP y las pruebas Selenium en Chrome headless. El pipeline bloquea alertas de nivel alto o cualquier prueba funcional fallida, y publica los reportes HTML como evidencia.

Mostrar: `Jenkinsfile` y la vista de etapas finalizada en verde.

## 3:35-4:00 - Cierre conjunto

> Selenium confirma que los controles funcionan desde la perspectiva del usuario, mientras que ZAP analiza la superficie HTTP. Integrarlos en Jenkins permite detectar regresiones de seguridad temprano y producir evidencia en cada cambio.

