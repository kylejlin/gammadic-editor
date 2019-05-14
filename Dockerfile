FROM node:11.15.0-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN echo "gritiGz gamadyk lrnr!" > sample.txt
CMD node index.js
EXPOSE 8081