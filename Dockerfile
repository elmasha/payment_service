FROM node:18

# Install nginx and envsubst
RUN apt-get update && apt-get install -y nginx gettext-base

# Install PM2 globally
RUN npm install -g pm2

# Set working directory
WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app files
COPY . .

# Copy nginx template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Expose Railway/Docker port
EXPOSE 8080

# Start both apps + nginx
CMD ["sh", "-c", "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && pm2-runtime ecosystem.config.js"]
