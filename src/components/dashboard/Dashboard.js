import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { database } from '../../firebase'

export default function Dashboard() {
    const [error, setError] = useState("")
    const {currentUser, logout} = useAuth()
    const history = useHistory()
    const [rooms, setRooms] = useState(null)

    async function handleLogout() {
        setError("")
        try{
            await logout()
            history.push('/login')
        }catch{
            setError('Failed to log out')
        }
    }

    async function handleRoom(event) {
        setError("")
        try{
            history.push(`/room/${event.target.value}`)
        }catch{
            setError('Failed to join room')
        }
    }

    useEffect(() => {
        const roomsRef = database.ref(`users/${currentUser.uid}/private/rooms`)
        roomsRef.once("value", (snapShot) => {
            setRooms(snapShot.val())
        })
        return () => {
            setRooms(null)
        }
    }, [currentUser.uid])


    return (
        <>
            <Card> 
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Emial:</strong> {currentUser.email}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3"> Update Profile</Link>
                </Card.Body>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>
            <div className="w-100 text-center mt-2">
                <Link to="/creat-room" >Creat Room</Link>
            </div>

            </Card> 
            <Form onClick={handleRoom}>
                {rooms !== null &&  Object.keys(rooms).map(key => 
                    <Button key={key} value={key} >{rooms[key].name}</Button>
                )}
            </Form>
        </>
    )
}
