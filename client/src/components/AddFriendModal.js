import React, { useState, useRef } from 'react'
import loader from '../giphy.gif'
import AlertResponse from './AlertResponse'
import { homeSocket as socket } from '../socket-config';

export default function AddFriendModal({ switchModal }) {
    const [content, setcontent] = useState('')
    const [spinner, setspinner] = useState(false)
    const [response, setresponse] = useState(null)

    const handleForm = () => {
        if (content.trim() !== "") {
            setspinner(true)
            socket.emit('friendRequest', { content }, (data) => {
                setspinner(false)
                setresponse(data)
            })
        }
    }
    const node = useRef(null)
    const closeModal = (e) => {
        if (node.current && !node.current.contains(e.target)) {
            switchModal(false)
        }
    }
    return (
        <>
            <div className="cu-modal" onClick={(e) => closeModal(e)}>
                <div className="cu-modal-body" ref={node}>
                    <div className="cu-modal-header"><span>Send Friend Request</span><span>{spinner ? <img width="20" src={loader} alt="spinner" /> : null}</span></div>
                    {/* {response ? <AlertResponse response={response} /> : null} */}
                    <label>Username</label>
                    <input type="text" placeholder="Enter friend username" onChange={(e) => setcontent(e.target.value)} />
                    <button onClick={handleForm}>Proceed</button>
                </div>
            </div>
        </>
    )
}
