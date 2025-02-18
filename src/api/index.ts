import { Api } from './Api';

const network_ip: string = '192.168.100.208'
export const tauri: boolean = true
export const host: string = tauri ? network_ip : 'localhost';

export const api = new Api({
    baseURL: tauri ? `http://${host}:8000/api/` : `https://${host}:8000/api/`,
    withCredentials: true
});
