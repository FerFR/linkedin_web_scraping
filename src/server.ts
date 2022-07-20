import express from 'express';
import { jobsRoutes } from './jobs/jobsController';
import { Scrap } from './scraping/Scrap';

const scrap = new Scrap();

scrap.getPage().then(() => scrap.init());

const app = express();

app.use(jobsRoutes);

app.listen(3000);
