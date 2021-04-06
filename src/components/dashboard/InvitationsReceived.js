import { useState, useEffect} from 'react'

import { useAuth } from "../../contexts/AuthContext"
import { useNotification } from "../../contexts/NotificationContext"
import { database }  from '../../firebase'

import { Modal, Card} from 'react-bootstrap'
import { HiOutlineMail } from "react-icons/hi"


import './InvitationsReceived.scss'

export default function InvitationsReceived() {

    const { currentUser } = useAuth()
    const { setError, DisplayError, setSuccess, DisplaySuccess } = useNotification()

    const [loading, setLoading] = useState(false)
    const [invitations, setInvitations] = useState(null)  

    //Display Modal
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleHide = () => setShow(false)

    useEffect(() => {
        
        database.ref(`public/${btoa(currentUser.email)}/rooms`).on("value", (snapShot) => {
            setInvitations(snapShot.val())
        })

    }, [currentUser.email])


    async function cancelInvitation(roomId){

        await database.ref(`public/${btoa(currentUser.email)}/rooms/${roomId}`).remove()

    }

    async function acceptInvitation(roomId){ 
        
        await database.ref(`public/${btoa(currentUser.email)}/rooms/${roomId}`).get().then(function(acceptSnapShot){
           
                database.ref(`users/${currentUser.uid}/private/rooms`).push(roomId).set({
                    name: acceptSnapShot.val().name,
                    admin: false,

                })

        })

        cancelInvitation(roomId)
        
    }

    async function handleAccept(e){
        e.preventDefault()
        setError('')
        
        try{
            setLoading(true)
            await acceptInvitation(e.target.value)
            setSuccess("")
            setLoading(false)
        } catch(err){
            setLoading(false)
            setError(err.message)
        }
    }


    async function handleCancel(e){
        e.preventDefault()
        setError('')
        try{
            setLoading(true)
            await cancelInvitation(e.target.value)
            setSuccess("")
            setLoading(false)
        } catch(err){
            setLoading(false)
            setError(err.message)
        }
    }
    
    
    return (
        <>
            <DisplaySuccess/>
            <DisplayError/>

            <div className="navigation-link" id={invitations ? 'invitationsReceivedIcon' : ''} onClick={handleShow}>
                <HiOutlineMail className="logo" />
                <span className="link-text">Invitations received</span>
            </div>
            
            <Modal className="invitationsReceived-modal" show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Invitations Received</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p className="invitationsReceived-text"> Add or decline invitations.</p>

                    {invitations ? Object.keys(invitations).map(key => 
                        <Card className="invitationsReceivedCard" key={key} >
                            <Card.Body className="invitationsReceivedCardBody">
                                <p className="invitationsReceivedCardMessage">
                                    User
                                    <span className="invitationsReceivedCardHost"> {invitations[key].host} </span>
                                    invites you to a room 
                                    <span className="invitationsReceivedCardName"> {invitations[key].name}</span>
                                    .
                                </p>
                                <div className="invitationsReceivedButtons">
                                    <button className="button button-accept" disabled={loading} onClick={handleAccept} value={key}> Accept </button>
                                    <button className="button button-cancel" disabled={loading} onClick={handleCancel} value={key}> Cancel </button>
                                </div>

                            </Card.Body>
                        </Card>
                    ): <span></span> } 
    
                </Modal.Body>
            </Modal>
        </>
    )
}
