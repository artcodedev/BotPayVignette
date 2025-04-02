import { Fetch } from "./Utils/Fetch"



(async () => {

    // const data = {
    //     type_vehicle: 'auto',
    //     period: '10days',
    //     payment_id: '444121212',
    //     country: 'AT',
    //     number_car: "W-12345W",
    //     date_start: '04.04.25',
    //     date_end: '05.05.2025',
    //     email: 'user@gmail.com',
    //     price: '12.9',
    //     cardholder: 'yser',
    //     cardnumber: '0000000000000000',
    //     cardexpiry: '1223',
    //     cardscv: '121',
    //     lead_id: '31476909',
    //     note_id: '396415735',
    //     country_name: 'Austria'
    // }

    // const res = await Fetch.request('http://46.101.231.149:5000/', data);

    // console.log(res);

    const data = {
        order_id: '6066097202041358', status: 'Paid'
            
        }
    
        const res = await Fetch.request('https://buy-vignette.com/api/callback', data);
    
        console.log(res);


})()