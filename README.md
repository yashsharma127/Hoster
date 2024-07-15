# Hoster

Hoster is a hosting platform which can be used to deploy your project on github to a hostname, utilizing AWS services, Express, Socket.io, Redis, and Node.js for the backend, with a Next.js frontend.

## Architecture

Hoster is designed with the following architecture:

- **Frontend**: Built with Next.js.
- **Backend**: Powered by Node.js and Express, handling API requests and serving as the core server-side logic.
- **Build Server**: Creates Docker containers, clones client GitHub repositories, builds projects, and stores build artifacts in AWS S3.
- **Reverse Proxy**: Routes client requests to the correct build artifacts in AWS S3 using a custom reverse proxy.
- **Redis**: Used for log storage and retrieval, providing real-time log access through Socket.io.
- **Socket.io**: Facilitates real-time communication for log access and updates.
- **AWS Services**: Utilizes AWS SDK for JavaScript, AWS ECR, and AWS ECS for container orchestration and deployment.

## Features and Technologies Used

- **Next.js**: Framework for the frontend, enabling server-side rendering and static site generation.
- **Node.js**: JavaScript runtime for building the backend server.
- **Express**: Web application framework for Node.js, handling API routes and server logic.
- **Docker**: Containerization technology used to build and deploy applications in isolated environments.
- **AWS S3**: Object storage service used to store build artifacts.
- **AWS ECR**: Docker container registry for storing Docker images.
- **AWS ECS**: Service for running Docker containers at scale.
- **Redis**: In-memory data structure store used for logging and real-time data processing.
- **Socket.io**: Library for real-time, bidirectional event-based communication.
- **Reverse Proxy**: Custom proxy server that maps client requests to the appropriate build artifacts.

## Prerequisites

Before setting up Hoster, ensure you have the following prerequisites:

- Node.js and npm (or Yarn) installed on your local machine.
- Docker installed for containerization.
- An AWS account with S3, ECR, and ECS services configured.
- Redis server or service available for logging.
- Git for version control and repository management.

## Setup

To set up Hoster, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/hoster.git
   cd hoster
   ```

2. **Setup Frontend**:
   ```bash
   cd hoster-frontend
   npm install
   ```
   
Now setup the Backend
   ```bash
   cd hoster-backend 
   ```

4. **Setup api-server**:
   ```bash 
   cd api-server
   npm install
   ```
   Rename `.env.example` to `.env` and add the required values to each environment variable

5. **Setup build-server**:
   ```bash 
   cd ../build-server
   npm install
   ```
   Rename `.env.example` to `.env` and add the required values to each environment variable

6. **Setup reverse-proxy**:
   ```bash 
   cd ../reverse-proxy
   npm install
   ```
   Rename `.env.example` to `.env` and add the required values to each environment variable

## Note

Remember to replace the values in .env files with your own values, and other variables with the actual values relevant to your setup.
