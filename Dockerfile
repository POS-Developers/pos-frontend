# Use Node.js Alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies more efficientlyw
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Expose the port used by Vite (5173)
EXPOSE 5173

# Set environment variable for API URL (Backend)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Start the Vite development server and bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host"]
