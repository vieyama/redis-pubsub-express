FROM node:20-alpine

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run prisma:deploy
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 