# PubSub Backend Service

A real-time backend service that handles sales data with Redis pub/sub functionality for real-time updates.

## Features

- RESTful API for sales management (CRUD operations)
- Real-time updates using Server-Sent Events (SSE)
- Redis pub/sub for message handling
- PostgreSQL database
- API documentation with Swagger UI
- Input validation using Zod
- TypeScript support
- Docker support

## Prerequisites

- Node.js (v16 or higher)
- Redis server
- PostgreSQL
- Yarn package manager
- Docker and Docker Compose (for containerized deployment)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/vieyama/redis-pubsub-express
cd redis-pubsub-express
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
PORT=3001
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pubsub?schema=public
```

4. Set up the database:
```bash
# Run Prisma migrations
yarn prisma generate
yarn prisma migrate dev
```

### Docker Deployment

1. Build and start the containers:
```bash
docker compose up --build
```

2. To run in detached mode:
```bash
docker compose up -d
```

3. To stop the containers:
```bash
docker compose down
```

4. To view logs:
```bash
docker compose logs -f
```

5. Reset the migration
```bash
docker compose run --rm app npx prisma migrate reset
```
<span style="background:#FDFBEE; color: #E55050; margin-left: 17px; font-size: 18px">It will erase all data from the database, so please be cautious.</span>

## Running the Application

### Local Development

Development mode:
```bash
yarn dev
```

Build and run in production:
```bash
yarn build
yarn start
```

### Docker

The application will automatically start when you run `docker compose up`. The services will be available at:
- API: http://localhost:3001
- Redis: localhost:6379
- PostgreSQL: localhost:5432

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:3001/api-docs`
- OpenAPI JSON: `http://localhost:3001/api-docs.json`

## API Endpoints

### Sales API

#### Create Sale
- **POST** `/api/sales`
- **Body**:
  ```json
  {
    "productName": "string",
    "quantity": number,
    "price": number
  }
  ```

#### Get All Sales
- **GET** `/api/sales`

#### Get Sale by ID
- **GET** `/api/sales/:id`

#### Update Sale
- **PUT** `/api/sales/:id`
- **Body**:
  ```json
  {
    "productName": "string",
    "quantity": number,
    "price": number
  }
  ```

#### Delete Sale
- **DELETE** `/api/sales/:id`

### Real-time Updates

#### Subscribe to Sales Updates
- **GET** `/api/subscribe`
- **Response**: Server-Sent Events (SSE) stream

Example client-side usage:
```javascript
const eventSource = new EventSource('/api/subscribe');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received update:', data);
};
```

## Project Structure

```
src/
├── config/         # Configuration files
├── routes/         # API routes
├── services/       # Business logic
└── index.ts        # Application entry point
```

## Technologies Used

- Express.js - Web framework
- Redis - Message broker
- TypeScript - Programming language
- Zod - Schema validation
- express-jsdoc-swagger - API documentation

## Development

### Available Scripts

- `yarn dev`: Start development server
- `yarn build`: Build the application
- `yarn start`: Start production server
- `yarn prisma:generate`: Generate Prisma client
- `yarn prisma:migrate`: Run database migrations 
- `yarn prisma:deploy`: Run database deployment 

## License

This project is licensed under the MIT License. 