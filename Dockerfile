# Base image
FROM node:18

# Install PM2 and Nginx
RUN npm install -g pm2 && apt-get update && apt-get install -y nginx

# Create app directory
WORKDIR /app

# Copy package.json first (better cache)
COPY package*.json ./
RUN npm install --production

# Copy all app files
COPY . .

# Replace default nginx config at runtime
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Expose Railway port
ENV PORT=8080
EXPOSE 8080

# Entry command: substitute $PORT into nginx.conf, then start PM2
CMD sh -c "envsubst '\$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && pm2-runtime ecosystem.config.js"
