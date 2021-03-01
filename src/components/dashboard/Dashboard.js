import React, {useState, useEffect} from 'react'
import {Form, Button, Card, Alert} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'
import useRooms from './useRooms'

export default function Dashboard() {
    const [error, setError] = useState("")
    const {currentUser, logout} = useAuth()
    const currentUserRooms = useRooms()
    const history = useHistory()

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
            setError('Failed to creat room')
        }
    }

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
                {currentUserRooms !== null &&  Object.keys(currentUserRooms).map(key => 
                    <Button key={key} value={key} >{currentUserRooms[key].name}</Button>
                )}
            </Form>
        </>
    )
}





                // snapShot.forEach(function (childSnapshot) {
                //     var childData = childSnapshot.val();
                //     console.log(childSnapshot.key)
                // })
