import React, {useRef, useState} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { database } from '../../firebase'
//import { useAuth } from '../../../contexts/AuthContext'

export default function Rooom({match}) {

    const inviteUser = useRef()
    //const { currentUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const roomId = match.params.id

    function invadeUserToRoom(email){

        // Get user uid 
        database.ref(`public/${btoa(email)}`).get().then(function(snapshotPublic){

            // Get all room users 
            snapshotPublic.val() ? database.ref(`rooms/${roomId}/access`).get().then(function(snapshotAccess){

                // Checking if user is in room. 
                Object.values(snapshotAccess.val()).includes(snapshotPublic.val().uid) ? setError('User with this email already is in room'): (() => {
                    //If not, add him 
                    database.ref(`rooms/${roomId}/access`).push(snapshotPublic.val().uid);
                    database.ref(`users/${snapshotPublic.val().uid}/public/rooms`).push(roomId).set({name: 'temp', admin: false})
                  })()
            }) : setError('The user with the specified email does not exist')
        })
    }

    async function handleInvite (e){
        e.preventDefault()
        setError('')
        
        try{
            setLoading(true)
            invadeUserToRoom(inviteUser.current.value)
            setLoading(false)
        }catch{
            setError('Problem with connection')
            setLoading(false)
        }
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4" >Invade</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleInvite}>
                        
                        <Form.Group id="email">
                            <Form.Label>Emial</Form.Label>
                            <Form.Control type="email"  ref={inviteUser} required/> 
                        </Form.Group>
    
                        <Button disabled={loading} type="submit">Send</Button>
                    </Form>

                </Card.Body> 
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/" >Cancel</Link>
            </div>
            
        </>
    )
} 
