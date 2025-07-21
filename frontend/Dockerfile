# Use Node.js as the base image
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Remix app for production
RUN npm run build

# Stage for serving the built app
FROM node:18-slim

WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --production

# Expose the port that Remix will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
