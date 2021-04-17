import {useRef, useState, useEffect} from 'react'
import { database } from '../../firebase'
import { Link } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"

import DisplayUsers from './DisplayUsers'
import Invitation from './Invitation'
import AddVote from './AddVote'

import './Room.scss'
import Logo from "../img/LogoSVG.svg"


export default function Room({match}) {

    const [existId, setExistId] = useState(false)
    const { currentUser } = useAuth()
    const roomId = match.params.id  

    useEffect(() => {
        database.ref(`rooms/${roomId}/private/access/${currentUser.uid}`).on("value" ,snapshot => {
            snapshot.exists() ? setExistId(true): setExistId(false)
        })
        
        return () => {
            setExistId(false)
            database.ref('rooms').off()
        }
    }, [roomId,currentUser.uid])

    return (
        <>
        {existId 

            ?<div className="Room">

                <Invitation roomId={roomId}/>
                <DisplayUsers roomId={roomId}/>
                <AddVote roomId={roomId}/>
                <Link to="/" className="room-link">Back to dashboard.</Link>

            </div>
        
            :<div className="RoomNoExist">
                <div className="logo">
                    <img className="logoImage" alt="" src={Logo} />
                    <p className="logoName">Fox Vote</p>
                </div>
                <span className="room-text">The room with the given ID {roomId} does not exist. Rauuuu! </span>
                <Link to="/" className="room-link">Back to dashboard.</Link>
            </div>
        }
        </>
    )

 
} 
