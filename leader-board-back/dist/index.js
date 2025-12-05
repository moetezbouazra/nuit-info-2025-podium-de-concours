import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import sseRoutes from './routes/sse.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { startDbListener } from './services/db-listener.service.js';
import { corsOrigins, isWildcard } from './config/cors.js';
const app = express();
// CORS configuration
app.use(cors({
    origin: corsOrigins,
    credentials: !isWildcard, // Only allow credentials with specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API routes
app.use('/api', routes);
// SSE routes
app.use('/api/sse', sseRoutes);
// Error handling
app.use(errorHandler);
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`CORS allowed origins: ${Array.isArray(corsOrigins) ? corsOrigins.join(', ') : corsOrigins}`);
    // Start database listener for real-time updates
    await startDbListener();
});
export default app;
//# sourceMappingURL=index.js.map