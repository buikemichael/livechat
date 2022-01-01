import React, { useState } from 'react'
import './Login.css'
import { socket } from './socket-config';
import { useNavigate } from "react-router-dom";
export default function Register() {
    let navigate = useNavigate();
    const [username, setusername] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        if (username.trim() !== "") {
            socket.emit('register', {
                username
            },
                (response) => {
                    if (response.status === 'ok') {
                        localStorage.setItem('authId', response.userID)
                        navigate('/home');
                    }
                }
            )
        }
        setusername('')
    }
    return (
        <>
            <div className="login-box">
                <h2>Register</h2>
                <form>
                    <div className="user-box">
                        <input type="text" value={username} onChange={(e) => setusername(e.target.value)} autoComplete="off" required />
                        <label>Username</label>
                    </div>
                    <button onClick={handleSubmit} >
                        <span />
                        <span />
                        <span />
                        <span />
                        Proceed
                    </button>
                </form>
            </div>
        </>
    )
}
