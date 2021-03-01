import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRout( {component: Component, ...rest}) {

    const {currentUser} = useAuth()

    return (
        <Route
            {...rest}
            render={props => {
                return currentUser ? <Component {...props} /> : <Redirect to="/login" />
            }}
        ></Route>
    )
} 

// Kolejną metodą renderowania warunkowego wewnątrz wyrażenia 
// jest stosowanie javascriptowego operatora warunkowego 
// warunek ? true : false.