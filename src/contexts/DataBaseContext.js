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
            const userUidData = database.ref(`users/${user.uid}`)
            userUidData.set({
            name: "New User"
            })
        })
    }

    function newRoom(roomName){

        const roomsRef = database.ref(`users/${currentUser.uid}/rooms`)
        const RoomId = roomsRef.push()

        const values = {
            name: roomName,
            admin: true
        }
 
        RoomId.set(values).then(() => {          
            RoomId.once('value').then((snap) => {
                const uploadRoomRef = database.ref(`rooms/${snap.key}`)
                uploadRoomRef.set({
                    roomName: roomName,
                    admin: currentUser.uid,
                    access:{
                        user: currentUser.uid,
                    }
                })
            })
        })
        //RoomId.off("value")
    }

    function UserRooms() {
        const [rooms, setRooms] = useState(null)

        useEffect(() => {
            const roomsRef = database.ref(`users/${currentUser.uid}/rooms`)
            roomsRef.on("value", (snapShot) => {
                setRooms(snapShot.val())
            })
            return () => {
                setRooms(null)
            }
        }, [])

        return rooms
    }


    const value ={
        uploadUserData,
        newRoom,
        UserRooms
    }

    return (
        <DataBaseContext.Provider value={value}>
            {children}
        </DataBaseContext.Provider>
    )
}
