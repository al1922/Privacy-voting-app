import {useState, useEffect} from 'react'
import { useAuth } from "../../contexts/AuthContext"
import { database } from '../../firebase'


export default function DisplayUsers({roomId}) {

    const [users, setUsers] = useState(null)
    const { currentUser } = useAuth()

    //Change online status
    useEffect(() => {
        database.ref(`users/${currentUser.uid}/private`).get().then(function(privateSnapShot){
            database.ref(`rooms/${roomId}/online/${currentUser.uid}`).set({
                    nickName: privateSnapShot.val().nickName,
                    online: true
            })
        })

        return () => {
            database.ref(`rooms/${roomId}/online/${currentUser.uid}`).update({
                online: false
            })
        }
       
    }, [roomId, currentUser.uid])

    //Get users from database
    useEffect(() => {
        database.ref(`rooms/${roomId}/online`).on("value", (userSnapShot) => {
            setUsers(userSnapShot.val())
        })
        return () => {
            database.ref(`room/${roomId}/online`).off()
            setUsers(null)
        }
    }, [roomId])

    return (
        <div className="DisplayUsers">
            <ul className="userList" >
                {users !== null && Object.keys(users).map(key => 
                    <li className="userList-element" key={key} >{atob(users[key].nickName)}</li>
                )}
            </ul>   

        </div>
    )
}
