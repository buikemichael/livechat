import './App.scss';
import './Bootsrap.css';
import { socket } from './socket-config';
import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Login from './Login';
import Register from './Register';
import Home from './components/Home';

function App() {
    useEffect(() => {
        socket.connect()
    }, [])
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
