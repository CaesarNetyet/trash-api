import axios from "axios";

const adafruitRequest = axios.create({
    baseURL: 'https://io.adafruit.com/api/v2/caesarnetyet/',
    headers: {
        'X-AIO-Key': 'aio_GtFc53sKjwtQeMAwk3m6t52PO3Gd',
        'Content-Type': 'application/json'}})


export const addCarRequest = async (name: string)=> {
    try {
        const response = await adafruitRequest.post(`groups/`, {name: name});
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}