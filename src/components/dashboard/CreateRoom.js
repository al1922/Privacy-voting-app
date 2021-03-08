import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import {useDataBase} from "../../contexts/DataBaseContext"



export default function CreateRoom() {

    const roomNameRef = useRef()
    const {newRoom} = useDataBase()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e){
        e.preventDefault()
        
        try{
            setError('')
            setLoading(true)
            await newRoom(roomNameRef.current.value)
            setLoading(false)
            //history.push('/')
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
