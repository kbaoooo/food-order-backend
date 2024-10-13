import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import 'dotenv/config';

// configs
const app = express();
const PORT = 4000;

// middlewares

// Parse application/json
app.use(express.json());
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));

// routes
routes(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

