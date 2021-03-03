import React, {useContext} from 'react'
import {database, auth} from  '../firebase'
import {useAuth} from "./AuthContext"

const DataBaseContext = React.createContext()

export function useDataBase() {
    return useContext(DataBaseContext)
}

export function DataBaseProvider({ children }) {

    const {currentUser} = useAuth()

    //const [loading, setLoading] = useState(false)

    function uploadUserData(){
        auth.onAuthStateChanged(user => {
            const roomsRef = database.ref(`users/${user.uid}`)
            roomsRef.set({
            name: "New User",
            })
        })
    }

    function createNewRoom(roomNameRef){

        const roomsRef =  database.ref("rooms")
        const newRoomsRef = roomsRef.push()
        newRoomsRef.set({
            name: roomNameRef.current.value,
            admin: currentUser.uid,
            access:{
                user: currentUser.uid,
            }

        })

        const addRoomToUserRef = database.ref(`users/${currentUser.uid}/rooms/${newRoomsRef.key}`)
        addRoomToUserRef.set({ 
            name: roomNameRef.current.value
        })
    }

    // useEffect(() => {

    //   }, [])

    const value ={
        uploadUserData,
        createNewRoom
    }

    return (
        <DataBaseContext.Provider value={value}>
            {children}
        </DataBaseContext.Provider>
    )
}
