import { useState, useRef } from 'react'

import { useAuth } from "../../contexts/AuthContext"
import { useNotification } from "../../contexts/NotificationContext"
import { database }  from '../../firebase'

import { Modal, Form, Accordion,Button} from 'react-bootstrap'
import { HiOutlineCog } from "react-icons/hi"


import './ProfileSettings.scss'

export default function ProfileSettings() {

    const { currentUser, updatePassword, deleteAccount } = useAuth()
    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()

    const [loading, setLoading] = useState(false)

    //Display Modal
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleHide = () => setShow(false)


    //Change Password
    const newPasswordConfirmRef = useRef()
    const newPasswordRef = useRef()
    
    async function handleChangePassword(e){
        e.preventDefault()
        setError('')

        if(newPasswordRef.current.value !== newPasswordConfirmRef.current.value){
            return setError('The passwords do not match.')
        }

        try{
            setLoading(true)
            await updatePassword(newPasswordRef.current.value)
            setLoading(false)
            setSuccess("Password has been changed successfully.")

        } catch(err){
            setLoading(false)
            setError(err.message)
        }
    }

    //Chancge Nickname
    const newNickanemRef = useRef()
    
    function updateNickname(){

        database.ref(`users/${currentUser.uid}/private`).update({ 
            nickName: btoa(newNickanemRef.current.value)
        })

        database.ref(`public/${btoa(currentUser.email)}`).update({ 
            nickName: btoa(newNickanemRef.current.value)
        })

    }

    function handleChangeNickname(e){
        e.preventDefault()
        setError('')

        try{
            setLoading(true)
            updateNickname()
            setLoading(false)
            setSuccess("The nickname has been successfully updated.")
        }
        catch(err){setError(err.message)}
    }


    //Delete account - NEED TO BE CHANGED !!!!!!!!!!!!!!!
    const emialRef = useRef()

    function handleDeleteAccount(e){
        e.preventDefault()
        
        if(emialRef.current.value !== currentUser.email){
            return setError('Emails do not match.')
        }

        setError('')
        try{
            setLoading(true)
            deleteAccount()
            setLoading(false)
            setSuccess("")
        }
        catch(err){setError(err.message)}



    }

    return (
        <>
            <DisplaySuccess/>
            <DisplayError/>

            <div className="navigation-link" onClick={handleShow}>
                <HiOutlineCog className="logo"/>
                <span className="link-text">Profile settings</span>
            </div>

            <Modal className="profile-modal" show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                <Modal.Title>Profile Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p className="profile-text"> Change the settings on your profile. </p>
                <Accordion className="profile-accordion" >

                    <Accordion.Toggle className="accordion-click" as={Button} variant="link" eventKey="0" >Change Nickname</Accordion.Toggle>
                    <Accordion.Collapse className="accordion-body" eventKey="0">
                        <Form onSubmit={handleChangeNickname}>
                            <Form.Group id="previous-password">
                                <Form.Label>New Nickname</Form.Label>
                                <Form.Control type="name"  placeholder=" 3-20 characters " pattern=".{3,20}" ref={newNickanemRef} required /> 
                            </Form.Group>
                            <button className="button" disabled={loading} type="submit" >Submit</button>
                        </Form>
                    </Accordion.Collapse>


                    <Accordion.Toggle className="accordion-click" as={Button} variant="link" eventKey="1">Change Password</Accordion.Toggle>
                    <Accordion.Collapse className="accordion-body" eventKey="1">
                        <Form onSubmit={handleChangePassword}>
                            <Form.Group id="previous-password">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" ref={newPasswordRef} /> 
                            </Form.Group>
                            <Form.Group id="new-password">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control type="password" ref={newPasswordConfirmRef} /> 
                            </Form.Group>
                            <button className="button" disabled={loading} type="submit" >Submit</button>
                        </Form>
                    </Accordion.Collapse>

                    <Accordion.Toggle className="accordion-click" as={Button} variant="link" eventKey="2">Delete Account</Accordion.Toggle>
                    <Accordion.Collapse className="accordion-body" eventKey="2">
                        <Form onSubmit={handleDeleteAccount}>
                            <Form.Group id="previous-password">
                                <Form.Label>Enter your Email:<span className="deleteEmialText"> {currentUser.email} </span>address to delete the account.</Form.Label>
                                <Form.Control type="email" placeholder="Email"  ref={emialRef} required /> 
                            </Form.Group>
                            <button className="button" disabled={loading} type="submit" >Submit</button>
                        </Form>
                    </Accordion.Collapse>

                </Accordion>
                </Modal.Body>
            </Modal>
        </>
    )
}
