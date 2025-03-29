

import puppeteer from 'puppeteer';

const deley = async(time: number): Promise<void> => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

(async () => {

  const proxyURL = 'http://196.18.227.90:8000';
  const proxyUsername = '1QqeC2';
  const proxyPassword = 'Qa0kaM';


  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: false,
    args: [`--proxy-server=${proxyURL}`],
});
  const page = await browser.newPage();

  await page.authenticate({
    username: proxyUsername,
    password: proxyPassword,
});



  // Navigate the page to a URL
  await page.goto('https://shop.asfinag.at/en');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});
  await deley(3000);



  await browser.close();
})();