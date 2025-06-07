FROM node:20-slim

RUN apt-get update && \
    apt-get install -y git git-lfs && \
    git lfs install

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN git lfs pull

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
