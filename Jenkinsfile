pipeline {
    agent any

    environment {
        // Jenkins runs as a background process and doesn't source ~/.zshrc,
        // so nvm's Node install isn't on PATH by default — add it explicitly.
        PATH = "/Users/thuong/.nvm/versions/node/v22.9.0/bin:${env.PATH}"
    }

    triggers {
        // Once a day; 'H' lets Jenkins pick the minute within the 8am hour to spread load.
        cron('H 8 * * *')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Type check') {
            steps {
                sh 'npx tsc --noEmit'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
        success {
            slackSend(channel: '#qa-results', color: 'good',
                message: "✅ ${env.JOB_NAME} #${env.BUILD_NUMBER} passed\n${env.BUILD_URL}")
        }

        failure {
            slackSend(channel: '#qa-results', color: 'danger',
                message: "❌ ${env.JOB_NAME} #${env.BUILD_NUMBER} failed\n${env.BUILD_URL}")
        }
    }
}
