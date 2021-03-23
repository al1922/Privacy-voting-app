import { Nav } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

export default function NavigationBar() {

    const {logout} = useAuth()
    const { setError, DisplayError} = useNotification()
    const history = useHistory()

    async function handleLogout() {
        setError("")
        try{
            await logout()
            history.push('/login')
        }catch(err){
            setError(err.message)
        }
    }

    return (
        <div className="Nav">
            <DisplayError/>       
            <Nav defaultActiveKey="/home" className="flex-column">
                <p className="profile text-white">Profile</p>
                <p className="text-white">Nick</p>
                <div className="invitations">
                    <p className=" text-white"> Invitations received </p>
                </div>
                <Nav.Link  className="update-profile">Profile Settings</Nav.Link>
                <Nav.Link  className="log-out" onClick={handleLogout}>Log Out</Nav.Link>
            </Nav>
        </div>
    )
}
