# Use Node.js Alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the application with the environment variables
RUN npm run build

# Expose the port used by Vite (5173)
EXPOSE 5173

# Set environment variable for API URL (Backend)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Start the Vite production server
CMD ["npm", "run", "preview", "--", "--host"]
