FROM node:20-alpine

# Install OpenSSL and other dependencies
RUN apk add --no-cache openssl openssl-dev

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

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

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3001

# Set default command
CMD ["sh", "./entrypoint.sh"]
