import './App.css'
import Header from "./components/Header/Header.tsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Footer from "./components/Footer/Footer.tsx";
import EnginesList from "./pages/EnginesList/EnginesList.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import EngineDetail from "./pages/EngineDetail/EngineDetail.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import AcceptancePage from "./pages/AcceptancePage/AcceptancePage.tsx";
import AcceptancesList from "./pages/AcceptancesList/AcceptancesList.tsx";
import NotFoundPage from "./pages/ErrorPages/NotFoundPage.tsx";
import ForbiddenPage from "./pages/ErrorPages/ForbiddenPage.tsx";
import EnginesTablePage from "./pages/EnginesTablePage/EnginesTablePage.tsx";
import EngineEditPage from "./pages/EngineEditPage/EngineEditPage.tsx";
//import {tauri} from "./api";
import { useEffect } from "react";



function App() {

    useEffect(() => {
        const base = ((import.meta as any).env?.VITE_API_BASE || "").replace(/\/+$/, "");
        fetch(`${base}/csrf/`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => console.log("CSRF fetched:", data))
            .catch((err) => console.error("CSRF error:", err));
        }, []);

    return (
        <Router basename={import.meta.env.BASE_URL}>
            <div className="d-flex flex-column min-vh-100">
                <Header/>

                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/engines" element={<EnginesList/>}/>
                    <Route path="/engines-table" element={<EnginesTablePage/>}/>
                    <Route path="/engines/:id" element={<EngineDetail/>}/>
                    <Route path="/engines/:id/edit" element={<EngineEditPage />} />
                    <Route path="/acceptances" element={<AcceptancesList/>}/>
                    <Route path="/acceptances/:id" element={<AcceptancePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegistrationPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/not-found" element={<NotFoundPage/>}/>
                    <Route path="/forbidden" element={<ForbiddenPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>

                <Footer/>
            </div>
        </Router>
    )
}

export default App
