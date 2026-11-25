#Starts with a lightweight Linux image that already has Node.js 24 installed.
FROM node:24-alpine

#Sets /app as the working directory inside the image.
WORKDIR /app

#Copies your package files into the image.
COPY package*.json ./

#Installs dependencies from your lockfile.
RUN npm ci

#Copies your project files into the image.
COPY . .

#Builds your Next.js application.
RUN npm run build

#Documents that the application listens on port 3000. It doesn't publish the port to your computer.
EXPOSE 3000

#Starts Next.js when the container runs
CMD ["npm", "run", "start"]