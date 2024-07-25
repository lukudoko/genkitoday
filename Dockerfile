
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start"]