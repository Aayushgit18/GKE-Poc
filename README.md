# Wanderlust

## The Ultimate Travel Blog 🌍✈️ for You

![Preview Image](https://github.com/krishnaacharyaa/wanderlust/assets/116620586/17ba9da6-225f-481d-87c0-5d5a010a9538)

---

### Blog Link: [How to Deploy a Three-Tier Application on GKE: A Step-by-Step Guide]([https://amitmaurya.hashnode.dev/how-to-deploy-a-three-tier-application-on-gke-a-step-by-step-guide#heading-understanding-three-tier-architecture-in-kubernetes](https://amitmaurya.hashnode.dev/how-to-deploy-a-three-tier-application-on-gke-a-step-by-step-guide)
## Step 1: Setting Up GCP Project

1. **Create a GCP Project**:
   - Go to the [GCP Console](https://console.cloud.google.com/).
   - Create a new project and name it `devsecops-3-tier`.

2. **Enable Billing**:
   - Ensure billing is enabled for your project.

3. **Enable Required APIs**:
   - Compute Engine API
   - Kubernetes Engine API
   - Cloud Logging API
   - Cloud Monitoring API

## Step 2: Configure IAM Roles

1. **Create Service Account**:
   - Name: `devsecops-3-tier`
   - Roles:
     - `Project Viewer`
     - `Project Admin`
     - `Kubernetes Engine Service Agent`

2. **Generate and download the service account key**.

## Step 3: Set Up Jenkins on GCP

1. **Create a Compute Engine Instance**:
   - Name: `jenkins-server`
   - Machine type: `e2-standard-2`
   - Disk: Debian-based OS
   - Allow HTTP/HTTPS traffic
   - Network tags: `jenkins`

2. **Create Firewall Rule**:
   - Name: `allow-jenkins`
   - Target tags: `jenkins`
   - Port: 8080
   - Source IP range: `0.0.0.0/0`

3. **Install Jenkins**:
   SSH into the instance and run the following commands:
   ```bash
   sudo apt-get update
   sudo apt install default-jre
   wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
   echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
   sudo apt-get update
   sudo apt-get install jenkins
   sudo systemctl enable jenkins
   sudo systemctl start jenkins
4. **Access Jenkins**:
   - Retrieve the initial admin password to complete the Jenkins setup:
     ```bash
     cat /var/lib/jenkins/secrets/initialAdminPassword
     ```
   - Copy the password, go to `http://<instance-ip>:8080` in your browser, and paste the password to unlock Jenkins.
   - Follow the guided installation steps and choose the suggested plugins to install.
   - Create an admin user when prompted and configure the Jenkins URL.

5. **Install Jenkins Plugins**:
   - Navigate to **Manage Jenkins > Manage Plugins** and ensure the following plugins are installed:
     - **Kubernetes CLI**
     - **Pipeline**
     - **Git**
     - **Docker Pipeline**

6. **Configure Jenkins Credentials**:
   - Go to **Manage Jenkins > Manage Credentials** and add the following:
     - **Docker Hub credentials** for pushing images.
     - **Kubernetes credentials** for `kubectl` to deploy to GKE.

## Step 4: Create GKE Cluster

1. **Create GKE Cluster**:
   - Go to the GCP Console and navigate to **Kubernetes Engine > Clusters**.
   - Create a new **GKE Standard cluster** and configure:
     - Cluster name: `devsecops-cluster`
     - Location: Choose a region close to your users.
     - Number of nodes: 3 (adjust based on your needs)
   
2. **Connect to the Cluster**:
   - Use **Cloud Shell** or your local terminal:
     ```bash
     gcloud container clusters get-credentials devsecops-cluster --region <your-region> --project devsecops-3-tier
     ```
   - Verify connectivity with:
     ```bash
     kubectl get nodes
     ```

3. **Create a Namespace**:
   ```bash
   kubectl create namespace devsecops

## Step 5: Jenkins Pipeline Configuration

1. **Configure Jenkins**:
   - Navigate to `http://<EXTERNAL_IP>:8080` to access the Jenkins server.
   - Complete the initial Jenkins setup by following the on-screen instructions.
   - Install the recommended plugins.
   - Create an admin user and log in to the Jenkins dashboard.

2. **Install Additional Jenkins Plugins**:
   - Go to `Manage Jenkins` > `Manage Plugins`.
   - Install the following plugins:
     - `Kubernetes`
     - `Pipeline`
     - `Git`
     - `Docker Pipeline`
     - `Blue Ocean` (optional, for an enhanced UI)

3. **Configure Jenkins Credentials**:
   - Navigate to `Manage Jenkins` > `Manage Credentials`.
   - Add the following credentials:
     - **GCP Service Account Key**:
       - Kind: Secret file
       - ID: `gcp-service-account`
       - Upload the service account key JSON file.
     - **Docker Hub Credentials**:
       - Kind: Username and password
       - ID: `docker-hub-credentials`
       - Enter your Docker Hub username and password.

4. **Create Jenkins Pipeline**:
   - Create a new Jenkins pipeline job:
     - Go to `New Item`, enter a name for your job (e.g., `gke-pipeline`), and select `Pipeline`.
   - Configure the pipeline by adding the following code under the `Pipeline` section (use the `Pipeline script` option):

     ```groovy
     pipeline {
         agent any
         environment {
             DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
             GCP_SERVICE_ACCOUNT = 'gcp-service-account'
         }
         stages {
             stage('Clone Repository') {
                 steps {
                     git branch: 'main', url: 'https://github.com/your-repo/devsecops-3-tier.git'
                 }
             }
             stage('Build Docker Images') {
                 steps {
                     script {
                         docker.build("app-backend:latest", "./backend")
                         docker.build("app-frontend:latest", "./frontend")
                     }
                 }
             }
             stage('Push Docker Images') {
                 steps {
                     withDockerRegistry([credentialsId: DOCKER_CREDENTIALS_ID, url: 'https://index.docker.io/v1/']) {
                         script {
                             docker.image("app-backend:latest").push()
                             docker.image("app-frontend:latest").push()
                         }
                     }
                 }
             }
             stage('Deploy to GKE') {
                 steps {
                     withCredentials([file(credentialsId: GCP_SERVICE_ACCOUNT, variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                         sh '''
                         # Authenticate with GCP
                         gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                         gcloud container clusters get-credentials devsecops-cluster --zone us-central1-c
                         
                         # Apply Kubernetes manifests
                         kubectl apply -f k8s/backend-deployment.yaml
                         kubectl apply -f k8s/frontend-deployment.yaml
                         kubectl apply -f k8s/service.yaml
                         '''
                     }
                 }
             }
         }
         post {
             success {
                 echo 'Pipeline completed successfully!'
             }
             failure {
                 echo 'Pipeline failed. Check the logs and try again.'
             }
         }
     }
     ```

## Step 6: Deploying and Testing the Application

1. **Access GKE Cluster**:
   - Ensure your `kubectl` is configured to interact with the GKE cluster by running:
     ```bash
     gcloud container clusters get-credentials devsecops-cluster --zone us-central1-c --project devsecops-3-tier
     ```

2. **Verify Deployments**:
   - Run `kubectl get pods` to ensure that all pods are running.
   - Run `kubectl get services` to check the service's external IP.

3. **Access the Application**:
   - Copy the external IP of the frontend service.
   - Open it in your web browser to test the deployed application.

## Conclusion

This guide helps set up a Jenkins CI/CD pipeline to deploy a three-tier application to a GKE cluster. Make sure to monitor your application and update the pipeline for new features and maintenance.

---

## 🤝 Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/krishnaacharyaa/wanderlust/blob/main/.github/CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
