import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import { RegisterRoutes } from './routes/routes';
import { HttpError } from './errors/HttpError';
import { ticketDatabaseService } from './services/TicketDatabaseService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      const error = new Error('Only audio files are allowed') as any;
      error.code = 'INVALID_FILE_TYPE';
      cb(error, false);
    }
  }
});

app.use(bodyParser.json());

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'express-tsoa-api'
  });
});

// Serve Swagger documentation
try {
  const swaggerDocument = require('../public/swagger.json');
  // Update the servers to include the /api prefix for proper reverse proxy support
  swaggerDocument.servers = [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    },
    {
      url: '/api',
      description: 'Production server (via reverse proxy)'
    }
  ];
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger UI available at http://localhost:3000/api-docs');
} catch (error) {
  console.log('Swagger document not found. Run "npm run swagger" to generate it.');
}

// API routes
RegisterRoutes(app);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      status: err.status
    });
  }
  
  // Handle TSOA validation errors
  if (err.name === 'ValidateError') {
    return res.status(422).json({
      error: 'Validation failed',
      details: err.fields
    });
  }
  
  // Default error handler
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'Internal Server Error'
  });
});

// Initialize database connection and start server
async function startServer() {
  try {
    // Try to connect to database, but don't fail if it's not available
    await ticketDatabaseService.connect();
    console.log('Database connected successfully');
  } catch (error: any) {
    console.warn('Database connection failed, but continuing without it:', error.message);
    console.log('Note: Some endpoints that require database access will not work');
  }
  
  // Start server regardless of database connection status
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  try {
    await ticketDatabaseService.disconnect();

    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  try {
    await ticketDatabaseService.disconnect();

    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();