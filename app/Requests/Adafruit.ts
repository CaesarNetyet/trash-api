import axios from "axios";

const adafruitRequest = axios.create({
    baseURL: 'https://io.adafruit.com/api/v2/caesarnetyet/',
    headers: {
        'X-AIO-Key': 'aio_wRWM84E3fuHeErAVzZAV0kX6lmz6',
        'Content-Type': 'application/json'}})


export const addCarRequest = async (name: string)=> {
    try {
        
        const response = await adafruitRequest.post(`groups/`, {name: name});
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}

export const addSensorRequest = async (name: string, group_key: string)=> {
    try {
        const params = new URLSearchParams();
        params.append('group_key', group_key)
        const response = await adafruitRequest.post(`feeds/`, {name: name}, {params: params});
        return [response.data, null];
    } catch (error) {
        return [null, error];
    }
}