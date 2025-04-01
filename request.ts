import { Fetch } from "./Utils/Fetch"



(async () => {

    const data = {
        type_vehicle: 'auto',
        period: '1year',
        payment_id: '1111111111',
        country: 'AT',
        number_car: "W-12345W",
        date_start: '04.04.25',
        date_end: '05.05.2025',
        email: 'user@gmail.com',
        price: '12.9',
        cardholder: 'yser',
        cardnumber: '0000000000000000',
        cardexpiry: '1223',
        cardscv: '121',
        lead_id: '12121',
        note_id: '12121',
        country_name: 'Austria'
    }

    const res = await Fetch.request('http://localhost:3000/', data);

    console.log(res);


})()