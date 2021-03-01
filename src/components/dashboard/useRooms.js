import { useState, useEffect } from 'react';
import { database } from '../../firebase'
import {useAuth} from '../../contexts/AuthContext'


export default function useRoom() {
    const [currentUserRooms, setCurrentUserRooms] = useState(null)
    const {currentUser} = useAuth()

    useEffect(() => {

        const ref = database.ref(`Users/${btoa(currentUser.email)}/rooms`)

        ref.on("value", (snapShot) => {
            setCurrentUserRooms(snapShot.val())
        })
        
        return () => {
            setCurrentUserRooms(null)
        }

    }, [currentUser.email])

    return currentUserRooms

}