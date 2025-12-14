FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN rm -f .env
EXPOSE 80
CMD ["node", "index.js"]