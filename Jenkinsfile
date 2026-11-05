pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 25, unit: 'MINUTES')
    }

    environment {
        APP_IMAGE = "psw-ap7-app:${BUILD_NUMBER}"
        TEST_IMAGE = "psw-ap7-selenium:${BUILD_NUMBER}"
        APP_CONTAINER = "psw-ap7-app-${BUILD_NUMBER}"
        ZAP_CONTAINER = "psw-ap7-zap-${BUILD_NUMBER}"
        SELENIUM_CONTAINER = "psw-ap7-selenium-${BUILD_NUMBER}"
        NETWORK_NAME = 'psw-ap7-ci'
        ZAP_IMAGE = 'ghcr.io/zaproxy/zaproxy:stable'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build y pruebas unitarias') {
            steps {
                sh '''
                    docker build --target test -t "${APP_IMAGE}-test" .
                    docker build -t "$APP_IMAGE" .
                '''
            }
        }

        stage('Inicio de aplicación') {
            steps {
                sh '''
                    docker network inspect "$NETWORK_NAME" >/dev/null 2>&1 || docker network create "$NETWORK_NAME"
                    docker rm -f "$APP_CONTAINER" >/dev/null 2>&1 || true
                    docker run -d \
                      --name "$APP_CONTAINER" \
                      --network "$NETWORK_NAME" \
                      -e JWT_SECRET="jenkins-laboratorio-${BUILD_NUMBER}" \
                      "$APP_IMAGE"

                    ready=false
                    for attempt in $(seq 1 30); do
                      if docker exec "$APP_CONTAINER" wget -q -O - http://127.0.0.1:3000/api/health >/dev/null; then
                        ready=true
                        break
                      fi
                      sleep 2
                    done
                    test "$ready" = "true"
                '''
            }
        }

        stage('OWASP ZAP pasivo') {
            steps {
                sh '''
                    mkdir -p reports/zap
                    chmod 777 reports/zap
                    docker rm -f "$ZAP_CONTAINER" >/dev/null 2>&1 || true
                    set +e
                    docker run --name "$ZAP_CONTAINER" \
                      --network "$NETWORK_NAME" \
                      "$ZAP_IMAGE" \
                      zap-baseline.py \
                        -t "http://${APP_CONTAINER}:3000" \
                        -m 2 \
                        -I \
                        -r zap-report.html \
                        -J zap-report.json
                    zap_status=$?
                    set -e
                    docker cp "$ZAP_CONTAINER:/zap/wrk/." reports/zap
                    docker rm -f "$ZAP_CONTAINER" >/dev/null
                    test "$zap_status" -eq 0
                    python3 scripts/validate_zap.py reports/zap/zap-report.json --fail-at High
                    python3 scripts/summarize_zap.py reports/zap/zap-report.json reports/zap/resumen.md
                '''
            }
        }

        stage('Selenium - controles de seguridad') {
            steps {
                sh '''
                    mkdir -p reports/selenium
                    chmod 777 reports/selenium
                    docker build -f tests/selenium/Dockerfile -t "$TEST_IMAGE" .
                    docker rm -f "$SELENIUM_CONTAINER" >/dev/null 2>&1 || true
                    set +e
                    docker run --name "$SELENIUM_CONTAINER" \
                      --network "$NETWORK_NAME" \
                      -e BASE_URL="http://${APP_CONTAINER}:3000" \
                      "$TEST_IMAGE"
                    selenium_status=$?
                    set -e
                    docker cp "$SELENIUM_CONTAINER:/reports/." reports/selenium
                    docker rm -f "$SELENIUM_CONTAINER" >/dev/null
                    test "$selenium_status" -eq 0
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/selenium/junit.xml'
                }
            }
        }

        stage('Publicación de evidencias') {
            steps {
                publishHTML target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/zap',
                    reportFiles: 'zap-report.html',
                    reportName: 'Reporte OWASP ZAP'
                ]
                publishHTML target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/selenium',
                    reportFiles: 'selenium-report.html',
                    reportName: 'Reporte Selenium'
                ]
            }
        }
    }

    post {
        always {
            sh '''
                mkdir -p reports
                docker logs "$APP_CONTAINER" > reports/application.log 2>&1 || true
                docker rm -f "$APP_CONTAINER" >/dev/null 2>&1 || true
                docker rm -f "$ZAP_CONTAINER" >/dev/null 2>&1 || true
                docker rm -f "$SELENIUM_CONTAINER" >/dev/null 2>&1 || true
                docker image rm "$TEST_IMAGE" >/dev/null 2>&1 || true
            '''
            archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline DevSecOps completado: ZAP y Selenium aprobados.'
        }
        failure {
            echo 'Pipeline bloqueado: revisar el reporte ZAP o las pruebas Selenium.'
        }
    }
}
