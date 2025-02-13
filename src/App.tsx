import './App.css'
import Header from "./components/Header/Header.tsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Footer from "./components/Footer/Footer.tsx";
import EnginesList from "./pages/EnginesList/EnginesList.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import EngineDetail from "./pages/EngineDetail/EngineDetail.tsx";
import { invoke } from "@tauri-apps/api/core";
import {useEffect} from "react";

function App() {
    useEffect(()=>{
        invoke('tauri', {cmd:'create'})
            .then(() =>{console.log("Tauri launched")})
            .catch(() =>{console.log("Tauri not launched")})
        return () =>{
            invoke('tauri', {cmd:'close'})
                .then(() =>{console.log("Tauri launched")})
                .catch(() =>{console.log("Tauri not launched")})
        }
    }, [])

    return (
        <Router basename="/">
            <div className="d-flex flex-column min-vh-100">
                <Header/>

                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/engines" element={<EnginesList/>} />
                    <Route path="/engines/:id" element={<EngineDetail/>} />
                </Routes>

                <Footer/>
            </div>
        </Router>
    )
}

export default App
