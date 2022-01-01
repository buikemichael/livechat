import React from 'react'

export default function AlertResponse({ response }) {
    console.log(response)
    if (response?.status === 0) {
        return (<div className="alert alert-danger">
            {response.message}
        </div>)
    } else if (response?.status === 1) {
        return (
            <div className="alert alert-success">
                {response.message}
            </div>
        )
    }
}
