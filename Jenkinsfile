pipeline {
    agent any

    environment {
        // Jenkins runs as a background process and doesn't source ~/.zshrc,
        // so nvm's Node install isn't on PATH by default — add it explicitly.
        PATH = "/Users/thuong/.nvm/versions/node/v22.9.0/bin:${env.PATH}"
        // Test card for the payment form: a "Secret text" credential, masked in the log.
        TEST_CARD_NUMBER = credentials('test-card-number')
    }

    triggers {
        // Once a day; 'H' lets Jenkins pick the minute within the 8am hour to spread load.
        cron('H 8 * * *')
        // After every push to main: Jenkins runs on localhost, so GitHub cannot reach it with a
        // webhook; instead it checks the repo every 5 minutes and builds only when there are
        // new commits (no new commit = no build, no Slack message).
        pollSCM('H/5 * * * *')
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

        stage('Lint') {
            steps {
                sh 'npm run lint'
                sh 'npm run check:overview'
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
            // Serves the Playwright HTML report as a tab on the build page (needs the HTML Publisher plugin).
            publishHTML(target: [reportDir: 'playwright-report', reportFiles: 'index.html',
                                 reportName: 'PlaywrightReport', keepAll: true, allowMissing: true])
            // Gives Jenkins a "Test Result" page: every test with its pass/fail and error/stack trace.
            junit testResults: 'results.xml', allowEmptyResults: true
            script {
                // Saves the run to SQLite for Grafana and builds the Slack message (both best-effort).
                sh 'node utils/report.js'
                env.SLACK_ATTACHMENTS = readFile('slack-attachments.json')
            }
        }
        success {
            slackSend(channel: '#qa-results', color: 'good',
                message: "✅ *${env.JOB_NAME}* #${env.BUILD_NUMBER} passed",
                attachments: env.SLACK_ATTACHMENTS)
        }
        failure {
            slackSend(channel: '#qa-results', color: 'danger',
                message: "❌ *${env.JOB_NAME}* #${env.BUILD_NUMBER} failed",
                attachments: env.SLACK_ATTACHMENTS)
        }
    }
}
