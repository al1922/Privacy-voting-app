import React, {useContext, useState, useEffect} from 'react'
import {database, auth} from  '../firebase'
import {useAuth} from "./AuthContext"

const DataBaseContext = React.createContext()

export function useDataBase() {
    return useContext(DataBaseContext)
}

export function DataBaseProvider({ children }) {

    const {currentUser} = useAuth()

    function uploadUserData(){
        auth.onAuthStateChanged(user => {
            const userUidData = database.ref(`users/${user.uid}/private`)
            userUidData.set({
            email: btoa(user.email)
            })

            const publicEmail = database.ref(`public/${btoa(user.email)}`)
            publicEmail.set({
                uid: user.uid
                })
        })
    }

    function newRoom(roomName){

        const roomsRef = database.ref(`users/${currentUser.uid}/private/rooms`)
        const RoomId = roomsRef.push()

        const values = {
            name: roomName,
            admin: true
        }
 
        RoomId.set(values).then(() => {          
            RoomId.get('value').then((snap) => {
                const uploadRoomRef = database.ref(`rooms/${snap.key}`)
                uploadRoomRef.set({
                    roomName: roomName,
                    admin: currentUser.uid,
                })
                const uploadRoomAccess = database.ref(`rooms/${snap.key}/access`)
                uploadRoomAccess.push(currentUser.uid)
            })
        })
    }

    function UserRooms() {
        const [rooms, setRooms] = useState(null)

        useEffect(() => {
            const roomsRef = database.ref(`users/${currentUser.uid}/private/rooms`)
            roomsRef.once("value", (snapShot) => {
                setRooms(snapShot.val())
            })
            return () => {
                setRooms(null)
            }
        }, [])

        return rooms
    }

    function invadeUserToRoom(email, id){
        database.ref(`public/${btoa(email)}`).get().then(function(snapshot){
            const addRoomAccess = database.ref(`rooms/${id}/access`)
            addRoomAccess.push(snapshot.val().uid)

            // const addRoomToUser = database.ref(`users/${snapshot.val().uid}/public/rooms`)
            // addRoomAccess.push(snapshot.val().uid)
        })
    }

    const value ={
        uploadUserData,
        newRoom,
        UserRooms,
        invadeUserToRoom
    }


    return (
        <DataBaseContext.Provider value={value}>
            {children}
        </DataBaseContext.Provider>
    )
}
