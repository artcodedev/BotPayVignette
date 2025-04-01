
import { test, expect, type Browser, firefox, type Page, type Locator, chromium, webkit } from '@playwright/test';
import { Console } from '../Utils/Console';
import logger from '../Utils/Logger';
import Logger from '../Utils/Logger';
import type { StringMappingType } from 'typescript';
import TelegramSender from '../Utils/TelegramSender';
import Leads from '../Utils/Loads';


class BotPay {

    private browser: Browser | undefined;
    private page: Page | null = null;
    private url: string = 'https://shop.asfinag.at/en';
    private type_vehicle: 'auto' | 'moto';
    private period: '1day' | '10days' | '2month' | '1year';
    private payment_id: string;
    private lead_id: string;
    private note_id: string;
    private country: string;
    private country_name: string
    private number_car: string;
    private date_start: string;
    private date_end: string;
    private email: string;
    private price: string;
    private cardholder: string;
    private cardnumber: string
    private cardexpiry: string;
    private cardcsv: string;

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
        date_start: string,
        date_end: string,
        email: string,
        price: string,
        cardholder: string,
        cardnumber: string,
        cardexpiry: string,
        cardscv: string,
        lead_id: string,
        note_id: string,
        country_name: string
    ) {
        this.type_vehicle = type_vehicle
        this.period = period
        this.payment_id = payment_id
        this.country = country
        this.number_car = number_car
        this.date_start = date_start
        this.date_end = date_end
        this.email = email
        this.price = price
        this.cardholder = cardholder;
        this.cardnumber = cardnumber;
        this.cardexpiry = cardexpiry
        this.cardcsv = cardscv
        this.lead_id = lead_id
        this.note_id = note_id
        this.country_name = country_name;

        const log = `\n
        type_vehicle: ${type_vehicle}
        period: ${period}
        payment_id: ${payment_id}
        country: ${country}
        number_car: ${number_car}
        date_start: ${date_start}
        date_end: ${date_end}
        email: ${email}
        price: ${price}
        cardholder: ${cardholder}
        cardnumber: ${cardnumber}
        cardexpiry: ${cardexpiry}
        cardcsv: ${cardscv}
        lead_id: ${lead_id}
        note_id: ${note_id}
        `

        Logger.write('LoggerBotNewRequest.txt', log);
    }

    private async escapeHtml(text: string) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /*
    *** Report of error 
    */

    private async repostResult(type: boolean): Promise<void> {
        try {
            Console.log('[+] Send report of error');
            Console.log(type);

            const data_lead = `
            ID лида A${this.escapeHtml(this.lead_id)}\n
            Email: ${this.escapeHtml(this.email)}\n
            Период виньетки: ${this.escapeHtml(this.period)}\n
            Тип авто: ${this.escapeHtml(this.type_vehicle)}\n
            Страна ТС: ${this.escapeHtml(this.country_name)}\n
            Номер автомобиля: ${this.escapeHtml(this.number_car)}\n
            Дата начала: ${this.escapeHtml(this.date_start)}\n
            Дата конца: ${this.escapeHtml(this.date_end)}\n
            Сумма: ${this.escapeHtml(this.price)} €\n
            Статус: ${type ? "Оплачен ботом" : "Бот не смог оплатить"}
            `;

            const status = `Статус : Опачен\n Оплата Ботом: ${type ? 'Оптатил' : 'Не удалось'}`;

            Console.warning(status);

            // if (type) await Leads.updateNoteLead(status, this.note_id, this.lead_id);

            // await TelegramSender.send(data_lead);

            //  good | bed

        }
        catch (e: any) {
            Console.error(e);
            Logger.write('LoggerBot.txt', 'Report have error')
        }
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
            Console.error(e);
            Logger.write('LoggerBot.txt', 'Can not close browser')
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
    *** Wait for I'm a consumer select 
    */
    private async selectConsumer(): Promise<void> {

        try {

            let steps = 0;

            if (this.page) {
                while (steps <= 3) {

                    try {
                        const consumer = await this.page.waitForSelector(`label[for="company"]`);
                        if (consumer) {
                            await consumer.click();

                            Console.log('[+] Find button Confirm');

                            const modal_footer = await this.page.waitForSelector(`div[class="modal-footer"]`);

                            if (modal_footer) {
                                const but = await modal_footer.waitForSelector("button");

                                if (but) {
                                    but.click();
                                    break;
                                }
                            }

                        }
                    } catch (e) {
                        Console.error('error in select consumer')
                    }

                    steps++;

                    await this.delay(1000);

                }
            } else {
                Logger.write('LoggerBot.txt', 'page is null in selectConsumer');
            }


        }
        catch (e: any) {
            /*
            * Write errors log
            */

            Console.error(e);
            Logger.write('LoggerBot.txt', e.toString())
        }

    }

    /*
    *** Filling card data for pay
    */
    private async fillingCardNumber(): Promise<void> {

        try {

            let steps = 0;

            if (this.page) {

                while (steps <= 3) {

                    try {

                        Console.log('[+] Find csv | card_number | expiry');
                        const cvc = await this.page.frameLocator('#mpay24_container').locator('#cvc').all();
                        const card_number = await this.page.frameLocator('#mpay24_container').locator('#identifier').all();
                        const expiry = await this.page.frameLocator('#mpay24_container').locator('#expiry').all();

                        if (cvc.length && card_number.length && expiry.length) {

                            Console.log('[+] Write card number');
                            await card_number[0].fill(this.cardnumber);

                            Console.log('[+] Write card expiry');
                            await expiry[0].click();

                            for (let i = 0; i < this.cardexpiry.length; i++) {
                                await this.page.keyboard.press(this.cardexpiry[i], {
                                    delay: 0.4
                                })
                            }

                            Console.log('[+] Write card csv');
                            await cvc[0].fill(this.cardcsv);

                            break;
                        }

                    } catch (e) {
                        Console.error('error in select consumer')
                    }

                    steps++;

                    await this.delay(1000);
                }
            }

        }
        catch (e: any) {
            /*
            * Write errors log
            */

            Console.error(e);
            Logger.write('LoggerBot.txt', e.toString())
        }
    }

    /*
    *** Check payment error for report 
    */
    private async checkErrorPayment(): Promise<boolean> {

        try {
            if (this.page) {

                const error = await this.page.locator('#IframeDataValid-error').all();

                return error.length ? false : true;
            }

            Logger.write('LoggerBot.txt', 'page content is null in checkErrorPayment');

            return false;
        } catch (e: any) {

            Console.error(e);
            Logger.write('LoggerBot.txt', e.toString())

            return false;
        }
    }

    /*
    *** All megic here :)
    */
    public async start(): Promise<void> {

        try {

            this.browser = await firefox.launch({
                headless: false,
                proxy: {
                    "server": "196.18.227.90:8000",
                    "username": "1QqeC2",
                    "password": "Qa0kaM",
                },
            });
            this.page = await this.browser.newPage();

            await this.page.setViewportSize({ width: 1200, height: 900 });

            try {
                await this.page.goto(this.url, { timeout: 10000, waitUntil: "domcontentloaded" });
            } catch (e) {
                /*
                *** slow internat 
                */
                Console.error(e);
            }

            await this.delay(3000);

            Console.log('[+] Find Accept cookie');
            const accept_cookie: Locator[] = await this.page.locator('button[aria-label="Alle Cookies akzeptieren"]').all();

            if (accept_cookie.length) await accept_cookie[0].click();

            Console.log('[+] Find button ACCEPT')
            const button = this.page.locator('text=Accept');
            const isVisible = await button.isVisible();
            if (isVisible) await button.click();

            Console.log('[+] Find type vehicle')

            const type_vehicle = await this.page.waitForSelector(`label[id="btn-label-${this.type_vehicle === 'auto' ? 'car' : 'motorbike'}"]`);

            await type_vehicle.click();

            Console.log('[+] Find link for pay')
            const period_pay_data = this.urls_pay[this.type_vehicle][this.period];

            const period_pay = await this.page.waitForSelector(`a[href="/en/toll-products/digitale-vignette/${period_pay_data}"]`);

            await period_pay.click();

            if (this.period === '1year' || this.period === '2month') {

                await this.selectConsumer();
            }

            await this.delay(1500);

            Console.log('[+] Find select elem for use country')
            await this.page.selectOption(`select[id="licenseplate_country"]`, this.country);

            await this.delay(1500);

            Console.log('[+] Write number');
            await this.page.locator('#licenseplate').pressSequentially(this.number_car);

            await this.delay(1000);

            Console.log('[+] Repeat write number')
            await this.page.locator('#licenseplateconfirm').pressSequentially(this.number_car);


            if (this.period !== '1year') {
                Console.log('[+] Write date')
                await this.page.locator('#ValidFrom').pressSequentially(this.date_start);
            }

            Console.log('[+] Submit')
            const btn_submit_form = await this.page.waitForSelector('input[id="btn-submit-form"]');

            await btn_submit_form.click();

            await this.delay(1000);

            Console.log('[+] Email')
            const email = await this.page.waitForSelector(`input[id="email"]`);

            if (email) {

                Console.log('[+] Write email')
                await this.page.locator('#email').pressSequentially(this.email);

                Console.log('[+] Repeat write email')
                await this.page.locator('#emailConfirm').pressSequentially(this.email);

            }

            Console.log('[+] Payment method')
            const payment_method = await this.page.waitForSelector('label[for="payment-1;"]');

            await payment_method.click();

            await this.delay(1500);

            Console.log('[+] Submit to pay');

            Console.log('[+] Submit data to payment')
            const btn_submit_form_to_pay = await this.page.waitForSelector('input[id="btn-submit-form"]');

            await btn_submit_form_to_pay.click();

            await this.delay(4000);

            if (this.period === '1day' || this.period === '10days') {

                Console.log('[+] Check checkbox request')

                const period = this.period === '1day' ? 'AcceptWithdrawal1DayVignette' : 'AcceptWithdrawal10DaysVignette'
                const AcceptWithdrawal10DaysVignette = await this.page.waitForSelector(`label[for="${period}"]`);

                await AcceptWithdrawal10DaysVignette.click();

            }

            Console.log('[+] Check checkbox')
            const checkagb = await this.page.waitForSelector('label[for="checkagb"]');

            await checkagb.click();

            Console.log('[+] Submit data to payment after check checkbox')
            const btn_submit_form_to_pay_pay = await this.page.waitForSelector('input[id="btn-submit-form"]');

            await btn_submit_form_to_pay_pay.click();

            Console.log('[+] Wait')
            await this.delay(10000);

            Console.log('[+] Wait input MPay24CustomerName')
            const MPay24CustomerName = await this.page.waitForSelector('input[id="MPay24CustomerName"]');

            if (MPay24CustomerName) {

                await this.page.locator('#MPay24CustomerName').pressSequentially(this.cardholder);

                await this.fillingCardNumber();
            }

            Console.log('[+] Payment is done')
            const paymentButton = await this.page.waitForSelector('button[id="paymentButton"]');

            await paymentButton.click();

            await this.delay(2000);

            const check_error = await this.checkErrorPayment();

            Console.log(check_error)

            await this.repostResult(check_error);

            Console.ok('[+] OK');

            await this.close();
        }

        catch (e: any) {
            /*
            * Close is error
            */

            Console.error(e);
            await this.repostResult(false);
            Logger.write('LoggerBot.txt', e.toString())
            await this.close()
        }
    }

}

export default BotPay;


// new BotPay('moto', '10days', '', 'AT', 'W-12345X', '01.04.2025', '12.02.27', 'userpisun84@gmail.com', '12,9', 'user pisun', '5272691234567890', '0127', '345', '121', '1212', 'AUSTRIA').start();

