import React from 'react'

import './Button.scss'

export default function Button({name,className="button" , disabled, type, event, key, value}) {



    return (
        <button className={className} disabled={disabled} type={type} onClick={event} key={key} value={value} >{name}</button>
    )
}
