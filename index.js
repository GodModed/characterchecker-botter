console.clear();

const puppeteer = require('puppeteer');
const handleError = require('./logger');
const { createSpinner } = require('nanospinner');

var THREADS = 3;

const baseURL = 'https://characterchecker.com/';

var START = new Date();
var sent = 0;

const spinner = createSpinner('Loading...').start();
//goto baseURL with puppeteer
async function main() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null
        });
        const page = await browser.newPage();
        await page.goto(baseURL);
        await page.type('#text', 'а');
        await page.click('#btn');
        await page.waitForSelector('#result');
        sent++;
        await browser.close();
        await main(); 
    } catch (e) {
        handleError(e, main);
    }
}

for (let i = 0; i < THREADS; i++) {
    main();
}

//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateSpinner() {
    spinner.update({
        text: `${sent} Clicks @ ${Math.round(sent / ((new Date() - START) / 1000) * 60)} Clicks/min`,
    })
    await sleep(1000);
    await updateSpinner();
}

updateSpinner();