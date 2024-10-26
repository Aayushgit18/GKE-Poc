pipeline {
    agent any
    stages {
        stage("Checkout Stage") {
            steps {
                script {
                    git branch: 'gcp-devsecops', url: 'https://github.com/amitmaurya07/wanderlust-devsecops.git'
                }
            }
        }
        
        stage("Build Stage") {
            steps {
                sh 'docker build -f ./frontend/Dockerfile -t wanderlust_frontend:1 .'
                sh 'docker build -f ./backend/Dockerfile -t wanderlust_backend:1 .'
            }
        }
    }
    
    post {
        success {
            echo "========pipeline executed successfully ========"
        }
    }
}
