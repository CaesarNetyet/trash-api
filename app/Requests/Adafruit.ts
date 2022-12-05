import axios from "axios";

const adafruitRequest = axios.create({
    baseURL: 'https://io.adafruit.com/api/v2/caesarnetyet/',
    headers: {
        'X-AIO-Key': 'aio_dLPO66vtXcmERKxAlI4588ZxE76i',
        'Content-Type': 'application/json'}})


export const addCarRequest = async (name: string)=> {
    try {
        const response = await adafruitRequest.post(`groups/`, {name: name});
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}

export const addSensorRequest = async (name: string, car_key: number)=> {
    try {
        const response = await adafruitRequest.post(`feeds/`, {name: name});
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}