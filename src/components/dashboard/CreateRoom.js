import { useState, useRef } from 'react'

import { useAuth } from "../../contexts/AuthContext"
import { useNotification } from "../../contexts/NotificationContext"
import { database }  from '../../firebase'

import { Modal, Form} from 'react-bootstrap'
import { HiViewGridAdd} from "react-icons/hi"

import Button from "../form_components/Button"
import './CreateRoom.scss'

export default function CreateRoom() {

    const { currentUser } = useAuth()
    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()
    const [loading, setLoading] = useState(false)
    const roomNameRef = useRef()
    
    //Display Modal
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleHide = () => setShow(false)

    async function creatNewRoom(roomName){
       
        //Create id for room and push to user root
        const roomId = database.ref(`users/${currentUser.uid}/private/rooms`).push()
        // Set name and admin to room 
        const roomValues = {
            name: roomName,
            admin: true
        }
        // Push sets roomValues
        await roomId.set(roomValues).then(() => {    
            // Push sets to room root
            database.ref(`rooms/${roomId.key}/private/read`).set({
                roomName: roomName,
                admin: currentUser.uid,
            })
            // Push room admin to access root
            database.ref(`rooms/${roomId.key}/public/access/${currentUser.uid}`).set({
                status: true
            })
        })
        
        return roomId.key
    }

    async function getKeys(roomId){
        try{
            const keysUrl = "http://127.0.0.1:5000/getkeys"
            const response = await fetch(keysUrl, {method: 'POST'})
            const data = await response.json()
            database.ref(`rooms/${roomId}/private/privateKey`).set(data.private_key)
            database.ref(`rooms/${roomId}/public/publicKey`).set(data.public_key)

        }
        catch(err){
            console.log(err.message)
        }
    }


    async function handleSubmit(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            const id = await creatNewRoom(roomNameRef.current.value)
            getKeys(id)
            setSuccess("The voting room was created successfully.")
            setLoading(false)
            setShow(false)
        } catch(err){
            setLoading(false)
            setError(err.message)
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
            
            <Modal className="create-modal" show={show} onHide={handleHide} animation={false} >
                <Modal.Header closeButton>
                <Modal.Title>Creat room</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <p className="create-text"> Create your own room and vote safely.</p>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="name">
                            <Form.Label>Name of the room </Form.Label>
                                <Form.Control type="name"  pattern=".{3,20}" placeholder="Name" ref={roomNameRef} required/> 
                            </Form.Group>
                        <Button name="Create" disabled={loading} type="submit"/>
                    </Form>
                    
                </Modal.Body>
            </Modal>
        </>
    )
}
