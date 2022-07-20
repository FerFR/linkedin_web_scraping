import express from 'express';
import { scrapy } from './scrapy';
import { jobsRoutes } from './jobs/jobsController';

scrapy();

const app = express();

app.use(jobsRoutes);

app.get('/', (req, res) => res.json('test'));
app.listen(3000);
