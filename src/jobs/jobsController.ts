import { Router } from 'express';
import { jobsService } from './jobsService';
const router = Router();

router.get('/jobs', async (req, res) => {
    const allJobs = await jobsService.findAll();
    return res.status(200).json(allJobs);
});

export { router as jobsRoutes };
