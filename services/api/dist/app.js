"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const multer_1 = __importDefault(require("multer"));
const routes_1 = require("./routes/routes");
const HttpError_1 = require("./errors/HttpError");
const TicketDatabaseService_1 = require("./services/TicketDatabaseService");
// Load environment variables
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept audio files
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        }
        else {
            const error = new Error('Only audio files are allowed');
            error.code = 'INVALID_FILE_TYPE';
            cb(error, false);
        }
    }
});
app.use(body_parser_1.default.json());
// CORS middleware for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
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
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    console.log('Swagger UI available at http://localhost:3000/api-docs');
}
catch (error) {
    console.log('Swagger document not found. Run "npm run swagger" to generate it.');
}
// API routes
(0, routes_1.RegisterRoutes)(app);
// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof HttpError_1.HttpError) {
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
        await TicketDatabaseService_1.ticketDatabaseService.connect();
        console.log('Database connected successfully');
    }
    catch (error) {
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
        await TicketDatabaseService_1.ticketDatabaseService.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    try {
        await TicketDatabaseService_1.ticketDatabaseService.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});
startServer();
//# sourceMappingURL=app.js.map