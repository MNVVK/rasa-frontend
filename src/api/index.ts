import { Api } from './Api';

export const tauri: boolean = true

export const api = new Api({
    baseURL: tauri ? 'http://localhost:8000/api/' : 'https://localhost:8000/api/',
    withCredentials: true
});
