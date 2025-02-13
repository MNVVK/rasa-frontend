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

function App() {

    return (
        <Router basename='/rasa-frontend/'>
            <div className="d-flex flex-column min-vh-100">
                <Header/>

                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/engines" element={<EnginesList/>}/>
                    <Route path="/engines/:id" element={<EngineDetail/>}/>
                    <Route path="/acceptances" element={<AcceptancesList/>}/>
                    <Route path="/acceptances/:id" element={<AcceptancePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegistrationPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                </Routes>

                <Footer/>
            </div>
        </Router>
    )
}

export default App
