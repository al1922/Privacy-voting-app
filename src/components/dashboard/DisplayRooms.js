import { useState, useEffect } from 'react'
import { database } from "../../firebase"

import {useAuth} from "../../contexts/AuthContext"
import {useNotification} from "../../contexts/NotificationContext"

import { Card } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import './DisplayRooms.scss'
import RoomLogo from "../img/RoomLogo.png"

export default function DisplayRooms() {
    
    const [privateRooms, setPrivateRooms] = useState(null)
    const { currentUser } = useAuth()
    const { setError } = useNotification()

    const history = useHistory()

    function hadndleJoinToRoom(event){
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

    }, [currentUser.uid])

    return (
        <div className="DisplayRooms">

            {privateRooms !== null && Object.keys(privateRooms).map(key => 
                <Card className="displaycard" key={key} >
                    <Card.Img className="image" variant="top" src={RoomLogo}/>
                    <Card.Body className="body">
                        <Card.Title className="displaycardTitle">{privateRooms[key].name}</Card.Title>
                        <Card.Text>
                        Change your temporary description in room settings.
                        </Card.Text>
                        <button className="button" onClick={hadndleJoinToRoom} value={key} >Join</button>
                    </Card.Body>
                </Card>
            )}
            
        </div>
    )
}
