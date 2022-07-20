import { Page } from 'puppeteer';

export default async function linkedin_jobs(
    job_url: string,
    page: Page,
    logged: boolean = true
) {
    if (!logged) {
        await page.goto(
            'https://www.linkedin.com/checkpoint/lg/sign-in-another-account'
        );

        const email = process.env.LINKEDIN_EMAIL!;
        const password = process.env.LINKEDIN_PASS!;
        await page.waitForSelector('input#username');
        await page.type('input#username', email, { delay: 20 });
        await page.type('input#password', password, { delay: 20 });
        await page.click(
            '#organic-div > form > div.login__form_action_container > button'
        );
        await page.waitForNavigation();
    }
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
}
