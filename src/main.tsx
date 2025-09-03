import {createRoot} from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App.tsx'
//import {registerSW} from "virtual:pwa-register";
import {Provider} from "react-redux";
import {store} from "./store.ts";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App/>
    </Provider>
)

// if ("serviceWorker" in navigator) {
//     registerSW()
// }

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  // @ts-ignore виртуальный модуль есть только когда активен плагин
  import('virtual:pwa-register')
    .then(({ registerSW }) => registerSW({ immediate: true }))
    .catch(() => { /* молча игнорируем, если плагин отсутствует */ });
}
