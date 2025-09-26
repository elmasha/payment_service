FROM node:18

# Install nginx and envsubst
RUN apt-get update && apt-get install -y nginx gettext-base

# Install PM2 globally
RUN npm install -g pm2

# Copy app
#WORKDIR 
COPY . .

# Copy nginx template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Expose Railway PORT
EXPOSE 8080

# Start both servers + nginx via PM2
CMD sh -c "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && pm2-runtime ecosystem.config.js"
