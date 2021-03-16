import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {database} from  '../../firebase'

export default function CreateRoom() {
    const roomNameRef = useRef()
    const {currentUser} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function creatNewRoom(roomName){

        const roomsRef = database.ref(`users/${currentUser.uid}/private/rooms`)
        const RoomId = roomsRef.push()

        const values = {
            name: roomName,
            admin: true
        }
 
        RoomId.set(values).then(() => {          
            RoomId.get('value').then((snapshot) => {
                database.ref(`rooms/${snapshot.key}`).set({
                    roomName: roomName,
                    admin: currentUser.uid,
                })

                database.ref(`rooms/${snapshot.key}/access`).push(currentUser.uid)
            })
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            creatNewRoom(roomNameRef.current.value)
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
