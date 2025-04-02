import { Elysia } from 'elysia'
import BotPay from './BotPay/BotPay'
import Reader from './Utils/Reader'
import { Console } from './Utils/Console'

// interface Data {
//     type_vehicle: "auto" | "moto"
//     tipe_price: "1day" | "10days" | "2month" | "1year"
//     payment_id: string
//     country: string
//     number_car: string
//     date: string
//     email: string
//     card_name: string
//     card_number: string
//     card_expity: string
//     card_csv: string
// }

interface Data {
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
}

new Elysia()
    .post('/', async ({ body }: { body: Data }) => {

        if (body) {

            let orders: Data[] = await Reader.read();

            if (!orders) orders = [];

            const orderIndex = orders.length ? orders.findIndex((order: Data) => order.payment_id === body.payment_id) : -1;
            
            console.log(body)

            if (orderIndex == -1) {

                const upadate_data: number = orders.push(body);

                if (upadate_data) {

                    const data: Data[] = orders;

                    const res: boolean = await Reader.write(data);

                    if (res) {

                        // start bot
                        new BotPay(
                            body.type_vehicle,
                            body.period,
                            body.payment_id,
                            body.country,
                            body.number_car,
                            body.date_start,
                            body.date_end,
                            body.email,
                            body.price,
                            body.cardholder,
                            body.cardnumber,
                            body.cardexpiry,
                            body.cardscv,
                            body.lead_id,
                            body.note_id,
                            body.country_name
                        ).start();

                        return { status: true, message: 'request accepted' }
                    }

                    return { status: false, message: 'can not save data' };
                }

                return { status: false, message: 'can not update data' }

            }

            if (orderIndex != -1) {
                return { status: false, message: 'repeat request' }
            }


        }

        return { status: false, message: 'Something went wrong.' }

    })
    .listen(3000)