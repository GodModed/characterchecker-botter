const puppeteer = require('puppeteer')
const minimal_args = require('./args')
const spinner = require('nanospinner').createSpinner('Loading...').start();
const logger = require('./logger');

let browser;

var date;
var sent = 0;
var THREADS = 5;
const baseURL = 'https://characterchecker.com/';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

browserStart();

async function browserStart() {
    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        // run puppeteer with minimal settings
        args: minimal_args
    })
    date = new Date();
    for (let i = 0; i < THREADS; i++) {
        createPage();
    }
}

//get every process id that puppeteer makes

async function createPage() {
    try {
        let page = await browser.newPage();
        await page.goto(baseURL);
        await page.type('#text', 'а');
        await page.click('#btn');
        await page.waitForSelector('#result');
        sent++;
        await page.close();
        await createPage();
        backupPage = page;
    } catch (e) {
        logger(e, createPage);
    }
}

async function updateSpinner() {
    spinner.update({
        text: `${sent} Clicks @ ${(sent / ((new Date() - date) / 1000) * 60).toFixed(1)} Clicks/min`,
    })
    await sleep(100);
    await updateSpinner();
}

updateSpinner();

//process.on signit
process.on('SIGINT', async () => {
    spinner.stop();
    browser.close();
    console.log('Ending process peacefully...');
    process.exit(0);
})
