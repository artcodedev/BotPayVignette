
import { test, expect, type Browser, firefox, type Page, type Locator, chromium } from '@playwright/test';
import { Console } from '../Utils/Console';
import { sleep } from 'bun';


class BotPay {

    private browser: Browser | undefined;
    // private url: string = 'https://www.asfinag.at/en/toll/vignette/';
    private url: string = 'https://shop.asfinag.at/en';
    private type_vehicle: 'auto' | 'moto';
    private period: '1day' | '10days' | '2month' | '1year';
    private payment_id: string
    private country: string
    private number_car: string
    private date: string
    private email: string


    private urls_pay = {
        "moto": {
            "1day": "00-1-tages-vignette-motorrad-2025/?year=25",
            "10days": "02-10-tages-vignette-motorrad-2025/?year=25",
            "2month": "02-2-monats-vignette-motorrad-2025/?year=25",
            "1year": "02-jahres-vignette-motorrad-2025/?year=25"
        },
        "auto": {
            "1day": "00-1-tages-vignette-pkw-2025/?year=25",
            "10days": "01-10-tages-vignette-pkw-2025/?year=25",
            "2month": "01-2-monats-vignette-pkw-2025/?year=25",
            "1year": "01-jahresvignette-pkw-2025/?year=25"
        }
    }

    constructor(
        type_vehicle: 'auto' | 'moto',
        period: '1day' | '10days' | '2month' | '1year',
        payment_id: string,
        country: string,
        number_car: string,
        date: string,
        email: string
    ) { 
        this.type_vehicle = type_vehicle
        this.period = period
        this.payment_id = payment_id
        this.country = country
        this.number_car = number_car
        this.date = date
        this.email = email
    }

    /*
    *** Close browser
    */
    private async close(): Promise<void> {
        try {

            Console.log('[+] Close browser');
            if (this.browser != undefined) await this.browser.close();
        }
        catch (e) {
            Console.warning('[+] browser is closed')
        }
    }

    /*
    *** Time sleep (delay)(miliseconds)
    */
    private async delay(time: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }


    /*
    *** All megic here :)
    */
    public async start(): Promise<void> {

        try {

            this.browser = await chromium.launch({
                headless: false,
                proxy: {
                    "server": "196.18.227.90:8000",
                    "username": "1QqeC2",
                    "password": "Qa0kaM",
                },
            });
            const page: Page = await this.browser.newPage();

            await page.setViewportSize({ width: 1200, height: 900 });

            // defore delete
            try {
                await page.goto(this.url, { timeout: 10000, waitUntil: "domcontentloaded" });
            } catch (e) {
                /*
                *** slow internat 
                */
                Console.error(e);
            }

            // ACCEPT

            await this.delay(3000);

            Console.log('[+] Find Accept cookie');
            const accept_cookie: Locator[] = await page.locator('button[aria-label="Alle Cookies akzeptieren"]').all();

            if (accept_cookie.length) await accept_cookie[0].click();

            Console.log('[+] Find button ACCEPT')
            const button = page.locator('text=Accept');
            const isVisible = await button.isVisible();
            if (isVisible) await button.click();

            Console.log('[+] Find type vehicle')

            const type_vehicle = await page.waitForSelector(`label[id="btn-label-${this.type_vehicle === 'auto' ? 'car' : 'motorbike'}"]`);

            await type_vehicle.click();

            Console.log('[+] Find link for pay')
            const period_pay_data = this.urls_pay[this.type_vehicle][this.period];
            const period_pay = await page.waitForSelector(`a[href="/en/toll-products/digitale-vignette/${period_pay_data}"]`);

            await period_pay.click();

            Console.log('[+] Find select elem for use country')
            await page.selectOption(`select[id="licenseplate_country"]`, this.country);

            await this.delay(1500);

            Console.log('[+] Write number');
            await page.locator('#licenseplate').pressSequentially(this.number_car);

            await this.delay(1000);

            Console.log('[+] Repeat write number')
            await page.locator('#licenseplateconfirm').pressSequentially(this.number_car);
            
            Console.log('[+] Write date')
            await page.locator('#ValidFrom').pressSequentially(this.date);


            Console.log('[+] Submit')
            const btn_submit_form = await page.waitForSelector('input[id="btn-submit-form"]');

            await btn_submit_form.click();

            await this.delay(1000);

            Console.log('[+] Email')
            const email = await page.waitForSelector(`input[id="email"]`);

            if (email) {

                Console.log('[+] Write email')
                await page.locator('#email').pressSequentially(this.email);

                Console.log('[+] Repeat write email')
                await page.locator('#emailConfirm').pressSequentially(this.email);

            }

            Console.log('[+] Payment method')
            const payment_method = await page.waitForSelector('label[for="payment-1;"]');

            await payment_method.click();

            await this.delay(1000);

            Console.log('[+] Submit to pay')
            const btn_submit_form_to_pay = await page.waitForSelector('input[data-click-target="second-submit-button"]');

            // const btn_submit_form_to_pay = await page.waitForSelector('input[id="btn-submit-form"]');

            await btn_submit_form_to_pay.click();

            Console.ok('[+] OK')
            await this.delay(100000)



            await this.close();
        }

        catch (e: any) {
            /*
            * Close is error
            */

            Console.error(e)
            await this.close()
        }
    }

}


new BotPay('moto', '10days', '', 'AT', 'W-12345X', '29.03.2025', 'userpisun84@gmail.com').start();

/*
{
    type_vehicle: "auto" | "moto"
    tipe_price: string (1day, 10days ...)
    payment_id: string
    country: string
    number_car: string
    date: 29.03.2025
    email
}

*/