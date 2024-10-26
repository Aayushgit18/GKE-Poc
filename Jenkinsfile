pipeline{
    agent any
    stages{
        stage("Checkout Stage"){
            steps{
                script {
                sh 'git branch: 'gcp-devsecops', url: 'https://github.com/amitmaurya07/wanderlust-devsecops.git''
            }
            }
        }
    }
    post{
        success{
            echo "========pipeline executed successfully ========"
        }
    }
        stage("Build Stage"){
            steps{
                sh 'docker build -t wanderlust:1 .'
            }
        }
    post{
        success{
            echo "========pipeline executed successfully ========"
        }
    }
}