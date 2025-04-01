import { Console } from "./Console";

export class Fetch {

    public static async request( path: string, json: Object = {}, method: string = "POST"): Promise<any | {}>{

        try {

            const response = await fetch(`${path}`, {

                method: method,
                body: JSON.stringify(json),
                headers: { "Content-Type": "application/json"},
    
            });
    
            return await response.text();

        } catch(e) {
            Console.log(e)
            return {}
        }


    } 

}