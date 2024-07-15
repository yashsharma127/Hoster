# Hoster

Hoster is a hosting platform which can be used to deploy your project from github using a hostname, utilizing AWS services, Express, Socket.io, Redis, and Node.js for the backend, with a Next.js frontend.

## Architecture

Hoster is designed with the following architecture:

- ``Frontend``: Built with Next.js and uses axios for fetching data from API server. 
- ``API Server``: HTTP API Server for REST API's. 
- ``Build Server``: Creates Docker containers, clones client GitHub repositories, builds projects, and pushes build artifacts in AWS S3.
- ``Reverse Proxy``: Routes client requests to the correct build artifacts in AWS S3 using a custom reverse proxy.
- ``Redis``: Used for log storage and retrieval, providing real-time log access through Socket.io.
- ``Socket.io``: Facilitates real-time communication for log access and updates.
- ``AWS Services``: Utilizes AWS SDK for JavaScript, AWS ECR, and AWS ECS for container orchestration and deployment and S3 for storing build codes.

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

## Setup Guide

This Project contains following services and folders:

- `api-server`: HTTP API Server for REST API's
- `build-server`: Docker Image code which clones, builds and pushes the build to S3
- `s3-reverse-proxy`: Reverse Proxy the subdomains and domains to s3 bucket static assets

To set up Hoster, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yashsharma127/Hoster.git
   cd hoster
   ```

### Local Setup

1. Run `npm install` in all the 3 services i.e. `api-server`, `build-server` and `reverse-proxy`
3. Rename `.env.example` to `.env` in all the 3 services and add the required values to them.
2. Docker build the `build-server` and push the image to AWS ECR.
3. Setup the `api-server` by providing all the required config such as TASK ARN and CLUSTER arn.
4. Run `node index.js` in `api-server` and `reverse-proxy`

At this point following services would be up and running:

| S.No | Service            | PORT    |
| ---- | ------------------ | ------- |
| 1    | `api-server`       | `:9000` |
| 2    | `socket.io-server` | `:9002` |
| 3    | `reverse-proxy`    | `:8000` |


## Note

Remember to replace the values in .env files with your own values, and other variables with the actual values relevant to your setup.
