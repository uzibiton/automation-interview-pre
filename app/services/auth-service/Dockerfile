FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN node node_modules/@nestjs/cli/bin/nest.js build

EXPOSE 8080

CMD ["node", "dist/main"]
