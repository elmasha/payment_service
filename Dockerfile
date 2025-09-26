FROM node:20

# Install nginx and envsubst
RUN apt-get update && apt-get install -y nginx gettext-base

# Install PM2 globally
RUN npm install -g pm2

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the app
COPY . .

# Copy nginx template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Expose Railway PORT (Railway provides this)
EXPOSE 8080

# Start both servers + nginx via PM2
CMD sh -c "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && pm2-runtime ecosystem.config.js"
