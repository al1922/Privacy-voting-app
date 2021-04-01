// import { useState, useEffect } from 'react'
// import { Route, Redirect} from 'react-router-dom'
// import { database } from '../firebase'
// import {  Alert } from 'react-bootstrap'
// import { useAuth } from '../contexts/AuthContext'


// export default function PrivateRoutRoom( {component: Component, ...rest}) {

//     const {currentUser} = useAuth()
//     const [error, setError] = useState('')
//     const [access, setAccess] = useState('wait')


//     useEffect(() => {
            
//         (async function() {
//             try{
//                 await database.ref(`rooms/${rest.location.pathname.substring(rest.location.pathname.lastIndexOf('/') + 1)}/access`).once('value').then(function(snapshotAccess){
//                     if(snapshotAccess.exists()) { if(Object.values(snapshotAccess.val()).includes(currentUser.uid)) 
//                         setAccess('true')
//                          }
//                     else {
//                         setError('You are not authorized to join')
//                         setAccess('false') 
//                     }
//                 })
                
//             }
//             catch{
//                 setError('Problem with conection')
//             } 
            
//             return () => {
//                 setError('')
//                 setAccess('wait')
//             }

//          })()
//     }, [currentUser, rest])

     
//     return (
//         <Route
//             {...rest}
//             render={ props => {

//                 if(access === 'wait' ) {
//                     return <div>Loading..</div>
//                   }
//                 return (access === 'true' ) ? <Component {...props} /> :  <Redirect to="/" /> 
//             }}
//         ></Route>
//     )
// } 