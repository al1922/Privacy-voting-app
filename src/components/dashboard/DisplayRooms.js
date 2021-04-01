import { useState, useEffect } from 'react'
import { database } from "../../firebase"

import {useAuth} from "../../contexts/AuthContext"
import {useNotification} from "../../contexts/NotificationContext"

import { Card} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import './DisplayRooms.scss'

export default function DisplayRooms({user}) {
    
    const [privateRooms, setPrivateRooms] = useState(null)
    const { currentUser } = useAuth()
    const { setError } = useNotification()


    const history = useHistory()

    function hadndleJoinToRoom(event){
        console.log("OK")
        try{
            history.push(`/room/${event.target.value}`)
        }catch{
            setError('Failed to join room')
        }
    }

    useEffect(() => {

        database.ref(`users/${currentUser.uid}/private/rooms`).on("value", (privateSnapShot) => {
            setPrivateRooms(privateSnapShot.val())
        })



        return () => {
            
        }
    }, [currentUser.uid])
    return (
        <div className="DisplayRooms">

            {privateRooms !== null &&  Object.keys(privateRooms).map((key,index) => 
                
                <Card className="displaycard" key={key} >
                    <Card.Img className="image" variant="top" src={`https://picsum.photos/500/500?random=${index}`}/>
                    <Card.Body className="body">
                        <Card.Title >{`Room name: ${privateRooms[key].name}`}</Card.Title>
                        <Card.Text>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
                        </Card.Text>
                        <button className="button" onClick={hadndleJoinToRoom} key={key} value={key} >Join</button>
                    </Card.Body>
                </Card>
                    
                
            )}
            
        </div>
    )
}
