import 'dotenv/config';
import express, { json } from 'express';
import path from 'path';
import cors from 'cors';

// Import Routes
import { router } from './routes/index.routes';

// Initialization
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api', router);

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Starting the server
app.listen(app.get('port'), async () => {
  console.log(`Server on Port: ${app.get('port')}`);
});
