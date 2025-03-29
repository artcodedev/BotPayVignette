const fetch = require('node-fetch');


// Укажите ваши учетные данные и домен

const domain = 'tollroad.amocrm.ru'; // замените на ваш домен

const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRmMThkMDFiYTc4ZDRlNmM2YzM1ZjdhOGM0ZDI5YmE4NTdjZjNjNjBhZDlkYmY0NDI0YzY4MWE1NzBlN2MxNmQzZDQ1YWI4N2IyZWVjOTBkIn0.eyJhdWQiOiJlZDhiY2E0Mi03NTA5LTQ2MDctOTk0Zi1jNjRhOTM4NjAxY2UiLCJqdGkiOiI0ZjE4ZDAxYmE3OGQ0ZTZjNmMzNWY3YThjNGQyOWJhODU3Y2YzYzYwYWQ5ZGJmNDQyNGM2ODFhNTcwZTdjMTZkM2Q0NWFiODdiMmVlYzkwZCIsImlhdCI6MTc0MjgzOTczNSwibmJmIjoxNzQyODM5NzM1LCJleHAiOjE3NDMyMDY0MDAsInN1YiI6IjE3NTMwOTgiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MTY0NTc3OTYsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbImNybSIsImZpbGVzIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyIsInB1c2hfbm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiIwZjZjMDgwZC1mZTk0LTQ0NTktYjE5Ni0wNmUxMjFmOTZlNjEiLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.Qvjqt6j_JR1kuRDXbZxaNMEEZNfYrZASd9oPatYkeprZttypnRLlet1uxXkVnkIBfsGYoOeqof30AKoLs-Bl5o6Y3Jt96DoiK-71I27MKZxH_1v4N81m_wta7fAOaTRvsp7OpjNfVlDpmEzeILmpKRi1_yUUjn2o6c0ANva8Q_V6AU9m7IiYp-1tChajfRIwsatqy7B9kwxnk4u3aoEi6grKUhGMd2bOlFT0swLlvk83oYFfhZa2Lp9HUfmNuM-fi6cucrxGw6jIqAxwJvoN_TprCAfs_wYUjUXVaWs0PiCkjsiTzfzjvm9R-n6DEShY2gYrvOpsMG10msvpCfRG8w';


async function getStatuses() {

    try {

        // Получаем все воронки

        const pipelinesResponse = await fetch(`https://${domain}/api/v4/pipelines`, {

            method: 'GET',

            headers: {

                'Authorization': `Bearer ${accessToken}`,

                'Content-Type': 'application/json'

            }

        });


        if (!pipelinesResponse.ok) {

            throw new Error(`Ошибка получения воронок: ${pipelinesResponse.statusText}`);

        }


        const pipelines = await pipelinesResponse.json();

        const statuses = [];


        // Проходим по каждой воронке и получаем статусы

        for (const pipeline of pipelines) {

            statuses.push(...pipeline.statuses); // Добавляем статусы в общий массив

        }


        console.log(statuses.map(status => ({

            id: status.id,

            name: status.name,

            pipeline_id: status.pipeline_id

        })));

    } catch (error) {

        console.error(`Ошибка при получении статусов: ${error.message}`);

    }

}


getStatuses();