import {useRef, useState} from "react"
import {Form } from "react-bootstrap"
import {useAuth} from "../../contexts/AuthContext"
import {Link, useHistory} from "react-router-dom"
import {useNotification} from "../../contexts/NotificationContext"
import UploadUserData from './UploadUserData'

import Logo from "../img/LogoSVG.svg"
import Button from "../form_components/Button"

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const nickName = useRef()
    const { signup } = useAuth()
    const {setError, DisplayError} = useNotification()
    const [loading, setLoading] = useState(false)
    const history = useHistory()
   
    async function handleSubmit(event){
        event.preventDefault()
        
        if(passwordRef.current.value !== passwordConfirmRef.current.value) return setError('Passwords do not the same')
    
        setError('')
        setLoading(true)
        try{
            await signup(emailRef.current.value, passwordRef.current.value)
            UploadUserData(nickName.current.value, setError)
            setLoading(false)
            history.push('/')
        }catch(err){
            setLoading(false)
            setError(err.message)
        }
    }

    return (
        <div className="Signup"> 

            <div className="logo">
                <img className="logoImage" alt="" src={Logo} />
                <p className="logoName">Fox Vote</p>
            </div>


            <DisplayError/>
            <div className="restart" >

                <hr className="topLine" />

                <h2 className="text-center mb-4 text-light" >Sing Up</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mt-4" id="name">
                        <Form.Control type="name"  placeholder="Nickname ( 3-20 characters )" pattern=".{3,20}" ref={nickName} required /> 
                    </Form.Group>
                    <Form.Group className="mt-4" id="email">
                        <Form.Control type="email" placeholder="Email" ref={emailRef} required /> 
                    </Form.Group>
                    <Form.Group className="mt-4" id="password">
                        <Form.Control type="password" placeholder="Password ( min 6 characters )" ref={passwordRef} required /> 
                    </Form.Group>
                    <Form.Group className="mt-4" id="password-confirm">
                        <Form.Control type="password" placeholder="Confirm password" ref={passwordConfirmRef} required /> 
                    </Form.Group>
                    <Button name="Sing Up" disabled={loading} type="submit"></Button>
                </Form>
                <hr className="mt-4 topLine" />
            </div>
                        
            <div className="downLink w-100 text-center mt-2 text-light" >
                Alredy have an account? <Link to="/login" className="link">Log In</Link>
            </div>
        </div>
    )
}
