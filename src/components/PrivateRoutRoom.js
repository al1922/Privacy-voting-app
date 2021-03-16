import React, { useEffect, useState } from 'react'
import { Route, Redirect} from 'react-router-dom'
import { database } from '../firebase'
import { useAuth } from '../contexts/AuthContext'


export default function PrivateRoutRoom( {component: Component, ...rest}) {

    const {currentUser} = useAuth()
    const [access, setAcces] = useState(false)
    

    (async () => {
        await database.ref(`rooms/${rest.location.pathname.substring(rest.location.pathname.lastIndexOf('/') + 1)}/access`).get('value').then(function(snapshotAccess){
            Object.values(snapshotAccess.val()).includes(currentUser.uid) ? setAcces(false): setAcces(true)
        })
    })()
 
    return (
        <Route
            {...rest}
            render={props => {
                console.log("DOWN " , access)
                
                return  access ? <Component {...props} /> : <Redirect to="/" />
            }}
        ></Route>
    )
} 