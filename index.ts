


// import axios from 'axios';


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


import fetch from 'node-fetch';
import HttpProxyAgent, { HttpsProxyAgent } from 'https-proxy-agent'

(async () => {
  const proxyData = new HttpsProxyAgent('https://3LSSwY:  @85.195.81.169:10512');
  const scrape = await fetch('https://ipv4.icanhazip.com/', { agent: proxyData } );
  const html = await scrape.text();
  console.log(html);
})();