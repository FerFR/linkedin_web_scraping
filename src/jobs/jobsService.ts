import { IJob } from './jobsTypes';
import { client } from '../database/client';

const jobsService = {
    async findOne(href: IJob['href']) {
        const job = await client.job.findUnique({
            where: {
                href,
            },
        });
        return job;
    },
    async findAll(): Promise<IJob[]> {
        return await client.job.findMany({});
    },
    async create(job: IJob | undefined) {
        if (!job || !job.href || !job.title) return;

        const newJob = await client.job.create({
            data: {
                href: job.href,
                title: job.title,
                type: job.type,
            },
        });
        return newJob;
    },
    async deleteAll() {
        await client.job.deleteMany({});
    },
};

export { jobsService };
