import NavigationBar from './NavigationBar'
import DisplayRooms from  "./DisplayRooms"

import './Dashboard.scss'

export default function Dashboard() {


    return (
        <div className="Dashboard">
            <NavigationBar/>
            
            <div className="main">
                <p className="appname">Vote App</p>
                <DisplayRooms/>
            </div>
            
        </div>
    )
}
