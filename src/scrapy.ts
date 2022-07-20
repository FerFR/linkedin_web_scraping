import linkedin_jobs from './scripts/linkedin_jobs';
import { client } from './database/client';
import puppeteer from 'puppeteer';
const scrapy = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    const jobs = {
        react_native: await linkedin_jobs(
            'https://www.linkedin.com/jobs/search/?distance=25.0&f_TPR=r86400&geoId=106057199&keywords=react%20native%20junior&location=Brasil',
            page,
            false
        ),
        react: await linkedin_jobs(
            'https://www.linkedin.com/jobs/search/?distance=25.0&f_TPR=r86400&geoId=106057199&keywords=%22react%22%20%22junior%22&location=Brasil',
            page
        ),
        frontend: await linkedin_jobs(
            'https://www.linkedin.com/jobs/search/?distance=25.0&f_TPR=r604800&geoId=106057199&keywords=frontend%20junior&location=Brasil',
            page
        ),
        node: await linkedin_jobs(
            'https://www.linkedin.com/jobs/search/?currentJobId=3177021738&distance=25.0&f_TPR=r86400&geoId=106057199&keywords=%22node%22%20%22junior%22&location=Brasil',
            page
        ),
    };
    browser.close();
    jobs.frontend.map(async (job) => {
        if (!job) return;
        await client.job.create({
            data: {
                href: job.href,
                title: job.title,
                type: 'frontend',
            },
        });
    });
    jobs.node.map(async (job) => {
        if (!job) return;

        await client.job.create({
            data: {
                href: job.href,
                title: job.title,
                type: 'node',
            },
        });
    });
    jobs.react.map(async (job) => {
        if (!job) return;

        await client.job.create({
            data: {
                href: job.href,
                title: job.title,
                type: 'react',
            },
        });
    });
    jobs.react_native.map(async (job) => {
        if (!job) return;

        await client.job.create({
            data: {
                href: job.href,
                title: job.title,
                type: 'react_native',
            },
        });
    });

    scrapy();
};
export { scrapy };
