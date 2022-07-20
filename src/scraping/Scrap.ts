import puppeteer from 'puppeteer';
import { jobsService } from '../jobs/jobsService';
import { getJobs, loginLinkedin } from './linkedin';

class Scrap {
    logged: boolean = false;
    page: puppeteer.Page;

    async getPage() {
        const browser = await puppeteer.launch({
            headless: false,
        });

        this.page = await browser.newPage();
    }

    async init() {
        if (!this.logged) {
            await loginLinkedin(this.page);
            this.logged = true;
        }

        const jobs = {
            react_native: await getJobs(
                'https://www.linkedin.com/jobs/search/?distance=25.0&f_TPR=r86400&geoId=106057199&keywords=react%20native%20junior&location=Brasil',
                this.page
            ),
            react: await getJobs(
                'https://www.linkedin.com/jobs/search/?distance=25.0&f_TPR=r86400&geoId=106057199&keywords=%22react%22%20%22junior%22&location=Brasil',
                this.page
            ),
            frontend: await getJobs(
                'https://www.linkedin.com/jobs/search/?distance=25.0&f_TPR=r604800&geoId=106057199&keywords=frontend%20junior&location=Brasil',
                this.page
            ),
            node: await getJobs(
                'https://www.linkedin.com/jobs/search/?currentJobId=3177021738&distance=25.0&f_TPR=r86400&geoId=106057199&keywords=%22node%22%20%22junior%22&location=Brasil',
                this.page
            ),
        };
        jobs.frontend.map((job) => {
            if (!job) return;
            jobsService.create({ ...job, type: 'frontend' });
        });
        jobs.node.map((job) => {
            if (!job) return;
            jobsService.create({ ...job, type: 'node' });
        });
        jobs.react.map((job) => {
            if (!job) return;
            jobsService.create({ ...job, type: 'react' });
        });
        jobs.react_native.map((job) => {
            if (!job) return;
            jobsService.create({ ...job, type: 'react_native' });
        });
        jobsService.deleteAll();
        this.init();
    }
}
export { Scrap };
