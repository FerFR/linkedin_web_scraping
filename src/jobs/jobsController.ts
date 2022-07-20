import { Router } from 'express';
import { client } from '../database/client';

const router = Router();

router.get('/jobs', async (req, res) => {
    const allJobs = await client.job.findMany({});
    return res.status(200).json(allJobs);
});

export { router as jobsRoutes };
