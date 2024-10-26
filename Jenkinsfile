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
                withCredentials([file(credentialsId: 'gcp-devsecops', variable: 'gcp_devsecops')]) {
                    sh "ls -l $GCP_DEVSECOPS"
                    sh 'gcloud auth activate-service-account --key-file=$GCP_DEVSECOPS'
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
