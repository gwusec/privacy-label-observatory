# Privacy Label Observatory

The Privacy Label Observatory is a web application for analyzing visualizing weekly snapshots of privacy labels from the App Store.

## Quick Start

### Prerequisites
- Node.js and npm installed
- Docker and Docker Compose for Elasticsearch/Kibana

### Setup Overview

1. **Backend Setup**: Set up Elasticsearch/Kibana and the API server
   - See [backend/README.md](backend/README.md) for detailed instructions

2. **Frontend Setup**: Set up the React application
   - See [frontend/README.md](frontend/README.md) for detailed instructions

### Running the Application

1. Start backend (runs on port 8017):
   ```sh
   cd backend
   npm install
   npm run dev
   ```

2. Start frontend (runs on port 3000):
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
