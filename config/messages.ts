import axios from "axios";
import Env from '@ioc:Adonis/Core/Env'

export default async function sendTwilioMessage(message: string, phone: string) {

    const params = new URLSearchParams();
    params.append('To', `+52${phone}`);
    params.append('From', `${Env.get('TWILIO_PHONE_NUMBER')}`);
    params.append('Body', message);
    try {
        const messageRequest = await axios.post(`https://api.twilio.com/2010-04-01/Accounts/${Env.get('TWILIO_ACCOUNT_SID')}/Messages.json`, params, {
        auth: {
            username: Env.get('TWILIO_ACCOUNT_SID'),
            password: Env.get('TWILIO_AUTH_TOKEN')
        }}
    )
    return [messageRequest, null]
    } catch (error) {

        console.log(error);

    return [null, error]
    }

}