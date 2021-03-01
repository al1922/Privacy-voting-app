import React, {useRef, useState, useEffect} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
//import { database } from '../firebase'
//import {useAuth} from "../contexts/AuthContext"

export default function Rooom(props) {

    const inviteUser = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [roomId] = useState(props.match.params.id)


    // function inviteNewUser(email) {


    // }

    async function handleInvite (event){
        event.preventDefault()
        setError('')
        
        try{
            setLoading(true)

            setLoading(false)
        }catch{
            setError('The user with the specified email does not exist')
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(roomId)
        // const ref = database.ref(`Rooms`)

        // ref.on("value", (snapShot) => {
        //     setCurrentUserRooms(snapShot.val())
        // })
        
        // return () => {
        //     ref.off()
        // }


    }, [])


    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >Invade</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleInvite}>
                        <Form.Group id="email">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="email" ref={inviteUser} /> 
                        </Form.Group>
    
                        <Button disabled={loading} type="submit">Send</Button>
                    </Form>

                </Card.Body> 
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/" >Cancel</Link>
            </div>
            
        </>
    )
} 
