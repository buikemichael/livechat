import React, { useEffect, useState, useReducer } from 'react'
import Message from './Message';
import Chats from './Chats';
import Profile from './Profile';
import { homeSocket as socket } from '../socket-config';
const initialState = { users: [], messages: [] };
function reducer(state, action) {
    switch (action.type) {
        case 'update':
            return {
                ...state, users: state.users.map(x => {
                    if (x.lastMessage.length && x.messageId === action.payload.messageId) {
                        x.lastMessage[0].content = action.payload.content
                        x.lastMessage[0].updatedAt = Date.now()
                    }
                    else if (x.messageId === action.payload.messageId) {
                        x.lastMessage.unshift(action.payload)
                    }
                    return x
                })
            }
        case 'setusers':
            return { ...state, users: [...action.payload] }
        case 'markAsRead':
            let users = state.users.map(x => {
                if (x.unReadMessage.length && x.unReadMessage[0].messageId === action.payload.messageId) {
                    x.unReadMessage = []
                }
                return x
            })
            return {
                ...state, users: users
            }
        case 'setMessage':
            return { ...state, messages: action.payload }
        case 'newMessage':
            let messages = [...state.messages, action.payload]
            return { ...state, messages: messages }
        default:
            throw new Error();
    }
}

export default function Home() {
    const [currentuser, setcurrentuser] = useState(null)
    const [userprofile, setuserprofile] = useState({})
    const [state, dispatch] = useReducer(reducer, initialState);

    const openChat = (data) => {
        setcurrentuser(data)
        socket?.emit('getChat', { userId: data.friendData.id }, (response) => {
            console.log(response)
            dispatch({ type: 'setMessage', payload: response.messages })
            dispatch({ type: 'markAsRead', payload: response.messages[0] })
        })
    }
    useEffect(() => {
        if (socket) socket.auth.authId = localStorage.getItem('authId')
        socket?.emit('onlineUser')
        socket?.on('userDetail', (data) => {
            setuserprofile(data)
        })
        socket?.on('notifyOnline', (data) => {
            console.log(data)
        })
        socket?.on('onlineUsersRes', (response) => {
            dispatch({ type: 'setusers', payload: response })
        })
        socket?.on('friendRequestAccepted', () => {
            console.log('friendRequestAccepted')
            socket?.emit('onlineUser')
        })
        return () => {
            socket.removeAllListeners()
        }
    }, [])

    useEffect(() => {
        socket?.on('newMessage', (data) => {
            updateUsers(data.message)
            if (currentuser && data.message.from === currentuser?.friendData.id) {
                dispatch({ type: 'newMessage', payload: data.message })
            }
        })
        return () => {
            socket.removeAllListeners()
        }
    }, [currentuser])

    const saveMessage = (data) => {
        dispatch({ type: 'newMessage', payload: data })
    }
    const clearCurrentUser = () => {
        dispatch({ type: 'setMessage', payload: [] })
        setcurrentuser(null)
    }

    const updateUsers = (data) => {
        dispatch({ type: 'update', payload: data })

    }
    const updateLastMessage = (data) => {
        updateUsers(data)
    }
    return (
        <>
            {/* <SocketContext.Provider value={socket}> */}
            <div className="home-page__content messages-page">
                <div className="container-fluid h-100">
                    <div className="row px-0 h-100">
                        {/* start infos section  */}
                        {/* <UserProfile userprofile={userprofile} toggleuserprofile={toggleuserprofile} /> */}
                        {/* end infos section  */}
                        {/* start message list section  */}
                        <Chats users={state.users} openChat={openChat} currentuser={currentuser} userprofile={userprofile} />
                        {/* end message list section  */}
                        {/* start content section  */}
                        <Message currentuser={currentuser} messages={state.messages} saveMessage={saveMessage} updateLastMessage={updateLastMessage} user={userprofile} clearCurrentUser={clearCurrentUser} />
                        {/* end content section  */}
                        {/* start infos section  */}
                        <Profile currentuser={currentuser} />
                        {/* end infos section  */}
                    </div>
                </div>
            </div>
            {/* </SocketContext.Provider> */}
        </>
    )
}
