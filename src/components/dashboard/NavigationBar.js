import { useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

import { HiOutlineLogout} from "react-icons/hi"

import InvitationsReceived from './InvitationsReceived'
import ProfileSettings from './ProfileSettings'
import CreateRoom from './CreateRoom'

export default function NavigationBar() {

    const {logout} = useAuth()
    const { setError, DisplayError} = useNotification()
    const history = useHistory()

    async function handleLogout() {
        setError("")
        try{
            await logout()
            history.push('/login')
        }
        catch(err){
            setError(err.message)
        }
    }


    return (
        <div className="NavigationBar">
            <DisplayError/>  
            <nav className="navigation">
                <div className="navigation-box">
                    <CreateRoom/>
                    <ProfileSettings/>
                    <InvitationsReceived/>
                    <div className="navigation-link" onClick={handleLogout}>
                        <HiOutlineLogout className="logo"/>
                        <span className="link-text" >Log out</span>
                    </div>
                </div>
            </nav>
            
        </div>
    )
}
