import React, { useState } from 'react'
import FriendRequests from './FriendRequests'
import AddFriendBtn from './AddFriendBtn';
import avatar from '../avatar.png'
import UserProfile from './UserProfile';
export default function Chats({ users, openChat, currentuser, userprofile }) {
    const [toggleuserprofile, settoggleuserprofile] = useState(false)
    const handleusertoggleprofile = () => {
        settoggleuserprofile(!toggleuserprofile)
    }
    const sortUsers = users.sort((a, b) => {
        return (new Date(b.lastMessage[0]?.updatedAt) - new Date(a.lastMessage[0]?.updatedAt))
    })
    const currentUsers = sortUsers.map((user) => (
        <li key={user.id} onClick={() => openChat(user)} className={`messaging-member ${user.unReadMessage.length && user.unReadMessage[0].to === userprofile.id ? ' messaging-member--new' : ''} ${user.friendData.connected ? 'messaging-member--online' : ''} ${currentuser?.friendData?.id === user?.friendData?.id ? 'messaging-member--active' : ''}`}>
            <div className="messaging-member__wrapper">
                <div className="messaging-member__avatar">
                    <img src="https://randomuser.me/api/portraits/thumb/men/74.jpg" alt="Bessie Cooper" loading="lazy" />
                    <div className="user-status" />
                </div>
                <span className="messaging-member__name">{user.friendData.username}</span>
                <span className="messaging-member__message">{user.lastMessage.length ? user.lastMessage[0].content : 'No messages yet'}</span>
            </div>
        </li>
    ))
    return (
        <>
            <div className="cu-col-12 cu-col-md-4 col-lg-4 cu-col-xl-3 px-0 messages-page__list-scroll">
                <AddFriendBtn />
                <UserProfile userprofile={userprofile} toggleuserprofile={toggleuserprofile} handleusertoggleprofile={handleusertoggleprofile} />
                <div className="messages-page__header mb-0 px-4 pt-3 pb-3">
                    <span className="messages-page__title">Chats</span>
                    <div className="messages-page__avatar-img" onClick={() => settoggleuserprofile(!toggleuserprofile)}>
                        <img src={avatar} alt="avatar" />
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon svg-icon--dark-mode" viewBox="0 0 49.7 49.7">
                            <path d="M25.4,49.7A25.6,25.6,0,0,1,1.3,32.3,25.6,25.6,0,0,1,17.3.1a2,2,0,0,1,2.1.5,2.2,2.2,0,0,1,.5,2.1,19.9,19.9,0,0,0-1.2,6.8A21,21,0,0,0,25,24.7,21,21,0,0,0,40.2,31h0a20.9,20.9,0,0,0,6.9-1.2,2,2,0,0,1,2.5,2.5,25.8,25.8,0,0,1-16,16.1A28.7,28.7,0,0,1,25.4,49.7ZM15,5.5A21.4,21.4,0,0,0,5.1,31.1,21.5,21.5,0,0,0,15.9,43.4a21.2,21.2,0,0,0,28.3-8.8,17.5,17.5,0,0,1-4,.4h0a24.9,24.9,0,0,1-18-7.5,24.9,24.9,0,0,1-7.5-18A26.9,26.9,0,0,1,15,5.5Z" fill="#f68b3c" />
                        </svg> */}
                    </div>
                </div>
                <div className="messages-page__search mb-0 px-3 pb-3">
                    <div className="custom-form__search-wrapper">
                        <input type="text" className="form-control custom-form" id="search" placeholder="Rechercher un message, un utilisateur???" autoComplete="off" />
                        <button type="submit" className="custom-form__search-submit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon svg-icon--search" viewBox="0 0 46.6 46.6">
                                <path d="M46.1,43.2l-9-8.9a20.9,20.9,0,1,0-2.8,2.8l8.9,9a1.9,1.9,0,0,0,1.4.5,2,2,0,0,0,1.5-.5A2.3,2.3,0,0,0,46.1,43.2ZM4,21a17,17,0,1,1,33.9,0A17.1,17.1,0,0,1,33,32.9h-.1A17,17,0,0,1,4,21Z" fill="#f68b3c" />
                            </svg>
                        </button>
                    </div>
                </div>
                <ul className="messages-page__list pb-5 px-1 px-md-3">
                    <FriendRequests />
                    {currentUsers}
                    {/* <li className="messaging-member messaging-member--new messaging-member--online">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/men/74.jpg" alt="Bessie Cooper" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Bessie Cooper</span>
                            <span className="messaging-member__message">Yes, I need your help with the project, it need it done by tomorrow ????</span>
                        </div>
                    </li>
                    <li className="messaging-member messaging-member--online messaging-member--active">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/women/56.jpg" alt="Jenny Smith" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Jenny Smith</span>
                            <span className="messaging-member__message">Perfect, thanks !</span>
                        </div>
                    </li>
                    <li className="messaging-member">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/women/17.jpg" alt="Courtney Simmons" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Courtney Simmons</span>
                            <span className="messaging-member__message">Going home soon, don't worry</span>
                        </div>
                    </li>
                    <li className="messaging-member messaging-member--online">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/women/39.jpg" alt="Martha Curtis" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Martha Curtis</span>
                            <span className="messaging-member__message">Great ????</span>
                        </div>
                    </li>
                    <li className="messaging-member messaging-member--online">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/men/27.jpg" alt="Rozie Tucker" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Gab Ryan</span>
                            <span className="messaging-member__message">Sure, may I get your phone number? ????</span>
                        </div>
                    </li>
                    <li className="messaging-member">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/men/17.jpg" alt="Jules Zimmermann" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Jules Zimmermann</span>
                            <span className="messaging-member__message">Well, here I am, coming as faaast as I can !</span>
                        </div>
                    </li>
                    <li className="messaging-member">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/men/9.jpg" alt="Mark Reid" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Mark Reid</span>
                            <span className="messaging-member__message">Have you listened to the latest album? Pure perfection</span>
                        </div>
                    </li>
                    <li className="messaging-member  messaging-member--online">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/men/54.jpg" alt="Russell Williams" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Russell Williams</span>
                            <span className="messaging-member__message">Nice to meet you again </span>
                        </div>
                    </li>
                    <li className="messaging-member">
                        <div className="messaging-member__wrapper">
                            <div className="messaging-member__avatar">
                                <img src="https://randomuser.me/api/portraits/thumb/women/85.jpg" alt="Savannah Nguyen" loading="lazy" />
                                <div className="user-status" />
                            </div>
                            <span className="messaging-member__name">Savannah Nguyen</span>
                            <span className="messaging-member__message">Really ?!</span>
                        </div>
                    </li> */}
                </ul>
            </div>
        </>
    )
}
