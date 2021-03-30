import React from 'react'

import './Button.scss'

export default function Button({name, disabled, type, event}) {

    return (
        <button className="button" disabled={disabled} type={type} onClick={event}>{name}</button>
    )
}
