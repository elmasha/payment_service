FROM node:18

# Install nginx and envsubst
RUN apt-get update && apt-get install -y nginx gettext-base

# Install PM2 globally
RUN npm install -g pm2

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies (only production)
RUN npm install --production

# Copy the rest of the app
COPY . .

# Copy nginx template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Expose Railway's dynamic port
EXPOSE 8080

# Start nginx in foreground + PM2 for Node apps
CMD sh -c "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf \
    && nginx -g 'daemon off;' & \
    pm2-runtime ecosystem.config.js"
