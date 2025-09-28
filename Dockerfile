FROM node:20

# Install nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install pm2 -g && npm install

COPY . .

# Remove default nginx config and use template
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Railway sets PORT automatically
EXPOSE 8080
ENV PORT=8080

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
