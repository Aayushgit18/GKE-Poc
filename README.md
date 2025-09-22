pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'gcp-devsecops',
                    url: 'https://github.com/Aayushgit18/GKE-Poc.git'
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-cred',  // Docker Hub credentials in Jenkins
                        usernameVariable: 'DOCKER_USERNAME', 
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker build -t $DOCKER_USERNAME/gkepoc_frontend:latest ./frontend
                        docker build -t $DOCKER_USERNAME/gkepoc_backend:latest ./backend
                        docker push $DOCKER_USERNAME/gkepoc_frontend:latest
                        docker push $DOCKER_USERNAME/gkepoc_backend:latest
                    '''
                }
            }
        }

        stage('Deploy to GKE Cluster (No PVC)') {
            steps {
                withCredentials([
                    file(credentialsId: 'gcp-sa-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS') // Service account key JSON
                ]) {
                    sh '''
                        # Authenticate with GCP
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        
                        # Get cluster credentials and set context
                        gcloud container clusters get-credentials autopilot-cluster --zone asia-south1 --project fir-b5c70
                        
                        # Apply only the non-PVC manifests
                        kubectl apply -f ./kubernetes/no-pvc -n devsecops --validate=false
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD pipeline succeeded."
        }
        failure {
            echo "❌ CI/CD pipeline failed. Check logs for details."
        }
    }
}
==============================================================================================================

pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'gcp-devsecops',
                    url: 'https://github.com/Aayushgit18/GKE-Poc.git'
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USERNAME', 
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                        docker build -t $DOCKER_USERNAME/gkepoc_frontend:latest ./frontend
                        docker build -t $DOCKER_USERNAME/gkepoc_backend:latest ./backend
                        docker push $DOCKER_USERNAME/gkepoc_frontend:latest
                        docker push $DOCKER_USERNAME/gkepoc_backend:latest
                    '''
                }
            }
        }

        stage('Deploy to GKE Cluster (No PVC)') {
            steps {
                withCredentials([
                    file(credentialsId: 'gcp-sa-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')
                ]) {
                    sh '''
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                        gcloud container clusters get-credentials autopilot-cluster --zone asia-south1 --project fir-b5c70
                        kubectl apply -f ./kubernetes/no-pvc -n devsecops --validate=false
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "CI/CD pipeline succeeded."
        }
        failure {
            echo "CI/CD pipeline failed. Check logs for details."
        }
    }
}

