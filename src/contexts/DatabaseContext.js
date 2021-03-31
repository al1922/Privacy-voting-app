import React, { useContext} from 'react'
import { database, auth } from "../firebase"
import { useAuth } from './AuthContext'

import  DisplayRooms  from './DisplayRooms'

const DatabaseContext = React.createContext()

export function useDatabase() {
    return useContext(DatabaseContext)
}

export function DatabaseProvider({ children }) {

    const { currentUser } = useAuth()


    function creatNewRoom(roomName){
        try{
            //Create id for room and push to user root
            const roomId = database.ref(`users/${currentUser.uid}/private/rooms`).push()
            // Set name and admin to room 
            const roomValues = {
                name: roomName,
                admin: true
            }
            // Push sets roomValues
            roomId.set(roomValues).then(() => {    
                // Push sets to room root
                database.ref(`rooms/${roomId.key}`).set({
                    roomName: roomName,
                    admin: currentUser.uid,
                })
                // Push room admin to access root
                database.ref(`rooms/${roomId.key}/access`).push(currentUser.uid)
            })
        }
        catch(err){console.log(err)}
    }

    function DisplayUserRooms(){
        return <DisplayRooms user = {currentUser} />
    }
     

    const value ={
        creatNewRoom,
        DisplayUserRooms
        
    }

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    )
}
