import React, {useRef, useState} from "react"
import {Form, Button, Card, Alert} from "react-bootstrap"
import {useAuth} from "../../contexts/AuthContext"
import {database, auth} from  '../../firebase'
import {Link, useHistory} from "react-router-dom"

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    

    function uploadUserData(){
        auth.onAuthStateChanged(user => {
            database.ref(`users/${user.uid}/private`).set({
                email: btoa(user.email)
            })

            database.ref(`public/${btoa(user.email)}`).set({
                uid: user.uid
            })
        })
    }

    async function handleSubmit(event){
        event.preventDefault()
        
        if(passwordRef.current.value !== passwordConfirmRef.current.value) return setError('Passwords do not the same')
    
        setError('')
        setLoading(true)
        
        try{
            await signup(emailRef.current.value, passwordRef.current.value)
            uploadUserData()
            setLoading(false)
            history.push('/')
        }catch{
            setLoading(false)
            setError('Failled to creat an account')
        }
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >Sing Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Emial</Form.Label>
                            <Form.Control type="email" ref={emailRef} required /> 
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required /> 
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required /> 
                        </Form.Group>
                        <Button disabled={loading} type="submit"> Sing Up </Button>
                    </Form>
                </Card.Body>
            </Card>            
            <div className="w-100 text-center mt-2">
                Alredy have an account? <Link to="/login" >Log In</Link>
            </div>
            
        </>
    )
}
