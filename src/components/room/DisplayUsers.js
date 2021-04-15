import {useState, useEffect} from 'react'
import { useAuth } from "../../contexts/AuthContext"
import { database } from '../../firebase'

import './DisplayUsers.scss'

export default function DisplayUsers({roomId}) {

    const [users, setUsers] = useState(null)
    const { currentUser } = useAuth()

    //Change online status
    useEffect(() => {

        database.ref(`users/${currentUser.uid}/private`).get().then(function(privateSnapShot){
            database.ref(`rooms/${roomId}/public/online/${currentUser.uid}`).set({
                    nickName: privateSnapShot.val().nickName,
                    online: true
            })
        })

        const cleanup = () => {
            database.ref(`rooms/${roomId}/public/online/${currentUser.uid}`).update({
                online: false
            })
        }

        window.addEventListener('beforeunload', cleanup);

        return () => {
            cleanup()
            window.removeEventListener('beforeunload', cleanup);

        }
       
    }, [roomId, currentUser.uid])

    //Get users from database
    useEffect(() => {
        database.ref(`rooms/${roomId}/public/online`).on("value", (userSnapShot) => {
            setUsers(userSnapShot.val())
        })
        return () => {
            database.ref(`room/${roomId}/public/online`).off()
            setUsers(null)
        }
    }, [roomId])

    return (
        <div className="DisplayUsers">
            <ul className="userList" >
                {users !== null && Object.keys(users).map(key =>
                    <div className="userList-current" key={key}>
                        <span className="userList-status">{users[key].online ? 'Online': 'Offline'} </span>
                        <li className="userList-name"  >{atob(users[key].nickName)}</li>
                    </div>
            
                )}
            </ul>   

        </div>
    )
}
