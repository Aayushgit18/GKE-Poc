pipeline {
    agent any

    parameters {
        string(name: 'DOCKER_IMAGE_TAG', defaultValue: 'latest', description: 'Tag for Docker images')
    }

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
                    script {
                        def frontendImage = "${DOCKER_USERNAME}/wanderlust_frontend:${params.DOCKER_IMAGE_TAG}"
                        sh "docker build -f ./frontend/Dockerfile -t ${frontendImage} ."
                    }

                    script {
                        def backendImage = "${DOCKER_USERNAME}/wanderlust_backend:${params.DOCKER_IMAGE_TAG}"
                        sh "docker build -f ./backend/Dockerfile -t ${backendImage} ."
                    }
                }
            }
        }

        stage("Push Stage") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    script {
                        sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"

                        sh "docker push ${DOCKER_USERNAME}/wanderlust_frontend:${params.DOCKER_IMAGE_TAG}"

                        sh "docker push ${DOCKER_USERNAME}/wanderlust_backend:${params.DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }

        stage("Deploy to GKE Cluster") {
            steps {
                withKubeConfig(caCertificate: '', clusterName: 'gke_devsecops-3-tier_us-central1_wanderlust-devsecops', contextName: '', credentialsId: 'k8s-secret', namespace: 'devsecops', restrictKubeConfigAccess: false, serverUrl: 'https://34.56.143.43') {
                    script {
                        sh "kubectl apply -f ./kubernetes -n devsecops"

                        sh "kubectl get pods -n devsecops"
                        sh "kubectl get services -n devsecops"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "======== Pipeline executed successfully ========"
        }
        failure {
            echo "======== Pipeline execution failed ========"
        }
        always {
            echo "======== Cleaning up resources ========"
            // Optionally, you can add cleanup steps here
        }
    }
}
