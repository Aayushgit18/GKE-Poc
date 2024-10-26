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
        
        stage("Push Stage") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push wanderlust_frontend:1'
                    sh 'docker push wanderlust_backend:1'
                }
            }
        }
    }
    
    post {
        success {
            echo "========pipeline executed successfully ========"
        }
    }
}
