import {useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {useAuth} from "../../contexts/AuthContext"
import {useNotification} from "../../contexts/NotificationContext"

import Logo from "../img/LogoSVG.svg"
import Button from "../form_components/Button"

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const {setError, DisplayError, setMessage, DisplayMessage} = useNotification()
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
            setLoading(false)
            
        } catch(err){
            setLoading(false)
            setError(err.message)
        }

    }

    return (
        
        <div className="ForgotPassword">
            <DisplayError/>
            <DisplayMessage/>
            
            <div className="logo">
                <img className="logoImage" alt="" src={Logo} />
                <p className="logoName">Fox Vote</p>
            </div>

            <div className="restart" > 

                <hr className="topLine" />

                    <h2 className="text-center mb-4 text-light" >Password Reset</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Control type="email" placeholder="Email" ref={emailRef} required /> 
                        </Form.Group>
                        <Button name="Reset Password" disabled={loading} type="submit"></Button>
                    </Form>

                <hr className="mt-4 topLine" />

                <div className="downLink w-100 text-center mt-2 text-light">
                    Back to <Link to="/login" className="link" >Log In</Link>
                </div>
            </div>
            
        </div>
    )
}
