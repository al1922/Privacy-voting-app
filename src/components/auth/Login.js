import {useRef, useState} from 'react'
import {Form} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import {useAuth} from "../../contexts/AuthContext"
import {useNotification} from "../../contexts/NotificationContext"

import Button from "../form_components/Button"
import Logo from "../img/LogoSVG.svg"


export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const {setError, DisplayError} = useNotification()
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    
    async function handleSubmit(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            setLoading(false)
            history.push("/")
            
        } catch(err){
            setLoading(false)
            setError(err.message)
        }
    }


    return (
        
        <div className="Login"> 
            <DisplayError/>

            <div className="logo">
                <img className="logoImage" alt="" src={Logo} />
                <p className="logoName">Fox Vote</p>
            </div>

            <div className="restart" >
                <hr className="mt-4 topLine" />
                    <h2 className="text-center mb-4 text-light" >Log in, I don't bite.</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mt-4" id="email">
                                <Form.Control type="email" placeholder="Email" ref={emailRef} required /> 
                            </Form.Group>
                            <Form.Group className="mt-4" id="password">
                                <Form.Control type="password" placeholder="Password" ref={passwordRef} required /> 
                            </Form.Group>
                            <Button name="Log In" disabled={loading} type="submit"></Button>
                        </Form>
                <hr className="mt-4 topLine" />
            </div>
            
            <div className="downLink w-100 text-center mt-2">
                <Link to="/forgot-password" className="link">Forgot Password?</Link>
            </div>
            <div className="downLink w-100 text-center mt-2 text-light">
                Need an account? <Link to="/singup" className="link">Sing Up</Link>
            </div>

        </div>
    )
}
