import React, { useState, useRef, useEffect } from 'react'
import AlertResponse from './AlertResponse'
import { homeSocket as socket } from '../socket-config';


export default function FriendRequests() {
    const [response, setresponse] = useState(null)
    const [friendRequest, setfriendRequest] = useState([])
    const [togglemenu, settogglemenu] = useState(null)

    useEffect(() => {
        socket?.on('friendRequest', (data) => {
            setfriendRequest(data)
        })
        return ()=>{
            socket.removeAllListeners()
        }
    }, [])
    const handleToggleMenu = (i) => {
        settogglemenu(i)
    }
    const node = useRef(null)
    const removeMenu = (e) => {
        if (node.current && !node.current.contains(e.target)) {
            settogglemenu(null)
        }
    }
    const acceptFriend = (id) => {
        settogglemenu(null)
        setfriendRequest(friendRequest.filter(x => x.userId !== id))
        socket?.emit('acceptFriend', { id }, (data) => {
            console.log('looped')
            socket?.emit('onlineUser')
            setresponse(data)
        })
    }
    useEffect(() => {
        if (togglemenu !== null) {
            document.addEventListener('click', removeMenu)
        }
        return () => {
            document.removeEventListener('click', removeMenu)
        }
    }, [togglemenu])

    return (
        <>
            {/* {response ? <AlertResponse response={response} /> : null} */}
            {friendRequest.map((x) => (
                <li key={x.id} className={`friend-request friend-request--new`}>
                    <div className="friend-request__wrapper">
                        <div className="friend-request__avatar">
                            <img src="https://randomuser.me/api/portraits/thumb/men/74.jpg" alt="Bessie Cooper" loading="lazy" />
                            <div className="user-status" />
                        </div>
                        <span className="friend-request__name">{x.userData.username}</span>
                        <span className="friend-request__message">{x.userData.username} sent you a friend request</span>
                    </div>
                    <div className="friend-request__menu" ref={node}>
                        <button onClick={() => handleToggleMenu(x.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="  friend-request__menu--menu-icon" viewBox="0 0 29.96 122.88"><path d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z" fill="#000000" /></svg>
                        </button>
                        <div className={`friend-request__menu__list ${togglemenu === x.id ? 'friend-request__menu__list__active' : ''}`}>
                            <ul>
                                <li onClick={() => acceptFriend(x.userId)}><div>Accept</div></li>
                                <li><div>Reject</div></li>
                                <li><div>Block</div></li>
                            </ul>
                        </div>
                    </div>
                </li>

            ))}
        </>
    )
}
