


// import axios from 'axios';

import { Fetch } from "./Utils/Fetch"


// const response = await axios.get('https://api.ipify.org?format=json', {
//   proxy: {
//     protocol: 'http',
//     host: '85.195.81.169',
//     port: 10512,
//     auth: {
//       username: '3LSSwY',
//       password: `edk1mR`,
//     },
//   },
// });

// console.log(response)


// import fetch from 'node-fetch';
// import HttpProxyAgent, { HttpsProxyAgent } from 'https-proxy-agent'

// (async () => {
//   const proxyData = new HttpsProxyAgent('https://3LSSwY:  @85.195.81.169:10512');
//   const scrape = await fetch('https://ipv4.icanhazip.com/', { agent: proxyData } );
//   const html = await scrape.text();
//   console.log(html);
// })();

( async () => {

  interface Data {
    type_vehicle: "auto" | "moto"
    tipe_price: "1day" | "1days" | "2month" | "1year"
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

  const data = {
    type_vehicle: "moto",
    tipe_price: "1day" ,
    payment_id: '',
    country: 'AT',
    number_car: 'W-12345W',
    date: '31.03.2025',
    email: 'userpisun@gmail.com',
    card_name: 'user pisun',
    card_number: '5272691234567890',
    card_expity: '0127',
    card_csv: '345'
  }

  const res = await Fetch.request('http://localhost:3000/', data);

  console.log(res);

})()