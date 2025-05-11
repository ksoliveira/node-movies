import express from 'express';
import intervalsRouter from './routes/intervals.js';

const app = express();

app.use(express.json());
app.use('/producers/intervals', intervalsRouter);

export default app;