# Use the official Node.js image from Docker Hub
FROM node:20.18.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock files first to leverage Docker's cache
COPY package*.json ./

# Install dependencies usingnpm
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port for the application (assuming serve uses port 5000)
EXPOSE 8081

# Start the server using npm (e.g., start command from package.json)
CMD ["npm", "run", "web"]  
