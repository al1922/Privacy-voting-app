import {useRef, useState, useEffect} from 'react'
// //import {} from 'react-bootstrap'
import { database } from '../../firebase'
// import { useAuth } from "../../contexts/AuthContext"

import DisplayUsers from './DisplayUsers'
import Invitation from './Invitation'

export default function Room({match}) {

    const [existId, setExistId] = useState(false)
    const roomId = match.params.id  

    useEffect(() => {
        database.ref(`rooms/${roomId}`).on("value" ,snapshot => {
            console.log(snapshot.exists())
            snapshot.exists() ? setExistId(true): setExistId(false)
        })
        return () => {
            setExistId(false)
            database.ref('rooms').off()
        }
    }, [roomId])


    return (
        <>
        {existId 
         
            ?<div className="Room">
                OKOKOKOKO
                    {/* <Invitation roomId={roomId}/>
                    <DisplayUsers roomId={roomId}/> */}
            </div>
        
            :<div className="Room">
                The room with the given ID {roomId} does not exist.  
            </div>
        }
        </>
    )

 
} 
