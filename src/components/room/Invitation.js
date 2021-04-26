import { useState, useRef } from 'react'
import { useNotification } from "../../contexts/NotificationContext"
import { database }  from '../../firebase'
import { Modal, Form} from 'react-bootstrap'
import { HiSearch } from "react-icons/hi"
import Button from "../form_components/Button"
import './Invitation.scss'

export default function Invitation({roomId}) {

    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()
    const invitationEmialRef = useRef('')
    const [loading, setLoading] = useState(false)

    //Display Modal
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleHide = () => setShow(false)

     function sendInvation(email){
        // Get user uid 
        database.ref(`public/${btoa(email)}`).get().then(function(snapshotPublic){

            // Get all room users 
            snapshotPublic.val() ? database.ref(`rooms/${roomId}/public/access`).get().then(function(snapshotAccess){

                // Checking if user is in room. 
                Object.keys(snapshotAccess.val()).includes(snapshotPublic.val().uid) ? setError('User with this email already is in room.'): ( async () => {
                    //If not, add him 
                    await database.ref(`rooms/${roomId}/public/access/${snapshotPublic.val().uid}`).set({email: btoa(email)})

                    database.ref(`rooms/${roomId}/private/read/roomName`).get().then(function(snapshotRoomName){
                        
                        database.ref(`users/${snapshotPublic.val().uid}/public/rooms/${roomId}`).set({name: snapshotRoomName.val(), admin: false})

                    })

                    setSuccess('The user has been successfully added.')
                  })()
            }) : setError('The user with the specified email does not exist.')
        })
    }

    function handleInvitation(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            sendInvation(invitationEmialRef.current.value)
            setLoading(false)
        }
        catch(err){
            setLoading(false)
            setError(err.message)
        }
    }
  

    return (
        <>
            <DisplaySuccess/>
            <DisplayError/>

            <div className="navigation-link" onClick={handleShow} >
                <HiSearch className="logo"/>
                <span className="link-text"> Invite Participants</span>
            </div>

            <Modal className="profile-modal" show={show} onHide={handleHide} animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>Invitation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p className="profile-text"> Invite persons by providing their emalia. </p>

                    <Form onSubmit={handleInvitation}>
                        <Form.Group className="mt-4" id="email">
                            <Form.Control type="email" placeholder="Email" ref={invitationEmialRef} required /> 
                        </Form.Group>
                        <Button name="Send" disabled={loading} type="submit"></Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    )
}
