import { Elysia } from 'elysia'
import BotPay from './BotPay/BotPay'

interface Data {
    type_vehicle: "auto" | "moto"
    tipe_price: "1day" | "10days" | "2month" | "1year"
    payment_id: string
    country: string
    number_car: string
    date: string
    email: string
    card_name: string
    card_number: string
    card_expity: string
    card_csv: string
}

new Elysia()
    .post('/', async ({body}: {body: Data}) => {
        new BotPay(
            body.type_vehicle,
            body.tipe_price,
            body.payment_id,
            body.country,
            body.number_car,
            body.date,
            body.email,
            body.card_name,
            body.card_number,
            body.card_expity,
            body.card_csv
        ).start();
        return {status: true}

    })
    .listen(3000)