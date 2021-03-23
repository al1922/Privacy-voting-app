import React from 'react'

import './Button.css'

export default function Button({name, disabled, type, event}) {

    return (
        <button className="button" disabled={disabled} type={type} onClick={event}>{name}</button>
    )
}
