import express from 'express';
import intervalsRouter from './routes/intervals.js';

const app = express();

app.use(express.json());
app.use('/producers/intervals', intervalsRouter);

app.all('/producers/intervals', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

export default app;