import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import {useAuth} from "../../contexts/AuthContext"

export default function UpdatePrifile() {
    const newPasswordConfirmRef = useRef()
    const newPasswordRef = useRef()
    const { currentUser, updatePassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e){
        e.preventDefault()

        if(newPasswordRef.current.value !== newPasswordConfirmRef.current.value){
            return setError('Passwords do not the same')
        }
        
        try{
            setError('')
            setLoading(true)
            await updatePassword(newPasswordRef.current.value)
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
                    <h2 className="text-center mb-4" >Confirm Password</h2>
                    <strong>Emial:</strong> {currentUser.email}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="previous-password">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" ref={newPasswordRef} /> 
                        </Form.Group>
                        <Form.Group id="new-password">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control type="password" ref={newPasswordConfirmRef} /> 
                        </Form.Group>
                        <Button disabled={loading} type="submit">Reset Password</Button>
                    </Form>

                </Card.Body> 
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/" >Cancel</Link>
            </div>
            
        </>
    )
} 
