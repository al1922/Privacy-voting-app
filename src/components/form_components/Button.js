import React from 'react'

import './Button.scss'

export default function Button({name, disabled, type, event, key, value}) {

    return (
        <button className="button" disabled={disabled} type={type} onClick={event} key={key} value={value} >{name}</button>
    )
}
