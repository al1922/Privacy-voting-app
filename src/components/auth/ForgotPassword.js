import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {useAuth} from "../../contexts/AuthContext"

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
            setLoading(false)
        } catch{
            setLoading(false)
            setError('Failled to reset passord')
        }

    }
    
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >Password Reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Emial</Form.Label>
                            <Form.Control type="email" ref={emailRef} required /> 
                        </Form.Group>
                        <Button disabled={loading} type="submit"> Reset Password </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Back to <Link to="/login" >Log In</Link>
            </div>
            
        </>
    )
}
