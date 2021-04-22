import NavigationBar from './NavigationBar'
import DisplayRooms from  "./DisplayRooms"

import Logo from "../img/LogoSVG.svg"
import './Dashboard.scss'

export default function Dashboard() {


    return (
        <div className="Dashboard">
            <NavigationBar/>
            <div className="main">
                <div className="logo">
                    <img className="logoImage" alt="" src={Logo} />
                    <p className="logoName">Fox Vote</p>
                </div>
                               
                <div className="noneRooms">Create a new room in the tab. Rauuu!</div>
                
                <DisplayRooms/>
            </div> 
        </div>
    )
}
