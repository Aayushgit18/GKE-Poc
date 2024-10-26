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
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                sh 'docker build -f ./frontend/Dockerfile -t $DOCKER_USERNAME/wanderlust_frontend:1 .'
                sh 'docker build -f ./backend/Dockerfile -t $DOCKER_USERNAME/wanderlust_backend:1 .'
            }
            }
        }
        
        stage("Push Stage") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push $DOCKER_USERNAME/wanderlust_frontend:1'
                    sh 'docker push $DOCKER_USERNAME/wanderlust_backend:1'
                }
            }
        }

        stage("Deploy to GKE Cluster") {
            steps {
                kubeconfig(credentialsId: 'gke-config', caCertificate: '', serverUrl: 'https://34.56.143.43') {
                    sh 'kubectl apply -f ./kubernetes/frontend-deployment.yaml'
                    sh 'kubectl apply -f ./kubernetes/frontend-service.yaml'
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
