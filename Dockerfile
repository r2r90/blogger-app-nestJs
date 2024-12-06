# Use the official Node.js image as the base image
FROM node:22

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml (if using pnpm) to the working directory
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire application code to the working directory
COPY . .

EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start:debug"]