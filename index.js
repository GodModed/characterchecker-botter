const puppeteer = require('puppeteer');

var threads = 2;

const baseURL = 'https://characterchecker.com/';

var sent = 0;
//goto baseURL with puppeteer
async function main() {
    let date = new Date();
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(baseURL);
    let date2 = new Date();
    console.log('Went to page in' + (date2 - date) + 'ms');
    await page.type('#text', 'а');
    await page.click('#btn');
    await page.waitForSelector('#result');
    sent++;
    console.log('Sent Click '+ sent);
    await browser.close();
    await main();
}

for (let i = 0; i < threads; i++) {
    main();
}