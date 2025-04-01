import axios from "axios";


class TelegramSender {

    private static token: string = '7476071117:AAEugz-3Iwo-_P8EDBpR3S1xKK2ZQjnE0uU';

    private static chat_id: string = '-1002496822245';

    public static async send(message: string): Promise<boolean> {

        try {

            await axios.post(`https://api.telegram.org/bot${TelegramSender.token}/sendMessage`, {
                chat_id: TelegramSender.chat_id,
                text: message,
                parse_mode: "HTML"
              });

            return true;
        }
        catch(e: any) {
            return false;
        }
    }

}
export default TelegramSender;