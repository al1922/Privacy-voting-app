import React, {useRef, useState, useEffect} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { database } from '../../../contexts/DataBaseContext'

export default function Rooom(props) {

    const inviteUser = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

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

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >Invade</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleInvite}>
                        <Form.Group id="email">
                            <Form.Label>Emial</Form.Label>
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
