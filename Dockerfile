# Step 1: Build the React application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy project files
COPY . .

# Build the app using Vite specifically in QA mode (creates 'dist' directory)
RUN npx vite build --mode qa

# Step 2: Serve the build directory using Nginx
FROM nginx:alpine

# Copy built files from the build stage to Nginx serve location
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing (Vite/React Router redirect support)
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]