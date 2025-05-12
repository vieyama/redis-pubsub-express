FROM node:20-alpine

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]