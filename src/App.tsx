import './App.css'
import Header from "./components/Header/Header.tsx";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Footer from "./components/Footer/Footer.tsx";
import EnginesList from "./pages/EnginesList/EnginesList.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import EngineDetail from "./pages/EngineDetail/EngineDetail.tsx";

function App() {

    return (
        <Router>
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
