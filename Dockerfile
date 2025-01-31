# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# (package-lock.json is recommended if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the app
EXPOSE 3000

# Define environment variables (if needed)
# ENV DATABASE_URL=your-database-url
# ENV REDIS_URL=your-redis-url
# ENV GEMINI_API_KEY=your-google-generative-ai-api-key

# Run the app when the container launches
CMD ["npm", "run", "dev"]
