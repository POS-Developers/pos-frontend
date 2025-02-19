# Use Node.js Alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies more efficiently
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Expose the port used by Vite (5173)
EXPOSE 5173

# Start the React development server
CMD ["npm", "run", "dev", "--", "--host"]
