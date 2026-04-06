import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Endpoints from "./pages/Endpoints";
import Events from "./pages/Events";


function App() {
    return(
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path = '/' element={<Home />} />
                <Route path = '/dashboard' element={<Dashboard />} />
                <Route path = '/endpoints' element={<Endpoints />} />
                <Route path = '/events' element={<Events />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
