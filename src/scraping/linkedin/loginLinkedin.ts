import { Page } from 'puppeteer';

const loginLinkedin = async (page: Page): Promise<boolean> => {
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

    return true;
};

export { loginLinkedin };
