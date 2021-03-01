import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { database } from '../../firebase'
import {useAuth} from "../../contexts/AuthContext"

export default function CreateRoom() {

    const roomNameRef = useRef()
    const {currentUser} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)

            const roomsRef =  database.ref("Rooms")
            const newRoomsRef = await roomsRef.push()
            await newRoomsRef.set({
                name: roomNameRef.current.value,
                admin: btoa(currentUser.email),
                access:{
                    user: btoa(currentUser.email),
                }

            })

            const addRoomToUserRef = database.ref(`Users/${btoa(currentUser.email)}/rooms/${newRoomsRef.key}`)
            await addRoomToUserRef.set({ 
                name: roomNameRef.current.value
            })
            setLoading(false)
            history.push('/')
        } catch{
            setLoading(false)
            setError('Failled to reset password')
        }

    }
    
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >New Vote Room</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" ref={roomNameRef} /> 
                        </Form.Group>
    
                        <Button disabled={loading} type="submit">Creat Room</Button>
                    </Form>

                </Card.Body> 
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/" >Cancel</Link>
            </div>
            
        </>
    )
} 
