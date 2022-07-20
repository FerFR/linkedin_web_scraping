import { Page } from 'puppeteer';

const getJobs = async (job_url: string, page: Page) => {
    await page.goto(job_url);
    const pagination = await page.$('section.jobs-search-two-pane__pagination');
    if (pagination) {
        await page.evaluate(() => {
            document
                .querySelector('section.jobs-search-two-pane__pagination')!
                .scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'end',
                });
        });
    }
    await page.waitForTimeout(5000);
    const allJobs = await page.$$eval(
        'li.jobs-search-results__list-item',
        (items) => {
            return items
                .filter((e) => {
                    const title = e.querySelector(
                        'a.job-card-list__title'
                    )?.innerHTML;

                    if (!title) return false;

                    const invalidWords = [
                        'Remote',
                        'Developer',
                        'Trabajos',
                        'Programmer',
                        'Sênior',
                        'Senior',
                        'Engineer',
                        'Analista',
                    ];
                    let valid = true;
                    for (let word of invalidWords) {
                        valid = !title?.includes(word);

                        if (!valid) {
                            break;
                        }
                    }
                    return valid;
                })
                .map((e) => {
                    const title = e.querySelector(
                        'a.job-card-list__title'
                    )?.innerHTML;
                    const href = e
                        .querySelector('a.job-card-list__title')
                        ?.getAttribute('href');

                    if (!title || !href) return;

                    return {
                        title,
                        href,
                    };
                });
        }
    );
    return allJobs;
};
export { getJobs };
