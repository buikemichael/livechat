import React, { useState } from 'react'
import AddFriendModal from './AddFriendModal'
export default function AddFriendBtn() {
    const switchModal = (data) => {
        setaddModal(data)
    }
    const [addModal, setaddModal] = useState(false)
    return (
        <>
            {addModal ? <AddFriendModal switchModal={() => switchModal(!addModal)} /> : false}
            <button className="add__friend__btn" onClick={switchModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="add__friend__btn__icon" viewBox="-12 -12 49.7 49.7">
                        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" fill="#f68b3c" />
                    </svg>
            </button>
        </>
    )
}
