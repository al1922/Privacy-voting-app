import {useState, useEffect} from 'react'
import { database } from '../../firebase'
import { useHistory, Link } from 'react-router-dom'
import { useAuth } from "../../contexts/AuthContext"
import {HiLogin} from  "react-icons/hi"

import DisplayUsers from './DisplayUsers'
import Invitation from './Invitation'
import AddVote from './AddVote'
import Voting from './Voting'

import './Room.scss'
import Logo from "../img/LogoSVG.svg"


export default function Room({match}) {

    const [existId, setExistId] = useState(false)
    const history = useHistory()
    const { currentUser } = useAuth()
    const roomId = match.params.id  

    useEffect(() => {
        database.ref(`rooms/${roomId}/public/access/${currentUser.uid}`).on("value" ,snapshot => {
            snapshot.exists() ? setExistId(true): setExistId(false)
        })
        
        return () => {
            setExistId(false)
            database.ref('rooms').off()
        }
    }, [roomId,currentUser.uid])


    function handleBackToDashboard(){
        history.push("/")
    }

    return (
        <>
        {existId 

            ?<div className="Room">
                 <div className="NavigationBar-Room">
                    <nav className="navigation">
                        <div className="navigation-box">
                            <Invitation roomId={roomId}/>
                            <AddVote roomId={roomId}/>
                            <DisplayUsers roomId={roomId}/> 
                            <div className="navigation-link" onClick={handleBackToDashboard} >
                                <HiLogin className="logo"/>
                                <span className="link-text" >Back to dashboard</span>
                            </div>
                        </div>
                    </nav>

                    <div className="main">
                        <div className="logo">
                            <img className="logoImage" alt="" src={Logo} />
                            <p className="logoName">Fox Vote</p>
                        </div>
                                     
                        <div className="noneRooms">Vote on your issues while maintaining your privacy. Rauuu!</div>
                        
                        <Voting roomId={roomId}/>
                    </div> 
              
                </div>
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
