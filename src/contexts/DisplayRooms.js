import { useState, useEffect } from 'react'
import { database } from "../firebase"
import { Form, Button} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default function DisplayRooms({user}) {
    
    const [privateRooms, setPrivateRooms] = useState(null)
    const [publicRooms, setPublicRooms] = useState(null)

    const history = useHistory()

    function getUserRooms(event){
        try{
            history.push(`/room/${event.target.value}`)
        }catch{
            //setError('Failed to join room')
        }
        

    }

    useEffect(() => {
        database.ref(`users/${user.uid}/private/rooms`).once("value").then(function(privateSnapShot){
            setPrivateRooms(privateSnapShot.val())

        })

        database.ref(`users/${user.uid}/public/rooms`).once("value", (publicSnapShot) => {
            setPublicRooms(publicSnapShot.val())
        })
        return () => {

        }
    }, [])

    return (
        <>
            <Form onClick={getUserRooms}>
                {privateRooms !== null &&  Object.keys(privateRooms).map(key => 
                    <Button key={key} value={key} >{privateRooms[key].name}</Button>
                )}
                {publicRooms !== null &&  Object.keys(publicRooms).map(key => 
                    <Button key={key} value={key} >{publicRooms[key].name}</Button>
                )}
            </Form>
        </>
    )
}
