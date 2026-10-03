FROM node:20-alpine
WORKDIR /frontend
COPY package*.json /frontend/
RUN npm install
COPY . .
ENTRYPOINT [ "npm", "run", "dev", "--", "--host" ]
EXPOSE 5173