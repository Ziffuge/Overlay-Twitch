FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY serverConfig.json ./
COPY dist ./dist
COPY static_pages ./static_pages
EXPOSE 3000
CMD ["node", "./dist/app.js"]