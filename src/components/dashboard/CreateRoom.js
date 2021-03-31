import { useState, useRef } from 'react'

import {useAuth} from "../../contexts/AuthContext"
import {useNotification} from "../../contexts/NotificationContext"
import {database }  from '../../firebase'

import { Modal, Form} from 'react-bootstrap'
import { HiViewGridAdd} from "react-icons/hi"

import Button from "../form_components/Button"

import './CreateRoom.scss'

export default function ProfileSettings() {

    const { currentUser } = useAuth()
    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()

    const [loading, setLoading] = useState(false)
    const roomNameRef = useRef()
    
    //Display Modal
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleHide = () => setShow(false)



    function creatNewRoom(roomName){
        try{
            //Create id for room and push to user root
            const roomId = database.ref(`users/${currentUser.uid}/private/rooms`).push()
            // Set name and admin to room 
            const roomValues = {
                name: roomName,
                admin: true
            }
            // Push sets roomValues
            roomId.set(roomValues).then(() => {    
                // Push sets to room root
                database.ref(`rooms/${roomId.key}`).set({
                    roomName: roomName,
                    admin: currentUser.uid,
                })
                // Push room admin to access root
                database.ref(`rooms/${roomId.key}/access`).push(currentUser.uid)
            })
        }
        catch(err){setError(err)}
    }


    function handleSubmit(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            creatNewRoom(roomNameRef.current.value)
            setSuccess("The voting room was created successfully.")
            setLoading(false)
            setShow(false)
        } catch{
            setLoading(false)
        }

    }
    
    return (
        <>
            <DisplaySuccess/>
            <DisplayError/>
            <div className="navigation-link" onClick={handleShow}>
                <HiViewGridAdd className="logo"/>
                <span className="link-text">Create new room</span>
            </div>
            <Modal className="create-modal" show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                <Modal.Title>Creat room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p className="create-text"> Create your own room and vote safely.</p>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="name">
                        <Form.Label>Name</Form.Label>
                            <Form.Control type="name"  pattern=".{5,30}" ref={roomNameRef} /> 
                        </Form.Group>
                    <Button name="Create" disabled={loading} type="submit"/>

                </Form>

                </Modal.Body>
            </Modal>
        </>
    )
}
