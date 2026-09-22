pipeline {
    agent any

    environment {
        // Jenkins runs as a background process and doesn't source ~/.zshrc,
        // so nvm's Node install isn't on PATH by default — add it explicitly.
        PATH = "/Users/thuong/.nvm/versions/node/v22.9.0/bin:${env.PATH}"
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
    }
}
